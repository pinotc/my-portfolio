"use client";

import Link from "next/link";
import { BookOpen, MessageSquare } from "lucide-react";
// Nhớ kiểm tra lại đường dẫn import này cho khớp với thư mục của bạn nhé
import AutoScrollCarousel from "@/components/AutoScrollCarousel"; 

// Hàm helper để lọc HTML tags
const stripHtml = (html: string) => {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, "").substring(0, 120) + "...";
};

export function BlogCarousel({ posts }: { posts: any[] }) {
  // Nếu không có bài viết nào thì không render gì cả
  if (!posts || posts.length === 0) return null;

  return (
    // Dùng negative margin (-mx-6) để lướt tràn viền mượt mà giống Project
    <div className="-mx-6 px-6 lg:-mx-8 lg:px-8"> 
      <AutoScrollCarousel>
        {/* Nhân 4 mảng bài viết lên để vòng lặp vô tận trơn tru */}
        {[...posts, ...posts, ...posts, ...posts].map((post: any, index: number) => (
          <Link
            href={`/blog/${post.slug}`}
            key={`${post.id}-${index}`} // Thêm index vào key để không bị trùng ID khi nhân mảng
            // THÊM: snap-start, w-[...], shrink-0 để biến thẻ thành block lướt ngang
            className="snap-start w-[85vw] sm:w-[350px] md:w-[400px] shrink-0 group flex flex-col rounded-lg bg-[#0d1117] border border-slate-800 shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden hover:border-amber-500/50 hover:shadow-[0_0_30px_rgba(245,158,11,0.15)] cursor-pointer"
          >
            {/* 1. Thanh tiêu đề (Top Bar) phong cách CODING */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/80 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-slate-700 group-hover:bg-red-500/80 transition-colors" />
                  <div className="w-3 h-3 rounded-full bg-slate-700 group-hover:bg-yellow-500/80 transition-colors" />
                  <div className="w-3 h-3 rounded-full bg-slate-700 group-hover:bg-green-500/80 transition-colors" />
                </div>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-semibold rounded uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20 whitespace-nowrap">
                {post.category?.name || "Blog"}
              </span>
            </div>

            {/* 2. Hình ảnh Cover */}
            <div className="relative h-48 overflow-hidden bg-[#030712] border-b border-slate-800">
              {post.coverImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={post.coverImage}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                  alt={post.title}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-700">
                  <BookOpen className="w-12 h-12 opacity-50" />
                </div>
              )}
            </div>

            {/* 3. Nội dung (Body) */}
            <div className="p-6 flex flex-col flex-1 font-sans">
              <div className="flex items-start gap-2 mb-3 text-slate-500 font-mono text-sm mt-1">
                <h3 className="text-xl font-bold text-white font-sans line-clamp-2 leading-snug group-hover:text-amber-400 transition-colors min-h-[56px]">
                  {post.title}
                </h3>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed line-clamp-3 mb-6">
                {stripHtml(post.content)}
              </p>
              
              <div className="mt-auto pt-4 border-t border-slate-800 flex items-center justify-between font-mono">
                <div className="flex gap-2">
                  {post.tags && post.tags.slice(0, 2).map((tag: any) => (
                    <span key={tag.id || tag.name} className="text-[11px] font-medium text-slate-400 bg-slate-800/50 border border-slate-700/50 px-2 py-0.5 rounded">
                      #{tag.name}
                    </span>
                  ))}
                  {post.tags && post.tags.length > 2 && (
                    <span className="text-[11px] font-medium text-slate-500 px-1 py-0.5">
                      +{post.tags.length - 2}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1 group-hover:text-amber-400/80 transition-colors">
                    <MessageSquare className="w-3.5 h-3.5" />
                    {post.comments?.length || 0}
                  </span>
                  <span>
                    {new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </AutoScrollCarousel>
    </div>
  );
}