"use client";

import { useState, useEffect } from "react";
import { opsService } from "@/services/opsService";
import { Image as ImageIcon, Upload, Trash2, ExternalLink, Search, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function ImageGalleryPage() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  async function load() {
    try {
      const res = await opsService.getGallery();
      setImages(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);
    formData.append("folder", "khmeriel/admin");

    try {
      await opsService.uploadImage(formData);
      toast.success("Asset uploaded successfully");
      load();
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (publicId: string) => {
    if (!confirm("Permanently delete this asset?")) return;
    try {
      await opsService.deleteImage(publicId);
      toast.success("Asset removed");
      load();
    } catch (err: any) {
      toast.error(err.message || "Delete failed");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text uppercase tracking-tight">Media Assets</h1>
          <p className="text-text-muted text-sm mt-1">Manage Cloudinary product photography and brand visuals</p>
        </div>
        <label className="flex items-center gap-2 rounded-btn bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 transition-all cursor-pointer">
          {uploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
          {uploading ? "Uploading..." : "Upload Asset"}
          <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} />
        </label>
      </div>

      <div className="rounded-card border border-border bg-surface p-4 flex items-center justify-between shadow-sm">
         <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search gallery..."
              className="h-10 w-full rounded-md border border-border bg-bg pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
         </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {loading ? (
          Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-square animate-pulse rounded-card border border-border bg-bg"></div>
          ))
        ) : images.length === 0 ? (
          <div className="col-span-full py-32 text-center bg-surface rounded-card border border-border">
            <ImageIcon size={48} className="mx-auto text-text-muted opacity-20 mb-4" />
            <p className="text-text-muted font-mono uppercase tracking-widest">No assets found</p>
          </div>
        ) : (
          images.map((img) => (
            <div key={img.public_id} className="group relative aspect-square rounded-card border border-border bg-bg overflow-hidden hover:border-primary transition-all">
               <img src={img.url} alt={img.public_id} className="h-full w-full object-cover" />
               <div className="absolute inset-0 bg-[#1E2631]/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                  <div className="flex gap-2">
                    <a href={img.url} target="_blank" rel="noreferrer" className="p-2 bg-white rounded-[2px] text-text hover:text-primary">
                       <ExternalLink size={16} />
                    </a>
                    <button onClick={() => handleDelete(img.public_id)} className="p-2 bg-white rounded-[2px] text-text hover:text-danger">
                       <Trash2 size={16} />
                    </button>
                  </div>
                  <span className="text-[8px] font-mono text-white/80 uppercase tracking-tighter max-w-[80%] truncate">
                    {img.width}x{img.height} • {img.format}
                  </span>
               </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
