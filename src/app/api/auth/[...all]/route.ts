// src/app/api/auth/[...all]/route.ts
import { auth } from "@/lib/auth"; // Import handler gốc từ Better Auth
import { toNextJsHandler } from "better-auth/next-js";

// Chuyển đổi Better Auth handler sang chuẩn Next.js App Router
export const { GET, POST } = toNextJsHandler(auth);