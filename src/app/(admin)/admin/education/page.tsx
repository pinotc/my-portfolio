import { getEducations, createEducation, deleteEducation } from "@/server/actions/education";
import { GraduationCap, Plus, Trash2, Calendar, Building, BookOpen, Trophy } from "lucide-react";

// Hàm hỗ trợ format ngày hiển thị cho đẹp
const formatDate = (date: Date | null) => {
  if (!date) return "Hiện tại";
  return new Date(date).toLocaleDateString("vi-VN", { month: '2-digit', year: 'numeric' });
};

export default async function EducationPage() {
  const educations = await getEducations();

  return (
    <div className="max-w-6xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <GraduationCap className="w-8 h-8 text-emerald-500" />
          Học Vấn & Bằng Cấp
        </h1>
        <p className="text-muted-foreground mt-2">Quản lý lộ trình học tập, môn học và các chứng chỉ chuyên môn.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Khung Form Thêm Mới */}
        <div className="xl:col-span-1">
          <form action={async (formData) => {
            "use server";
            await createEducation(formData);
          }} className="p-6 bg-card/40 backdrop-blur-md border border-border rounded-xl shadow-lg space-y-4 sticky top-8">
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <Plus className="w-5 h-5 text-emerald-400" /> Thêm Học Vấn
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Trường / Tổ chức (Institution)</label>
              <input name="institution" required placeholder="VD: HUFLIT" className="w-full px-4 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-emerald-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Bằng cấp (Degree)</label>
              <input name="degree" required placeholder="VD: Cử nhân Khoa học Dữ liệu" className="w-full px-4 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-emerald-500" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Ngày bắt đầu</label>
                <input name="startDate" type="date" required className="w-full px-4 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Ngày kết thúc</label>
                <input name="endDate" type="date" className="w-full px-4 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-emerald-500" />
                <p className="text-xs text-muted-foreground mt-1">Bỏ trống nếu đang học</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Các môn học (Cách nhau dấu phẩy)</label>
              <textarea name="courses" rows={2} placeholder="VD: Machine Learning, Data Mining, Python..." className="w-full px-4 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-emerald-500 resize-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Thành tích (Cách nhau dấu phẩy)</label>
              <textarea name="achievements" rows={2} placeholder="VD: GPA 3.8, Học bổng học kỳ..." className="w-full px-4 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-emerald-500 resize-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Thứ tự hiển thị (Order)</label>
              <input name="order" type="number" defaultValue="0" className="w-full px-4 py-2 text-sm bg-background border border-border rounded-lg focus:ring-2 focus:ring-emerald-500" />
            </div>

            <button type="submit" className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors">
              Lưu Thông Tin
            </button>
          </form>
        </div>

        {/* Danh Sách Học Vấn */}
        <div className="xl:col-span-2 space-y-4">
          {educations.length === 0 ? (
            <div className="p-8 text-center bg-card/20 border border-border border-dashed rounded-xl text-muted-foreground">
              Chưa có dữ liệu học vấn. Hãy thêm trường học đầu tiên của bạn!
            </div>
          ) : (
            educations.map((edu) => (
              <div key={edu.id} className="relative flex flex-col sm:flex-row gap-6 p-6 bg-card/40 backdrop-blur-md border border-border rounded-xl shadow-md transition-all hover:border-emerald-500/30">
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-foreground">{edu.degree}</h3>
                    <form action={async () => {
                      "use server";
                      await deleteEducation(edu.id);
                    }}>
                      <button type="submit" className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors" title="Xóa">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm text-muted-foreground mb-4 border-b border-border pb-4">
                    <span className="flex items-center gap-1.5 font-medium text-foreground">
                      <Building className="w-4 h-4 text-emerald-400" /> {edu.institution}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-emerald-400" /> 
                      {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Render Môn học */}
                    {edu.courses.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-emerald-400 flex items-center gap-2">
                          <BookOpen className="w-4 h-4" /> Khóa học tiêu biểu
                        </h4>
                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                          {edu.courses.map((course, idx) => (
                            <li key={idx}>{course}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Render Thành tích */}
                    {edu.achievements.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-yellow-400 flex items-center gap-2">
                          <Trophy className="w-4 h-4" /> Thành tích
                        </h4>
                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                          {edu.achievements.map((achievement, idx) => (
                            <li key={idx}>{achievement}</li>
                          ))}
                        </ul>
                      </div>
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