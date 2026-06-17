import { getMessages, markAsRead, deleteMessage } from "@/server/actions/messages";
import { Mail, Trash2, CheckCircle, Clock } from "lucide-react";

export default async function MessagesPage() {
  const messages = await getMessages();

  return (
    <div className="max-w-6xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Mail className="w-8 h-8 text-rose-500" />
          Hộp Thư Liên Hệ
        </h1>
        <p className="text-muted-foreground mt-2">Quản lý tin nhắn và lời mời hợp tác từ Website.</p>
      </div>

      <div className="space-y-4">
        {messages.length === 0 ? (
          <div className="p-8 text-center bg-card/20 border border-border border-dashed rounded-xl text-muted-foreground">
            Hộp thư của bạn hiện đang trống.
          </div>
        ) : (
          messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`p-6 rounded-xl border transition-all ${
                msg.isRead 
                  ? "bg-card/20 border-border opacity-70" 
                  : "bg-card/60 backdrop-blur-md border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.1)]"
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                    {!msg.isRead && <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />}
                    {msg.subject}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <span className="font-medium text-blue-400">{msg.name}</span>
                    <span>•</span>
                    <a href={`mailto:${msg.email}`} className="hover:text-foreground transition-colors">{msg.email}</a>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(msg.createdAt).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!msg.isRead && (
                    <form action={async () => {
                      "use server";
                      await markAsRead(msg.id);
                    }}>
                      <button type="submit" className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-lg transition-colors border border-emerald-500/20">
                        <CheckCircle className="w-3 h-3" /> Đã đọc
                      </button>
                    </form>
                  )}
                  <form action={async () => {
                    "use server";
                    await deleteMessage(msg.id);
                  }}>
                    <button type="submit" className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-500/20" title="Xóa tin nhắn">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </div>

              <div className="p-4 bg-background/50 rounded-lg border border-border text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                {msg.message}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}