import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PROMPT_VI = `Bạn là Dasi, trợ lý ảo trên trang Portfolio cá nhân của Lê Văn Đạt. Bạn CHỈ trả lời bằng TIẾNG VIỆT.

THÔNG TIN VỀ LÊ VĂN ĐẠT:
- Vai trò & Học vấn: IT Professional, MES System Administrator. Tốt nghiệp Cử nhân ngành Khoa học Dữ liệu (Data Science) tại Đại học HUFLIT (07/2025).
- Kinh nghiệm thực tế:
  + Hiện tại: Quản trị hệ thống tại Công ty TNHH Daeha Cable Việt Nam (Daeha Cable Vietnam Co., Ltd.).
  + Kỹ năng thế mạnh: Viết Chrome Extensions, Google Apps Script và các công cụ tự động hóa quy trình cho hệ thống MES.
- Sở thích cá nhân: Chụp ảnh, leo núi, du lịch và viết code sáng tạo các dự án cá nhân.

QUY TẮC BẮT BUỘC:
1. KHÔNG thêm bất kỳ prefix, tag hoặc header nào như \`>[STATUS: ONLINE]\`, \`>[CALC_RESULT]\`, v.v. Trả lời trực tiếp bằng văn bản tự nhiên.
2. PHẠM VI NGHIÊM NGẶT (STRICT SCOPE): CHỈ trả lời các câu hỏi về Lê Văn Đạt, kỹ năng, kinh nghiệm, portfolio và sở thích của anh ấy.
3. TỪ CHỐI NGOÀI LỀ (REJECT OFF-TOPIC): Nếu người dùng hỏi kiến thức chung, nhờ viết code hộ, giải toán, dịch thuật hoặc bất kỳ chủ đề nào ngoài lề, hãy từ chối lịch sự và gợi ý họ quay lại hỏi về Đạt.
4. ĐỘ DÀI & PHONG THÁI: Giữ câu trả lời ngắn gọn (tối đa 3 câu), thân thiện, lễ phép và luôn đề cao Đạt.`;

const PROMPT_EN = `You are Dasi, the virtual assistant on the personal portfolio website of Lê Văn Đạt. You MUST respond ONLY in ENGLISH.

ABOUT LÊ VĂN ĐẠT:
- Role & Education: IT Professional, MES System Administrator. Graduated with a Bachelor's degree in Data Science from HUFLIT University (July 2025).
- Professional Experience:
  + Current Position: System Administrator at Daeha Cable Vietnam Co., Ltd.
  + Key Technical Skills: Developing custom Chrome Extensions, Google Apps Scripts, and automated tools for Manufacturing Execution Systems (MES).
- Personal Interests: Photography, mountain hiking, traveling, and writing code for creative personal projects.

MANDATORY RULES:
1. NEVER include prefixes, tags, or headers such as \`>[STATUS: ONLINE]\`, \`>[CALC_RESULT]\`, etc. Output plain, natural conversational text directly.
2. STRICT SCOPE: Answer ONLY questions related to Lê Văn Đạt, his portfolio, skills, professional experience, and hobbies.
3. REJECT OFF-TOPIC: If the user asks general knowledge questions, requests external coding assistance, math solving, translation, or anything unrelated to Đạt, politely decline and redirect them back to asking about Đạt.
4. LENGTH & TONE: Keep responses concise (maximum 3 sentences), friendly, polite, and supportive of Đạt.`;

const MAINTENANCE = "Sorry, I'm currently under maintenance. Please try again later.";

type IncomingMessage = {
  role?: unknown;
  message?: unknown;
  text?: unknown;
  content?: unknown;
};

type ChatTurn = {
  role: "user" | "assistant";
  content: string;
};

type ProviderContext = {
  systemPrompt: string;
  history: ChatTurn[];
  message: string;
};

function historyContent(item: IncomingMessage) {
  if (typeof item.message === "string" && item.message.trim()) return item.message;
  if (typeof item.text === "string" && item.text.trim()) return item.text;
  if (typeof item.content === "string" && item.content.trim()) return item.content;
  return "";
}

async function saveChatLog(sessionId: string, role: "user" | "bot", message: string) {
  const label = role === "user" ? "User Message" : "Bot Message";
  try {
    await prisma.chatLog.create({
      data: {
        sessionId,
        role,
        message,
      },
    });
  } catch (dbErr) {
    console.error(`[Prisma ChatLog Error - ${label}]:`, dbErr);
  }
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unknown provider error";
}

async function readFailure(response: Response, apiKey: string) {
  const raw = await response.text();
  const snippet = raw.slice(0, 240).replaceAll(apiKey, "[redacted]");
  throw new Error(`HTTP ${response.status} ${snippet}`);
}

async function chatCompletion(
  url: string,
  apiKey: string,
  model: string,
  messages: { role: "system" | "user" | "assistant"; content: string }[],
  extraHeaders?: HeadersInit,
) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      ...extraHeaders,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.6,
      max_tokens: 300,
    }),
  });

  if (!response.ok) await readFailure(response, apiKey);

  const data = (await response.json()) as {
    choices?: { message?: { content?: string | null } }[];
  };
  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error(`${model} returned an empty response`);
  return text;
}

