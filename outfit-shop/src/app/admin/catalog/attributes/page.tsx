"use client";

import { useState, useEffect } from "react";
import { CatalogDeepService } from "@/services/catalogDeep";
import { LiquidCard } from "@/components/ui/LiquidCard";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { Palette, Ruler, Trash2, Edit3, RefreshCw, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

function normalizeHex(hex?: string): string {
  if (!hex || typeof hex !== "string") return "#1E2631";
  const clean = hex.trim();
  if (clean.startsWith("#")) return clean;
  if (/^[0-9A-Fa-f]{3,6}$/.test(clean)) return `#${clean}`;
  return "#1E2631";
}

function isLightColor(hex: string): boolean {
  const c = normalizeHex(hex).replace("#", "");
  const full = c.length === 3 ? c.split("").map((x) => x + x).join("") : c;
  const r = parseInt(full.substring(0, 2), 16) || 0;
  const g = parseInt(full.substring(2, 4), 16) || 0;
  const b = parseInt(full.substring(4, 6), 16) || 0;
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 190;
}

export default function AttributesPage() {
  const [colors, setColors] = useState<any[]>([]);
  const [sizes, setSizes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Color Modal
  const [isColorModalOpen, setIsColorModalOpen] = useState(false);
  const [editingColor, setEditingColor] = useState<any | null>(null);
  const [colorForm, setColorForm] = useState({ color_name: "", hex_code: "#1E2631" });

  // Size Modal
  const [isSizeModalOpen, setIsSizeModalOpen] = useState(false);
  const [editingSize, setEditingSize] = useState<any | null>(null);
  const [sizeForm, setSizeForm] = useState({ size_name: "", size_order: 1, size_code: "EU 48" });

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState<{ type: "color" | "size"; id: number; name: string } | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [cRes, sRes] = await Promise.all([
        CatalogDeepService.getColors(),
        CatalogDeepService.getSizes()
      ]);
      setColors(cRes?.data || []);
      setSizes(sRes?.data || []);
    } catch {
      // Handled in service
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // --- COLOR HANDLERS ---
  const handleOpenAddColor = () => {
    setEditingColor(null);
    setColorForm({ color_name: "", hex_code: "#1E2631" });
    setIsColorModalOpen(true);
  };

  const handleOpenEditColor = (c: any) => {
    setEditingColor(c);
    setColorForm({ color_name: c.color_name, hex_code: c.hex_code || "#1E2631" });
    setIsColorModalOpen(true);
  };

  const handleSaveColor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!colorForm.color_name.trim()) {
      toast.error("Color name is required");
      return;
    }

    const payload = {
      color_name: colorForm.color_name.trim(),
      hex_code: colorForm.hex_code.trim()
    };

    if (editingColor) {
      await CatalogDeepService.updateColor(editingColor.id, payload);
      setColors((prev) => prev.map((c) => (c.id === editingColor.id ? { ...c, ...payload } : c)));
      toast.success(`Color "${payload.color_name}" updated`);
    } else {
      const res = await CatalogDeepService.createColor(payload);
      const created = (res as any)?.data || { id: Date.now(), ...payload };
      setColors((prev) => [created, ...prev.filter((c) => c.id !== created.id)]);
      toast.success(`Color "${payload.color_name}" added to Chromatic Registry`);
    }
    setIsColorModalOpen(false);
  };

  // --- SIZE HANDLERS ---
  const handleOpenAddSize = () => {
    setEditingSize(null);
    setSizeForm({ size_name: "", size_order: sizes.length + 1, size_code: "EU 48" });
    setIsSizeModalOpen(true);
  };

  const handleOpenEditSize = (s: any) => {
    setEditingSize(s);
    setSizeForm({ size_name: s.size_name, size_order: s.size_order || 1, size_code: s.size_code || "EU 48" });
    setIsSizeModalOpen(true);
  };

  const handleSaveSize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sizeForm.size_name.trim()) {
      toast.error("Size name is required");
      return;
    }

    const payload = {
      size_name: sizeForm.size_name.trim().toUpperCase(),
      size_order: Number(sizeForm.size_order) || 1,
      size_code: sizeForm.size_code.trim()
    };

    if (editingSize) {
      await CatalogDeepService.updateSize(editingSize.id, payload as any);
      setSizes((prev) => prev.map((s) => (s.id === editingSize.id ? { ...s, ...payload } : s)));
      toast.success(`Size "${payload.size_name}" updated`);
    } else {
      const res = await CatalogDeepService.createSize(payload as any);
      const created = (res as any)?.data || { id: Date.now(), ...payload };
      setSizes((prev) => [...prev.filter((s) => s.id !== created.id), created]);
      toast.success(`Size "${payload.size_name}" added to Dimensional Registry`);
    }
    setIsSizeModalOpen(false);
  };

  // --- DELETE CONFIRM ---
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === "color") {
      await CatalogDeepService.deleteColor(deleteTarget.id);
      setColors((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      toast.success(`Color "${deleteTarget.name}" removed`);
    } else {
      await CatalogDeepService.deleteSize(deleteTarget.id);
      setSizes((prev) => prev.filter((s) => s.id !== deleteTarget.id));
      toast.success(`Size "${deleteTarget.name}" removed`);
    }
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* 1. HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8">
        <div>
          <h1 className="text-3xl font-black text-text uppercase tracking-tight">Product Attributes</h1>
          <p className="text-xs text-text-muted mt-1">
            Sizes, chromatic color palettes, and structural dimension specifications
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            className="btn-liquid btn-liquid-glass p-2.5 shadow-sm hover:border-border transition-all cursor-pointer"
            title="Refresh Registry"
          >
            <RefreshCw size={16} className={cn(loading && "animate-spin")} />
          </button>
        </div>
      </div>

      {/* 2. MAIN SPLIT REGISTRY GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Chromatic Registry */}
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-border/40">
            <h3 className="text-sm font-black text-text uppercase tracking-[0.2em] flex items-center gap-3">
              <Palette size={18} className="text-primary" /> Chromatic Registry ({colors.length})
            </h3>
            <button
              onClick={handleOpenAddColor}
              className="btn-liquid btn-liquid-terracotta px-3.5 py-1.5 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Plus size={14} />
              <span>Add Color</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-24 animate-pulse liquid-glass bg-white/20" />
              ))
            ) : colors.length === 0 ? (
              <div className="col-span-2 text-center py-10 liquid-glass text-xs text-text-muted italic">
                No color profiles registered. Click &quot;Add Color&quot; above.
              </div>
            ) : (
              colors.map((c) => {
                const hex = normalizeHex(c.hex_code);
                const isLight = isLightColor(hex);

                return (
                  <LiquidCard
                    key={c.id}
                    className="p-4 flex items-center justify-between group hover:border-primary/40 transition-all shadow-sm relative overflow-hidden"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      {/* Live True Color Swatch with Specular Shadow Aura */}
                      <div
                        className={cn(
                          "h-12 w-12 rounded-[4px] shadow-sm flex-shrink-0 transition-transform group-hover:scale-105 relative",
                          isLight ? "border border-border/80" : "border border-black/20"
                        )}
                        style={{
                          backgroundColor: hex,
                          boxShadow: `0 4px 14px ${hex}35`
                        }}
                      >
                        <div className="absolute inset-0 rounded-[4px] bg-gradient-to-tr from-black/15 via-transparent to-white/20 pointer-events-none" />
                      </div>

                      <div className="space-y-1 min-w-0">
                        <p className="text-xs font-black text-text uppercase tracking-wider truncate">
                          {c.color_name}
                        </p>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(hex);
                              toast.success(`Copied hex code: ${hex}`);
                            }}
                            className="text-[10px] font-mono font-bold text-text-muted hover:text-primary uppercase tracking-tight flex items-center gap-1 cursor-pointer"
                            title="Click to copy hex"
                          >
                            <span>{hex}</span>
                          </button>
                          {c.pantone && (
                            <span className="text-[8px] font-mono text-text-muted uppercase px-1 py-0.2 rounded-[2px] bg-bg border border-border/50 truncate max-w-[110px]">
                              {c.pantone}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2">
                      <button
                        onClick={() => handleOpenEditColor(c)}
                        className="p-1.5 text-text-muted hover:text-primary transition-colors cursor-pointer"
                        title="Edit Color"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget({ type: "color", id: c.id, name: c.color_name })}
                        className="p-1.5 text-text-muted hover:text-danger transition-colors cursor-pointer"
                        title="Delete Color"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </LiquidCard>
                );
              })
            )}
          </div>
        </div>

        {/* Dimensional Registry */}
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-border/40">
            <h3 className="text-sm font-black text-text uppercase tracking-[0.2em] flex items-center gap-3">
              <Ruler size={18} className="text-primary" /> Dimensional Registry ({sizes.length})
            </h3>
            <button
              onClick={handleOpenAddSize}
              className="btn-liquid btn-liquid-glass px-3.5 py-1.5 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-sm border border-border"
            >
              <Plus size={14} />
              <span>Add Size</span>
            </button>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-square animate-pulse liquid-glass bg-white/20" />
              ))
            ) : sizes.length === 0 ? (
              <div className="col-span-4 text-center py-10 liquid-glass text-xs text-text-muted italic">
                No size dimensions registered. Click &quot;Add Size&quot; above.
              </div>
            ) : (
              sizes.map((s) => (
                <LiquidCard
                  key={s.id}
                  className="aspect-square p-3 flex flex-col items-center justify-between group hover:border-primary/40 transition-all relative shadow-sm"
                >
                  <div className="w-full flex justify-end">
                    <button
                      onClick={() => setDeleteTarget({ type: "size", id: s.id, name: s.size_name })}
                      className="opacity-0 group-hover:opacity-100 text-text-muted hover:text-danger transition-all cursor-pointer p-0.5"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                  <div className="text-center my-auto">
                    <span className="text-xl font-black text-text uppercase font-mono tracking-tight group-hover:text-primary transition-colors block">
                      {s.size_name}
                    </span>
                    <span className="text-[9px] font-mono font-bold text-text-muted uppercase tracking-wider block mt-0.5">
                      {s.size_code || `Order #${s.size_order || 1}`}
                    </span>
                  </div>
                  <div className="w-full flex justify-center">
                    <button
                      onClick={() => handleOpenEditSize(s)}
                      className="opacity-0 group-hover:opacity-100 text-[9px] font-mono font-bold uppercase text-text-muted hover:text-primary transition-all cursor-pointer"
                    >
                      Edit
                    </button>
                  </div>
                </LiquidCard>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 3. ADD/EDIT COLOR MODAL */}
      {isColorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="liquid-glass w-full max-w-md p-6 space-y-5 shadow-2xl border border-border">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="text-sm font-bold text-text uppercase tracking-tight">
                {editingColor ? "Edit Color Swatch" : "Add Color to Chromatic Registry"}
              </h2>
              <button onClick={() => setIsColorModalOpen(false)} className="text-text-muted hover:text-text">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveColor} className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] font-bold uppercase text-text-muted mb-1">Color Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Midnight Navy"
                  value={colorForm.color_name}
                  onChange={(e) => setColorForm({ ...colorForm, color_name: e.target.value })}
                  className="w-full bg-bg/50 border border-border px-3 py-2 text-text text-xs focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-text-muted mb-1">Hex Color Code</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={colorForm.hex_code}
                    onChange={(e) => setColorForm({ ...colorForm, hex_code: e.target.value })}
                    className="h-9 w-12 border border-border p-0.5 bg-bg cursor-pointer rounded-[2px]"
                  />
                  <input
                    type="text"
                    required
                    placeholder="#1E2631"
                    value={colorForm.hex_code}
                    onChange={(e) => setColorForm({ ...colorForm, hex_code: e.target.value })}
                    className="flex-1 bg-bg/50 border border-border px-3 py-2 text-text text-xs font-mono uppercase focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Color Presets */}
              <div>
                <label className="block text-[9px] font-mono font-bold uppercase text-text-muted mb-2">Heritage Presets</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { name: "Charcoal", hex: "#1E2631" },
                    { name: "Terracotta", hex: "#C84428" },
                    { name: "Ecru", hex: "#EAE6DF" },
                    { name: "Navy", hex: "#1B2A4A" },
                    { name: "Flax Olive", hex: "#4B5320" },
                    { name: "Sand", hex: "#D2B48C" }
                  ].map((preset) => (
                    <button
                      key={preset.hex}
                      type="button"
                      onClick={() => setColorForm({ color_name: preset.name, hex_code: preset.hex })}
                      className="px-2.5 py-1 rounded-[2px] border border-border text-[10px] font-mono font-bold uppercase flex items-center gap-1.5 hover:border-primary transition-all cursor-pointer"
                    >
                      <span className="h-2.5 w-2.5 rounded-full border border-black/20" style={{ backgroundColor: preset.hex }} />
                      <span>{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border/40">
                <button
                  type="button"
                  onClick={() => setIsColorModalOpen(false)}
                  className="btn-liquid btn-liquid-glass px-4 py-2 text-xs font-mono font-bold uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-liquid btn-liquid-terracotta px-4 py-2 text-xs font-mono font-bold uppercase"
                >
                  {editingColor ? "Save Changes" : "Create Color"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. ADD/EDIT SIZE MODAL */}
      {isSizeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="liquid-glass w-full max-w-md p-6 space-y-5 shadow-2xl border border-border">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="text-sm font-bold text-text uppercase tracking-tight">
                {editingSize ? "Edit Size Dimension" : "Add Size to Dimensional Registry"}
              </h2>
              <button onClick={() => setIsSizeModalOpen(false)} className="text-text-muted hover:text-text">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveSize} className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] font-bold uppercase text-text-muted mb-1">Size Label</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. S, M, L, XL, 32/34"
                  value={sizeForm.size_name}
                  onChange={(e) => setSizeForm({ ...sizeForm, size_name: e.target.value })}
                  className="w-full bg-bg/50 border border-border px-3 py-2 text-text text-xs font-bold uppercase focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-text-muted mb-1">Standard Code</label>
                  <input
                    type="text"
                    placeholder="e.g. EU 48"
                    value={sizeForm.size_code}
                    onChange={(e) => setSizeForm({ ...sizeForm, size_code: e.target.value })}
                    className="w-full bg-bg/50 border border-border px-3 py-2 text-text text-xs focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-text-muted mb-1">Display Order</label>
                  <input
                    type="number"
                    min={1}
                    value={sizeForm.size_order}
                    onChange={(e) => setSizeForm({ ...sizeForm, size_order: Number(e.target.value) || 1 })}
                    className="w-full bg-bg/50 border border-border px-3 py-2 text-text text-xs font-mono focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border/40">
                <button
                  type="button"
                  onClick={() => setIsSizeModalOpen(false)}
                  className="btn-liquid btn-liquid-glass px-4 py-2 text-xs font-mono font-bold uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-liquid btn-liquid-terracotta px-4 py-2 text-xs font-mono font-bold uppercase"
                >
                  {editingSize ? "Save Changes" : "Create Size"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. CONFIRM DELETE MODAL */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title={`Delete ${deleteTarget?.type === "color" ? "Color Swatch" : "Size Dimension"}`}
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This attribute will be decommissioned from catalog variants.`}
        confirmLabel="Decommission"
        cancelLabel="Cancel"
        variant="danger"
      />
    </div>
  );
}
