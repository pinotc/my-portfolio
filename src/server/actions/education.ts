"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getEducations() {
  try {
    return await prisma.education.findMany({
      // Ưu tiên hiển thị theo order, sau đó đến ngày bắt đầu
      orderBy: [
        { order: 'asc' },
        { startDate: 'desc' }
      ]
    });
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu học vấn:", error);
    return [];
  }
}

export async function createEducation(formData: FormData) {
  try {
    const institution = formData.get("institution") as string;
    const degree = formData.get("degree") as string;
    const coursesStr = formData.get("courses") as string;
    const achievementsStr = formData.get("achievements") as string;
    const startDateStr = formData.get("startDate") as string;
    const endDateStr = formData.get("endDate") as string;
    const orderStr = formData.get("order") as string;

    // Chuyển đổi chuỗi cách nhau bằng dấu phẩy thành Mảng (Array)
    const courses = coursesStr ? coursesStr.split(",").map(c => c.trim()).filter(Boolean) : [];
    const achievements = achievementsStr ? achievementsStr.split(",").map(a => a.trim()).filter(Boolean) : [];

    // Xử lý DateTime
    const startDate = new Date(startDateStr);
    const endDate = endDateStr ? new Date(endDateStr) : null;
    const order = orderStr ? parseInt(orderStr, 10) : 0;

    await prisma.education.create({
      data: {
        institution,
        degree,
        courses,
        achievements,
        startDate,
        endDate,
        order,
      }
    });

    revalidatePath("/admin/education");
    revalidatePath("/"); 
    return { success: true };
  } catch (error) {
    console.error("Lỗi khi thêm học vấn:", error);
    return { success: false, error: "Không thể thêm dữ liệu." };
  }
}

export async function deleteEducation(id: string) {
  try {
    await prisma.education.delete({
      where: { id }
    });
    revalidatePath("/admin/education");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Lỗi khi xóa:", error);
    return { success: false };
  }
}