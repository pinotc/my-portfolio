import { GoogleGenAI } from "@google/genai";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const PROMPT_VI = `Bạn là Dasi, trợ lý ảo trên trang Portfolio cá nhân của Lê Văn Đạt. Bạn CHỈ trả lời bằng TIẾNG VIỆT.

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

export const PROMPT_EN = `You are Dasi, the virtual assistant on the personal portfolio website of Lê Văn Đạt. You MUST respond ONLY in ENGLISH.

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

type IncomingMessage = {
  role?: unknown;
  content?: unknown;
};

function toContents(history: IncomingMessage[], message: string) {
  const turns = history
    .filter(
      (item): item is { role: "user" | "assistant"; content: string } =>
        (item.role === "user" || item.role === "assistant") &&
        typeof item.content === "string" &&
        item.content.trim().length > 0,
    )
    .slice(-12)
    .map((item) => ({
      role: item.role === "assistant" ? ("model" as const) : ("user" as const),
      parts: [{ text: item.content.slice(0, 2000) }],
    }));

  const contents = [
    ...turns,
    { role: "user" as const, parts: [{ text: message }] },
  ];

  while (contents[0]?.role === "model") {
    contents.shift();
  }

  return contents;
}

function saveLog(sessionId: string, role: "user" | "bot", message: string) {
  return prisma.chatLog
    .create({ data: { sessionId, role, message } })
    .catch(console.error);
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "GEMINI_API_KEY is not set" }, { status: 500 });
  }

  let body: {
    message?: unknown;
    history?: unknown;
    sessionId?: unknown;
    language?: unknown;
  };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (!message) {
    return Response.json({ error: "Message is required" }, { status: 400 });
  }
  if (message.length > 2000) {
    return Response.json({ error: "Message is too long" }, { status: 400 });
  }
  if (body.language !== "vi" && body.language !== "en") {
    return Response.json({ error: "Language must be vi or en" }, { status: 400 });
  }

  const providedSession =
    typeof body.sessionId === "string" ? body.sessionId.trim() : "";
  const sessionId =
    providedSession.length > 0 && providedSession.length <= 80
      ? providedSession
      : crypto.randomUUID();

  const history = Array.isArray(body.history) ? (body.history as IncomingMessage[]) : [];
  await saveLog(sessionId, "user", message);

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: toContents(history, message),
      config: {
        systemInstruction: body.language === "en" ? PROMPT_EN : PROMPT_VI,
      },
    });

    const text = response.text?.trim();
    if (!text) {
      return Response.json({ error: "Empty response from Gemini", sessionId }, { status: 502 });
    }

    await saveLog(sessionId, "bot", text);
    return Response.json({ text, sessionId });
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Gemini request failed";
    const redacted = detail.replaceAll(apiKey, "[redacted]");
    console.error("Gemini request failed:", redacted);
    return Response.json({ error: "Gemini request failed", sessionId }, { status: 502 });
  }
}
