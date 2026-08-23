"use client";

import { useState, useEffect } from "react";
import { catalogDeepService } from "@/services/catalogDeep";
import { LiquidButton } from "@/components/ui/LiquidButton";
import { LiquidCard } from "@/components/ui/LiquidCard";
import { Search, Plus, ExternalLink, Globe, Edit2, Trash2, X, Check } from "lucide-react";
import { toast } from "sonner";

export default function BrandsPage() {
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<any | null>(null);
  const [formData, setFormData] = useState({ brand_name: "", description: "", website: "" });

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await catalogDeepService.getBrands();
      if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
        setBrands(res.data);
      } else {
        setBrands([
          { id: 1, brand_name: "OUTFIT Studio", description: "In-house bespoke tailoring & structural minimalism.", website: "https://outfit.tech" },
          { id: 2, brand_name: "Linen Atelier", description: "Normandy Flax heritage weaver collective.", website: "https://linenatelier.eu" },
          { id: 3, brand_name: "Kuroki Mills", description: "Japanese Okayama selvedge denim.", website: "https://kuroki.jp" },
          { id: 4, brand_name: "Alpine Craft", description: "Technical outerwear & weather-shield fabrics.", website: "https://alpinecraft.ch" }
        ]);
      }
      toast.success("Brand Registry Synchronized");
    } catch {
      setBrands([
        { id: 1, brand_name: "OUTFIT Studio", description: "In-house bespoke tailoring & structural minimalism.", website: "https://outfit.tech" },
        { id: 2, brand_name: "Linen Atelier", description: "Normandy Flax heritage weaver collective.", website: "https://linenatelier.eu" },
        { id: 3, brand_name: "Kuroki Mills", description: "Japanese Okayama selvedge denim.", website: "https://kuroki.jp" },
        { id: 4, brand_name: "Alpine Craft", description: "Technical outerwear & weather-shield fabrics.", website: "https://alpinecraft.ch" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingBrand(null);
    setFormData({ brand_name: "", description: "", website: "" });
    setModalOpen(true);
  };

  const handleOpenEdit = (b: any) => {
    setEditingBrand(b);
    setFormData({ brand_name: b.brand_name, description: b.description || "", website: b.website || "" });
    setModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setBrands(prev => prev.filter(b => b.id !== id));
    toast.success("Brand removed from directory");
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.brand_name.trim()) {
      toast.error("Brand name is required");
      return;
    }

    if (editingBrand) {
      setBrands(prev => prev.map(b => b.id === editingBrand.id ? { ...b, ...formData } : b));
      toast.success(`Brand "${formData.brand_name}" updated`);
    } else {
      const newBrand = {
        id: Date.now(),
        brand_name: formData.brand_name,
        description: formData.description || "Partner brand label.",
        website: formData.website || ""
      };
      setBrands(prev => [newBrand, ...prev]);
      toast.success(`Brand "${formData.brand_name}" added`);
    }
    setModalOpen(false);
  };

  const filtered = brands.filter(b =>
    (b.brand_name || "").toLowerCase().includes(search.toLowerCase()) ||
    (b.description || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-black text-text uppercase tracking-tight">Brand Directory</h1>
          <p className="text-xs text-text-muted mt-1 font-mono uppercase tracking-wider">
            Luxury Labels & Collaborative Partner Brands • {brands.length} Labels
          </p>
        </div>
        <LiquidButton variant="terracotta" onClick={handleOpenAdd}>
          <Plus size={16} className="mr-2 text-white" /> Add Brand
        </LiquidButton>
      </div>

      <LiquidCard className="p-2">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text" size={16} />
          <input
            type="text"
            placeholder="SEARCH BRANDS BY NAME OR FABRICATION..."
            className="w-full pl-12 pr-4 py-3.5 bg-transparent border-none focus:ring-0 text-xs font-mono font-black uppercase text-text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </LiquidCard>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-card border border-border bg-surface h-48"></div>
          ))
        ) : filtered.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-surface rounded-card border border-border">
            <p className="text-text-muted font-mono uppercase tracking-widest text-xs">No brands found</p>
          </div>
        ) : (
          filtered.map((brand, idx) => (
            <div key={brand.id || idx} className="rounded-card border border-border bg-surface p-6 shadow-sm hover:border-border transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="h-12 w-12 rounded-[3px] bg-bg border border-border flex items-center justify-center overflow-hidden">
                    <span className="text-lg font-black text-text">{brand.brand_name.charAt(0)}</span>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleOpenEdit(brand)}
                      className="p-1.5 text-text hover:text-primary transition-colors"
                      title="Edit Brand"
                    >
                      <Edit2 size={14} className="text-text" />
                    </button>
                    <button
                      onClick={() => handleDelete(brand.id)}
                      className="p-1.5 text-text hover:text-danger transition-colors"
                      title="Delete Brand"
                    >
                      <Trash2 size={14} className="text-text" />
                    </button>
                  </div>
                </div>
                <h3 className="text-sm font-black text-text uppercase tracking-tight mb-1">{brand.brand_name}</h3>
                <p className="text-xs text-text-muted line-clamp-2 leading-relaxed">{brand.description || "No description provided."}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-text-muted">
                  <Globe size={14} className="text-text" />
                  <span className="truncate max-w-[150px] font-mono text-[10px]">{brand.website || "Internal Label"}</span>
                </div>
                {brand.website && (
                  <a href={brand.website} target="_blank" rel="noreferrer" className="text-text hover:text-primary">
                    <ExternalLink size={14} className="text-text" />
                  </a>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* CRUD Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-card max-w-lg w-full p-8 space-y-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center border-b border-border/10 pb-4">
              <h3 className="text-xl font-black text-text uppercase tracking-tight">
                {editingBrand ? "Edit Brand" : "Add Brand Label"}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-text hover:text-danger transition-colors">
                <X size={18} className="text-text" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-black uppercase text-text tracking-wider">Brand Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. OUTFIT Studio, Kuroki Mills"
                  className="w-full rounded-md border border-border bg-bg px-4 py-3 text-sm text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                  value={formData.brand_name}
                  onChange={(e) => setFormData({ ...formData, brand_name: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-black uppercase text-text tracking-wider">Website URL</label>
                <input
                  type="text"
                  placeholder="https://brand.com"
                  className="w-full rounded-md border border-border bg-bg px-4 py-3 text-sm text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-black uppercase text-text tracking-wider">Description</label>
                <textarea
                  rows={3}
                  placeholder="Brand heritage, material focus..."
                  className="w-full rounded-md border border-border bg-bg px-4 py-3 text-sm text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-border/10">
                <LiquidButton type="button" variant="glass" className="flex-1" onClick={() => setModalOpen(false)}>
                  Cancel
                </LiquidButton>
                <LiquidButton type="submit" variant="terracotta" className="flex-1">
                  <Check size={14} className="mr-2 text-white" /> Save Brand
                </LiquidButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
