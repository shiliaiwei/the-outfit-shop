"use client";

import { useState, useEffect, useMemo } from "react";
import { fulfillmentService } from "@/services/fulfillmentService";
import { useAuth } from "@/hooks/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faMagnifyingGlass,
  faRotate,
  faEye,
  faCheck,
  faBan,
  faXmark,
  faTruckRampBox,
  faBoxesPacking
} from "@fortawesome/free-solid-svg-icons";
import { BrandSelect, BrandSelectOption } from "@/components/shared/BrandSelect";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const STATUS_OPTIONS: BrandSelectOption[] = [
  { value: "ALL", label: "All Statuses" },
  { value: "PENDING", label: "Pending" },
  { value: "PARTIAL", label: "Partial" },
  { value: "RECEIVED", label: "Received" },
  { value: "CANCELLED", label: "Cancelled" }
];

const SUPPLIER_OPTIONS: BrandSelectOption[] = [
  { value: "Phnom Penh Textile Mills", label: "Phnom Penh Textile Mills" },
  { value: "Angkor Silk & Fabrics", label: "Angkor Silk & Fabrics" },
  { value: "Mekong Garment Co.", label: "Mekong Garment Co." },
  { value: "Normandy Flax Cooperative", label: "Normandy Flax Cooperative" }
];

import { entityStore } from "@/lib/storage/entityStore";

const DEFAULT_PURCHASES = [
  {
    id: 1001,
    supplier_id: 1,
    supplier_name: "Phnom Penh Textile Mills",
    total_cost: 4500.00,
    status: "PENDING",
    expected_date: new Date(Date.now() + 5 * 86400000).toISOString().split("T")[0],
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    items: [
      { name: "Structured Normandy Linen Overshirt", quantity: 100, unit_cost: 45, total: 4500 }
    ]
  },
  {
    id: 1002,
    supplier_id: 2,
    supplier_name: "Angkor Silk & Fabrics",
    total_cost: 3200.00,
    status: "RECEIVED",
    expected_date: new Date(Date.now() - 86400000).toISOString().split("T")[0],
    created_at: new Date(Date.now() - 86400000 * 6).toISOString(),
    items: [
      { name: "Minimalist Supima Knit Polo", quantity: 80, unit_cost: 40, total: 3200 }
    ]
  }
];

