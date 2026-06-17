"use client";

import { useState, useEffect } from "react";
import { Camera } from "lucide-react";

export function AlbumSlideshow({ album }: { album: any }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Gộp coverImage và mảng photos thành 1 mảng duy nhất, dùng Set để xóa URL bị trùng lặp
  const images = Array.from(new Set([
    album.coverImage,
    ...(album.photos?.map((p: any) => p.url) || [])
  ])).filter(Boolean);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    // Nếu đang hover và album có nhiều hơn 1 ảnh thì bắt đầu xoay vòng
    if (isHovered && images.length > 1) {
      timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, 1200); // Tốc độ đổi ảnh: 1.2 giây/frame
    } else {
      // Khi chuột rời đi, reset về ảnh bìa mặc định
      setCurrentIndex(0); 
    }
    return () => clearInterval(timer);
  }, [isHovered, images.length]);

  if (images.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-600">
        <Camera className="w-8 h-8 opacity-50" />
      </div>
    );
  }

  return (
    <div 
      className="w-full h-full relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {images.map((url, idx) => (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          key={idx}
          src={url as string}
          alt={`${album.title} - photo ${idx}`}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out ${
            idx === currentIndex 
              ? "opacity-80 group-hover:opacity-100 group-hover:scale-105 z-10" 
              : "opacity-0 scale-100 z-0"
          }`}
        />
      ))}
    </div>
  );
}