async function tryModels(
  models: string[],
  call: (model: string) => Promise<string>,
) {
  let last: Error | null = null;
  for (const model of models) {
    try {
      return await call(model);
    } catch (error) {
      last = error instanceof Error ? error : new Error(errorMessage(error));
    }
  }
  throw last ?? new Error("Provider returned no response");
}

function openAIMessages(ctx: ProviderContext) {
  return [
    { role: "system" as const, content: ctx.systemPrompt },
    ...ctx.history,
    { role: "user" as const, content: ctx.message },
  ];
}

async function askGroq(apiKey: string, ctx: ProviderContext) {
  return tryModels(["openai/gpt-oss-20b", "openai/gpt-oss-120b"], (model) =>
    chatCompletion(
      "https://api.groq.com/openai/v1/chat/completions",
      apiKey,
      model,
      openAIMessages(ctx),
    ),
  );
}

async function askMistral(apiKey: string, ctx: ProviderContext) {
  return tryModels(["mistral-small-latest", "open-mistral-nemo"], (model) =>
    chatCompletion(
      "https://api.mistral.ai/v1/chat/completions",
      apiKey,
      model,
      openAIMessages(ctx),
    ),
  );
}

async function askGemini(apiKey: string, ctx: ProviderContext) {
  const contents = [
    ...ctx.history.map((item) => ({
      role: item.role === "assistant" ? "model" : "user",
      parts: [{ text: item.content }],
    })),
    { role: "user", parts: [{ text: ctx.message }] },
  ];

  return tryModels(["gemini-2.5-flash", "gemini-1.5-flash"], async (model) => {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: ctx.systemPrompt }] },
          contents,
          generationConfig: { temperature: 0.6, maxOutputTokens: 300 },
        }),
      },
    );
    if (!response.ok) await readFailure(response, apiKey);
    const data = (await response.json()) as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    };
    const text = data.candidates?.[0]?.content?.parts
      ?.map((part) => part.text ?? "")
      .join("")
      .trim();
    if (!text) throw new Error(`${model} returned an empty response`);
    return text;
  });
}

async function askOpenRouter(apiKey: string, ctx: ProviderContext) {
  const headers = {
    "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001",
    "X-Title": "Le Dat Portfolio",
  };
  return tryModels(
    ["openrouter/free", "meta-llama/llama-3.3-70b-instruct:free"],
    (model) =>
      chatCompletion(
        "https://openrouter.ai/api/v1/chat/completions",
        apiKey,
        model,
        openAIMessages(ctx),
        headers,
      ),
  );
}

export async function POST(request: Request) {
  let body: {
    message?: unknown;
    history?: unknown;
    sessionId?: unknown;
    language?: unknown;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (!message) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }
  if (message.length > 2000) {
    return NextResponse.json({ error: "Message is too long" }, { status: 400 });
  }
  if (body.language !== "vi" && body.language !== "en") {
    return NextResponse.json({ error: "Language must be vi or en" }, { status: 400 });
  }

  const providedSession =
    typeof body.sessionId === "string" ? body.sessionId.trim() : "";
  const currentSessionId =
    providedSession.length > 0 && providedSession.length <= 80
      ? providedSession
      : crypto.randomUUID();

  const history = Array.isArray(body.history) ? (body.history as IncomingMessage[]) : [];
  const formattedHistory = history
    .map((item) => {
      const content = historyContent(item).slice(0, 2000);
      if (!content) return null;
      return {
        role: item.role === "user" ? ("user" as const) : ("assistant" as const),
        content,
      };
    })
    .filter((item): item is ChatTurn => item !== null)
    .slice(-12);

  await saveChatLog(currentSessionId, "user", message);

  const ctx: ProviderContext = {
    systemPrompt: body.language === "en" ? PROMPT_EN : PROMPT_VI,
    history: formattedHistory,
    message,
  };

  const providers: { name: string; apiKey?: string; run: (apiKey: string) => Promise<string> }[] = [
    { name: "Groq", apiKey: process.env.GROQ_API_KEY, run: (apiKey) => askGroq(apiKey, ctx) },
    { name: "Mistral", apiKey: process.env.MISTRAL_API_KEY, run: (apiKey) => askMistral(apiKey, ctx) },
    { name: "Gemini", apiKey: process.env.GEMINI_API_KEY, run: (apiKey) => askGemini(apiKey, ctx) },
    { name: "OpenRouter", apiKey: process.env.OPENROUTER_API_KEY, run: (apiKey) => askOpenRouter(apiKey, ctx) },
  ];

  for (const provider of providers) {
    if (!provider.apiKey) continue;
    try {
      const responseText = await provider.run(provider.apiKey);
      await saveChatLog(currentSessionId, "bot", responseText);
      return NextResponse.json({
        text: responseText,
        sessionId: currentSessionId,
        provider: provider.name,
      });
    } catch (error) {
      console.error(
        `[AI Fallback] ${provider.name} failed: ${errorMessage(error).replaceAll(provider.apiKey, "[redacted]")}. Trying next provider...`,
      );
    }
  }

  await saveChatLog(currentSessionId, "bot", MAINTENANCE);
  return NextResponse.json({
    text: MAINTENANCE,
    sessionId: currentSessionId,
    provider: null,
  });
}
