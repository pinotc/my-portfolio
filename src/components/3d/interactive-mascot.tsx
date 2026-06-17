"use client";

import { useEffect, useState, useRef } from "react";

export function InteractiveMascot({ children }: { children?: React.ReactNode }) {
  const mascotRef = useRef<HTMLDivElement>(null);
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!mascotRef.current) return;

      const mouseX = e.clientX;
      const mouseY = e.clientY;
      
      const rect = mascotRef.current.getBoundingClientRect();
      const mascotCenterX = rect.left + rect.width / 2;
      const mascotCenterY = rect.top + rect.height / 2;

      const deltaX = mouseX - mascotCenterX;
      const deltaY = mouseY - mascotCenterY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      // Cho phép mắt di chuyển biên độ lớn hơn vì mặt trời giờ đã bự hơn
      const maxMove = 15;
      const moveX = distance > 0 ? (deltaX / distance) * Math.min(distance * 0.05, maxMove) : 0;
      const moveY = distance > 0 ? (deltaY / distance) * Math.min(distance * 0.05, maxMove) : 0;
      
      setEyeOffset({ x: moveX, y: moveY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div 
      ref={mascotRef}
      // Tăng kích thước lên khổng lồ (320px trên mobile, 550px trên desktop)
      className="relative flex items-center justify-center w-[320px] h-[320px] md:w-[550px] md:h-[550px] drop-shadow-[0_0_40px_rgba(250,204,21,0.5)] hover:drop-shadow-[0_0_80px_rgba(249,115,22,0.6)] transition-all duration-700 z-0 my-4"
      style={{ animation: 'float 6s ease-in-out infinite' }}
    >
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
      `}</style>

      {/* LAYER 1: TIA NẮNG */}
      <div className="absolute inset-0 animate-[spin_20s_linear_infinite] pointer-events-none">
        <svg viewBox="0 0 100 100" className="w-full h-full text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.8)]">
          <path d="M50 0 L56 20 L75 12 L68 30 L88 35 L72 48 L92 65 L72 68 L80 88 L60 75 L50 95 L40 75 L20 88 L28 68 L8 65 L28 48 L12 35 L32 30 L25 12 L44 20 Z" fill="currentColor" />
        </svg>
      </div>

      {/* LAYER 2: LÕI MẶT TRỜI */}
      <div className="absolute inset-[15%] bg-gradient-to-br from-yellow-100 via-yellow-400 to-orange-500 rounded-full shadow-[inset_0_0_40px_rgba(234,88,12,0.6)] pointer-events-none" />

      {/* LAYER 3: KHUÔN MẶT LIẾC THEO CHUỘT (Dùng % để tự phóng to) */}
      <div 
        className="absolute inset-0 pointer-events-none transition-transform duration-100 ease-out"
        style={{ transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px)` }}
      >
        {/* Mắt Trái (Đẩy lên cao để nhường chỗ cho chữ ở giữa) */}
        <div className="absolute top-[28%] left-[34%] w-[4%] h-[6%] bg-slate-900 rounded-full overflow-hidden">
          <div className="absolute top-[15%] right-[15%] w-[40%] h-[40%] bg-white rounded-full" />
        </div>
        
        {/* Mắt Phải */}
        <div className="absolute top-[28%] right-[34%] w-[4%] h-[6%] bg-slate-900 rounded-full overflow-hidden">
          <div className="absolute top-[15%] right-[15%] w-[40%] h-[40%] bg-white rounded-full" />
        </div>

        {/* Nụ cười (Đẩy xuống dưới thấp) */}
        <svg className="absolute top-[68%] left-[38%] w-[24%] h-[12%]" viewBox="0 0 100 50">
          <path d="M 10 10 Q 50 45 90 10" fill="none" stroke="#7c2d12" strokeWidth="8" strokeLinecap="round" />
        </svg>
        
        {/* Má hồng */}
        <div className="absolute top-[62%] left-[28%] w-[6%] h-[3%] bg-red-500/40 rounded-full blur-[4px]" />
        <div className="absolute top-[62%] right-[28%] w-[6%] h-[3%] bg-red-500/40 rounded-full blur-[4px]" />
      </div>

      {/* LAYER 4: NỘI DUNG CHỮ BÊN TRONG (CHILDREN) */}
      <div className="relative z-10 pointer-events-auto">
        {children}
      </div>

    </div>
  );
}