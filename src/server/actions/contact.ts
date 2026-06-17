"use server";

import { prisma } from "@/lib/db";

export async function submitContact(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const subject = formData.get("subject") as string;
    const message = formData.get("message") as string;

    if (!name || !email || !subject || !message) {
      return { success: false, error: "Vui lòng điền đầy đủ thông tin." };
    }

    await prisma.contactMessage.create({
      data: {
        name,
        email,
        subject,
        message,
        // isRead và isArchived tự động nhận default(false) từ DB
      }
    });

    return { success: true };
  } catch (error) {
    console.error("Lỗi gửi tin nhắn:", error);
    return { success: false, error: "Lỗi hệ thống, vui lòng thử lại sau." };
  }
}