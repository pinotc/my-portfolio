"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

// ==================== PHOTOGRAPHY ====================
export async function getAlbums() {
  return await prisma.photoAlbum.findMany({
    include: { photos: true },
    orderBy: { createdAt: "desc" }
  });
}

export async function createAlbum(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const category = formData.get("category") as string;
    const coverImage = formData.get("coverImage") as string;
    const photoUrlsStr = formData.get("photoUrls") as string;

    // Tách chuỗi URL bằng dấu phẩy để tạo mảng ảnh
    const photoUrls = photoUrlsStr ? photoUrlsStr.split(",").map(url => url.trim()).filter(Boolean) : [];

    await prisma.photoAlbum.create({
      data: {
        title,
        category,
        coverImage,
        photos: {
          create: photoUrls.map(url => ({ url }))
        }
      }
    });

    revalidatePath("/admin/media");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Lỗi tạo Album:", error);
    return { success: false };
  }
}

export async function deleteAlbum(id: string) {
  await prisma.photoAlbum.delete({ where: { id } });
  revalidatePath("/admin/media");
  revalidatePath("/");
}

// ==================== ADVENTURE ====================
export async function getAdventures() {
  return await prisma.adventureStory.findMany({
    include: { galleries: true },
    orderBy: { date: "desc" }
  });
}

export async function createAdventure(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const location = formData.get("location") as string;
    const routeInfo = formData.get("routeInfo") as string;
    const lessonsLearned = formData.get("lessonsLearned") as string;
    const dateStr = formData.get("date") as string;
    const galleryUrlsStr = formData.get("galleryUrls") as string;

    const date = dateStr ? new Date(dateStr) : new Date();
    const galleryUrls = galleryUrlsStr ? galleryUrlsStr.split(",").map(url => url.trim()).filter(Boolean) : [];

    await prisma.adventureStory.create({
      data: {
        title,
        content,
        location,
        routeInfo,
        lessonsLearned,
        date,
        galleries: {
          create: galleryUrls.map(url => ({ url }))
        }
      }
    });

    revalidatePath("/admin/media");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Lỗi tạo Hành trình:", error);
    return { success: false };
  }
}

export async function deleteAdventure(id: string) {
  await prisma.adventureStory.delete({ where: { id } });
  revalidatePath("/admin/media");
  revalidatePath("/");
}