export default function PurchasesPage() {
  const { user } = useAuth();
  const userRole = user?.role || "ADMIN";
  const canManage = userRole === "ADMIN" || userRole === "MANAGER";

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Modals
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [selectedPO, setSelectedPO] = useState<any | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [cancelPOId, setCancelPOId] = useState<number | null>(null);

  // New PO Form
  const [newPOForm, setNewPOForm] = useState({
    supplier_name: "Phnom Penh Textile Mills",
    expected_date: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
    item_name: "Structured Normandy Linen Overshirt",
    quantity: 100,
    unit_cost: 45,
    note: ""
  });

  async function load() {
    setLoading(true);
    try {
      const res = await fulfillmentService.getPurchaseOrders();
      if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
        const synced = entityStore.sync("purchase_orders", res.data, DEFAULT_PURCHASES);
        setOrders(synced);
      } else {
        const local = entityStore.get("purchase_orders", DEFAULT_PURCHASES);
        setOrders(local);
      }
    } catch {
      const local = entityStore.get("purchase_orders", DEFAULT_PURCHASES);
      setOrders(local);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter((po) => {
      const q = search.toLowerCase();
      const poNum = `PO-${String(po.id).padStart(5, "0")}`.toLowerCase();
      const matchSearch =
        search === "" ||
        poNum.includes(q) ||
        (po.supplier_name && po.supplier_name.toLowerCase().includes(q));

      const matchStatus = statusFilter === "ALL" || po.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [orders, search, statusFilter]);

  const handleCreatePO = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = Math.floor(100 + Math.random() * 900);
    const totalCost = Number(newPOForm.quantity) * Number(newPOForm.unit_cost);

    const newEntry = {
      id: newId,
      supplier_id: 1,
      supplier_name: newPOForm.supplier_name,
      total_cost: totalCost,
      status: "PENDING",
      expected_date: newPOForm.expected_date,
      created_at: new Date().toISOString(),
      items: [
        {
          name: newPOForm.item_name,
          quantity: newPOForm.quantity,
          unit_cost: newPOForm.unit_cost,
          total: totalCost
        }
      ]
    };

    entityStore.add("purchase_orders", newEntry, DEFAULT_PURCHASES);
    setOrders((prev) => [newEntry, ...prev.filter(p => p.id !== newEntry.id)]);
    toast.success(`Purchase Order PO-${String(newId).padStart(5, "0")} created`);
    setIsNewModalOpen(false);
    setNewPOForm({
      supplier_name: "Phnom Penh Textile Mills",
      expected_date: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
      item_name: "Structured Normandy Linen Overshirt",
      quantity: 100,
      unit_cost: 45,
      note: ""
    });
  };

  const handleReceivePO = (id: number) => {
    entityStore.update("purchase_orders", id, { status: "RECEIVED" }, DEFAULT_PURCHASES);
    setOrders((prev) =>
      prev.map((po) => (po.id === id ? { ...po, status: "RECEIVED" } : po))
    );
    toast.success(`PO-${String(id).padStart(5, "0")} marked as RECEIVED. Stock inventory updated!`);
    setIsDetailModalOpen(false);
  };

  const handleCancelPO = () => {
    if (!cancelPOId) return;
    entityStore.update("purchase_orders", cancelPOId, { status: "CANCELLED" }, DEFAULT_PURCHASES);
    setOrders((prev) =>
      prev.map((po) => (po.id === cancelPOId ? { ...po, status: "CANCELLED" } : po))
    );
    toast.info(`Purchase Order PO-${String(cancelPOId).padStart(5, "0")} cancelled`);
    setCancelPOId(null);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-700">
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-text uppercase tracking-tight">
            Purchase Orders
          </h1>
          <p className="text-xs text-text-muted mt-1">
            Procurement management and warehouse stock intake ({orders.length} total)
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            onClick={load}
            className="btn-liquid btn-liquid-glass p-2.5 shadow-sm cursor-pointer"
            title="Refresh POs"
          >
            <FontAwesomeIcon
              icon={faRotate}
              className={cn("text-[#1E2631] text-xs", loading && "animate-spin")}
            />
          </button>

          {canManage && (
            <button
              onClick={() => setIsNewModalOpen(true)}
              className="btn-liquid btn-liquid-terracotta px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 shadow-md cursor-pointer"
            >
              <FontAwesomeIcon icon={faPlus} className="text-xs" />
              <span>New PO</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. SEARCH & STATUS FILTERS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2 liquid-glass p-1.5 shadow-md flex items-center">
          <div className="relative w-full flex items-center">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="absolute left-4 text-[#1E2631] text-xs h-3.5 w-3.5"
            />
            <input
              type="text"
              placeholder="Search by PO number or supplier name..."
              className="w-full pl-11 pr-4 py-2 bg-transparent border-none text-xs font-mono text-text placeholder:text-text-muted focus:outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="liquid-glass p-1.5 shadow-md flex items-center">
          <BrandSelect
            options={STATUS_OPTIONS}
            value={statusFilter}
            onChange={(val) => setStatusFilter(val)}
            size="md"
          />
        </div>
      </div>

      {/* 3. PO TABLE / CARDS */}
      <div className="liquid-glass shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[650px]">
            <thead>
              <tr className="border-b border-border/40 bg-bg/40">
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-text-muted">
                  PO Number
                </th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-text-muted">
                  Supplier
                </th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-text-muted">
                  Status
                </th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-text-muted">
                  Expected Delivery
                </th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-text-muted">
                  Total Cost
                </th>
                <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-text-muted text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-4 py-4">
                      <div className="h-4 bg-bg rounded-[2px] w-full" />
                    </td>
                  </tr>
                ))
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-xs font-mono text-text-muted">
                    No purchase orders found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((po) => (
                  <tr key={po.id} className="hover:bg-bg/30 transition-colors">
                    <td className="px-4 py-3.5 text-xs font-bold text-text uppercase font-mono">
                      PO-{String(po.id).padStart(5, "0")}
                    </td>
                    <td className="px-4 py-3.5 text-xs text-text uppercase font-bold">
                      {po.supplier_name || `Supplier #${po.supplier_id}`}
                    </td>
                    <td className="px-4 py-3.5">
                      <POStatusBadge status={po.status} />
                    </td>
                    <td className="px-4 py-3.5 text-xs text-text-muted font-mono">
                      {new Date(po.expected_date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3.5 text-xs font-black text-text font-mono">
                      ${Number(po.total_cost ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedPO(po);
                            setIsDetailModalOpen(true);
                          }}
                          className="px-2.5 py-1 rounded-[2px] bg-bg border border-border text-[10px] font-bold uppercase text-text hover:text-primary transition-colors cursor-pointer"
                          title="View PO Details"
                        >
                          <FontAwesomeIcon icon={faEye} className="text-[#1E2631] text-xs mr-1" />
                          <span>View</span>
                        </button>

                        {canManage && po.status === "PENDING" && (
                          <>
                            <button
                              onClick={() => handleReceivePO(po.id)}
                              className="px-2.5 py-1 rounded-[2px] bg-success/10 border border-success/30 text-[10px] font-bold uppercase text-success hover:bg-success/20 transition-colors cursor-pointer"
                              title="Receive Stock"
                            >
                              <FontAwesomeIcon icon={faCheck} className="text-xs mr-1" />
                              <span>Receive</span>
                            </button>

                            <button
                              onClick={() => setCancelPOId(po.id)}
                              className="p-1 text-text-muted hover:text-danger cursor-pointer"
                              title="Cancel PO"
                            >
                              <FontAwesomeIcon icon={faBan} className="text-[#1E2631] text-xs" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. MODAL: CREATE PURCHASE ORDER */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="liquid-glass bg-surface p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-border space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border/40 pb-4">
              <div className="flex items-center gap-2.5">
                <FontAwesomeIcon icon={faTruckRampBox} className="text-[#1E2631] text-sm" />
                <h3 className="text-base font-black text-text uppercase tracking-widest">
                  Create Purchase Order
                </h3>
              </div>
              <button
                onClick={() => setIsNewModalOpen(false)}
                className="text-text-muted hover:text-text cursor-pointer p-1"
              >
                <FontAwesomeIcon icon={faXmark} className="text-sm" />
              </button>
            </div>

            <form onSubmit={handleCreatePO} className="space-y-4 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text uppercase tracking-wider block">
                  Supplier *
                </label>
                <BrandSelect
                  options={SUPPLIER_OPTIONS}
                  value={newPOForm.supplier_name}
                  onChange={(val) => setNewPOForm({ ...newPOForm, supplier_name: val })}
                  size="md"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-text uppercase tracking-wider block">
                    Expected Delivery Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={newPOForm.expected_date}
                    onChange={(e) => setNewPOForm({ ...newPOForm, expected_date: e.target.value })}
                    className="w-full px-3 py-2.5 bg-bg border border-border rounded-[2px] text-text focus:border-primary focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-text uppercase tracking-wider block">
                    Item / Garment Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newPOForm.item_name}
                    onChange={(e) => setNewPOForm({ ...newPOForm, item_name: e.target.value })}
                    className="w-full px-3 py-2.5 bg-bg border border-border rounded-[2px] text-text focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-text uppercase tracking-wider block">
                    Intake Quantity (Units) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newPOForm.quantity}
                    onChange={(e) => setNewPOForm({ ...newPOForm, quantity: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 bg-bg border border-border rounded-[2px] text-text focus:border-primary focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-text uppercase tracking-wider block">
                    Wholesale Unit Cost (USD) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={newPOForm.unit_cost}
                    onChange={(e) => setNewPOForm({ ...newPOForm, unit_cost: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 bg-bg border border-border rounded-[2px] text-text focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              {/* Calculated Summary */}
              <div className="p-3 bg-bg/60 rounded-[2px] border border-border flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-text-muted">Total Calculated Cost</span>
                <span className="text-sm font-black text-text font-mono">
                  ${(Number(newPOForm.quantity) * Number(newPOForm.unit_cost)).toLocaleString(undefined, { minimumFractionDigits: 2 })} USD
                </span>
              </div>

              <div className="flex gap-3 pt-4 border-t border-border/40">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="btn-liquid btn-liquid-glass flex-1 py-3 text-xs font-bold uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-liquid btn-liquid-terracotta flex-1 py-3 text-xs font-bold uppercase flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  Create Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. MODAL: VIEW PO DETAILS */}
      {isDetailModalOpen && selectedPO && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="liquid-glass bg-surface p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-border space-y-6">
            <div className="flex items-center justify-between border-b border-border/40 pb-4">
              <div>
                <h3 className="text-base font-black text-text uppercase tracking-widest">
                  PO-{String(selectedPO.id).padStart(5, "0")}
                </h3>
                <p className="text-[10px] font-mono text-text-muted mt-0.5">
                  Created: {new Date(selectedPO.created_at).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="text-text-muted hover:text-text cursor-pointer p-1"
              >
                <FontAwesomeIcon icon={faXmark} className="text-sm" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="flex justify-between border-b border-border/20 pb-2">
                <span className="text-text-muted">Supplier:</span>
                <span className="font-bold text-text uppercase">{selectedPO.supplier_name}</span>
              </div>
              <div className="flex justify-between border-b border-border/20 pb-2">
                <span className="text-text-muted">Status:</span>
                <POStatusBadge status={selectedPO.status} />
              </div>
              <div className="flex justify-between border-b border-border/20 pb-2">
                <span className="text-text-muted">Expected Delivery:</span>
                <span className="font-bold text-text">{new Date(selectedPO.expected_date).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between border-b border-border/20 pb-2">
                <span className="text-text-muted">Total Commitment:</span>
                <span className="font-black text-text text-sm">
                  ${Number(selectedPO.total_cost || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-border/40">
              <button
                type="button"
                onClick={() => setIsDetailModalOpen(false)}
                className="btn-liquid btn-liquid-glass flex-1 py-2.5 text-xs font-bold uppercase cursor-pointer"
              >
                Close
              </button>
              {canManage && selectedPO.status === "PENDING" && (
                <button
                  type="button"
                  onClick={() => handleReceivePO(selectedPO.id)}
                  className="btn-liquid btn-liquid-terracotta flex-1 py-2.5 text-xs font-bold uppercase cursor-pointer"
                >
                  Receive Stock
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 6. COMPACT CONFIRM MODAL: CANCEL PO */}
      <ConfirmModal
        isOpen={Boolean(cancelPOId)}
        onClose={() => setCancelPOId(null)}
        onConfirm={handleCancelPO}
        title="Cancel Purchase Order"
        description="Are you sure you want to void this procurement order? This action cannot be reversed."
        confirmLabel="Cancel PO"
        cancelLabel="Keep Active"
        variant="danger"
      />
    </div>
  );
}

function POStatusBadge({ status }: { status: string }) {
  const s = status ? status.toUpperCase() : "PENDING";
  switch (s) {
    case "RECEIVED":
      return (
        <span className="px-2 py-0.5 rounded-[2px] bg-success/10 text-success border border-success/20 text-[9px] font-mono font-black uppercase">
          Received
        </span>
      );
    case "PARTIAL":
      return (
        <span className="px-2 py-0.5 rounded-[2px] bg-primary/10 text-primary border border-primary/20 text-[9px] font-mono font-black uppercase">
          Partial
        </span>
      );
    case "CANCELLED":
      return (
        <span className="px-2 py-0.5 rounded-[2px] bg-danger/10 text-danger border border-danger/20 text-[9px] font-mono font-black uppercase">
          Cancelled
        </span>
      );
    default:
      return (
        <span className="px-2 py-0.5 rounded-[2px] bg-warning/10 text-warning border border-warning/20 text-[9px] font-mono font-black uppercase">
          Pending
        </span>
      );
  }
}
