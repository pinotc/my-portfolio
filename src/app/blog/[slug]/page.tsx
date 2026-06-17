import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import { CommentForm } from "@/components/comment-form"; // Thêm dòng này
import { MessageSquare, User } from "lucide-react";

// LƯU Ý NEXT.JS 15: params bây giờ là một Promise
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // 1. Lấy slug từ URL
  const { slug } = await params;

  // 2. Tìm bài viết trong Database thông qua slug
  const post = await prisma.blogPost.findUnique({
    where: { 
      slug: slug 
    },
    include: {
      category: true,
      tags: true,
      comments: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  // 3. Nếu không tìm thấy bài viết (hoặc nhập sai link) -> Chuyển về trang 404
  if (!post) {
    notFound();
  }

  // 4. Nếu tìm thấy, render giao diện bài viết
  return (
    <main className="min-h-screen bg-[#030712] text-slate-300 font-sans py-24 selection:bg-amber-500/30">
      <article className="max-w-3xl mx-auto px-6 lg:px-8">
        
        {/* Nút quay lại */}
        <Link 
          href="/#blog" 
          className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 font-mono text-sm mb-12 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back home
        </Link>

        {/* Phần Header bài viết */}
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-6 font-mono text-sm">
            <span className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full">
              {post.category.name}
            </span>
            <span className="text-slate-500 flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {new Date(post.createdAt).toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-8">
            {post.title}
          </h1>

          {/* Ảnh Cover (nếu có) */}
          {post.coverImage && (
            <div className="w-full h-[400px] rounded-2xl overflow-hidden border border-slate-800 mb-12 shadow-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={post.coverImage} 
                alt={post.title} 
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </header>

        {/* Phần Nội dung bài viết (Render HTML từ Tiptap) */}
        <div 
          className="prose prose-invert prose-amber max-w-none prose-pre:bg-[#0d1117] prose-pre:border prose-pre:border-slate-800"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Phần Footer (Tags) */}
        <footer className="mt-16 pt-8 border-t border-slate-800 flex flex-wrap gap-3">
          <Tag className="w-5 h-5 text-slate-500 mr-2" />
          {post.tags.map((tag: any) => (
            <span key={tag.id} className="px-3 py-1 bg-slate-900 border border-slate-800 text-slate-400 rounded-lg text-sm">
              #{tag.name}
            </span>
          ))}
        </footer>
        {/* ================= PHẦN BÌNH LUẬN ================= */}
        <section className="mt-24 border-t border-slate-800 pt-12">
          <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
            <MessageSquare className="w-6 h-6 text-amber-500" />
            System Feedback ({post.comments.length})
          </h2>

          {/* Form để người dùng nhập */}
          <CommentForm postId={post.id} />

          {/* Danh sách các bình luận đã có */}
          <div className="mt-12 space-y-6">
            {post.comments.length === 0 ? (
              <p className="text-slate-500 italic font-mono text-sm">{"// No feedback logs found."}</p>
            ) : (
              post.comments.map((comment) => (
                <div key={comment.id} className="p-4 bg-slate-900/40 border border-slate-800/50 rounded-lg font-mono">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-emerald-400 text-sm flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-slate-500" />
                      {comment.author}
                    </span>
                    <span className="text-[10px] text-slate-600">
                      {new Date(comment.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-wrap">
                    {comment.content}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>
      </article>
    </main>
  );
}