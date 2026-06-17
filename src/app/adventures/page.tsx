import { prisma } from "@/lib/db";
import Link from "next/link";
import { ArrowLeft, MapPin } from "lucide-react";

export default async function AllAdventuresPage() {
  const adventures = await prisma.adventureStory.findMany({
    orderBy: { date: "desc" },
  });

  return (
    <main className="min-h-screen bg-[#030712] text-slate-300 font-mono py-24">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        
        <Link href="/#media" className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 text-sm mb-12 transition-colors">
          <ArrowLeft className="w-4 h-4" />Back
        </Link>

        <div className="mb-16">
          <h1 className="text-4xl font-bold text-white flex items-center gap-2">
            <span className="text-slate-500">My</span>
            Adventures.
            <span className="animate-pulse">_</span>
          </h1>
          <p className="text-slate-500 mt-2">{"// Reading historical logs..."}</p>
        </div>

        <div className="space-y-6">
          {adventures.map((adv: any) => (
            <Link 
              href={`/adventures/${adv.id}`} 
              key={adv.id} 
              className="group flex flex-col rounded-lg bg-[#0d1117] border border-slate-800 shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden hover:border-orange-500/50 hover:shadow-[0_0_30px_rgba(249,115,22,0.1)] block"
            >
              <div className="flex items-center justify-between px-4 py-2 bg-slate-900/80 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-700 group-hover:bg-red-500/80 transition-colors" />
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-700 group-hover:bg-yellow-500/80 transition-colors" />
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-700 group-hover:bg-green-500/80 transition-colors" />
                  </div>
                  <span className="ml-2 text-[11px] text-slate-500 select-none">
                    {adv.date ? new Date(adv.date).toISOString().split('T')[0] : 'trip'}_{adv.location.replace(/\s+/g, '_').toLowerCase()}.md
                  </span>
                </div>
              </div>

              <div className="p-6 font-sans">
                <div className="flex items-start gap-2 mb-2 text-slate-500 font-mono text-sm mt-1">
                  <span className="mt-0.5 shrink-0">#</span>
                  <h4 className="font-bold text-xl text-white leading-snug group-hover:text-orange-400 transition-colors">
                    {adv.title}
                  </h4>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-orange-400/80 mb-4 font-mono">
                  <MapPin className="w-3.5 h-3.5" /> {adv.location}
                </div>
                <p className="text-sm text-slate-300 line-clamp-3 leading-relaxed">
                  {adv.content}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}