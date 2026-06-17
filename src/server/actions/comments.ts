"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createComment(formData: FormData) {
  const content = formData.get("content") as string;
  const postId = formData.get("postId") as string;
  const isAnonymous = formData.get("isAnonymous") === "on";
  let author = formData.get("nickname") as string;

  // Xử lý logic ẩn danh
  if (isAnonymous || !author) {
    author = "Anonymous_User";
  }

  if (!content || !postId) return { error: "Nội dung không được để trống" };

  try {
    await prisma.comment.create({
      data: {
        content,
        author,
        postId,
      },
    });

    // Làm mới trang blog để hiện comment mới ngay lập tức
    revalidatePath(`/blog/[slug]`);
    return { success: true };
  } catch (error) {
    return { error: "Lỗi không thể gửi bình luận" };
  }
}