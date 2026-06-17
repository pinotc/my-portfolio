"use client";

import { useState, useEffect } from "react";

export function TypewriterText({
  text,
  speed = 25,
}: {
  text: string;
  speed?: number;
}) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, 30 + Math.random() * 70);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text]);

  const isTyping = currentIndex < text.length;

  return (
    <span>
      {displayedText}

      {/* Chỉ hiện khi đang typing */}
      {isTyping && (
        <span className="inline-block w-1.5 h-5 ml-1 bg-cyan-400 animate-pulse align-middle" />
      )}
    </span>
  );
}