import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ChatLogsPage() {
  const logs = await prisma.chatLog.findMany({
    take: 200,
    orderBy: { createdAt: "desc" },
  });

  const grouped = new Map<string, typeof logs>();
  for (const log of logs) {
    const session = grouped.get(log.sessionId) ?? [];
    session.push(log);
    grouped.set(log.sessionId, session);
  }

  const sessions = [...grouped.entries()]
    .map(([sessionId, messages]) => {
      const chronological = [...messages].sort(
        (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
      );
      return {
        sessionId,
        messages: chronological,
        startedAt: chronological[0]?.createdAt ?? new Date(),
      };
    })
    .sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime());

  return (
    <div className="mx-auto max-w-5xl space-y-6 font-mono text-slate-200">
      <div>
        <h1 className="text-2xl font-bold text-emerald-400">dasi@chat-logs:~</h1>
        <p className="mt-1 text-sm text-slate-400">
          Latest {logs.length} messages, grouped by session.
        </p>
      </div>

      {sessions.length === 0 ? (
        <p className="rounded-lg border border-dashed border-slate-800 bg-[#030712] px-4 py-8 text-center text-sm text-slate-500">
          No chat logs yet.
        </p>
      ) : (
        sessions.map((session) => (
          <article
            key={session.sessionId}
            className="rounded-lg border border-slate-800 bg-[#030712] p-4"
          >
            <header className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3 text-xs">
              <span className="text-emerald-400">{session.sessionId}</span>
              <time className="text-slate-500" dateTime={session.startedAt.toISOString()}>
                {session.startedAt.toLocaleString("vi-VN")}
              </time>
            </header>
            <div className="flex flex-col gap-2">
              {session.messages.map((entry) => {
                const fromUser = entry.role === "user";
                return (
                  <p
                    key={entry.id}
                    className={
                      fromUser
                        ? "ml-12 self-end rounded border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-200"
                        : "mr-12 self-start rounded border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-100"
                    }
                  >
                    <span className="mr-2 text-xs text-slate-500">{fromUser ? "user" : "dasi"}</span>
                    {entry.message}
                  </p>
                );
              })}
            </div>
          </article>
        ))
      )}
    </div>
  );
}
