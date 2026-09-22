"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CheckCircle, Clock, Mail, MessageSquare, Reply, Trash2 } from "lucide-react";
import { deleteMessage, markAsRead } from "@/server/actions/messages";

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

type CommentReply = {
  id: string;
  author: string;
  content: string;
  isAdmin: boolean;
  createdAt: string;
};

type BlogComment = {
  id: string;
  author: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  postId: string;
  post: { title: string; slug: string };
  replies: CommentReply[];
};

export function MessagesBoard({
  messages,
  comments,
}: {
  messages: ContactMessage[];
  comments: BlogComment[];
}) {
  const [tab, setTab] = useState<"mail" | "comments">("mail");
  const [threads, setThreads] = useState(comments);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const unread = useMemo(
    () => threads.filter((comment) => !comment.isRead).length,
    [threads],
  );

  const sendReply = async (comment: BlogComment) => {
    const content = drafts[comment.id]?.trim() ?? "";
    if (!content || pendingId) return;

    setPendingId(comment.id);
    setError("");
    try {
      const response = await fetch("/api/admin/comments/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          commentId: comment.id,
          postId: comment.postId,
          content,
        }),
      });
      const data = (await response.json()) as { reply?: CommentReply; error?: string };
      if (!response.ok || !data.reply) {
        setError(data.error || "Không gửi được phản hồi.");
        return;
      }
      setThreads((current) =>
        current.map((item) =>
          item.id === comment.id
            ? { ...item, isRead: true, replies: [...item.replies, data.reply!] }
            : item,
        ),
      );
      setDrafts((current) => ({ ...current, [comment.id]: "" }));
    } catch {
      setError("Mất kết nối. Thử lại nhé.");
    } finally {
      setPendingId(null);
    }
  };

  return (
    <div className="max-w-6xl space-y-6 font-mono">
      <div>
        <h1 className="flex items-center gap-3 text-2xl font-bold text-emerald-400">
          <Mail className="h-7 w-7" />
          inbox@admin:~
        </h1>
        <p className="mt-2 text-sm text-slate-400">Tin nhắn liên hệ và bình luận trên blog.</p>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setTab("mail")}
          className={`rounded border px-3 py-1.5 text-xs ${
            tab === "mail"
              ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-300"
              : "border-slate-800 text-slate-400 hover:text-slate-200"
          }`}
        >
          Direct Contact ({messages.length})
        </button>
        <button
          type="button"
          onClick={() => setTab("comments")}
          className={`inline-flex items-center gap-2 rounded border px-3 py-1.5 text-xs ${
            tab === "comments"
              ? "border-amber-500/50 bg-amber-500/10 text-amber-300"
              : "border-slate-800 text-slate-400 hover:text-slate-200"
          }`}
        >
          <MessageSquare className="h-3.5 w-3.5" />
          Blog Comments
          {unread > 0 ? (
            <span className="rounded-full bg-amber-500 px-1.5 py-0.5 text-[10px] font-bold text-[#030712]">
              {unread}
            </span>
          ) : null}
        </button>
      </div>

      {tab === "mail" ? (
        <div className="space-y-4">
          {messages.length === 0 ? (
            <p className="rounded-lg border border-dashed border-slate-800 bg-[#030712] px-4 py-8 text-center text-sm text-slate-500">
              Hộp thư của bạn hiện đang trống.
            </p>
          ) : (
            messages.map((msg) => (
              <article
                key={msg.id}
                className={`rounded-lg border bg-[#030712] p-5 ${
                  msg.isRead ? "border-slate-800 opacity-70" : "border-emerald-500/30"
                }`}
              >
                <div className="mb-4 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                  <div>
                    <h2 className="flex items-center gap-2 text-base font-bold text-slate-100">
                      {!msg.isRead ? <span className="h-2 w-2 rounded-full bg-emerald-400" /> : null}
                      {msg.subject}
                    </h2>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span className="text-emerald-300">{msg.name}</span>
                      <span>•</span>
                      <a href={`mailto:${msg.email}`} className="hover:text-slate-200">
                        {msg.email}
                      </a>
                      <span>•</span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(msg.createdAt).toLocaleString("vi-VN")}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!msg.isRead ? (
                      <form
                        action={async () => {
                          await markAsRead(msg.id);
                        }}
                      >
                        <button
                          type="submit"
                          className="inline-flex items-center gap-1 rounded border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-400"
                        >
                          <CheckCircle className="h-3 w-3" /> Đã đọc
                        </button>
                      </form>
                    ) : null}
                    <form
                      action={async () => {
                        await deleteMessage(msg.id);
                      }}
                    >
                      <button
                        type="submit"
                        className="rounded p-2 text-red-400 hover:bg-red-500/10"
                        title="Xóa tin nhắn"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </form>
                  </div>
                </div>
                <p className="whitespace-pre-wrap rounded border border-slate-800 bg-slate-950/60 p-4 text-sm leading-relaxed text-slate-300">
                  {msg.message}
                </p>
              </article>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {error ? (
            <p className="rounded border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
              {error}
            </p>
          ) : null}
          {threads.length === 0 ? (
            <p className="rounded-lg border border-dashed border-slate-800 bg-[#030712] px-4 py-8 text-center text-sm text-slate-500">
              Chưa có bình luận nào trên blog.
            </p>
          ) : (
            threads.map((comment) => (
              <article
                key={comment.id}
                className={`rounded-lg border bg-[#030712] p-5 ${
                  comment.isRead ? "border-slate-800" : "border-amber-500/40"
                }`}
              >
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                  <span className="text-amber-300">{comment.author}</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(comment.createdAt).toLocaleString("vi-VN")}
                  </span>
                </div>
                <Link
                  href={`/blog/${comment.post.slug}`}
                  className="text-sm text-emerald-400 hover:text-emerald-300"
                >
                  {comment.post.title}
                </Link>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-200">
                  {comment.content}
                </p>

                {comment.replies.length > 0 ? (
                  <div className="mt-4 space-y-2 border-l border-slate-800 pl-3">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="rounded border border-emerald-500/20 bg-emerald-500/5 px-3 py-2">
                        <p className="text-[11px] text-emerald-400">
                          {reply.author}
                          <span className="ml-2 text-slate-600">
                            {new Date(reply.createdAt).toLocaleString("vi-VN")}
                          </span>
                        </p>
                        <p className="mt-1 whitespace-pre-wrap text-sm text-slate-300">{reply.content}</p>
                      </div>
                    ))}
                  </div>
                ) : null}

                <form
                  className="mt-4 flex flex-col gap-2 sm:flex-row"
                  onSubmit={(event) => {
                    event.preventDefault();
                    void sendReply(comment);
                  }}
                >
                  <label className="sr-only" htmlFor={`reply-${comment.id}`}>
                    Phản hồi {comment.author}
                  </label>
                  <textarea
                    id={`reply-${comment.id}`}
                    value={drafts[comment.id] ?? ""}
                    onChange={(event) =>
                      setDrafts((current) => ({ ...current, [comment.id]: event.target.value }))
                    }
                    rows={2}
                    placeholder="Viết phản hồi..."
                    className="min-w-0 flex-1 rounded border border-slate-800 bg-[#0d1117] px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-600 focus:border-emerald-500/50"
                  />
                  <button
                    type="submit"
                    disabled={pendingId === comment.id || !(drafts[comment.id] ?? "").trim()}
                    className="inline-flex items-center justify-center gap-1 rounded border border-emerald-500/40 px-3 py-2 text-xs text-emerald-300 hover:bg-emerald-500/10 disabled:opacity-40"
                  >
                    <Reply className="h-3.5 w-3.5" />
                    Send Reply
                  </button>
                </form>
              </article>
            ))
          )}
        </div>
      )}
    </div>
  );
}
