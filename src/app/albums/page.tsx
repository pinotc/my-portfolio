import { prisma } from "@/lib/db";
import Link from "next/link";
import { ArrowLeft, Camera } from "lucide-react";
import { AlbumSlideshow } from "@/components/album-slideshow"; // Import component bạn đã tạo

export default async function AllAlbumsPage() {
  const albums = await prisma.photoAlbum.findMany({
    orderBy: { createdAt: "desc" },
    include: { photos: true }
  });

  return (
    <main className="min-h-screen bg-[#030712] text-slate-300 font-mono py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        <Link href="/#media" className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 text-sm mb-12 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>

        <div className="mb-16">
          <h1 className="text-4xl font-bold text-white flex items-center gap-2">
            <span className="text-slate-500">My</span>
            Albums
            <span className="animate-pulse">_</span>
          </h1>
          <p className="text-slate-500 mt-2">{"// Total directories found: "}{albums.length}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {albums.map((album: any) => (
            <Link 
              href={`/albums/${album.id}`} 
              key={album.id} 
              className="group relative rounded-lg bg-[#0d1117] border border-slate-800 shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] block"
            >
              <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/80 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-slate-700 group-hover:bg-red-500/80 transition-colors" />
                    <div className="w-3 h-3 rounded-full bg-slate-700 group-hover:bg-yellow-500/80 transition-colors" />
                    <div className="w-3 h-3 rounded-full bg-slate-700 group-hover:bg-green-500/80 transition-colors" />
                  </div>
                  <span className="ml-3 text-xs text-slate-500 truncate">
                    {album.title.split(' ')[0].toLowerCase()}.raw
                  </span>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-semibold rounded uppercase bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  {album.category}
                </span>
              </div>

              <div className="h-56 relative overflow-hidden bg-[#030712] border-b border-slate-800">
                <AlbumSlideshow album={album} />
              </div>

              <div className="p-5 font-sans bg-[#0d1117]">
                <h4 className="text-white font-bold text-lg group-hover:text-purple-400 transition-colors">
                  {album.title}
                </h4>
                <p className="text-slate-500 text-sm mt-2 flex items-center gap-2 font-mono">
                  <Camera className="w-4 h-4" /> {album.photos?.length || 0} items
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}