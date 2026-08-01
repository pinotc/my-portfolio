"use client";

import { useEffect, useRef } from "react";

export default function AutoScrollCarousel({ children }: { children: React.ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let animationFrameId: number;
    let isHovered = false;

    // Hàm tự động cuộn
    const scroll = () => {
      if (!isHovered && container) {
        container.scrollLeft += 1; // Thay đổi số này để tăng/giảm tốc độ lướt
        
        // Tạo hiệu ứng lặp vô tận: Khi lướt qua một nửa, tự động reset về 0 (người dùng sẽ không nhận ra)
        if (container.scrollLeft >= container.scrollWidth / 2) {
          container.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    // Chỉ kích hoạt lướt khi người dùng cuộn màn hình tới phần này (tối ưu hiệu năng)
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          animationFrameId = requestAnimationFrame(scroll);
        } else {
          cancelAnimationFrame(animationFrameId);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(container);

    // Dừng lại khi người dùng rê chuột vào hoặc chạm ngón tay vào (mobile)
    const pause = () => (isHovered = true);
    const play = () => (isHovered = false);

    container.addEventListener("mouseenter", pause);
    container.addEventListener("mouseleave", play);
    container.addEventListener("touchstart", pause);
    container.addEventListener("touchend", play);

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      container.removeEventListener("mouseenter", pause);
      container.removeEventListener("mouseleave", play);
      container.removeEventListener("touchstart", pause);
      container.removeEventListener("touchend", play);
    };
  }, []);

  return (
    <div 
      ref={scrollRef} 
      // ĐÃ XÓA: snap-x snap-mandatory để không bị khựng lại chống lại JS
      className="flex gap-8 overflow-x-auto pb-8 pt-4 hide-scrollbar cursor-grab active:cursor-grabbing"
      style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
    >
      <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>
      {children}
    </div>
  );
}