"use client";

import { useState, useEffect } from "react";

export function SkillTyper({ skills }: { skills: string[] }) {
  const [text, setText] = useState("");
  const [skillIndex, setSkillIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!skills || skills.length === 0) return;

    const currentSkill = skills[skillIndex];
    const typingSpeed = isDeleting ? 50 : 100; // Tốc độ xóa nhanh hơn tốc độ gõ

    const timeout = setTimeout(() => {
      if (!isDeleting && text === currentSkill) {
        // Nếu đã gõ xong chữ, đợi 2s rồi bắt đầu xóa
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && text === "") {
        // Nếu đã xóa hết, chuyển sang từ tiếp theo
        setIsDeleting(false);
        setSkillIndex((prev) => (prev + 1) % skills.length);
      } else {
        // Đang gõ hoặc đang xóa
        setText(currentSkill.substring(0, text.length + (isDeleting ? -1 : 1)));
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [text, isDeleting, skillIndex, skills]);

  return (
    <span className="inline-flex min-w-[140px] text-left">
      {text}
      <span className="w-1.5 h-4 ml-[1px] bg-blue-400 animate-pulse self-center" />
    </span>
  );
}