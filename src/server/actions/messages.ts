"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

// Lấy danh sách tin nhắn
export async function getMessages() {
  try {
    return await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.error("Lỗi khi lấy tin nhắn:", error);
    return [];
  }
}

// Đánh dấu đã đọc
export async function markAsRead(id: string) {
  try {
    await prisma.contactMessage.update({
      where: { id },
      data: { isRead: true }
    });
    revalidatePath("/admin/messages");
  } catch (error) {
    console.error("Lỗi cập nhật:", error);
  }
}

// Xóa tin nhắn
export async function deleteMessage(id: string) {
  try {
    await prisma.contactMessage.delete({
      where: { id }
    });
    revalidatePath("/admin/messages");
  } catch (error) {
    console.error("Lỗi xóa:", error);
  }
}