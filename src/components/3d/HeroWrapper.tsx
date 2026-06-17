"use client";

import dynamic from "next/dynamic";

// Thực hiện tắt SSR bên trong Client Component hợp lệ
const Hero3D = dynamic(() => import("./Hero3D"), { ssr: false });

export default function HeroWrapper() {
  return <Hero3D />;
}