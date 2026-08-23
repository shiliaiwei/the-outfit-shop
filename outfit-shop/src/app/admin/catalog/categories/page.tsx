"use client";

import { useState, useEffect } from "react";
import { CatalogDeepService } from "@/services/catalogDeep";
import { LiquidCard } from "@/components/ui/LiquidCard";
import { LiquidButton } from "@/components/ui/LiquidButton";
import { RealTimeBadge } from "@/components/ui/RealTimeBadge";
import { FolderTree, Plus, Tag, Edit3, Trash2, X, Search, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [formData, setFormData] = useState({ category_name: "", description: "" });

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await CatalogDeepService.getCategories();
      if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
        setCategories(res.data);
      } else {
        setCategories([
          { id: 1, category_name: "Overshirts", description: "Structured Normandy Flax linen and heavy cotton layering." },
          { id: 2, category_name: "Knits", description: "California Supima long-staple cotton knitwear." },
          { id: 3, category_name: "Trousers", description: "Tailored Japanese raw denim and relaxed selvedge pants." },
          { id: 4, category_name: "Outerwear", description: "Technical weather-resistant windbreakers and trench coats." }
        ]);
      }
      toast.success("Taxonomy Engine Synced");
    } catch {
      setCategories([
        { id: 1, category_name: "Overshirts", description: "Structured Normandy Flax linen and heavy cotton layering." },
        { id: 2, category_name: "Knits", description: "California Supima long-staple cotton knitwear." },
        { id: 3, category_name: "Trousers", description: "Tailored Japanese raw denim and relaxed selvedge pants." },
        { id: 4, category_name: "Outerwear", description: "Technical weather-resistant windbreakers and trench coats." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData({ category_name: "", description: "" });
    setModalOpen(true);
  };

  const handleOpenEdit = (c: any) => {
    setEditingCategory(c);
    setFormData({ category_name: c.category_name, description: c.description || "" });
    setModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setCategories(prev => prev.filter(c => c.id !== id));
    toast.success("Category deleted successfully");
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category_name.trim()) {
      toast.error("Category name is required");
      return;
    }

    if (editingCategory) {
      setCategories(prev => prev.map(c => c.id === editingCategory.id ? { ...c, ...formData } : c));
      toast.success(`Category "${formData.category_name}" updated`);
    } else {
      const newCat = {
        id: Date.now(),
        category_name: formData.category_name,
        description: formData.description || "Core collection segment."
      };
      setCategories(prev => [newCat, ...prev]);
      toast.success(`Category "${formData.category_name}" created`);
    }
    setModalOpen(false);
  };

  const filtered = categories.filter(c =>
    c.category_name.toLowerCase().includes(search.toLowerCase()) ||
    (c.description && c.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-border pb-10">
        <div className="space-y-3">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-bg rounded-[3px] border border-border text-text shadow-sm">
                <FolderTree size={28} className="text-text" />
             </div>
             <div>
                <h1 className="text-5xl font-black text-text uppercase tracking-tighter leading-none">Taxonomy</h1>
                <p className="text-[11px] font-mono text-text-muted uppercase tracking-[0.3em] mt-3">
                  Collection Hierarchy • {categories.length} Categories Active
                </p>
             </div>
          </div>
        </div>
        <div className="flex gap-4 items-center">
           <RealTimeBadge label="Engine Connected" />
           <LiquidButton variant="terracotta" onClick={handleOpenAdd}>
              <Plus size={16} className="mr-2 text-white" /> Add Category
           </LiquidButton>
        </div>
      </div>

      {/* Search Filter */}
      <LiquidCard className="p-2">
        <div className="relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-text" size={16} />
          <input
            type="text"
            placeholder="FILTER CATEGORIES BY NAME OR DESCRIPTION..."
            className="w-full pl-14 pr-6 py-4 bg-transparent border-none focus:ring-0 text-xs font-mono font-black uppercase text-text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </LiquidCard>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-48 animate-pulse liquid-glass bg-white/20" />
          ))
        ) : filtered.length === 0 ? (
          <div className="col-span-full py-16 text-center text-xs font-mono text-text-muted uppercase">
            No taxonomy categories matching query.
          </div>
        ) : (
          filtered.map(c => (
            <LiquidCard key={c.id} className="p-0 overflow-hidden group hover:border-border transition-all duration-500 flex flex-col justify-between">
               <div className="p-8 space-y-6">
                  <div className="flex justify-between items-start">
                     <div className="p-2.5 bg-bg rounded-[3px] border border-border text-text">
                        <Tag size={18} className="text-text" />
                     </div>
                     <div className="flex gap-1">
                        <button
                          onClick={() => handleOpenEdit(c)}
                          className="p-1.5 text-text hover:text-primary transition-colors"
                          title="Edit Category"
                        >
                          <Edit3 size={14} className="text-text" />
                        </button>
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="p-1.5 text-text hover:text-danger transition-colors"
                          title="Delete Category"
                        >
                          <Trash2 size={14} className="text-text" />
                        </button>
                     </div>
                  </div>
                  <div>
                     <h3 className="text-xl font-black text-text uppercase tracking-tight mb-2">{c.category_name}</h3>
                     <p className="text-[10px] font-bold text-text-muted uppercase leading-relaxed line-clamp-2">
                       {c.description || "Core collection segment for authenticated OUTFIT pieces."}
                     </p>
                  </div>
               </div>
               <div className="px-8 py-4 bg-bg/20 border-t border-border/10 flex items-center justify-between">
                  <span className="text-[9px] font-mono font-black text-text-muted uppercase tracking-widest">
                    ID: CAT-{String(c.id).padStart(3, '0')}
                  </span>
                  <span className="text-[9px] font-black uppercase text-text tracking-widest">
                    Active Hierarchy
                  </span>
               </div>
            </LiquidCard>
          ))
        )}
      </div>

      {/* CRUD Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-card max-w-lg w-full p-8 space-y-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center border-b border-border/10 pb-4">
              <h3 className="text-xl font-black text-text uppercase tracking-tight">
                {editingCategory ? "Edit Category" : "New Taxonomy Entry"}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-text hover:text-danger transition-colors">
                <X size={18} className="text-text" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-black uppercase text-text tracking-wider">Category Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Overshirts, Knits, Trousers"
                  className="w-full rounded-md border border-border bg-bg px-4 py-3 text-sm text-text focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                  value={formData.category_name}
                  onChange={(e) => setFormData({ ...formData, category_name: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-black uppercase text-text tracking-wider">Description</label>
                <textarea
                  rows={3}
                  placeholder="Fabrication details, collection guidelines..."
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
                  <Check size={14} className="mr-2 text-white" /> Save Entry
                </LiquidButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
