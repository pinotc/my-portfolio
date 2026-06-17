import { getHomeProfile, updateHomeProfile } from "@/server/actions/home-profile";
import { 
  Save, Home, Activity, Briefcase, Database, MapPin, 
  Eye, LayoutList, GraduationCap, FolderGit2, BookOpen, Image as ImageIcon 
} from "lucide-react";

export default async function AdminHomePage() {
  const profile = await getHomeProfile();
  
  // Chuyển mảng thành chuỗi để hiển thị trong input
  const skillsString = profile.skills?.join(", ") || "";

  return (
    <div className="max-w-6xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Home className="w-8 h-8 text-blue-500" /> Quản Lý Trang Chủ
        </h1>
        <p className="text-muted-foreground mt-2">Tùy chỉnh thông tin và trạng thái hiển thị của các module trên trang.</p>
      </div>

      <form action={async (formData) => { "use server"; await updateHomeProfile(formData); }}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* ================= CỘT TRÁI: THÔNG TIN CÁ NHÂN (Chiếm 2/3) ================= */}
          <div className="lg:col-span-2 p-8 bg-card border border-border rounded-2xl shadow-xl space-y-6 h-fit">
            <h2 className="text-xl font-bold text-foreground mb-6 border-b border-border pb-4">Thông tin hiển thị (Hero Section)</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-muted-foreground mb-1">Họ và Tên</label>
                <input name="fullName" defaultValue={profile.fullName} required className="w-full px-4 py-2 bg-background border border-border rounded-lg" />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1"><Activity className="w-4 h-4 text-blue-400"/> Trạng thái hiện tại</label>
                <select name="status" defaultValue={profile.status} className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm appearance-none">
                  <option value="System Online & Operating">System Online & Operating (Hoạt động)</option>
                  <option value="Available for Hire">Available for Hire (Đang tìm việc)</option>
                  <option value="Working on Projects">Working on Projects (Đang làm dự án)</option>
                  <option value="Busy / Do Not Disturb">Busy / Do Not Disturb (Bận)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1"><MapPin className="w-4 h-4 text-emerald-400"/> Địa điểm</label>
                <input name="location" defaultValue={profile.location} required className="w-full px-4 py-2 bg-background border border-border rounded-lg" />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1"><Briefcase className="w-4 h-4 text-cyan-400"/> Chức vụ / Vai trò chính</label>
                <input name="primaryRole" defaultValue={profile.primaryRole} required className="w-full px-4 py-2 bg-background border border-border rounded-lg" />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1"><Database className="w-4 h-4 text-purple-400"/> Các kỹ năng (Cách nhau phẩy)</label>
                <input name="skills" defaultValue={skillsString} required placeholder="Data Science, Python, SQL..." className="w-full px-4 py-2 bg-background border border-border rounded-lg" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-muted-foreground mb-1">Đoạn giới thiệu bản thân (Bio)</label>
                <textarea name="bio" defaultValue={profile.bio} required rows={4} className="w-full px-4 py-2 bg-background border border-border rounded-lg resize-none" />
              </div>
            </div>
          </div>

          {/* ================= CỘT PHẢI: QUẢN LÝ HIỂN THỊ (Chiếm 1/3) ================= */}
          <div className="lg:col-span-1 space-y-6">
            
            <div className="p-6 bg-card border border-border rounded-2xl shadow-xl">
              <h2 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2 border-b border-border pb-4">
                <Eye className="w-5 h-5 text-emerald-500" /> Tùy chỉnh hiển thị
              </h2>
              
              <div className="space-y-4">
                
                {/* Toggle Experience */}
                <label className="flex items-center justify-between p-3 bg-background border border-border rounded-xl cursor-pointer hover:border-blue-500/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500"><LayoutList className="w-4 h-4" /></div>
                    <span className="text-sm font-medium">Experience</span>
                  </div>
                  <div className="relative inline-flex items-center">
                    {/* Giả sử trong DB có trường isShowExperience */}
                    <input type="checkbox" name="isShowExperience" defaultChecked={profile.isShowExperience} className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </div>
                </label>

                {/* Toggle Education */}
                <label className="flex items-center justify-between p-3 bg-background border border-border rounded-xl cursor-pointer hover:border-amber-500/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500"><GraduationCap className="w-4 h-4" /></div>
                    <span className="text-sm font-medium">Education</span>
                  </div>
                  <div className="relative inline-flex items-center">
                    <input type="checkbox" name="isShowEducation" defaultChecked={profile.isShowEducation} className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </div>
                </label>

                {/* Toggle Projects */}
                <label className="flex items-center justify-between p-3 bg-background border border-border rounded-xl cursor-pointer hover:border-emerald-500/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500"><FolderGit2 className="w-4 h-4" /></div>
                    <span className="text-sm font-medium">Projects</span>
                  </div>
                  <div className="relative inline-flex items-center">
                    <input type="checkbox" name="isShowProjects" defaultChecked={profile.isShowProjects} className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </div>
                </label>

                {/* Toggle Blog */}
                <label className="flex items-center justify-between p-3 bg-background border border-border rounded-xl cursor-pointer hover:border-pink-500/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-pink-500/10 rounded-lg text-pink-500"><BookOpen className="w-4 h-4" /></div>
                    <span className="text-sm font-medium">Blog</span>
                  </div>
                  <div className="relative inline-flex items-center">
                    <input type="checkbox" name="isShowBlog" defaultChecked={profile.isShowBlog} className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </div>
                </label>

                {/* Toggle Media */}
                <label className="flex items-center justify-between p-3 bg-background border border-border rounded-xl cursor-pointer hover:border-purple-500/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500"><ImageIcon className="w-4 h-4" /></div>
                    <span className="text-sm font-medium">Media</span>
                  </div>
                  <div className="relative inline-flex items-center">
                    <input type="checkbox" name="isShowMedia" defaultChecked={profile.isShowMedia} className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </div>
                </label>

              </div>
            </div>

            {/* Nút Submit nằm bên phải để tiện click */}
            <button type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-blue-500/25">
              <Save className="w-5 h-5" /> Lưu Thay Đổi
            </button>
            
          </div>
        </div>
      </form>
    </div>
  );
}