"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

const slugify = (text: string) => {
  return text.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-").replace(/[^\w-]+/g, "").replace(/--+/g, "-").replace(/^-+/, "").replace(/-+$/, "");
};

// Lấy danh sách kèm Category và Tags
export async function getPosts() {
  return await prisma.blogPost.findMany({
    include: { category: true, tags: true },
    orderBy: { createdAt: "desc" }
  });
}

export async function createPost(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const coverImage = formData.get("coverImage") as string;
    const categoryName = formData.get("category") as string;
    const tagsString = formData.get("tags") as string;
    const isPublished = formData.get("isPublished") === "on";

    const slug = `${slugify(title)}-${Date.now().toString().slice(-4)}`;

    // 1. Tìm hoặc tạo Category
    let category = await prisma.blogCategory.findUnique({ where: { name: categoryName } });
    if (!category) {
      category = await prisma.blogCategory.create({ data: { name: categoryName } });
    }

    // 2. Chuẩn bị mảng Tags (connectOrCreate)
    const tagNames = tagsString ? tagsString.split(",").map(t => t.trim()).filter(Boolean) : [];
    const tagsConnectOrCreate = tagNames.map(name => ({
      where: { name },
      create: { name }
    }));

    // 3. Tạo bài viết
    await prisma.blogPost.create({
      data: {
        title,
        slug,
        content,
        coverImage,
        isPublished,
        categoryId: category.id,
        tags: { connectOrCreate: tagsConnectOrCreate }
      }
    });

    revalidatePath("/admin/blog");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Lỗi tạo bài viết:", error);
    return { success: false };
  }
}

export async function deletePost(id: string) {
  try {
    await prisma.blogPost.delete({ where: { id } });
    revalidatePath("/admin/blog");
    revalidatePath("/");
  } catch (error) {
    console.error("Lỗi xóa bài viết:", error);
  }
}