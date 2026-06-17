"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Home, Briefcase, GraduationCap, Factory, 
  BookOpen, Camera, Mail 
} from "lucide-react";

export function LiquidNav() {
  const [hoveredLeft, setHoveredLeft] = useState(false);
  const [hoveredRight, setHoveredRight] = useState(false);

  const leftNavItems = [
    { icon: Home, label: "Home", href: "#home" },
    { icon: Briefcase, label: "Experience", href: "#experience" },
    { icon: GraduationCap, label: "Education", href: "#education" },
    { icon: Factory, label: "Projects", href: "#portfolio" },
  ];

  const rightNavItems = [
    { icon: BookOpen, label: "Blog", href: "#blog" },
    { icon: Camera, label: "Media", href: "#media" },
    { icon: Mail, label: "Contact", href: "#contact" },
  ];

  return (
    <>
      {/* ================= LEFT NAVIGATION (MAIN) ================= */}
      <div 
        className="fixed left-0 top-0 h-screen w-16 md:w-24 z-50 flex items-center justify-start group"
        onMouseEnter={() => setHoveredLeft(true)}
        onMouseLeave={() => setHoveredLeft(false)}
      >
        {/* Vệt mờ vĩnh viễn (Hit area / Indicator) */}
        <div className={`absolute left-0 w-2 h-32 bg-cyan-500/20 blur-md rounded-r-full transition-opacity duration-500 ${hoveredLeft ? 'opacity-0' : 'opacity-100'}`} />

        {/* Khối Liquid Glass */}
        <div className={`
          relative flex flex-col gap-6 p-4 ml-4
          bg-white/5 backdrop-blur-2xl border border-white/10 
          shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_0_20px_rgba(255,255,255,0.05)]
          rounded-full transition-all duration-700 cubic-bezier(0.34, 1.56, 0.64, 1)
          ${hoveredLeft ? 'translate-x-0 scale-100 opacity-100' : '-translate-x-24 scale-90 opacity-0'}
        `}>
          {leftNavItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link 
                key={item.label} 
                href={item.href}
                className="group/item relative flex items-center justify-center w-12 h-12 rounded-full hover:bg-white/10 transition-all duration-300"
                style={{ transitionDelay: `${index * 50}ms` }} // Hiệu ứng lăn từng icon
              >
                <Icon className="w-5 h-5 text-slate-300 group-hover/item:text-cyan-400 group-hover/item:scale-110 transition-all duration-300" />
                {/* Tooltip giọt nước */}
                <span className="absolute left-full ml-4 px-3 py-1 bg-slate-900/80 backdrop-blur-md border border-slate-700 text-cyan-400 text-xs font-bold rounded-full opacity-0 group-hover/item:opacity-100 -translate-x-4 group-hover/item:translate-x-0 transition-all duration-300 pointer-events-none">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ================= RIGHT NAVIGATION (SECONDARY) ================= */}
      <div 
        className="fixed right-0 top-0 h-screen w-16 md:w-24 z-50 flex items-center justify-end group"
        onMouseEnter={() => setHoveredRight(true)}
        onMouseLeave={() => setHoveredRight(false)}
      >
        {/* Vệt mờ vĩnh viễn (Hit area / Indicator) */}
        <div className={`absolute right-0 w-2 h-32 bg-blue-500/20 blur-md rounded-l-full transition-opacity duration-500 ${hoveredRight ? 'opacity-0' : 'opacity-100'}`} />

        {/* Khối Liquid Glass */}
        <div className={`
          relative flex flex-col gap-6 p-4 mr-4
          bg-white/5 backdrop-blur-2xl border border-white/10 
          shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_0_20px_rgba(255,255,255,0.05)]
          rounded-full transition-all duration-700 cubic-bezier(0.34, 1.56, 0.64, 1)
          ${hoveredRight ? 'translate-x-0 scale-100 opacity-100' : 'translate-x-24 scale-90 opacity-0'}
        `}>
          {rightNavItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link 
                key={item.label} 
                href={item.href}
                className="group/item relative flex items-center justify-center w-12 h-12 rounded-full hover:bg-white/10 transition-all duration-300"
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <Icon className="w-5 h-5 text-slate-300 group-hover/item:text-blue-400 group-hover/item:scale-110 transition-all duration-300" />
                {/* Tooltip giọt nước */}
                <span className="absolute right-full mr-4 px-3 py-1 bg-slate-900/80 backdrop-blur-md border border-slate-700 text-blue-400 text-xs font-bold rounded-full opacity-0 group-hover/item:opacity-100 translate-x-4 group-hover/item:translate-x-0 transition-all duration-300 pointer-events-none">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}