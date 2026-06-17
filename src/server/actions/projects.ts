"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getProjects() {
  return await prisma.project.findMany({
    include: { images: true }, // Lấy kèm theo cả hình ảnh phụ nếu có
    orderBy: { createdAt: "desc" },
  });
}

export async function createProject(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const content = formData.get("content") as string;
    const imageUrl = formData.get("imageUrl") as string;
    const technologiesStr = formData.get("technologies") as string;
    const githubUrl = formData.get("githubUrl") as string;
    const demoUrl = formData.get("demoUrl") as string;
    const isPublished = formData.get("isPublished") === "true"; // Đọc trạng thái checkbox

    // Tách chuỗi công nghệ thành mảng
    const technologies = technologiesStr 
      ? technologiesStr.split(",").map(t => t.trim()).filter(Boolean) 
      : [];

    await prisma.project.create({
      data: {
        title,
        description,
        content, // Đã thêm trường bắt buộc
        imageUrl: imageUrl || null,
        technologies,
        githubUrl: githubUrl || null,
        demoUrl: demoUrl || null,
        isPublished, // Đã thêm trường trạng thái
      }
    });

    revalidatePath("/admin/projects");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Lỗi tạo dự án:", error);
    return { success: false };
  }
}

export async function deleteProject(id: string) {
  await prisma.project.delete({ where: { id } });
  revalidatePath("/admin/projects");
  revalidatePath("/");
}