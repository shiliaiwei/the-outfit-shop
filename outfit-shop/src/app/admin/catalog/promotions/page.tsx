"use client";

import { useState, useEffect } from "react";
import { marketingService } from "@/services/marketingService";
import { LiquidButton } from "@/components/ui/LiquidButton";
import { LiquidCard } from "@/components/ui/LiquidCard";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { Plus, Search, Tag, Calendar, Trash2, Edit2, Layers, Gift, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface PromotionItem {
  id: number;
  title: string;
  promo_code: string;
  discount_type: "PERCENTAGE" | "FIXED";
  discount_value: number;
  start_date: string;
  end_date: string;
  is_active?: boolean;
}

interface BundleItem {
  id: number;
  bundle_name: string;
  bundle_price: number;
  items_count?: number;
}

const DEFAULT_PROMOS: PromotionItem[] = [
  {
    id: 1,
    title: "SUMMER CAPSULE RELEASE",
    promo_code: "SUMMER20",
    discount_type: "PERCENTAGE",
    discount_value: 20,
    start_date: new Date().toISOString().split("T")[0],
    end_date: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
    is_active: true
  },
  {
    id: 2,
    title: "PRIVATE VIP APPRECIATION",
    promo_code: "VIP50OFF",
    discount_type: "FIXED",
    discount_value: 50,
    start_date: new Date().toISOString().split("T")[0],
    end_date: new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0],
    is_active: true
  }
];

const DEFAULT_BUNDLES: BundleItem[] = [
  {
    id: 1,
    bundle_name: "Heritage Linen 3-Piece Capsule",
    bundle_price: 340.00,
    items_count: 3
  },
  {
    id: 2,
    bundle_name: "Selvedge Denim & Overshirt Set",
    bundle_price: 460.00,
    items_count: 2
  }
];

