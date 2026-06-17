import { prisma } from "@/lib/db";
import Link from "next/link";
import { ArrowLeft, BookOpen, MessageSquare, Calendar } from "lucide-react";

export default async function AllBlogPage() {
  // Lấy toàn bộ bài viết từ database
  const posts = await prisma.blogPost.findMany({
    where: { isPublished: true },
    include: { category: true, tags: true, comments: true },
    orderBy: { createdAt: "desc" },
  });

  const stripHtml = (html: string) => {
    if (!html) return "";
    return html.replace(/<[^>]*>?/gm, '').substring(0, 120) + "...";
  };

  return (
    <main className="min-h-screen bg-[#030712] text-slate-300 font-mono py-24">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        
        {/* Nút quay lại trang chủ */}
        <Link href="/" className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 text-sm mb-12 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>

        {/* Header Terminal */}
        <div className="mb-16">
          <h1 className="text-4xl font-bold text-white flex items-center gap-2">
            <span className="text-slate-500">My</span>
            Blog
            <span className="animate-pulse">_</span>
          </h1>
          <p className="text-slate-500 mt-2">{"// Total archives found: "}{posts.length} entries.</p>
        </div>

        {/* Danh sách bài viết dạng Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post: any) => (
            <Link 
              href={`/blog/${post.slug}`} 
              key={post.id} 
              className="group flex flex-col rounded-lg bg-[#0d1117] border border-slate-800 shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden hover:border-amber-500/50 hover:shadow-[0_0_30px_rgba(245,158,11,0.15)] cursor-pointer"
            >
              {/* Top Bar */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/80 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-slate-700 group-hover:bg-red-500/80 transition-colors" />
                    <div className="w-3 h-3 rounded-full bg-slate-700 group-hover:bg-yellow-500/80 transition-colors" />
                    <div className="w-3 h-3 rounded-full bg-slate-700 group-hover:bg-green-500/80 transition-colors" />
                  </div>
                  <span className="ml-3 text-xs text-slate-500 select-none truncate max-w-[150px]">
                    {post.slug}.md
                  </span>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-semibold rounded uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  {post.category.name}
                </span>
              </div>

              {/* Cover Image */}
              <div className="relative h-48 overflow-hidden bg-[#030712] border-b border-slate-800">
                {post.coverImage ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={post.coverImage} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-500" alt={post.title} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-700"><BookOpen className="w-12 h-12 opacity-50" /></div>
                )}
              </div>

              {/* Body Content */}
              <div className="p-6 flex flex-col flex-1 font-sans">
                <div className="flex items-start gap-2 mb-3 text-slate-500 font-mono text-sm mt-1">
                  <span className="mt-0.5 shrink-0">$ cat</span>
                  <h3 className="text-xl font-bold text-white font-sans line-clamp-2 leading-snug group-hover:text-amber-400 transition-colors">
                    {post.title}
                  </h3>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed line-clamp-3 mb-6">
                  {stripHtml(post.content)}
                </p>
                
                {/* Footer Card */}
                <div className="mt-auto pt-4 border-t border-slate-800 flex items-center justify-between font-mono text-[11px] text-slate-500">
                  <div className="flex gap-1">
                    {post.tags.slice(0, 2).map((tag: any) => (
                      <span key={tag.id} className="text-slate-400">#{tag.name}</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> {post.comments?.length || 0}</span>
                    <span>{new Date(post.createdAt).toLocaleDateString("en-US", { month: 'short', day: '2-digit' })}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </main>
  );
}