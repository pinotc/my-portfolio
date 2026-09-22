"use client";

import { useEffect, useRef, useState } from "react";
import { Mascot } from "page-mascot";
import { Send, X } from "lucide-react";

type Language = "vi" | "en";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const IDLE_GREETING =
  "Hello! I'm Dasi - Đạt's AI assistant. Click me to chat!";

const GREETINGS: Record<Language, string> = {
  vi: "Xin chào! Tôi là Dasi, trợ lý ảo của anh Đạt. Bạn muốn biết gì về kinh nghiệm hay dự án của anh ấy?",
  en: "Hello! I'm Dasi, Đạt's AI assistant. What would you like to know about his experience or projects?",
};

const CHIPS: Record<Language, { label: string; message: string }[]> = {
  vi: [
    { label: "./Kinh_nghiệm_MES", message: "Kinh nghiệm MES của anh Đạt là gì?" },
    { label: "./Sở_thích", message: "Sở thích của anh Đạt là gì?" },
  ],
  en: [
    { label: "./MES_Experience", message: "What is Đạt's MES experience?" },
    { label: "./Hobbies", message: "What are Đạt's hobbies?" },
  ],
};

export function FloatingMascot() {
  const [open, setOpen] = useState(false);
  const [bubble, setBubble] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language | null>(null);
  const [sessionId, setSessionId] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [reacting, setReacting] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const mascotBoxRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setSessionId(crypto.randomUUID());
  }, []);

  useEffect(() => {
    if (open) {
      setBubble(null);
      return;
    }

    let showTimer = 0;
    let hideTimer = 0;

    const schedule = () => {
      const wait = 15000 + Math.floor(Math.random() * 5001);
      showTimer = window.setTimeout(() => {
        setBubble(IDLE_GREETING);
        hideTimer = window.setTimeout(() => {
          setBubble(null);
          schedule();
        }, 5000);
      }, wait);
    };

    schedule();

    return () => {
      window.clearTimeout(showTimer);
      window.clearTimeout(hideTimer);
    };
  }, [open]);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    scroller.scrollTop = scroller.scrollHeight;
  }, [messages, loading, open, language]);

  useEffect(() => {
    let resetTimer = 0;

    const handleGlobalClick = (event: PointerEvent) => {
      if (!event.isTrusted) return;

      const mascotBox = mascotBoxRef.current;
      if (!mascotBox) return;

      const target = event.target;
      if (!(target instanceof Node)) return;
      if (mascotBox.contains(target)) return;
      if (chatRef.current?.contains(target)) return;

      const interactive =
        mascotBox.querySelector("canvas, [role='button']") || mascotBox.firstElementChild;
      if (!interactive) return;

      const init = { bubbles: true, cancelable: true };
      interactive.dispatchEvent(new PointerEvent("pointerdown", init));
      interactive.dispatchEvent(new MouseEvent("click", init));

      setReacting(true);
      window.clearTimeout(resetTimer);
      resetTimer = window.setTimeout(() => setReacting(false), 350);
    };

    window.addEventListener("pointerdown", handleGlobalClick);
    return () => {
      window.removeEventListener("pointerdown", handleGlobalClick);
      window.clearTimeout(resetTimer);
    };
  }, []);

  const chooseLanguage = (next: Language) => {
    setLanguage(next);
    setMessages([{ role: "assistant", content: GREETINGS[next] }]);
    setDraft("");
  };

  const send = async (raw?: string) => {
    const text = (raw ?? draft).trim();
    if (!text || loading || !language) return;

    const history = messages;
    setMessages((current) => [...current, { role: "user", content: text }]);
    setDraft("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: history.map((item) => ({ role: item.role, content: item.content })),
          sessionId,
          language,
        }),
      });
      const data = (await response.json()) as {
        text?: string;
        error?: string;
        sessionId?: string;
      };
      if (data.sessionId) setSessionId(data.sessionId);
      const fallback =
        language === "en" ? "I couldn't answer that. Please try again." : "Mình chưa trả lời được. Thử lại nhé.";
      const reply = data.text?.trim() || data.error || fallback;
      setMessages((current) => [...current, { role: "assistant", content: reply }]);
    } catch {
      const offline =
        language === "en" ? "Lost connection to Dasi. Please try again." : "Mất kết nối tới Dasi. Thử lại sau nhé.";
      setMessages((current) => [...current, { role: "assistant", content: offline }]);
    } finally {
      setLoading(false);
    }
  };

  if (isDismissed) return null;

  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 font-mono">
      {open ? (
        <section
          ref={chatRef}
          aria-label="Mini terminal chat"
          className="pointer-events-auto flex h-[28rem] w-[min(22rem,calc(100vw-3rem))] flex-col overflow-hidden rounded-lg border border-emerald-500/30 bg-[#030712]/95 text-sm text-slate-200 shadow-[0_8px_40px_rgba(0,0,0,0.55)] backdrop-blur-md"
        >
          <header className="flex items-center justify-between gap-2 border-b border-emerald-500/20 px-3 py-2">
            <span className="truncate text-xs tracking-wide text-emerald-400">
              {language ? "dasi@portfolio:~" : "dasi_assistant.exe"}
            </span>
            <div className="flex items-center gap-1">
              {language ? (
                <button
                  type="button"
                  onClick={() => chooseLanguage(language === "vi" ? "en" : "vi")}
                  className="rounded border border-emerald-500/40 px-2 py-0.5 text-[10px] tracking-wider text-emerald-300 hover:bg-emerald-500/10"
                  aria-label={language === "vi" ? "Switch to English" : "Chuyển sang Tiếng Việt"}
                >
                  {language === "vi" ? "VI" : "EN"}
                </button>
              ) : null}
              <button
                type="button"
                aria-label="Đóng chat"
                onClick={() => setOpen(false)}
                className="rounded p-1 text-slate-400 transition-colors hover:bg-emerald-500/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </header>

          {language ? (
            <>
              <div
                ref={scrollerRef}
                className="flex flex-1 flex-col gap-2 overflow-y-auto px-3 py-3"
                aria-live="polite"
              >
                {messages.map((message, index) => (
                  <p
                    key={`${message.role}-${index}`}
                    className={
                      message.role === "user"
                        ? "ml-6 rounded border border-slate-700 bg-slate-900/80 px-2 py-1.5 text-slate-200"
                        : "mr-6 rounded border border-emerald-500/20 bg-emerald-500/10 px-2 py-1.5 text-emerald-100"
                    }
                  >
                    <span className="mr-1 text-slate-500">
                      {message.role === "user" ? ">" : "dasi:"}
                    </span>
                    {message.content}
                  </p>
                ))}
                {loading ? <p className="text-xs text-emerald-400/80">typing...</p> : null}
              </div>

              <div className="flex flex-wrap gap-2 border-t border-emerald-500/10 px-3 py-2">
                {CHIPS[language].map((chip) => (
                  <button
                    key={chip.label}
                    type="button"
                    disabled={loading}
                    onClick={() => void send(chip.message)}
                    className="rounded border border-slate-800 px-2 py-1 text-[11px] text-emerald-300 hover:border-emerald-500/40 hover:bg-emerald-500/10 disabled:opacity-40"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>

              <form
                className="flex items-center gap-2 border-t border-emerald-500/20 p-2"
                onSubmit={(event) => {
                  event.preventDefault();
                  void send();
                }}
              >
                <label className="sr-only" htmlFor="dasi-chat-input">
                  {language === "en" ? "Question for Dasi" : "Câu hỏi cho Dasi"}
                </label>
                <input
                  id="dasi-chat-input"
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  disabled={loading}
                  placeholder={language === "en" ? "Ask Dasi..." : "Hỏi Dasi..."}
                  className="min-w-0 flex-1 rounded border border-slate-800 bg-[#0d1117] px-2 py-1.5 text-sm text-slate-100 outline-none placeholder:text-slate-600 focus:border-emerald-500/50"
                />
                <button
                  type="submit"
                  aria-label={language === "en" ? "Send" : "Gửi"}
                  disabled={loading || draft.trim().length === 0}
                  className="rounded border border-emerald-500/40 p-2 text-emerald-400 transition-colors hover:bg-emerald-500/10 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-5 px-5 text-center">
              <p className="text-xs leading-relaxed text-slate-300">
                Please select your preferred language / Vui lòng chọn ngôn ngữ:
              </p>
              <div className="flex w-full gap-2">
                <button
                  type="button"
                  onClick={() => chooseLanguage("vi")}
                  className="flex-1 rounded border border-emerald-500/40 px-2 py-3 text-xs text-emerald-200 hover:bg-emerald-500/10"
                >
                  🇻🇳 Tiếng Việt
                </button>
                <button
                  type="button"
                  onClick={() => chooseLanguage("en")}
                  className="flex-1 rounded border border-emerald-500/40 px-2 py-3 text-xs text-emerald-200 hover:bg-emerald-500/10"
                >
                  🇬🇧 English
                </button>
              </div>
            </div>
          )}
        </section>
      ) : null}

      <div className="group pointer-events-auto relative">
        <button
          type="button"
          aria-label="Hide assistant"
          onClick={(event) => {
            event.stopPropagation();
            setIsDismissed(true);
          }}
          className="absolute left-1 top-1 z-10 flex h-5 w-5 items-center justify-center rounded-full border border-slate-700/80 bg-[#030712]/80 text-slate-400 opacity-60 transition-opacity hover:text-white group-hover:opacity-100"
        >
          <X className="h-3 w-3" />
        </button>
        {bubble && !open ? (
          <p
            aria-live="polite"
            className="pointer-events-none absolute bottom-8 right-full mr-3 w-64 rounded-lg border border-emerald-500/30 bg-[#030712]/95 px-3 py-2 text-xs leading-relaxed text-emerald-100 shadow-lg"
          >
            {bubble}
          </p>
        ) : null}
        <div
          ref={mascotBoxRef}
          onClick={(event) => {
            if (!event.nativeEvent.isTrusted) return;
            setOpen((current) => !current);
          }}
          className={`origin-bottom transition-transform duration-300 ease-out ${
            reacting ? "scale-125 -translate-y-1.5 rotate-6" : ""
          }`}
        >
          <Mascot
            directions="/mascots/le-directions.webp"
            reactions="/mascots/le-reactions.webp"
            size={120}
            label="Dasi"
          />
        </div>
      </div>
    </div>
  );
}
