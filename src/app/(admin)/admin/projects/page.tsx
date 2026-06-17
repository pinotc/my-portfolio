import { getProjects, createProject, deleteProject } from "@/server/actions/projects";
import { Factory, Plus, Trash2, ExternalLink, Eye, EyeOff } from "lucide-react";

export default async function ProjectsAdminPage() {
  const projects = await getProjects();

  return (
    <div className="max-w-7xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Factory className="w-8 h-8 text-indigo-500" /> Quản Lý Dự Án
        </h1>
        <p className="text-muted-foreground mt-2">Thêm mới và chỉnh sửa các dự án Data Pipeline & Development.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Form Thêm Mới */}
        <div className="xl:col-span-1">
          <form action={async (formData) => {
            "use server";
            await createProject(formData);
          }} className="p-6 bg-card border border-border rounded-xl shadow-lg space-y-4 sticky top-8">
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
              <Plus className="w-5 h-5 text-indigo-400" /> Thêm Dự Án Mới
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Tên dự án</label>
              <input name="title" required placeholder="VD: MES Dashboard System" className="w-full px-4 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-indigo-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Link ảnh (Thumbnail)</label>
              <input name="imageUrl" placeholder="https://..." className="w-full px-4 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-indigo-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Mô tả ngắn</label>
              <textarea name="description" required rows={2} placeholder="Mô tả chức năng chính..." className="w-full px-4 py-2 text-sm bg-background border border-border rounded-lg resize-none focus:ring-2 focus:ring-indigo-500" />
            </div>

            {/* TRƯỜNG CONTENT BẮT BUỘC THEO DB */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Nội dung chi tiết (Content)</label>
              <textarea name="content" required rows={4} placeholder="Chi tiết quá trình thực hiện, bài toán giải quyết..." className="w-full px-4 py-2 text-sm bg-background border border-border rounded-lg resize-none focus:ring-2 focus:ring-indigo-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Công nghệ sử dụng</label>
              <input name="technologies" required placeholder="VD: Python, SQL, Next.js (cách nhau dấu phẩy)" className="w-full px-4 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-indigo-500" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Link Source</label>
                <input name="githubUrl" placeholder="GitHub URL" className="w-full px-4 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Link Demo</label>
                <input name="demoUrl" placeholder="Live Demo URL" className="w-full px-4 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-indigo-500" />
              </div>
            </div>

            {/* CHECKBOX XUẤT BẢN */}
            <div className="flex items-center gap-2 py-2">
              <input type="checkbox" id="isPublished" name="isPublished" value="true" defaultChecked className="w-4 h-4 text-indigo-600 rounded border-border focus:ring-indigo-500 bg-background" />
              <label htmlFor="isPublished" className="text-sm font-medium text-foreground cursor-pointer">
                Xuất bản (Hiển thị công khai)
              </label>
            </div>

            <button type="submit" className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors mt-2">
              Lưu Dự Án
            </button>
          </form>
        </div>

        {/* Danh Sách Dự Án */}
        <div className="xl:col-span-2 space-y-4">
          {projects.length === 0 ? (
            <div className="p-8 text-center bg-card/20 border border-border border-dashed rounded-xl text-muted-foreground">
              Chưa có dự án nào được thêm.
            </div>
          ) : (
            projects.map((project: any) => (
              <div key={project.id} className="p-6 bg-card/40 backdrop-blur-md border border-border rounded-xl shadow-md flex flex-col sm:flex-row gap-6 transition-all hover:border-indigo-500/30 relative">
                
                {/* Trạng thái xuất bản (Badge góc trái) */}
                <div className="absolute top-4 left-4 z-10">
                  {project.isPublished ? (
                    <span className="flex items-center gap-1 px-2 py-1 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded-md backdrop-blur-md">
                      <Eye className="w-3 h-3" /> Công khai
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 px-2 py-1 bg-slate-500/40 text-slate-300 text-[10px] font-bold rounded-md backdrop-blur-md">
                      <EyeOff className="w-3 h-3" /> Bản nháp
                    </span>
                  )}
                </div>

                {/* Thumbnail */}
                {project.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={project.imageUrl} className="w-full sm:w-48 h-36 object-cover rounded-lg bg-secondary shrink-0" alt={project.title} />
                ) : (
                  <div className="hidden sm:flex w-48 h-36 bg-secondary rounded-lg items-center justify-center text-muted-foreground shrink-0">
                    <Factory className="w-8 h-8" />
                  </div>
                )}
                
                {/* Content */}
                <div className="flex-1 flex flex-col pt-6 sm:pt-0">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-foreground leading-tight">{project.title}</h3>
                    <form action={async () => { "use server"; await deleteProject(project.id); }}>
                      <button type="submit" className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors ml-4"><Trash2 className="w-4 h-4" /></button>
                    </form>
                  </div>
                  
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3 leading-relaxed">{project.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech: any, idx: number) => (
                      <span key={idx} className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 rounded border border-indigo-500/20">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto flex items-center gap-4 pt-4 border-t border-border">
                    {project.githubUrl && (
                      <a href={project.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="16" 
                          height="16" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          className="w-4 h-4"
                        >
                          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A4.8 4.8 0 0 0 8 18v4"></path>
                          <path d="M12 18h.01"></path>
                        </svg> Source
                      </a>
                    )}
                    {project.demoUrl && (
                      <a href={project.demoUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                        <ExternalLink className="w-4 h-4" /> Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}