import { prisma } from "@/lib/db";
import Link from "next/link";
import { ArrowLeft, Github, ExternalLink } from "lucide-react";

export default async function AllProjectsPage() {
  // Lấy toàn bộ project từ DB
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-[#030712] text-slate-300 font-mono py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Nút quay lại trang chủ */}
        <Link href="/#portfolio" className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 text-sm mb-12 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>

        {/* Header Terminal */}
        <div className="mb-16">
          <h1 className="text-4xl font-bold text-white flex items-center gap-2">
            <span className="text-slate-500">My</span>
            Project
            <span className="animate-pulse">_</span>
          </h1>
          <p className="text-slate-500 mt-2">{"// Total repositories found: "}{projects.length}</p>
        </div>

        {/* Grid Layout 3 Cột */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project: any) => (
            <Link 
              href={`/projects/${project.id}`} 
              key={project.id} 
              className="group flex flex-col rounded-lg bg-[#0d1117] border border-slate-800 shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] block"
            >
              {/* Top Bar Coding */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/80 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-slate-700 group-hover:bg-red-500/80 transition-colors" />
                    <div className="w-3 h-3 rounded-full bg-slate-700 group-hover:bg-yellow-500/80 transition-colors" />
                    <div className="w-3 h-3 rounded-full bg-slate-700 group-hover:bg-green-500/80 transition-colors" />
                  </div>
                  <span className="ml-3 text-xs text-slate-500 select-none">
                    src/projects/<span className="text-yellow-300">{project.title.toLowerCase().replace(/\s+/g, '_')}</span>.tsx
                  </span>
                </div>
              </div>

              {/* Hình ảnh */}
              {project.imageUrl && (
                <div className="relative w-full h-48 overflow-hidden border-b border-slate-800 bg-[#030712]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" />
                </div>
              )}

              {/* Nội dung */}
              <div className="p-6 flex-1 flex flex-col font-sans">
                <div className="flex items-center gap-2 mb-2 text-slate-500 font-mono text-sm">
                  <span>$ ./open</span>
                  <h3 className="text-xl font-bold text-white font-sans group-hover:text-emerald-400 transition-colors">{project.title}</h3>
                </div>

                <p className="text-slate-300 mb-6 text-sm md:text-base leading-relaxed line-clamp-3">
                  {project.description}
                </p>
                
                <div className="mb-6">
                  <div className="text-xs text-slate-500 font-mono mb-2">{"// Technologies"}</div>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.slice(0, 3).map((tech: string, idx: number) => (
                      <span key={idx} className="px-2.5 py-1 text-xs font-medium bg-emerald-500/10 text-emerald-400 rounded border border-emerald-500/20">
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                       <span className="px-2.5 py-1 text-xs font-medium bg-slate-800 text-slate-400 rounded border border-slate-700">
                         +{project.technologies.length - 3}
                       </span>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex flex-wrap gap-5 mt-auto font-mono text-sm">
                  {project.githubUrl && (
                    <div className="flex items-center gap-2 text-slate-400 group/link">
                      <Github className="w-4 h-4" /> 
                      <span>Source</span>
                    </div>
                  )}
                  {project.demoUrl && (
                    <div className="flex items-center gap-2 text-blue-400 group/link">
                      <ExternalLink className="w-4 h-4" /> 
                      <span>Demo</span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}