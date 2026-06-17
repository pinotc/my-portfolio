"use client";

import { useState, useTransition } from "react";
import { changePasswordAction } from "@/server/actions/profile";
import { Save, KeyRound, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export default function PasswordForm() {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await changePasswordAction(formData);
      
      if (result.success) {
        setMessage({ type: "success", text: "Đổi mật khẩu thành công!" });
        (e.target as HTMLFormElement).reset(); // Xóa trắng form
      } else {
        setMessage({ type: "error", text: result.error as string });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
        <KeyRound className="w-5 h-5 text-emerald-500" /> Đổi Mật Khẩu
      </h2>

      {/* Thông báo */}
      {message && (
        <div className={`p-3 rounded-lg flex items-center gap-2 text-sm font-medium ${
          message.type === "success" ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"
        }`}>
          {message.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {message.text}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-1">Mật khẩu hiện tại</label>
        <input 
          name="currentPassword" 
          type="password" 
          required 
          className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500" 
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-1">Mật khẩu mới (Tối thiểu 8 ký tự)</label>
        <input 
          name="newPassword" 
          type="password" 
          required 
          className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500" 
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-1">Xác nhận mật khẩu mới</label>
        <input 
          name="confirmPassword" 
          type="password" 
          required 
          className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500" 
        />
      </div>

      <button 
        type="submit" 
        disabled={isPending}
        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        {isPending ? "Đang xử lý..." : "Lưu Mật Khẩu"}
      </button>
    </form>
  );
}