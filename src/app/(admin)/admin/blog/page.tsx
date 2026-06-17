import { getPosts, createPost, deletePost } from "@/server/actions/blog";
import { BookOpen, Plus, Trash2, Folder, Tag } from "lucide-react";

export default async function BlogAdminPage() {
  const posts = await getPosts();

  return (
    <div className="max-w-6xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-amber-500" /> Quản Lý Bài Viết
        </h1>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Form Viết Bài */}
        <div className="xl:col-span-1">
          <form action={async (formData) => {
            "use server";
            await createPost(formData);
          }} className="p-6 bg-card border border-border rounded-xl space-y-4 sticky top-8">
            <h3 className="font-bold flex items-center gap-2"><Plus className="w-4 h-4" /> Bài Viết Mới</h3>
            
            <input name="title" required placeholder="Tiêu đề bài viết" className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm" />
            <input name="category" required placeholder="Danh mục (VD: Data Engineering)" className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm" />
            <input name="coverImage" placeholder="Link ảnh bìa" className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm" />
            
            <textarea name="content" required rows={6} placeholder="Nội dung bài viết (Hỗ trợ định dạng Tiptap HTML sau này)..." className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm resize-none" />
            
            <input name="tags" placeholder="Tags (cách nhau dấu phẩy. VD: MES, SQL)" className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm" />
            
            <label className="flex items-center gap-2 text-sm font-medium cursor-pointer py-2">
              <input name="isPublished" type="checkbox" className="w-4 h-4 rounded border-border text-amber-600 focus:ring-amber-500" defaultChecked />
              Xuất bản ngay
            </label>

            <button type="submit" className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg transition-colors">Tạo Bài Viết</button>
          </form>
        </div>

        {/* Danh Sách Bài Viết */}
        <div className="xl:col-span-2 space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="p-4 bg-card border border-border rounded-xl flex flex-col sm:flex-row gap-4 sm:items-center">
              {post.coverImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={post.coverImage} className="w-full sm:w-28 h-20 object-cover rounded-lg bg-secondary" alt="" />
              ) : (
                <div className="hidden sm:flex w-28 h-20 bg-secondary rounded-lg items-center justify-center text-muted-foreground"><BookOpen className="w-6 h-6" /></div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`w-2 h-2 rounded-full ${post.isPublished ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                  <h3 className="font-bold text-lg leading-tight">{post.title}</h3>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground mt-2">
                  <span className="flex items-center gap-1 font-medium text-amber-500"><Folder className="w-3 h-3" /> {post.category.name}</span>
                  {post.tags.map(tag => (
                    <span key={tag.id} className="flex items-center gap-1"><Tag className="w-3 h-3" /> {tag.name}</span>
                  ))}
                </div>
              </div>
              <form action={async () => { "use server"; await deletePost(post.id); }}>
                <button type="submit" className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg"><Trash2 className="w-4 h-4" /></button>
              </form>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}