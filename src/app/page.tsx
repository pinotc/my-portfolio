import Link from "next/link";
import { ArrowRight, MessageSquare, Activity, Database, Laptop, Factory, Briefcase, ExternalLink, GraduationCap, MapPin, BookOpen, Trophy, School, Calendar, Camera, Map, Compass, Image as ImageIcon} from "lucide-react";
import { prisma } from "@/lib/db";
import HeroWrapper from "@/components/3d/HeroWrapper";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getHomeProfile } from "@/server/actions/home-profile";
import { getProfile } from "@/server/actions/profile";
import { SkillTyper } from "@/components/skill-typer";
import { InteractiveMascot } from "@/components/3d/interactive-mascot";
import { TypewriterText } from "@/components/typewriter-text";
import { AlbumSlideshow } from "@/components/album-slideshow";
import { BlogCarousel } from "@/components/blog-carousel";

export default async function HomePage() {
  // 1. TỐI ƯU HÓA: Fetch toàn bộ dữ liệu song song cùng một lúc
  const [
    homeProfile,       // Dữ liệu cho phần Hero (Skill, Title, Bio...)
    userProfile,       // Dữ liệu Profile (Email, Github...) cho phần Contact
    educations,
    personalProjects,
    experiences,
    posts,
    albums,
    adventures
  ] = await Promise.all([
    getHomeProfile(),
    getProfile(),
    prisma.education.findMany({
      orderBy: [{ order: 'asc' }, { startDate: 'desc' }]
    }),
    prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
    prisma.experience.findMany({
      orderBy: [{ order: 'asc' }, { startDate: 'desc' }]
    }),
    prisma.blogPost.findMany({
      where: { isPublished: true },
      include: { category: true, tags: true, comments: true },
      orderBy: { createdAt: "desc" },
      take: 12
    }),
    prisma.photoAlbum.findMany({
      orderBy: { createdAt: "desc" },
      take: 4,
      include: { 
        photos: true 
      }
    }),
    prisma.adventureStory.findMany({
      orderBy: { date: "desc" },
      take: 2,
    })
  ]);

  // 2. Các hàm Helper xử lý format dữ liệu
  const formatEduDate = (date: Date | null) => {
    if (!date) return "Present";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
    });
  };

  const stripHtml = (html: string) => {
    if (!html) return ""; // Tránh lỗi nếu bài viết chưa có nội dung
    return html.replace(/<[^>]*>?/gm, '').substring(0, 120) + "...";
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* ================= HERO SECTION ================= */}
      <main id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
        
        <HeroWrapper />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 flex flex-col items-center text-center">
      
        {/* TRẠNG THÁI (Status) ĐỘNG */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium mb-8 backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            { homeProfile.status === "System Online & Operating" && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            )}
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          { homeProfile.status}
        </div>

        {/* TÊN ĐỘNG - Phong cách Command Prompt */}
        <h1 className="text-5xl md:text-7xl font-mono font-bold tracking-tight mb-6 text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.4)] flex justify-center items-center gap-2">
          <span className="text-emerald-600">{">"}</span>
          <TypewriterText text={homeProfile.fullName} />
          <span className="animate-pulse text-emerald-400">_</span>
        </h1>

        {/* CÁC THẺ BADGE - Phong cách Syntax Highlighting */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-8 font-mono text-sm md:text-base">
          
          {/* ROLE ĐỘNG (Khai báo biến) */}
          <div className="flex items-center gap-2 px-4 py-2 bg-black/60 backdrop-blur-md border border-emerald-500/30 rounded-md text-emerald-300 shadow-[inset_0_0_10px_rgba(16,185,129,0.1)]">
            <Briefcase className="w-4 h-4 text-emerald-500" />
            <span><span className="text-pink-500"></span> role <span className="text-blue-400">=</span> <span className="text-yellow-300">"<TypewriterText text={homeProfile.primaryRole} />"</span></span>
          </div>

          {/* LIST SKILL ĐỘNG (Thẻ Component) */}
          <div className="flex items-center gap-2 px-4 py-2 bg-black/60 backdrop-blur-md border border-blue-500/30 rounded-md text-blue-300 shadow-[inset_0_0_10px_rgba(59,130,246,0.1)]">
            <Laptop className="w-4 h-4 text-blue-500" />
            <span className="text-slate-400">{"<"}</span>
            <SkillTyper skills={homeProfile.skills} />
            <span className="text-slate-400">{"/>"}</span>
          </div>

          {/* ĐỊA ĐIỂM ĐỘNG (Object Property) */}
          <div className="flex items-center gap-2 px-4 py-2 bg-black/60 backdrop-blur-md border border-cyan-500/30 rounded-md text-cyan-300 shadow-[inset_0_0_10px_rgba(6,182,212,0.1)]">
            <MapPin className="w-4 h-4 text-cyan-500" />
            <span>loc: <span className="text-yellow-300">"<TypewriterText text={homeProfile.location}/>"</span></span>
          </div>
        </div>

        {/* ĐOẠN BIO ĐỘNG - Phong cách Terminal Block */}
        <div className="relative text-lg md:text-xl font-mono text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed whitespace-pre-wrap bg-[#0d1117] p-6 rounded-lg border border-slate-800 shadow-[0_0_20px_rgba(0,0,0,0.5)] text-left">
          {/* Nút giả lập cửa sổ code (Mac style) */}
          <div className="absolute top-3 left-4 flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
          </div>
          
          {/* Nội dung Bio */}
          <div className="mt-4">
            <span className="text-slate-500">{"// About me"}</span><br/>
            <TypewriterText text={homeProfile.bio} />
          </div>
        </div>

        {/* ================= NÚT VIEW PORTFOLIO (CYBER/TERMINAL STYLE) ================= */}
        <div className="mt-4 flex justify-center z-10 relative">
          <a 
            href="#portfolio" // Đổi link này trỏ đến đúng ID phần dự án của bạn
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-[#0d1117] border border-emerald-500/40 text-emerald-400 font-mono text-base md:text-lg rounded-md overflow-hidden transition-all duration-300 hover:border-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:-translate-y-1"
          >
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
            <span className="text-slate-500 group-hover:text-emerald-300 transition-colors">{"$"}</span>
            <span className="font-semibold tracking-wide">view_portfolio</span>
            <ArrowRight className="w-5 h-5 opacity-70 group-hover:opacity-100 group-hover:translate-x-1.5 transition-all" />
          </a>
        </div>
      </div>
      </main>

      {/* ================= EXPERIENCE TIMELINE (TERMINAL STYLE) ================= */}
      {homeProfile.isShowExperience && (
      <section id="experience" className="py-24 relative z-10 bg-[#030712] font-mono">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          
          {/* Header phong cách dòng lệnh */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-400 flex items-center justify-center gap-2">
              <span className="text-slate-500">My</span>
              Experience
              <span className="animate-pulse">_</span>
            </h2>
            <p className="text-slate-500 mt-4">{"// Anything in life that is worth having was worth working for."}</p>
          </div>

          {/* Đường line dọc của Timeline */}
          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-px before:bg-gradient-to-b before:from-slate-800 before:via-slate-700 before:to-transparent">
            {experiences.map((item: any, index: number) => {
              const isOngoing = item.isCurrent || !item.endDate;

              return (
                <div key={item.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                  
                  {/* Icon Node - Biến thành con trỏ Terminal (Square) thay vì hình tròn */}
                  <div className={`flex items-center justify-center w-8 h-8 md:w-10 md:h-10 border border-slate-800 bg-[#0d1117] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-all duration-300 ${
                    isOngoing 
                      ? 'shadow-[0_0_15px_rgba(16,185,129,0.4)] border-emerald-500/50 text-emerald-400' 
                      : 'shadow-[0_0_15px_rgba(59,130,246,0.2)] border-blue-500/30 text-blue-400'
                  }`}>
                    <Briefcase className="w-4 h-4" />
                  </div>
                  
                  {/* Content Card - Cửa sổ IDE/Terminal */}
                  <div className={`w-[calc(100%-3.5rem)] md:w-[calc(50%-2.5rem)] rounded-lg bg-[#0d1117] border shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden ${
                    isOngoing 
                      ? 'border-emerald-500/30 hover:border-emerald-400/60 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]' 
                      : 'border-slate-800 hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)]'
                  }`}>
                    
                    {/* Thanh tiêu đề (Top Bar) của cửa sổ code */}
                    <div className="flex items-center justify-between px-4 py-2 bg-slate-900/80 border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-slate-700 group-hover:bg-red-500/80 transition-colors" />
                          <div className="w-2.5 h-2.5 rounded-full bg-slate-700 group-hover:bg-yellow-500/80 transition-colors" />
                          <div className="w-2.5 h-2.5 rounded-full bg-slate-700 group-hover:bg-green-500/80 transition-colors" />
                        </div>
                      </div>
                      
                      {/* Badge Ngày Tháng */}
                      <span className={`px-2 py-0.5 text-[10px] sm:text-xs font-semibold rounded uppercase tracking-wider ${
                        isOngoing 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      }`}>
                        {new Date(item.startDate).toLocaleDateString("en-US", { month: 'short', year: 'numeric' })} - 
                        {isOngoing ? " PRESENT" : " " + new Date(item.endDate!).toLocaleDateString("en-US", { month: 'short', year: 'numeric' })}
                      </span>
                    </div>

                    {/* Nội dung Code (Body) */}
                    <div className="mt-4 ml-4">
                      <h3 className="text-xl font-semibold text-white">
                        {item.company}
                      </h3>

                      <p className="text-cyan-400 font-medium mt-1">
                        {item.role}
                      </p>
                      <br></br>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      )}

      {/* ================= ACADEMIC FOUNDATION (TERMINAL FULL WIDTH) ================= */}
      {homeProfile.isShowEducation && (
      <section id="education" className="py-24 relative z-10 bg-[#030712] font-mono">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          
          {/* Header phong cách dòng lệnh */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-400 flex items-center justify-center gap-2">
              <span className="text-slate-500">My</span>
              Education
              <span className="animate-pulse">_</span>
            </h2>
            <p className="text-slate-500 mt-4">{"// Education is not the learning of facts, but the training of the mind to think."}</p>
          </div>

          {/* Khung chứa (Đã xóa các class tạo đường kẻ Timeline) */}
          <div className="space-y-8">
            {educations.map((edu: any, index: number) => {
              const isOngoing = !edu.endDate;

              return (
                <div key={edu.id} className="relative group">
                  
                  {/* Content Card - Cửa sổ IDE/Terminal mở rộng FULL WIDTH */}
                  <div className={`w-full rounded-lg bg-[#0d1117] border shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden ${
                    isOngoing 
                      ? 'border-emerald-500/30 hover:border-emerald-400/60 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]' 
                      : 'border-slate-800 hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)]'
                  }`}>
                    
                    {/* Thanh tiêu đề (Top Bar) của cửa sổ code */}
                    <div className="flex items-center justify-between px-4 py-3 bg-slate-900/80 border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1.5">
                          <div className="w-3 h-3 rounded-full bg-slate-700 group-hover:bg-red-500/80 transition-colors" />
                          <div className="w-3 h-3 rounded-full bg-slate-700 group-hover:bg-yellow-500/80 transition-colors" />
                          <div className="w-3 h-3 rounded-full bg-slate-700 group-hover:bg-green-500/80 transition-colors" />
                        </div>
                        <span className="ml-3 text-xs text-slate-500 select-none">
                          University.ts
                        </span>
                      </div>
                      
                      {/* Badge Ngày Tháng */}
                      <span className={`px-2 py-0.5 text-[10px] sm:text-xs font-semibold rounded uppercase tracking-wider ${
                        isOngoing 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      }`}>
                        {formatEduDate(edu.startDate)} - {isOngoing ? "PRESENT" : formatEduDate(edu.endDate)}
                      </span>
                    </div>

                    {/* Nội dung dạng Text (Body) */}
                    <div className="p-6 md:p-8 text-left">
                      <h3 className="text-XL md:text-xl font-medium text-cyan-200 font-mono tracking-wide">
                        {edu.institution}
                      </h3>
                        {/* Render tên viết tắt trường */}
                        <div className="flex flex-wrap gap-2">
                          <span 
                            className="px-3 py-1.5 text-xs text-slate-300 bg-[#030712] border border-slate-800 rounded-md group-hover:border-slate-700 transition-colors"
                          >{edu.courses}
                          </span>
                        </div>

                      <p className="text-emerald-400 text-lg font-medium mt-2 mb-8">
                        {edu.degree}
                      </p>

                      {/* Render Thành tích */}
                      {edu.achievements.length > 0 && (
                        <div>
                          <span className="text-slate-500 text-sm mb-3 block ">{"// Key Achievements"}</span>
                          <ul className="space-y-3">
                            {edu.achievements.map((ach: string, idx: number) => (
                              <li key={idx} className="flex items-start gap-3 text-sm text-slate-300 leading-relaxed flex-1 whitespace-nowrap">
                                <span className="text-emerald-500 mt-0.5 shrink-0">{"->"}</span>
                                <span className="leading-relaxed">{ach}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      )}

      {/* ================= PORTFOLIO SECTION (MODIFIED & LINKED) ================= */}
      {homeProfile.isShowProjects && (
      <section id="portfolio" className="py-24 relative z-10 bg-[#030712] font-mono">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          
          {/* Header phong cách dòng lệnh */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-emerald-400 flex items-center justify-start gap-2">
                <span className="text-slate-500">My</span>
                Projects
                <span className="animate-pulse">_</span>
              </h2>
              <p className="text-slate-500 mt-4">
                {"// A selection of my personal projects showcasing software development & problem-solving skills."}
              </p>
            </div>

            {/* NÚT XEM TẤT CẢ DỰ ÁN */}
            <Link href="/projects" className="text-emerald-400 hover:text-emerald-300 text-sm font-medium flex items-center justify-start md:justify-end gap-2 group">
              <span className="text-slate-500 group-hover:text-emerald-300 transition-colors">./view_all_projects</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Grid Layout - 3 cột trên Desktop (giống ban đầu) */}
          {/* Grid Layout - 3 cột trên Desktop (giống ban đầu) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {personalProjects.map((project: any) => (
              // 1. ĐỔI THẺ BỌC NGOÀI THÀNH THẺ DIV (Thêm chữ relative)
              <div 
                key={project.id} 
                className="group relative flex flex-col rounded-lg bg-[#0d1117] border border-slate-800 shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]"
              >
                {/* 2. TUYỆT CHIÊU: Link tàng hình phủ kín toàn bộ Card (z-10) */}
                <Link href={`/projects/${project.id}`} className="absolute inset-0 z-10" aria-label={`Xem chi tiết ${project.title}`} />
                
                {/* 1. Thanh tiêu đề (Top Bar) phong cách CODING */}
                <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/80 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-slate-700 group-hover:bg-red-500/80 transition-colors" />
                      <div className="w-3 h-3 rounded-full bg-slate-700 group-hover:bg-yellow-500/80 transition-colors" />
                      <div className="w-3 h-3 rounded-full bg-slate-700 group-hover:bg-green-500/80 transition-colors" />
                    </div>
                  </div>
                </div>

                {/* 2. Hình ảnh dự án */}
                {project.imageUrl && (
                  <div className="relative w-full h-48 overflow-hidden border-b border-slate-800 bg-[#030712]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={project.imageUrl} 
                      alt={project.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" 
                    />
                  </div>
                )}

                {/* 3. Nội dung (Body) */}
                <div className="p-6 flex-1 flex flex-col font-sans">
                  
                  {/* Project Name */}
                  <div className="flex items-center gap-2 mb-2 text-slate-500 font-mono text-sm">
                    <h3 className="text-xl font-bold text-white font-sans group-hover:text-emerald-400 transition-colors">
                      {project.title}
                    </h3>
                  </div>

                  <p className="text-slate-300 mb-6 text-sm md:text-base leading-relaxed line-clamp-3">
                    {project.description}
                  </p>
                  
                  {/* Technologies */}
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

                  {/* 3. CÁC NÚT LINKS: Thêm relative z-20 để nổi lên trên cùng, hứng cú click */}
                  <div className="pt-4 border-t border-slate-800 flex flex-wrap gap-5 mt-auto font-mono text-sm relative z-20">
                    {project.githubUrl && (
                      <a 
                        href={project.githubUrl.startsWith('http') ? project.githubUrl : `https://${project.githubUrl}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group/link"
                      >
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" 
                          fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
                          className="w-4 h-4"
                        >
                          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A4.8 4.8 0 0 0 8 18v4"></path>
                          <path d="M12 18h.01"></path>
                        </svg>
                        <span className="group-hover/link:underline decoration-slate-600 underline-offset-4">view-source</span>
                      </a>
                    )}
                    {project.demoUrl && (
                      <a 
                        href={project.demoUrl.startsWith('http') ? project.demoUrl : `https://${project.demoUrl}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors group/link"
                      >
                        <ExternalLink className="w-4 h-4" /> 
                        <span className="group-hover/link:underline decoration-blue-500/30 underline-offset-4">view-demo</span>
                      </a>
                    )}
                  </div>
                  
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* ================= BLOG SECTION (TERMINAL & DB SYNCED) ================= */}
      {homeProfile.isShowBlog && (
      <section id="blog" className="py-24 relative z-10 bg-[#030712] font-mono">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-amber-400 flex items-center gap-2">
                <span className="text-slate-500">My</span>
                Blog
                <span className="animate-pulse">_</span>
              </h2>
              <p className="text-slate-500 mt-4">
                {"// Thoughts, tutorials, and insights on tech, data, and growth."}
              </p>
            </div>
            
            <Link href="/blog" className="text-amber-400 hover:text-amber-300 text-sm font-medium flex items-center justify-start md:justify-end gap-2 group">
              <span className="text-slate-500 group-hover:text-amber-300 transition-colors">./read_all</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* CHỈ CẦN GỌI ĐÚNG 1 DÒNG NÀY */}
          <BlogCarousel posts={posts} />

        </div>
      </section>
      )}

      {/* ================= MEDIA & ADVENTURE SECTION (LINKED & MODIFIED) ================= */}
      {homeProfile.isShowMedia && (
      <section id="media" className="py-24 relative z-10 bg-[#030712] font-mono">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          
          {/* Header phong cách dòng lệnh */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-purple-400 flex items-center gap-2">
                <span className="text-slate-500">My</span>
                Life
                <span className="text-pink-500">Through The Lens</span> 
                <span className="animate-pulse">_</span>
              </h2>
              <p className="text-slate-500 mt-4">
                {"// Capturing moments, stories, and adventures from my travels and daily life."}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* ================= CỘT 1: PHOTOGRAPHY (Chiếm 2 phần) ================= */}
            <div className="lg:col-span-2">
              
              {/* Header của cột Photography CÓ NÚT XEM TẤT CẢ */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <span className="text-pink-500">$</span>./photos
                </div>
                <Link href="/albums" className="text-purple-400 hover:text-purple-300 text-xs sm:text-sm font-medium flex items-center gap-1.5 group">
                  <span className="text-slate-500 group-hover:text-purple-300 transition-colors">./view_all_albums</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {albums.map((album: any) => (
                  // BỌC THẺ BẰNG LINK
                  <Link 
                    href={`/albums/${album.id}`} 
                    key={album.id} 
                    className="group relative rounded-lg bg-[#0d1117] border border-slate-800 shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] block"
                  >
                    
                    {/* Thanh tiêu đề IDE */}
                    <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/80 border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-slate-700 group-hover:bg-red-500/80 transition-colors" />
                          <div className="w-2.5 h-2.5 rounded-full bg-slate-700 group-hover:bg-yellow-500/80 transition-colors" />
                          <div className="w-2.5 h-2.5 rounded-full bg-slate-700 group-hover:bg-green-500/80 transition-colors" />
                        </div>
                      </div>
                      {/* Category Badge */}
                      <span className="px-2 py-0.5 text-[10px] font-semibold rounded uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/20 whitespace-nowrap">
                        {album.category}
                      </span>
                    </div>

                    {/* Khu vực hiển thị Hình ảnh */}
                    <div className="h-48 relative overflow-hidden bg-[#030712] border-b border-slate-800">
                      <AlbumSlideshow album={album} />
                    </div>

                    {/* Tiêu đề */}
                    <div className="p-4 font-sans bg-[#0d1117]">
                      <h4 className="text-white font-bold truncate group-hover:text-purple-400 transition-colors">
                        {album.title}
                      </h4>
                    </div>

                  </Link>
                ))}
              </div>
            </div>

            {/* ================= CỘT 2: ADVENTURES (Chiếm 1 phần) ================= */}
            <div className="lg:col-span-1">
              
              {/* Header của cột Adventures CÓ NÚT XEM TẤT CẢ */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <span className="text-pink-500">$</span>./adventures
                </div>
                <Link href="/adventures" className="text-orange-400 hover:text-orange-300 text-xs sm:text-sm font-medium flex items-center gap-1.5 group">
                  <span className="text-slate-500 group-hover:text-orange-300 transition-colors">./read_all</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              <div className="space-y-6">
                {adventures.map((adv: any) => (
                  // BỌC THẺ BẰNG LINK
                  <Link 
                    href={`/adventures/${adv.id}`}
                    key={adv.id} 
                    className="group rounded-lg bg-[#0d1117] border border-slate-800 shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden hover:border-orange-500/50 hover:shadow-[0_0_30px_rgba(249,115,22,0.1)] block"
                  >
                    
                    {/* Thanh tiêu đề file log */}
                    <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/80 border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-slate-700 group-hover:bg-red-500/80 transition-colors" />
                          <div className="w-2.5 h-2.5 rounded-full bg-slate-700 group-hover:bg-yellow-500/80 transition-colors" />
                          <div className="w-2.5 h-2.5 rounded-full bg-slate-700 group-hover:bg-green-500/80 transition-colors" />
                        </div>
                      </div>
                    </div>

                    {/* Nội dung chuyến đi */}
                    <div className="p-5 font-sans">
                      
                      <div className="flex items-start gap-2 mb-2 text-slate-500 font-mono text-sm mt-1">
                        <span className="mt-0.5 shrink-0">#</span>
                        <h4 className="font-bold text-lg text-white leading-snug group-hover:text-orange-400 transition-colors">
                          {adv.title}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2 text-xs font-medium text-orange-400/80 mb-4 font-mono">
                        <MapPin className="w-3.5 h-3.5" /> {adv.location}
                      </div>

                      <p className="text-sm text-slate-300 line-clamp-4 leading-relaxed mb-4">
                        {adv.content}
                      </p>

                      {adv.routeInfo && (
                        <div className="p-3 bg-[#030712] rounded text-[11px] sm:text-xs text-slate-400 border border-slate-800 font-mono mt-4 overflow-x-auto whitespace-nowrap">
                          <span className="text-pink-500">const</span> <span className="text-blue-400">route</span> <span className="text-pink-500">=</span> <span className="text-yellow-300">"{adv.routeInfo}"</span>;
                        </div>
                      )}

                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      <Footer 
        email={userProfile?.email}
        githubUrl={userProfile?.githubUrl} 
        linkedinUrl={userProfile?.linkedinUrl}
      />
    </div>
  );
}