import { prisma } from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Github, ExternalLink, Terminal } from "lucide-react";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Lấy chi tiết dự án theo ID
  const project = await prisma.project.findUnique({
    where: { id },
  });

  if (!project) notFound();

  return (
    <main className="min-h-screen bg-[#030712] text-slate-300 font-sans py-24 selection:bg-emerald-500/30">
      <article className="max-w-4xl mx-auto px-6 lg:px-8">
        
        {/* Nút quay lại */}
        <Link 
          href="/projects" 
          className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-mono text-sm mb-12 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> back/
        </Link>

        {/* Khung IDE giả lập cho Header */}
        <div className="bg-[#0d1117] border border-slate-800 rounded-xl shadow-2xl overflow-hidden mb-12">
          {/* Top Bar */}
          <div className="flex items-center justify-between px-4 py-3 bg-slate-900/80 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-slate-700" />
                <div className="w-3 h-3 rounded-full bg-slate-700" />
                <div className="w-3 h-3 rounded-full bg-slate-700" />
              </div>
              <span className="ml-3 text-xs text-slate-500 font-mono">
                readme.md - {project.title}
              </span>
            </div>
          </div>
          
          {/* Image */}
          {project.imageUrl && (
            <div className="w-full h-[300px] md:h-[450px] bg-[#030712] relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover opacity-90" />
            </div>
          )}
        </div>

        {/* Nội dung */}
        <div className="flex flex-col md:flex-row gap-12">
          
          {/* Cột trái: Thông tin */}
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {project.title}
            </h1>
            <p className="text-lg text-slate-400 leading-relaxed mb-8 whitespace-pre-wrap">
              {project.description}
            </p>
          </div>

          {/* Cột phải: Tech Stack & Links */}
          <div className="w-full md:w-80 shrink-0 space-y-8">
            {/* Tech Stack */}
            <div className="p-6 bg-[#0d1117] border border-slate-800 rounded-lg font-mono">
              <h3 className="text-slate-500 text-sm mb-4">{"// Tech_Stack"}</h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech: string, idx: number) => (
                  <span key={idx} className="px-3 py-1 text-xs font-medium bg-emerald-500/10 text-emerald-400 rounded border border-emerald-500/20">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Links */}
            <div className="p-6 bg-[#0d1117] border border-slate-800 rounded-lg font-mono space-y-4">
              <h3 className="text-slate-500 text-sm mb-4">{"// Deploy_&_Source"}</h3>
              
              {project.demoUrl && (
                <a href={project.demoUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-blue-400 hover:text-blue-300 transition-colors w-full p-3 bg-blue-500/10 border border-blue-500/20 rounded-md">
                  <ExternalLink className="w-5 h-5" /> Live Project Demo
                </a>
              )}
              
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-slate-300 hover:text-white transition-colors w-full p-3 bg-slate-800/50 border border-slate-700 rounded-md">
                  <Github className="w-5 h-5" /> GitHub Repository
                </a>
              )}

              {!project.demoUrl && !project.githubUrl && (
                 <div className="flex items-center gap-3 text-slate-500 text-sm italic">
                    <Terminal className="w-4 h-4" /> Internal / Private source
                 </div>
              )}
            </div>
          </div>
        </div>

      </article>
    </main>
  );
}