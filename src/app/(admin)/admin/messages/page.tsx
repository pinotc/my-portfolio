import { prisma } from "@/lib/db";
import { MessagesBoard } from "./messages-board";

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const [messages, comments] = await Promise.all([
    prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.comment.findMany({
      where: { parentId: null },
      orderBy: { createdAt: "desc" },
      include: {
        post: { select: { title: true, slug: true } },
        replies: { orderBy: { createdAt: "asc" } },
      },
    }),
  ]);

  return (
    <MessagesBoard
      messages={messages.map((message) => ({
        ...message,
        createdAt: message.createdAt.toISOString(),
      }))}
      comments={comments.map((comment) => ({
        id: comment.id,
        author: comment.author,
        content: comment.content,
        isRead: comment.isRead,
        createdAt: comment.createdAt.toISOString(),
        postId: comment.postId,
        post: comment.post,
        replies: comment.replies.map((reply) => ({
          id: reply.id,
          author: reply.author,
          content: reply.content,
          isAdmin: reply.isAdmin,
          createdAt: reply.createdAt.toISOString(),
        })),
      }))}
    />
  );
}
