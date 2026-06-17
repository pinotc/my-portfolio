"use client";

import { useState, useRef } from "react";
import { createComment } from "@/server/actions/comments";
import { Send, User } from "lucide-react"; 
export function CommentForm({ postId }: { postId: string }) {
  const [isAnonymous, setIsAnonymous] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    const res = await createComment(formData);
    if (res.success) {
      formRef.current?.reset(); // Xóa trắng form sau khi gửi thành công
      setIsAnonymous(false);
    }
  }

  return (
    <div className="mt-16 p-6 bg-[#0d1117] border border-slate-800 rounded-xl font-mono">
      <h3 className="text-emerald-400 text-lg mb-6 flex items-center gap-2">
        <span className="text-pink-500">$</span> Post a comment!
      </h3>

      <form ref={formRef} action={handleSubmit} className="space-y-4">
        <input type="hidden" name="postId" value={postId} />

        {/* Checkbox ẩn danh */}
        <div className="flex items-center gap-2 mb-4 cursor-pointer">
          <input
            type="checkbox"
            name="isAnonymous"
            id="anon"
            className="w-4 h-4 accent-emerald-500"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
          />
          <label htmlFor="anon" className="text-sm text-slate-400 select-none">
           Anonymous
          </label>
        </div>

        {/* Trường Nickname (Ẩn đi nếu tick ẩn danh) */}
        {!isAnonymous && (
          <div className="relative">
            <span className="absolute left-3 top-3 text-slate-500 text-xs">name:</span>
            <input
              type="text"
              name="nickname"
              required
              placeholder="Nickname"
              className="w-full bg-[#030712] border border-slate-800 rounded-md p-3 pl-16 text-sm text-emerald-400 focus:outline-none focus:border-emerald-500/50 transition-all"
            />
          </div>
        )}

        {/* Nội dung Comment */}
        <div className="relative">
          <span className="absolute left-3 top-3 text-slate-500 text-xs">msg:</span>
          <textarea
            name="content"
            required
            rows={4}
            placeholder="Write your thoughts..."
            className="w-full bg-[#030712] border border-slate-800 rounded-md p-3 pl-12 text-sm text-slate-300 focus:outline-none focus:border-emerald-500/50 transition-all"
          ></textarea>
        </div>

        <button
          type="submit"
          className="flex items-center gap-2 px-6 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-md hover:bg-emerald-500/20 transition-all group"
        >
          <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          Execute
        </button>
      </form>
    </div>
  );
}