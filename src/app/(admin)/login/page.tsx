"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Activity } from "lucide-react";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true); // Biến trạng thái để chuyển đổi Form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (isLogin) {
      // Gọi API Đăng nhập
      const { error: signInError } = await authClient.signIn.email({
        email,
        password,
      });
      if (signInError) {
        setError(signInError.message || "Đăng nhập thất bại.");
        setLoading(false);
      } else {
        router.push("/admin");
      }
    } else {
      // Gọi API Đăng ký (Tạo tài khoản mới)
      const { error: signUpError } = await authClient.signUp.email({
        email,
        password,
        name,
      });
      if (signUpError) {
        setError(signUpError.message || "Đăng ký thất bại. Email có thể đã tồn tại.");
        setLoading(false);
      } else {
        // Đăng ký thành công, tự động chuyển vào Admin
        router.push("/admin");
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px]" />

      <div className="z-10 w-full max-w-md p-8 bg-card/50 backdrop-blur-xl border border-border rounded-2xl shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="p-3 bg-blue-500/20 rounded-full mb-4">
            <Activity className="w-8 h-8 text-blue-500" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Hệ Thống Quản Trị</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isLogin ? "Đăng nhập để truy cập CMS" : "Tạo tài khoản quản trị mới"}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 text-sm text-red-500 bg-red-500/10 rounded-lg border border-red-500/20 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Trường Họ Tên chỉ hiện khi ở chế độ Đăng Ký */}
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Họ và tên</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required={!isLogin}
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? "Đang xử lý..." : isLogin ? "Đăng Nhập" : "Tạo Tài Khoản"}
          </button>
        </form>
      </div>
    </div>
  );
}