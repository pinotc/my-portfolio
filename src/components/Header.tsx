"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Terminal } from "lucide-react";

// 1. Khai báo khuôn mẫu cho dữ liệu truyền vào Header
type HeaderProps = {
  homeProfile?: any; // Đặt optional để tránh lỗi nếu dữ liệu chưa kịp tải
};

// 2. Khai báo khuôn mẫu cho từng mục menu
type NavItem = {
  name: string;
  href: string;
  show?: boolean;
};

// 3. Nhận biến homeProfile từ component cha truyền vào
export default function Header({ homeProfile }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 4. Ép kiểu NavItem[] và dùng optional chaining (?.) để đọc dữ liệu an toàn
  const navItems: NavItem[] = [
      { name: "home", href: "#home", show: true },
      { name: "experience", href: "#experience", show: homeProfile?.isShowExperience ?? true },
      { name: "education", href: "#education", show: homeProfile?.isShowEducation ?? true },
      { name: "projects", href: "#portfolio", show: homeProfile?.isShowProjects ?? true },
      { name: "blog", href: "#blog", show: homeProfile?.isShowBlog ?? true },
      { name: "media", href: "#media", show: homeProfile?.isShowMedia ?? true },
      { name: "contact", href: "#contact", show: true },
    ];

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-500 border-b font-mono ${
      scrolled 
        ? "bg-[#030712]/90 backdrop-blur-md border-emerald-500/20 py-4 shadow-[0_4px_30px_rgba(0,0,0,0.6)]" 
        : "bg-transparent border-transparent py-6"
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
        
        {/* ================= BRAND LOGO ================= */}
        <Link href="/" className="flex items-center gap-2 group select-none">
          <div className="p-1.5 bg-[#0d1117] rounded border border-slate-800 group-hover:border-emerald-500/50 transition-all shadow-[0_0_10px_rgba(16,185,129,0)] group-hover:shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <Terminal className="w-5 h-5 text-emerald-500 group-hover:animate-pulse" />
          </div>
          <span className="font-bold text-lg tracking-wider text-slate-300 group-hover:text-white transition-colors">
            <span className="text-emerald-500">Das</span>i<span className="text-pink-500"></span>
          </span>
        </Link>

        {/* ================= NAVIGATION LINKS ================= */}
       <nav className="hidden md:flex items-center gap-7 text-sm">
          {/* Lọc: Chỉ render những item có show là true */}
          {navItems.filter((item) => item.show).map((item) => (
            <Link 
              key={item.name} 
              href={item.href} 
              className="group relative text-slate-400 hover:text-emerald-400 transition-colors"
            >
              <span className="text-slate-600 group-hover:text-pink-500 transition-colors">./</span>
              {item.name}
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-emerald-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}