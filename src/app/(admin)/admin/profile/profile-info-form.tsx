"use client";

import { useState, useTransition } from "react";
import { updateProfileInfoAction } from "@/server/actions/profile";
import { Save, User, Link as LinkIcon, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export default function ProfileInfoForm({ initialData }: { initialData: any }) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await updateProfileInfoAction(formData);
      if (result.success) {
        setMessage({ type: "success", text: "Cập nhật thông tin thành công!" });
      } else {
        setMessage({ type: "error", text: result.error as string });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border">
        <User className="w-5 h-5 text-blue-500" /> 
        <h2 className="text-lg font-bold text-foreground">Thông Tin Cá Nhân</h2>
      </div>

      {message && (
        <div className={`p-3 rounded-lg flex items-center gap-2 text-sm font-medium ${
          message.type === "success" ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"
        }`}>
          {message.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">Email liên hệ</label>
          <input name="email" defaultValue={initialData?.email || ""} type="email" className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm" />
        </div>

        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1"><LinkIcon className="w-3 h-3"/> GitHub URL</label>
          <input name="githubUrl" defaultValue={initialData?.githubUrl || ""} placeholder="https://github.com/..." className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm" />
        </div>

        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1"><LinkIcon className="w-3 h-3"/> LinkedIn URL</label>
          <input name="linkedinUrl" defaultValue={initialData?.linkedinUrl || ""} placeholder="https://linkedin.com/in/..." className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm" />
        </div>
      </div>

      <button 
        type="submit" 
        disabled={isPending}
        className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
      >
        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        {isPending ? "Đang xử lý..." : "Lưu Thông Tin"}
      </button>
    </form>
  );
}