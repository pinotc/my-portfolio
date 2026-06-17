import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getProfile } from "@/server/actions/profile";
import { User as UserIcon } from "lucide-react";
import PasswordForm from "./password-form";
import ProfileInfoForm from "./profile-info-form"; // Import component mới

export default async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const profile = await getProfile();

  if (!session?.user) return null;

  return (
    <div className="max-w-6xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <UserIcon className="w-8 h-8 text-blue-500" /> Quản Lý Hồ Sơ
        </h1>
        <p className="text-muted-foreground mt-2">Cập nhật thông tin cá nhân và thiết lập bảo mật hệ thống.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ================= CỘT TRÁI (2/3): THÔNG TIN PROFILE ================= */}
        <div className="lg:col-span-2 p-8 bg-card border border-border rounded-2xl shadow-xl h-max">
          <ProfileInfoForm initialData={profile} />
        </div>

        {/* ================= CỘT PHẢI (1/3): ĐỔI MẬT KHẨU ================= */}
        <div className="lg:col-span-1 p-8 bg-card border border-border rounded-2xl shadow-xl h-max">
          <PasswordForm />
        </div>

      </div>
    </div>
  );
}