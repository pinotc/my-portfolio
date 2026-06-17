import { getGlobalSettings, updateGlobalSettings } from "@/server/actions/settings";
import { Settings, Image as ImageIcon, Layout, Save, Globe } from "lucide-react";

export default async function SettingsPage() {
  const config = await getGlobalSettings();

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Settings className="w-8 h-8 text-slate-400" /> Cấu Hình Hệ Thống
        </h1>
        <p className="text-muted-foreground mt-2">Thay đổi tên hiển thị, logo và biểu tượng trình duyệt.</p>
      </div>

      <form action={async (formData) => { "use server"; await updateGlobalSettings(formData); }} 
            className="p-8 bg-card border border-border rounded-2xl shadow-xl space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Cấu hình Tên & Logo */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2"><Layout className="w-5 h-5 text-blue-500" /> Giao diện chính</h2>
            
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Tên Website (Site Name)</label>
              <input name="siteName" defaultValue={config.siteName} required className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm" />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Link Logo (Dùng cho Header)</label>
              <input name="logoUrl" defaultValue={config.logoUrl || ""} placeholder="https://..." className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm" />
            </div>
          </div>

          {/* Cấu hình Icon Browser */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2"><Globe className="w-5 h-5 text-emerald-500" /> Trình duyệt</h2>
            
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Link Favicon (Browser Icon)</label>
              <input name="faviconUrl" defaultValue={config.faviconUrl || ""} placeholder="https://..." className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm" />
              <p className="text-[10px] text-muted-foreground mt-1 italic">Nên sử dụng ảnh .ico hoặc .png kích thước 32x32.</p>
            </div>

            {config.faviconUrl && (
              <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
                <img src={config.faviconUrl} alt="Favicon Preview" className="w-8 h-8 object-contain" />
                <span className="text-xs text-muted-foreground text-italic">Preview biểu tượng</span>
              </div>
            )}
          </div>
        </div>

        <button type="submit" className="w-full md:w-max px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20">
          <Save className="w-5 h-5" /> Cập Nhật Cấu Hình
        </button>
      </form>
    </div>
  );
}