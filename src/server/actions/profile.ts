"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

// ================= LẤY DỮ LIỆU PROFILE =================
export async function getProfile() {
  try {
    return await prisma.profile.findFirst() || null;
  } catch (error) {
    console.error("Lỗi lấy profile:", error);
    return null;
  }
}

// ================= CẬP NHẬT THÔNG TIN PROFILE =================
export async function updateProfileInfoAction(formData: FormData) {
  try {
    const fullName = formData.get("fullName") as string;
    const jobTitle = formData.get("jobTitle") as string;
    const bio = formData.get("bio") as string;
    const avatarUrl = formData.get("avatarUrl") as string;
    const coverUrl = formData.get("coverUrl") as string;
    const email = formData.get("email") as string;
    const linkedinUrl = formData.get("linkedinUrl") as string;
    const githubUrl = formData.get("githubUrl") as string;

    const existing = await prisma.profile.findFirst();

    if (existing) {
      await prisma.profile.update({
        where: { id: existing.id },
        data: { fullName, jobTitle, bio, avatarUrl, coverUrl, email, linkedinUrl, githubUrl }
      });
    } else {
      await prisma.profile.create({
        data: { fullName, jobTitle, bio, avatarUrl, coverUrl, email, linkedinUrl, githubUrl }
      });
    }

    revalidatePath("/");
    revalidatePath("/admin/profile");
    return { success: true };
  } catch (error) {
    console.error("Lỗi cập nhật profile:", error);
    return { success: false, error: "Đã xảy ra lỗi khi lưu thông tin." };
  }
}

// ================= ĐỔI MẬT KHẨU (Bảo mật Better Auth) =================
export async function changePasswordAction(formData: FormData) {
  // ... (Giữ nguyên code hàm changePasswordAction của bạn ở đây)
  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { success: false, error: "Vui lòng nhập đầy đủ thông tin." };
  }

  if (newPassword !== confirmPassword) {
    return { success: false, error: "Mật khẩu xác nhận không khớp!" };
  }

  if (newPassword.length < 8) {
    return { success: false, error: "Mật khẩu mới phải có ít nhất 8 ký tự." };
  }

  try {
    await auth.api.changePassword({
      headers: await headers(),
      body: {
        newPassword: newPassword,
        currentPassword: currentPassword,
        revokeOtherSessions: true,
      }
    });
    
    return { success: true };
  } catch (error: any) {
    console.error("Lỗi đổi mật khẩu:", error);
    return { success: false, error: "Mật khẩu hiện tại không đúng hoặc có lỗi xảy ra." };
  }
}