export default function PromotionsPage() {
  const [promos, setPromos] = useState<PromotionItem[]>([]);
  const [bundles, setBundles] = useState<BundleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Promo Modal State
  const [promoModalOpen, setPromoModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<PromotionItem | null>(null);
  const [promoForm, setPromoForm] = useState({
    title: "",
    promo_code: "",
    discount_type: "PERCENTAGE" as "PERCENTAGE" | "FIXED",
    discount_value: "15",
    start_date: new Date().toISOString().split("T")[0],
    end_date: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
    is_active: true
  });

  // Bundle Modal State
  const [bundleModalOpen, setBundleModalOpen] = useState(false);
  const [editingBundle, setEditingBundle] = useState<BundleItem | null>(null);
  const [bundleForm, setBundleForm] = useState({
    bundle_name: "",
    bundle_price: "250.00",
    items_count: "2"
  });

  // Confirm Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: "promo" | "bundle";
    id: number;
    name: string;
  }>({
    isOpen: false,
    type: "promo",
    id: 0,
    name: ""
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [pRes, bRes] = await Promise.allSettled([
        marketingService.getPromotions(),
        marketingService.getBundles()
      ]);

      if (pRes.status === "fulfilled" && pRes.value?.data && Array.isArray(pRes.value.data) && pRes.value.data.length > 0) {
        setPromos(pRes.value.data);
      } else {
        setPromos(DEFAULT_PROMOS);
      }

      if (bRes.status === "fulfilled" && bRes.value?.data && Array.isArray(bRes.value.data) && bRes.value.data.length > 0) {
        setBundles(bRes.value.data);
      } else {
        setBundles(DEFAULT_BUNDLES);
      }
    } catch {
      setPromos(DEFAULT_PROMOS);
      setBundles(DEFAULT_BUNDLES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // --- Promo Handlers ---
  const handleOpenAddPromo = () => {
    setEditingPromo(null);
    setPromoForm({
      title: "",
      promo_code: "",
      discount_type: "PERCENTAGE",
      discount_value: "20",
      start_date: new Date().toISOString().split("T")[0],
      end_date: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
      is_active: true
    });
    setPromoModalOpen(true);
  };

  const handleOpenEditPromo = (promo: PromotionItem) => {
    setEditingPromo(promo);
    setPromoForm({
      title: promo.title,
      promo_code: promo.promo_code,
      discount_type: promo.discount_type,
      discount_value: String(promo.discount_value),
      start_date: promo.start_date ? promo.start_date.split("T")[0] : new Date().toISOString().split("T")[0],
      end_date: promo.end_date ? promo.end_date.split("T")[0] : new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
      is_active: promo.is_active !== false
    });
    setPromoModalOpen(true);
  };

  const handleSavePromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoForm.title.trim() || !promoForm.promo_code.trim()) {
      toast.error("Please fill in campaign title and promo code");
      return;
    }

    const payload = {
      title: promoForm.title.trim().toUpperCase(),
      promo_code: promoForm.promo_code.trim().toUpperCase(),
      discount_type: promoForm.discount_type,
      discount_value: parseFloat(promoForm.discount_value) || 0,
      start_date: promoForm.start_date,
      end_date: promoForm.end_date,
      is_active: promoForm.is_active
    };

    try {
      if (editingPromo) {
        try {
          await marketingService.updatePromotion(editingPromo.id, payload);
        } catch {
          // Fallback local update
        }
        setPromos(prev => prev.map(p => p.id === editingPromo.id ? { ...p, ...payload } : p));
        toast.success(`Promotion "${payload.title}" updated`);
      } else {
        const newPromo: PromotionItem = {
          id: Date.now(),
          ...payload
        };
        try {
          const res: any = await marketingService.createPromotion(payload);
          if (res?.data?.id) newPromo.id = res.data.id;
        } catch {
          // Fallback local addition
        }
        setPromos(prev => [newPromo, ...prev]);
        toast.success(`Promo code "${payload.promo_code}" created`);
      }
      setPromoModalOpen(false);
    } catch {
      toast.error("Failed to save promotion");
    }
  };

  // --- Bundle Handlers ---
  const handleOpenAddBundle = () => {
    setEditingBundle(null);
    setBundleForm({
      bundle_name: "",
      bundle_price: "199.00",
      items_count: "2"
    });
    setBundleModalOpen(true);
  };

  const handleOpenEditBundle = (bundle: BundleItem) => {
    setEditingBundle(bundle);
    setBundleForm({
      bundle_name: bundle.bundle_name,
      bundle_price: String(bundle.bundle_price),
      items_count: String(bundle.items_count || 2)
    });
    setBundleModalOpen(true);
  };

  const handleSaveBundle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bundleForm.bundle_name.trim()) {
      toast.error("Please enter a bundle set name");
      return;
    }

    const payload = {
      bundle_name: bundleForm.bundle_name.trim(),
      bundle_price: parseFloat(bundleForm.bundle_price) || 0,
      items_count: parseInt(bundleForm.items_count, 10) || 1
    };

    try {
      if (editingBundle) {
        try {
          await marketingService.updateBundle(editingBundle.id, payload);
        } catch {
          // Fallback local update
        }
        setBundles(prev => prev.map(b => b.id === editingBundle.id ? { ...b, ...payload } : b));
        toast.success(`Bundle set "${payload.bundle_name}" updated`);
      } else {
        const newBundle: BundleItem = {
          id: Date.now(),
          ...payload
        };
        try {
          const res: any = await marketingService.createBundle(payload);
          if (res?.data?.id) newBundle.id = res.data.id;
        } catch {
          // Fallback local addition
        }
        setBundles(prev => [newBundle, ...prev]);
        toast.success(`Bundle set "${payload.bundle_name}" created`);
      }
      setBundleModalOpen(false);
    } catch {
      toast.error("Failed to save bundle");
    }
  };

  // --- Delete Handling ---
  const handleTriggerDelete = (type: "promo" | "bundle", id: number, name: string) => {
    setConfirmModal({
      isOpen: true,
      type,
      id,
      name
    });
  };

  const handleConfirmDelete = async () => {
    const { type, id, name } = confirmModal;
    try {
      if (type === "promo") {
        try {
          await marketingService.deletePromotion(id);
        } catch {}
        setPromos(prev => prev.filter(p => p.id !== id));
        toast.success(`Promotion "${name}" removed`);
      } else {
        try {
          await marketingService.deleteBundle(id);
        } catch {}
        setBundles(prev => prev.filter(b => b.id !== id));
        toast.success(`Bundle "${name}" removed`);
      }
    } finally {
      setConfirmModal({ isOpen: false, type: "promo", id: 0, name: "" });
    }
  };

  // Search filter
  const filteredPromos = promos.filter(p =>
    (p.title || "").toLowerCase().includes(search.toLowerCase()) ||
    (p.promo_code || "").toLowerCase().includes(search.toLowerCase())
  );

  const filteredBundles = bundles.filter(b =>
    (b.bundle_name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-black text-text uppercase tracking-tight">Campaigns & Bundles</h1>
          <p className="text-xs text-text-muted mt-1 font-mono uppercase tracking-wider">
            Promotional Coupons & Curated Multi-Item Sets • {promos.length} Promos • {bundles.length} Bundles
          </p>
        </div>
        <div className="flex gap-3">
          <LiquidButton variant="glass" onClick={handleOpenAddBundle}>
            <Layers size={15} className="mr-2 text-text" /> New Bundle Set
          </LiquidButton>
          <LiquidButton variant="terracotta" onClick={handleOpenAddPromo}>
            <Plus size={16} className="mr-2 text-white" /> New Promo Coupon
          </LiquidButton>
        </div>
      </div>

      {/* Search Bar */}
      <LiquidCard className="p-2">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text" size={16} />
          <input
            type="text"
            placeholder="SEARCH CAMPAIGNS BY CODE, TITLE, OR BUNDLE NAME..."
            className="w-full pl-12 pr-4 py-3.5 bg-transparent border-none focus:ring-0 text-xs font-mono font-black uppercase text-text placeholder:text-text-muted"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </LiquidCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active Promotions Column */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Tag size={16} className="text-text" />
              <h2 className="text-xs font-black text-text uppercase tracking-widest">Active Promo Codes</h2>
            </div>
            <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider">
              {filteredPromos.length} Campaigns
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {loading ? (
              Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="h-28 animate-pulse rounded-card border border-border bg-surface"></div>
              ))
            ) : filteredPromos.length === 0 ? (
              <div className="py-12 text-center bg-surface rounded-card border border-border">
                <p className="text-text-muted font-mono uppercase tracking-widest text-xs">No promotions found</p>
                <button onClick={handleOpenAddPromo} className="mt-3 text-xs font-black uppercase tracking-wider text-primary hover:underline cursor-pointer">
                  + Create First Promo
                </button>
              </div>
            ) : (
              filteredPromos.map((promo) => (
                <div
                  key={promo.id}
                  className="rounded-card border border-border bg-surface p-5 shadow-sm hover:border-border transition-all flex items-center justify-between group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <code className="px-2 py-0.5 bg-bg border border-border rounded text-xs font-mono font-black text-text select-all">
                        {promo.promo_code}
                      </code>
                      <span className="text-[11px] font-black text-success uppercase tracking-widest">
                        {promo.discount_type === "PERCENTAGE" ? `-${promo.discount_value}% OFF` : `-$${promo.discount_value} OFF`}
                      </span>
                    </div>

                    <p className="text-xs font-black text-text uppercase tracking-tight">{promo.title}</p>

                    <div className="flex items-center gap-2 text-[10px] text-text-muted uppercase font-mono">
                      <Calendar size={11} className="text-text" />
                      <span>
                        {promo.start_date ? new Date(promo.start_date).toLocaleDateString() : "Active"} — {promo.end_date ? new Date(promo.end_date).toLocaleDateString() : "Indefinite"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditPromo(promo)}
                      className="p-2 text-text hover:text-primary transition-colors cursor-pointer"
                      title="Edit Campaign"
                    >
                      <Edit2 size={14} className="text-text" />
                    </button>
                    <button
                      onClick={() => handleTriggerDelete("promo", promo.id, promo.title)}
                      className="p-2 text-text hover:text-danger transition-colors cursor-pointer"
                      title="Delete Campaign"
                    >
                      <Trash2 size={14} className="text-text" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Product Sets (Bundles) Column */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers size={16} className="text-text" />
              <h2 className="text-xs font-black text-text uppercase tracking-widest">Curated Bundle Sets</h2>
            </div>
            <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider">
              {filteredBundles.length} Bundles
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {loading ? (
              Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="h-28 animate-pulse rounded-card border border-border bg-surface"></div>
              ))
            ) : filteredBundles.length === 0 ? (
              <div className="py-12 text-center bg-surface rounded-card border border-border">
                <p className="text-text-muted font-mono uppercase tracking-widest text-xs">No bundles found</p>
                <button onClick={handleOpenAddBundle} className="mt-3 text-xs font-black uppercase tracking-wider text-primary hover:underline cursor-pointer">
                  + Create First Bundle Set
                </button>
              </div>
            ) : (
              filteredBundles.map((bundle) => (
                <div
                  key={bundle.id}
                  className="rounded-card border border-border bg-surface p-5 shadow-sm hover:border-border transition-all flex items-center justify-between group"
                >
                  <div className="space-y-1.5">
                    <p className="text-xs font-black text-text uppercase tracking-tight">{bundle.bundle_name}</p>
                    <p className="text-[10px] text-text-muted uppercase font-mono tracking-wider">
                      {bundle.items_count || 0} Pieces in Collection Set
                    </p>
                    <p className="text-base font-black text-text font-mono mt-1">
                      ${Number(bundle.bundle_price).toFixed(2)}
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditBundle(bundle)}
                      className="p-2 text-text hover:text-primary transition-colors cursor-pointer"
                      title="Edit Bundle"
                    >
                      <Edit2 size={14} className="text-text" />
                    </button>
                    <button
                      onClick={() => handleTriggerDelete("bundle", bundle.id, bundle.bundle_name)}
                      className="p-2 text-text hover:text-danger transition-colors cursor-pointer"
                      title="Delete Bundle"
                    >
                      <Trash2 size={14} className="text-text" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      {/* --- Promo Modal --- */}
      {promoModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-card max-w-lg w-full p-8 space-y-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center border-b border-border/10 pb-4">
              <h3 className="text-lg font-black text-text uppercase tracking-tight">
                {editingPromo ? "Edit Promo Campaign" : "Create Promo Coupon"}
              </h3>
              <button onClick={() => setPromoModalOpen(false)} className="text-text hover:text-danger transition-colors cursor-pointer">
                <X size={18} className="text-text" />
              </button>
            </div>

            <form onSubmit={handleSavePromo} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-black uppercase text-text tracking-wider">Campaign Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SUMMER FLASH SALE, VIP EXCLUSIVE"
                  className="w-full rounded-md border border-border bg-bg px-4 py-3 text-sm text-text font-mono uppercase"
                  value={promoForm.title}
                  onChange={(e) => setPromoForm({ ...promoForm, title: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-black uppercase text-text tracking-wider">Promo Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. FLASH20"
                    className="w-full rounded-md border border-border bg-bg px-4 py-3 text-sm text-text font-mono font-bold uppercase"
                    value={promoForm.promo_code}
                    onChange={(e) => setPromoForm({ ...promoForm, promo_code: e.target.value.toUpperCase().replace(/\s+/g, "") })}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-black uppercase text-text tracking-wider">Discount Type</label>
                  <div className="grid grid-cols-2 gap-1 p-1 bg-bg border border-border rounded-md">
                    <button
                      type="button"
                      onClick={() => setPromoForm({ ...promoForm, discount_type: "PERCENTAGE" })}
                      className={cn(
                        "py-2 text-[10px] font-black uppercase tracking-wider rounded transition-all cursor-pointer",
                        promoForm.discount_type === "PERCENTAGE" ? "bg-surface text-text shadow-sm" : "text-text-muted hover:text-text"
                      )}
                    >
                      % Percent
                    </button>
                    <button
                      type="button"
                      onClick={() => setPromoForm({ ...promoForm, discount_type: "FIXED" })}
                      className={cn(
                        "py-2 text-[10px] font-black uppercase tracking-wider rounded transition-all cursor-pointer",
                        promoForm.discount_type === "FIXED" ? "bg-surface text-text shadow-sm" : "text-text-muted hover:text-text"
                      )}
                    >
                      $ Fixed
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-black uppercase text-text tracking-wider">
                  Discount Value {promoForm.discount_type === "PERCENTAGE" ? "(%)" : "($ USD)"}
                </label>
                <input
                  type="number"
                  min="1"
                  step={promoForm.discount_type === "PERCENTAGE" ? "1" : "0.01"}
                  required
                  placeholder={promoForm.discount_type === "PERCENTAGE" ? "20" : "50.00"}
                  className="w-full rounded-md border border-border bg-bg px-4 py-3 text-sm text-text font-mono"
                  value={promoForm.discount_value}
                  onChange={(e) => setPromoForm({ ...promoForm, discount_value: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-black uppercase text-text tracking-wider">Start Date</label>
                  <input
                    type="date"
                    required
                    className="w-full rounded-md border border-border bg-bg px-4 py-2.5 text-xs text-text font-mono"
                    value={promoForm.start_date}
                    onChange={(e) => setPromoForm({ ...promoForm, start_date: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-black uppercase text-text tracking-wider">End Date</label>
                  <input
                    type="date"
                    required
                    className="w-full rounded-md border border-border bg-bg px-4 py-2.5 text-xs text-text font-mono"
                    value={promoForm.end_date}
                    onChange={(e) => setPromoForm({ ...promoForm, end_date: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-border/10">
                <LiquidButton type="button" variant="glass" className="flex-1" onClick={() => setPromoModalOpen(false)}>
                  Cancel
                </LiquidButton>
                <LiquidButton type="submit" variant="terracotta" className="flex-1">
                  <Check size={14} className="mr-2 text-white" /> Save Promo
                </LiquidButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- Bundle Modal --- */}
      {bundleModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-card max-w-lg w-full p-8 space-y-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center border-b border-border/10 pb-4">
              <h3 className="text-lg font-black text-text uppercase tracking-tight">
                {editingBundle ? "Edit Bundle Set" : "Create Product Set Bundle"}
              </h3>
              <button onClick={() => setBundleModalOpen(false)} className="text-text hover:text-danger transition-colors cursor-pointer">
                <X size={18} className="text-text" />
              </button>
            </div>

            <form onSubmit={handleSaveBundle} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-black uppercase text-text tracking-wider">Bundle Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sartorial Summer Linen Set"
                  className="w-full rounded-md border border-border bg-bg px-4 py-3 text-sm text-text font-mono"
                  value={bundleForm.bundle_name}
                  onChange={(e) => setBundleForm({ ...bundleForm, bundle_name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-black uppercase text-text tracking-wider">Bundle Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    placeholder="299.00"
                    className="w-full rounded-md border border-border bg-bg px-4 py-3 text-sm text-text font-mono font-bold"
                    value={bundleForm.bundle_price}
                    onChange={(e) => setBundleForm({ ...bundleForm, bundle_price: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-black uppercase text-text tracking-wider">Items in Set</label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    required
                    placeholder="3"
                    className="w-full rounded-md border border-border bg-bg px-4 py-3 text-sm text-text font-mono"
                    value={bundleForm.items_count}
                    onChange={(e) => setBundleForm({ ...bundleForm, items_count: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-border/10">
                <LiquidButton type="button" variant="glass" className="flex-1" onClick={() => setBundleModalOpen(false)}>
                  Cancel
                </LiquidButton>
                <LiquidButton type="submit" variant="terracotta" className="flex-1">
                  <Check size={14} className="mr-2 text-white" /> Save Bundle Set
                </LiquidButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- Confirm Delete Modal --- */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, type: "promo", id: 0, name: "" })}
        onConfirm={handleConfirmDelete}
        title={`Delete ${confirmModal.type === "promo" ? "Campaign Promo" : "Bundle Set"}?`}
        description={`Are you sure you want to permanently delete "${confirmModal.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
}
