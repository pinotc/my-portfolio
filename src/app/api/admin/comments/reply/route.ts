import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { commentId?: unknown; content?: unknown; postId?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const commentId = typeof body.commentId === "string" ? body.commentId.trim() : "";
  const postId = typeof body.postId === "string" ? body.postId.trim() : "";
  const content = typeof body.content === "string" ? body.content.trim() : "";

  if (!commentId || !postId || !content) {
    return Response.json({ error: "commentId, content, and postId are required" }, { status: 400 });
  }
  if (content.length > 2000) {
    return Response.json({ error: "Reply is too long" }, { status: 400 });
  }

  const parent = await prisma.comment.findUnique({
    where: { id: commentId },
    include: { post: { select: { slug: true } } },
  });
  if (!parent || parent.postId !== postId) {
    return Response.json({ error: "Comment not found" }, { status: 404 });
  }

  const reply = await prisma.$transaction(async (tx) => {
    const created = await tx.comment.create({
      data: {
        content,
        isAdmin: true,
        isRead: true,
        author: "Lê Văn Đạt (Admin)",
        parentId: commentId,
        postId,
      },
    });
    await tx.comment.update({
      where: { id: commentId },
      data: { isRead: true },
    });
    return created;
  });

  revalidatePath("/admin/messages");
  revalidatePath(`/blog/${parent.post.slug}`);

  return Response.json({
    reply: {
      id: reply.id,
      content: reply.content,
      author: reply.author,
      isAdmin: reply.isAdmin,
      createdAt: reply.createdAt.toISOString(),
    },
  });
}
