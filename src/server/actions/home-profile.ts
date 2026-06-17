"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

// Cấu hình mặc định nếu Database chưa có dữ liệu
const DEFAULT_PROFILE = {
  fullName: "Le Dat",
  status: "System Online & Operating",
  primaryRole: "IT/ System Administrator",
  skills: ["Data Science", "Data Analytics", "Systems Administration"],
  location: "Ho Chi Minh City",
  bio: "A passionate IT & Data professional with a strong background in Data Analysis, Systems Administration, and a love for photography and travel. I thrive at the intersection of technology and creativity, always eager to learn and explore new horizons."
};

export async function getHomeProfile() {
  const profile = await prisma.homeProfile.findFirst();
  
  if (profile) return profile;

  // ĐÂY CHÍNH LÀ THỦ PHẠM: Object mặc định khi DB trống
  return {
    fullName: "Your Name",
    status: "System Online & Operating",
    primaryRole: "Developer",
    skills: ["Next.js", "React"],
    location: "Vietnam",
    bio: "Hello world!",
    
    isShowExperience: true,
    isShowEducation: true,
    isShowProjects: true,
    isShowBlog: true,
    isShowMedia: true,
  };
}
export async function updateHomeProfile(formData: FormData) {
  try {
    const fullName = formData.get("fullName") as string;
    const status = formData.get("status") as string;
    const primaryRole = formData.get("primaryRole") as string;
    const location = formData.get("location") as string;
    const bio = formData.get("bio") as string;
    
    // Xử lý chuỗi kỹ năng (cách nhau bằng dấu phẩy) thành mảng
    const skillsString = formData.get("skills") as string;
    const skills = skillsString.split(",").map(s => s.trim()).filter(Boolean);

    // Hứng dữ liệu từ các nút Bật/Tắt (Toggle)
    const isShowExperience = formData.get("isShowExperience") === "on";
    const isShowEducation = formData.get("isShowEducation") === "on";
    const isShowProjects = formData.get("isShowProjects") === "on";
    const isShowBlog = formData.get("isShowBlog") === "on";
    const isShowMedia = formData.get("isShowMedia") === "on";

    await prisma.homeProfile.upsert({
      where: { id: "home_config" },
      update: { fullName, status, primaryRole, location, bio, skills },
      create: { id: "home_config", fullName, status, primaryRole, location, bio, skills }
    });

    await prisma.homeProfile.updateMany({
      data: {
        fullName,
        status,
        location,
        primaryRole,
        bio,
        skills,
        // Cập nhật trạng thái hiển thị
        isShowExperience,
        isShowEducation,
        isShowProjects,
        isShowBlog,
        isShowMedia,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/home");
    return { success: true };
  } catch (error) {
    console.error("Lỗi cập nhật Home Profile:", error);
    return { error: "Không thể lưu thay đổi" };
  }
}