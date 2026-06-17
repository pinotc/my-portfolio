import { prisma } from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, Calendar, Map } from "lucide-react";

export default async function AdventureDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const adv = await prisma.adventureStory.findUnique({
    where: { id },
  });

  if (!adv) notFound();

  return (
    <main className="min-h-screen bg-[#030712] text-slate-300 font-sans py-24 selection:bg-orange-500/30">
      <article className="max-w-3xl mx-auto px-6 lg:px-8">
        
        <Link 
          href="/adventures" 
          className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 font-mono text-sm mb-12 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> cd ../
        </Link>

        {/* Cửa sổ log file */}
        <div className="bg-[#0d1117] border border-slate-800 rounded-xl shadow-2xl overflow-hidden">
          
          <div className="flex items-center justify-between px-4 py-3 bg-slate-900/80 border-b border-slate-800 font-mono">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-slate-700" />
                <div className="w-3 h-3 rounded-full bg-slate-700" />
                <div className="w-3 h-3 rounded-full bg-slate-700" />
              </div>
              <span className="ml-3 text-xs text-slate-500">
                viewer_mode: active
              </span>
            </div>
            <span className="text-[10px] text-slate-500">UTF-8</span>
          </div>

          <div className="p-8 md:p-12">
            <div className="flex items-center gap-4 mb-6 font-mono text-sm text-slate-400 border-b border-slate-800 pb-6">
              <span className="flex items-center gap-1.5 text-orange-400">
                <MapPin className="w-4 h-4" /> {adv.location}
              </span>
              {adv.date && (
                <>
                  <span>|</span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" /> 
                    {new Date(adv.date).toLocaleDateString("en-US", { month: 'short', day: '2-digit', year: 'numeric' })}
                  </span>
                </>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">
              {adv.title}
            </h1>

            {adv.routeInfo && (
              <div className="mb-10 p-4 bg-[#030712] border border-slate-800 rounded-lg font-mono">
                <div className="text-slate-500 text-xs mb-2 flex items-center gap-2">
                  <Map className="w-4 h-4 text-orange-500" /> route_data
                </div>
                <div className="text-orange-300 text-sm">
                  {adv.routeInfo}
                </div>
              </div>
            )}

            <div className="prose prose-invert prose-orange max-w-none text-lg text-slate-300 leading-relaxed whitespace-pre-wrap">
              {adv.content}
            </div>

            <div className="mt-16 pt-6 border-t border-slate-800 font-mono text-xs text-slate-500 text-center">
              {"// End of log file."}
            </div>
          </div>
        </div>

      </article>
    </main>
  );
}