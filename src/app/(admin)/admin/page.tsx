import { getDashboardStats, getSEOSettings, saveSEOSetting } from "@/server/actions/dashboard";
import { Activity, Search, Globe, Save, BarChart3, Users, Eye, Zap } from "lucide-react";


export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();
  const seoSettings = await getSEOSettings();

  return (
    <div className="max-w-7xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Activity className="w-8 h-8 text-blue-500" /> Trung Tâm Điều Khiển Web
        </h1>
        <p className="text-muted-foreground mt-2">Dữ liệu đồng bộ trực tiếp từ hệ thống Google Analytics (GA4).</p>
      </div>

      {/* Khối thống kê 3 thẻ chỉ số chính từ GA4 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Thẻ 1: Đang trực tuyến */}
        <div className="p-6 bg-card border border-border rounded-xl shadow-sm flex items-center gap-4 relative overflow-hidden group">
          <div className="w-12 h-12 rounded-full bg-orange-500/10 text-orange-500 flex items-center justify-center relative">
            <Zap className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Đang trực tuyến (Realtime)</p>
            <h3 className="text-3xl font-bold text-foreground">{stats.realtimeUsers} <span className="text-xs text-orange-500 font-medium">active</span></h3>
          </div>
          <div className="absolute top-3 right-3 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </div>
        </div>

        {/* Thẻ 2: Người dùng hoạt động */}
        <div className="p-6 bg-card border border-border rounded-xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Người dùng (30 ngày qua)</p>
            <h3 className="text-3xl font-bold text-foreground">{stats.totalActiveUsers.toLocaleString()}</h3>
          </div>
        </div>

        {/* Thẻ 3: Tổng lượt xem trang */}
        <div className="p-6 bg-card border border-border rounded-xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <Eye className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Lượt xem trang (30 ngày qua)</p>
            <h3 className="text-3xl font-bold text-foreground">{stats.totalPageViews.toLocaleString()}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-4">
        
        {/* ================= CỘT TRÁI: TOP PAGES FROM GA4 ================= */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-500" /> Đường Dẫn Phổ Biến Nhất
          </h2>
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            {!stats.success || stats.topPages.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground text-sm">Chưa có dữ liệu lịch sử. Google Analytics đang tổng hợp đường dẫn (có thể mất 24-48h đối với tài khoản mới).</div>
            ) : (
              <ul className="divide-y divide-border">
                {stats.topPages.map((page, idx) => (
                  <li key={idx} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                    <span className="font-medium text-sm text-foreground flex items-center gap-2">
                      <span className="text-muted-foreground">{idx + 1}.</span> {page.path}
                    </span>
                    <span className="text-xs font-bold bg-secondary px-3 py-1 rounded-md text-emerald-400">
                      {page.views.toLocaleString()} views
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* ================= CỘT PHẢI: SEO SETTINGS ================= */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Search className="w-5 h-5 text-amber-500" /> Tối Ưu Hóa (SEO)
          </h2>
          
          <form action={async (formData) => {
            "use server";
            await saveSEOSetting(formData);
          }} className="p-6 bg-card border border-border rounded-xl space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Trang (Page Path)</label>
              <select name="page" className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm">
                <option value="/">Trang Chủ (/)</option>
                <option value="/blog">Blog (/blog)</option>
                <option value="/portfolio">Portfolio (/portfolio)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Tiêu đề (Title)</label>
              <input name="title" required placeholder="Cấu hình thẻ tiêu đề..." className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm" />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Mô tả (Description)</label>
              <textarea name="description" required rows={3} placeholder="Mô tả ngắn xuất hiện trên kết quả tìm kiếm..." className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm resize-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Từ khóa (Keywords)</label>
              <input name="keywords" required placeholder="Từ khóa ngăn cách bằng dấu phẩy..." className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm" />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Ảnh chia sẻ (OG Image)</label>
              <input name="ogImage" placeholder="Link ảnh thumbnail khi share link" className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm" />
            </div>

            <button type="submit" className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md">
              <Save className="w-4 h-4" /> Lưu Cấu Hình SEO
            </button>
          </form>

          <div className="flex flex-wrap gap-2 pt-2">
            {seoSettings.map(seo => (
              <span key={seo.id} className="px-3 py-1 bg-secondary text-xs font-medium rounded border border-border">
                Đã lưu SEO: <span className="text-amber-500">{seo.page}</span>
              </span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}