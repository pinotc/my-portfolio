import { getExperiences, createExperience, deleteExperience } from "@/server/actions/experience";
import { Briefcase, Plus, Trash2, Calendar, Building, CheckCircle2 } from "lucide-react";

const formatDate = (date: Date | null, isCurrent: boolean) => {
  if (isCurrent || !date) return "Hiện tại";
  return new Date(date).toLocaleDateString("vi-VN", { month: '2-digit', year: 'numeric' });
};

export default async function ExperienceAdminPage() {
  const experiences = await getExperiences();

  return (
    <div className="max-w-6xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Briefcase className="w-8 h-8 text-blue-500" />
          Kinh Nghiệm Làm Việc
        </h1>
        <p className="text-muted-foreground mt-2">Quản lý lịch sử công tác và các trách nhiệm chính.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Form Thêm Mới */}
        <div className="xl:col-span-1">
          <form action={async (formData) => {
            "use server";
            await createExperience(formData);
          }} className="p-6 bg-card/40 backdrop-blur-md border border-border rounded-xl shadow-lg space-y-4 sticky top-8">
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
              <Plus className="w-5 h-5 text-blue-400" /> Thêm Kinh Nghiệm
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Chức danh (Role)</label>
              <input name="role" required placeholder="VD: Data Engineer" className="w-full px-4 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Công ty (Company)</label>
              <input name="company" required placeholder="VD: HDBank" className="w-full px-4 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Bắt đầu</label>
                <input name="startDate" type="date" required className="w-full px-4 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Kết thúc</label>
                <input name="endDate" type="date" className="w-full px-4 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm font-medium text-foreground cursor-pointer">
              <input name="isCurrent" type="checkbox" className="w-4 h-4 rounded border-border text-blue-600 focus:ring-blue-500" />
              Công việc hiện tại (Bỏ qua ngày kết thúc)
            </label>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Trách nhiệm (Mỗi dòng 1 ý)</label>
              <textarea name="responsibilities" rows={4} placeholder="Xây dựng Data Pipeline...&#10;Tối ưu hóa query SQL..." className="w-full px-4 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-blue-500 resize-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Thứ tự ưu tiên (Order)</label>
              <input name="order" type="number" defaultValue="0" className="w-full px-4 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>

            <button type="submit" className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
              Lưu Kinh Nghiệm
            </button>
          </form>
        </div>

        {/* Danh Sách */}
        <div className="xl:col-span-2 space-y-4">
          {experiences.length === 0 ? (
            <div className="p-8 text-center bg-card/20 border border-border border-dashed rounded-xl text-muted-foreground">
              Chưa có dữ liệu.
            </div>
          ) : (
            experiences.map((exp) => (
              <div key={exp.id} className="p-6 bg-card/40 backdrop-blur-md border border-border rounded-xl shadow-md transition-all hover:border-blue-500/30">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{exp.role}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <span className="flex items-center gap-1"><Building className="w-4 h-4 text-blue-400" /> {exp.company}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-4 h-4 text-blue-400" /> {formatDate(exp.startDate, false)} - {formatDate(exp.endDate, exp.isCurrent)}</span>
                    </div>
                  </div>
                  <form action={async () => { "use server"; await deleteExperience(exp.id); }}>
                    <button type="submit" className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </form>
                </div>
                
                {exp.responsibilities.length > 0 && (
                  <ul className="space-y-2 mt-4 pt-4 border-t border-border">
                    {exp.responsibilities.map((resp, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{resp}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}