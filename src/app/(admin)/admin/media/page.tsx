import { getAlbums, createAlbum, deleteAlbum, getAdventures, createAdventure, deleteAdventure } from "@/server/actions/media";
import { Camera, Map, Plus, Trash2, Image as ImageIcon, MapPin } from "lucide-react";

export default async function MediaAdminPage() {
  const albums = await getAlbums();
  const adventures = await getAdventures();

  return (
    <div className="max-w-7xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Camera className="w-8 h-8 text-purple-500" /> Quản Lý Media & Hành Trình
        </h1>
        <p className="text-muted-foreground mt-2">Nơi lưu giữ các bộ ảnh nhiếp ảnh tự do và câu chuyện khám phá.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* ================= CỘT PHOTOGRAPHY ================= */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b border-border pb-2">
            <ImageIcon className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl font-bold">Photo Albums</h2>
          </div>

          <form action={async (formData) => { "use server"; await createAlbum(formData); }} className="p-6 bg-card border border-border rounded-xl space-y-4">
            <h3 className="font-bold flex items-center gap-2 text-sm"><Plus className="w-4 h-4" /> Thêm Album Mới</h3>
            <div className="grid grid-cols-2 gap-4">
              <input name="title" required placeholder="Tên Album (VD: Summer Camp Freelance)" className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm" />
              <select name="category" className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm">
                <option value="Portrait">Portrait</option>
                <option value="Street">Street</option>
                <option value="Landscape">Landscape</option>
                <option value="Travel">Travel</option>
              </select>
            </div>
            <input name="coverImage" placeholder="Link ảnh bìa Album" className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm" />
            <textarea name="photoUrls" rows={3} placeholder="Link các ảnh con (Cách nhau bằng dấu phẩy)..." className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm resize-none" />
            <button type="submit" className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors text-sm">Tạo Album</button>
          </form>

          <div className="space-y-4">
            {albums.map((album) => (
              <div key={album.id} className="p-4 bg-card/40 border border-border rounded-xl flex gap-4">
                {album.coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={album.coverImage} className="w-20 h-20 object-cover rounded-lg" alt="" />
                ) : (
                  <div className="w-20 h-20 bg-secondary rounded-lg flex items-center justify-center"><ImageIcon className="w-6 h-6 text-muted-foreground" /></div>
                )}
                <div className="flex-1">
                  <h3 className="font-bold">{album.title}</h3>
                  <span className="text-xs font-medium px-2 py-1 bg-purple-500/10 text-purple-400 rounded-md">{album.category}</span>
                  <p className="text-xs text-muted-foreground mt-2">{album.photos.length} ảnh trong album</p>
                </div>
                <form action={async () => { "use server"; await deleteAlbum(album.id); }}>
                  <button type="submit" className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                </form>
              </div>
            ))}
          </div>
        </div>

        {/* ================= CỘT ADVENTURE ================= */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b border-border pb-2">
            <Map className="w-5 h-5 text-orange-400" />
            <h2 className="text-xl font-bold">Adventure Stories</h2>
          </div>

          <form action={async (formData) => { "use server"; await createAdventure(formData); }} className="p-6 bg-card border border-border rounded-xl space-y-4">
            <h3 className="font-bold flex items-center gap-2 text-sm"><Plus className="w-4 h-4" /> Thêm Chuyến Đi</h3>
            <input name="title" required placeholder="Tên chuyến đi (VD: Phượt xe máy SG - Nghệ An)" className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm" />
            
            <div className="grid grid-cols-2 gap-4">
              <input name="location" required placeholder="Địa điểm" className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm" />
              <input name="date" type="date" required className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm" />
            </div>

            <textarea name="content" required rows={3} placeholder="Nội dung câu chuyện..." className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm resize-none" />
            <textarea name="routeInfo" rows={2} placeholder="Thông tin tuyến đường (Route info)..." className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm resize-none" />
            <textarea name="lessonsLearned" rows={2} placeholder="Kinh nghiệm rút ra..." className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm resize-none" />
            <textarea name="galleryUrls" rows={2} placeholder="Link ảnh gallery (Cách nhau dấu phẩy)..." className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm resize-none" />
            
            <button type="submit" className="w-full py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors text-sm">Lưu Hành Trình</button>
          </form>

          <div className="space-y-4">
            {adventures.map((adv) => (
              <div key={adv.id} className="p-4 bg-card/40 border border-border rounded-xl flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg leading-tight mb-1">{adv.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-orange-400" /> {adv.location}</span>
                    <span>{new Date(adv.date).toLocaleDateString("vi-VN")}</span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-2">{adv.content}</p>
                </div>
                <form action={async () => { "use server"; await deleteAdventure(adv.id); }}>
                  <button type="submit" className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg ml-2"><Trash2 className="w-4 h-4" /></button>
                </form>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}