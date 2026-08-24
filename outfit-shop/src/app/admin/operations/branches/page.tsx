"use client";

import { useState, useEffect, useMemo } from "react";
import { opsService } from "@/services/opsService";
import { Branch } from "@/types/inventory.types";
import { LiquidCard } from "@/components/ui/LiquidCard";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import {
  Plus,
  Search,
  MapPin,
  Phone,
  Building2,
  Edit2,
  Trash2,
  Globe,
  RefreshCw,
  X,
  Store,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function BranchesPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; name: string } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    branch_name: "",
    branch_code: "",
    phone: "",
    address: "",
    city: "Phnom Penh"
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await opsService.getBranches();
      setBranches(res?.data || []);
    } catch {
      // Handled in service
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredBranches = useMemo(() => {
    return branches.filter((b) => {
      const q = search.toLowerCase();
      return (
        search === "" ||
        b.branch_name.toLowerCase().includes(q) ||
        b.branch_code.toLowerCase().includes(q) ||
        b.city.toLowerCase().includes(q) ||
        b.address.toLowerCase().includes(q)
      );
    });
  }, [branches, search]);

  // Open Add
  const handleOpenAdd = () => {
    setFormData({
      branch_name: "",
      branch_code: `BKK-${Math.floor(10 + Math.random() * 90)}`,
      phone: "+855 23 888 999",
      address: "",
      city: "Phnom Penh"
    });
    setIsAddModalOpen(true);
  };

  // Open Edit
  const handleOpenEdit = (b: Branch) => {
    setEditingBranch(b);
    setFormData({
      branch_name: b.branch_name,
      branch_code: b.branch_code,
      phone: b.phone,
      address: b.address,
      city: b.city
    });
    setIsEditModalOpen(true);
  };

  // Submit Add
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.branch_name.trim() || !formData.branch_code.trim()) {
      toast.error("Branch name and code are required");
      return;
    }

    const payload = {
      branch_name: formData.branch_name.trim(),
      branch_code: formData.branch_code.trim(),
      phone: formData.phone.trim() || "+855 23 888 999",
      address: formData.address.trim() || "Central Boulevard, Phnom Penh",
      city: formData.city.trim() || "Phnom Penh"
    };

    const res = await opsService.createBranch(payload);
    const created = (res as any)?.data || { id: Date.now(), ...payload };
    setBranches((prev) => [...prev.filter((b) => b.id !== created.id), created]);
    toast.success(`Flagship Location "${payload.branch_name}" registered successfully`);
    setIsAddModalOpen(false);
  };

  // Submit Edit
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBranch) return;

    const payload = {
      branch_name: formData.branch_name.trim(),
      branch_code: formData.branch_code.trim(),
      phone: formData.phone.trim(),
      address: formData.address.trim(),
      city: formData.city.trim()
    };

    await opsService.updateBranch(editingBranch.id, payload);
    setBranches((prev) =>
      prev.map((b) => (b.id === editingBranch.id ? { ...b, ...payload } : b))
    );
    toast.success(`Location "${payload.branch_name}" updated`);
    setIsEditModalOpen(false);
    setEditingBranch(null);
  };

  // Delete Confirm
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    await opsService.deleteBranch(deleteTarget.id);
    setBranches((prev) => prev.filter((b) => b.id !== deleteTarget.id));
    toast.success(`Location "${deleteTarget.name}" decommissioned`);
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* 1. HERO HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black text-text uppercase tracking-tight">Flagship Registry</h1>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-[2px] bg-primary/10 text-primary border border-primary/20">
              {branches.length} Salons &amp; Hubs
            </span>
          </div>
          <p className="text-xs text-text-muted mt-1">
            Manage global salon locations, flagship boutiques, and regional inventory warehouse hubs
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            className="btn-liquid btn-liquid-glass p-2.5 shadow-sm cursor-pointer"
            title="Refresh Locations"
          >
            <RefreshCw size={14} className={cn("text-[#1E2631]", loading && "animate-spin")} />
          </button>
          <button
            onClick={handleOpenAdd}
            className="btn-liquid btn-liquid-terracotta px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 shadow-md cursor-pointer"
          >
            <Plus size={14} />
            <span>New Location</span>
          </button>
        </div>
      </div>

      {/* 2. SEARCH & CONTROLS TOOLBAR */}
      <div className="liquid-glass p-1.5 shadow-md flex items-center max-w-md">
        <div className="relative w-full flex items-center">
          <Search className="absolute left-4 text-[#1E2631] text-xs h-4 w-4" />
          <input
            type="text"
            placeholder="Search by Location Name, Code (e.g. BKK-01), City..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2 bg-transparent text-xs font-sans text-text placeholder:text-text-muted focus:outline-none"
          />
        </div>
      </div>

      {/* 3. BRANCHES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-52 animate-pulse liquid-glass bg-white/20" />
          ))
        ) : filteredBranches.length === 0 ? (
          <div className="col-span-full py-20 text-center liquid-glass border border-border">
            <Building2 size={48} className="mx-auto text-text-muted opacity-30 mb-4" />
            <p className="text-sm font-bold text-text uppercase tracking-wider">No matching locations found</p>
            <p className="text-xs text-text-muted mt-1">Click &quot;New Location&quot; above to register a boutique or warehouse hub.</p>
          </div>
        ) : (
          filteredBranches.map((b) => (
            <LiquidCard
              key={b.id}
              className="p-6 transition-all shadow-md hover:border-primary/40 flex flex-col justify-between group relative"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-bg rounded-[3px] text-primary border border-border/80 shadow-sm">
                    <Store size={22} />
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleOpenEdit(b)}
                      className="p-1.5 text-text-muted hover:text-primary transition-colors cursor-pointer"
                      title="Edit Location"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => setDeleteTarget({ id: b.id, name: b.branch_name })}
                      className="p-1.5 text-text-muted hover:text-danger transition-colors cursor-pointer"
                      title="Decommission Location"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-black text-text uppercase tracking-tight truncate">
                    {b.branch_name}
                  </h3>
                  <span className="text-[10px] font-mono font-bold text-primary px-1.5 py-0.2 bg-primary/10 rounded-[2px]">
                    #{b.branch_code}
                  </span>
                </div>

                <div className="space-y-2 mt-4 text-xs text-text-muted">
                  <div className="flex items-start gap-2">
                    <MapPin size={14} className="shrink-0 mt-0.5 text-primary" />
                    <span className="leading-relaxed">{b.address}, {b.city}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="shrink-0 text-text-muted" />
                    <span className="font-mono">{b.phone}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-success uppercase tracking-wider">
                  <div className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                  Live Operational
                </div>
                <span className="text-[10px] font-mono text-text-muted uppercase">
                  {b.city} Hub
                </span>
              </div>
            </LiquidCard>
          ))
        )}
      </div>

      {/* 4. ADD / EDIT LOCATION MODAL */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="liquid-glass w-full max-w-md p-6 sm:p-8 space-y-5 shadow-2xl border border-border">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="text-base font-bold text-text uppercase tracking-tight">
                {isAddModalOpen ? "Register Flagship Location" : "Edit Flagship Location"}
              </h2>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setIsEditModalOpen(false);
                }}
                className="text-text-muted hover:text-text cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={isAddModalOpen ? handleCreate : handleUpdate} className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] font-bold uppercase text-text-muted mb-1">
                  Location Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Phnom Penh Central Boutique"
                  value={formData.branch_name}
                  onChange={(e) => setFormData({ ...formData, branch_name: e.target.value })}
                  className="w-full bg-bg/50 border border-border px-3 py-2 text-text text-xs focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-text-muted mb-1">
                    Branch Code
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BKK-01"
                    value={formData.branch_code}
                    onChange={(e) => setFormData({ ...formData, branch_code: e.target.value })}
                    className="w-full bg-bg/50 border border-border px-3 py-2 text-text text-xs font-mono uppercase focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-text-muted mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Phnom Penh"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-bg/50 border border-border px-3 py-2 text-text text-xs focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-text-muted mb-1">
                  Contact Phone
                </label>
                <input
                  type="text"
                  placeholder="e.g. +855 23 888 999"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-bg/50 border border-border px-3 py-2 text-text text-xs font-mono focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-text-muted mb-1">
                  Street Address &amp; Landmarks
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Street 240, Chey Chumneah, Daun Penh"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-bg/50 border border-border px-3 py-2 text-text text-xs focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border/40">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setIsEditModalOpen(false);
                  }}
                  className="btn-liquid btn-liquid-glass px-4 py-2 text-xs font-mono font-bold uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-liquid btn-liquid-terracotta px-5 py-2 text-xs font-mono font-bold uppercase cursor-pointer"
                >
                  {isAddModalOpen ? "Create Location" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. DELETE CONFIRMATION MODAL */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Decommission Location"
        description={`Are you sure you want to decommission the flagship location "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Decommission"
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteTarget(null)}
        variant="danger"
      />
    </div>
  );
}
