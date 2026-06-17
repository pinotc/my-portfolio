import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import {
  LayoutDashboard,
  Briefcase,
  Factory,
  GraduationCap,
  Image as ImageIcon,
  User,
  LogOut,
  Home,
  Mail,
  BookOpen, // Thêm icon cho Blog
  Settings  // Thêm icon cho Settings
} from "lucide-react";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Kiểm tra xác thực (Server-side)
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  // Cấu trúc menu Sidebar theo yêu cầu CMS
  const menuItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "HomePage", href: "/admin/home", icon: Home},
    { name: "Projects", href: "/admin/projects", icon: Factory }, 
    { name: "Education", href: "/admin/education", icon: GraduationCap },
    { name: "Experience", href: "/admin/experience", icon: Briefcase },
    { name: "Messages & Feedback", href: "/admin/messages", icon: Mail },
    { name: "Blog", href: "/admin/blog", icon: BookOpen }, 
    { name: "Media", href: "/admin/media", icon: ImageIcon },
    { name: "Profile", href: "/admin/profile", icon: User },
    { name: "Settings", href: "/admin/settings", icon: Settings } 
  ];

  // Hàm xử lý Logout (Server Action)
  const handleLogout = async () => {
    "use server";
    // Gọi API xóa session của Better-Auth (nếu cần) hoặc các thư viện auth khác.
    // Tạm thời sử dụng redirect để đẩy người dùng về trang login.
    redirect("/login");
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border flex flex-col">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
            Admin CMS
          </h2>
          <p className="text-xs text-muted-foreground mt-1">Industry 4.0 Platform</p>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md transition-colors"
              >
                <Icon className="w-4 h-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 font-bold">
              {session.user.name?.charAt(0) || "A"}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-foreground font-medium">{session.user.name || "Admin"}</p>
            </div>
            
            {/* Form và Server Action để xử lý sự kiện Đăng xuất */}
            <form action={handleLogout}>
              <button type="submit" className="p-1 hover:text-red-400 transition-colors" title="Đăng xuất">
                <LogOut className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-background/50 relative">
        {/* Lưới Grid nền chìm chuẩn phong cách công nghệ */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        
        <div className="relative p-8 z-10">
          {children}
        </div>
      </main>
    </div>
  );
}