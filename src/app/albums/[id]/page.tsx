import { prisma } from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ImageIcon, Calendar } from "lucide-react";

export default async function AlbumDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const album = await prisma.photoAlbum.findUnique({
    where: { id },
    include: { photos: true }
  });

  if (!album) notFound();

  // Gộp cover image và danh sách ảnh thành 1 mảng để render
  const allImages = Array.from(new Set([album.coverImage, ...(album.photos?.map((p: any) => p.url) || [])])).filter(Boolean);

  return (
    <main className="min-h-screen bg-[#030712] text-slate-300 font-mono py-24 selection:bg-purple-500/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        <Link href="/albums" className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 text-sm mb-12 transition-colors">
          <ArrowLeft className="w-4 h-4" />Back
        </Link>

        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4 text-sm">
            <span className="px-3 py-1 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-full">
              {album.category}
            </span>
            <span className="text-slate-500 flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {new Date(album.createdAt).toLocaleDateString("en-US", { month: 'long', year: 'numeric' })}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-sans">{album.title}</h1>
          <p className="text-slate-500">{"// Image gallery viewer initialized. "}{allImages.length} files loaded.</p>
        </header>

        {/* Khung chứa ảnh phong cách cửa sổ */}
        <div className="bg-[#0d1117] border border-slate-800 rounded-xl shadow-2xl overflow-hidden p-6">
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {allImages.map((imgUrl, idx) => (
              <div key={idx} className="relative group break-inside-avoid rounded-lg overflow-hidden border border-slate-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={imgUrl as string} 
                  alt={`Photo ${idx}`} 
                  className="w-full h-auto object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" 
                  loading="lazy"
                />
                <div className="absolute bottom-0 left-0 w-full p-2 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] text-slate-300 font-mono">IMG_{idx.toString().padStart(4, '0')}.RAW</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}