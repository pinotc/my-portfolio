"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getExperiences() {
  try {
    return await prisma.experience.findMany({
      orderBy: [
        { order: 'asc' },
        { startDate: 'desc' }
      ]
    });
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu kinh nghiệm:", error);
    return [];
  }
}

export async function createExperience(formData: FormData) {
  try {
    const role = formData.get("role") as string;
    const company = formData.get("company") as string;
    const responsibilitiesStr = formData.get("responsibilities") as string;
    const startDateStr = formData.get("startDate") as string;
    const endDateStr = formData.get("endDate") as string;
    const isCurrent = formData.get("isCurrent") === "on"; // Checkbox trả về "on" nếu được tick
    const orderStr = formData.get("order") as string;

    // Tách chuỗi thành mảng dựa trên dấu xuống dòng (Enter)
    const responsibilities = responsibilitiesStr 
      ? responsibilitiesStr.split("\n").map(r => r.trim()).filter(Boolean) 
      : [];

    const startDate = new Date(startDateStr);
    const endDate = (isCurrent || !endDateStr) ? null : new Date(endDateStr);
    const order = orderStr ? parseInt(orderStr, 10) : 0;

    await prisma.experience.create({
      data: {
        role,
        company,
        responsibilities,
        startDate,
        endDate,
        isCurrent,
        order,
      }
    });

    revalidatePath("/admin/experience");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Lỗi khi thêm kinh nghiệm:", error);
    return { success: false, error: "Lỗi khi thêm dữ liệu." };
  }
}

export async function deleteExperience(id: string) {
  try {
    await prisma.experience.delete({ where: { id } });
    revalidatePath("/admin/experience");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}