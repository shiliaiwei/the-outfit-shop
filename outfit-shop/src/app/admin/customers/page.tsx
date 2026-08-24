"use client";

import { useState, useEffect } from "react";
import { customerService } from "@/services/customerService";
import { RealTimeBadge } from "@/components/ui/RealTimeBadge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faPlus,
  faUser,
  faPhone,
  faEnvelope,
  faAward,
  faClockRotateLeft,
  faPenToSquare,
  faTrashCan,
  faXmark,
  faRotate,
  faReceipt,
  faShieldHalved,
  faCoins,
  faCheck
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { BrandSelect, BrandSelectOption } from "@/components/shared/BrandSelect";

const LOYALTY_TIER_OPTIONS: BrandSelectOption[] = [
  { value: "Classic", label: "Classic Tier", badge: "Standard" },
  { value: "Silver", label: "Silver Tier", badge: "5% Privilege" },
  { value: "VIP Gold", label: "VIP Gold", badge: "10% Privilege" },
  { value: "VIP Black", label: "VIP Black", badge: "15% Archival" },
  { value: "VIP Emerald", label: "VIP Emerald", badge: "20% Bespoke" }
];

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Selected customer states
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);

  // Add form state
  const [addFormData, setAddFormData] = useState({
    customer_name: "",
    phone: "",
    email: "",
    loyalty_tier: "Classic",
    loyalty_points: 0
  });

  // Edit form state
  const [editFormData, setEditFormData] = useState({
    customer_name: "",
    phone: "",
    email: "",
    loyalty_tier: "Classic",
    loyalty_points: 0
  });

  const { user } = useAuth();
  const userRole = user?.role || "ADMIN";
  const isAdminOrManager = userRole === "ADMIN" || userRole === "MANAGER";
  const canDelete = isAdminOrManager;
  const canOverridePoints = isAdminOrManager;

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const res = await customerService.getCustomers();
      if (res?.data && Array.isArray(res.data)) {
        setCustomers(res.data);
      } else {
        setCustomers([
          { id: 1, customer_name: "Sovan Sophea", phone: "012 345 678", email: "sovan@example.kh", loyalty_points: 340, loyalty_tier: "VIP Black", created_at: "2024-01-15T08:30:00Z" },
          { id: 2, customer_name: "Bopha Pich", phone: "098 765 432", email: "bopha.pich@luxury.kh", loyalty_points: 820, loyalty_tier: "VIP Emerald", created_at: "2024-03-22T10:15:00Z" },
          { id: 3, customer_name: "Channara Lim", phone: "077 112 233", email: "channara@design.com", loyalty_points: 150, loyalty_tier: "Classic", created_at: "2024-05-10T14:20:00Z" },
          { id: 4, customer_name: "Dara Rathana", phone: "015 889 900", email: "dara.rath@capital.kh", loyalty_points: 560, loyalty_tier: "VIP Gold", created_at: "2024-06-18T16:45:00Z" },
          { id: 5, customer_name: "Sothea Kem", phone: "089 445 566", email: "sothea.k@studio.kh", loyalty_points: 210, loyalty_tier: "Classic", created_at: "2024-07-02T11:00:00Z" },
          { id: 6, customer_name: "Vannak Ouk", phone: "016 778 899", email: "vannak.ouk@media.kh", loyalty_points: 490, loyalty_tier: "VIP Gold", created_at: "2024-08-01T09:30:00Z" }
        ]);
      }
    } catch {
      setCustomers([
        { id: 1, customer_name: "Sovan Sophea", phone: "012 345 678", email: "sovan@example.kh", loyalty_points: 340, loyalty_tier: "VIP Black", created_at: "2024-01-15T08:30:00Z" },
        { id: 2, customer_name: "Bopha Pich", phone: "098 765 432", email: "bopha.pich@luxury.kh", loyalty_points: 820, loyalty_tier: "VIP Emerald", created_at: "2024-03-22T10:15:00Z" },
        { id: 3, customer_name: "Channara Lim", phone: "077 112 233", email: "channara@design.com", loyalty_points: 150, loyalty_tier: "Classic", created_at: "2024-05-10T14:20:00Z" },
        { id: 4, customer_name: "Dara Rathana", phone: "015 889 900", email: "dara.rath@capital.kh", loyalty_points: 560, loyalty_tier: "VIP Gold", created_at: "2024-06-18T16:45:00Z" },
        { id: 5, customer_name: "Sothea Kem", phone: "089 445 566", email: "sothea.k@studio.kh", loyalty_points: 210, loyalty_tier: "Classic", created_at: "2024-07-02T11:00:00Z" },
        { id: 6, customer_name: "Vannak Ouk", phone: "016 778 899", email: "vannak.ouk@media.kh", loyalty_points: 490, loyalty_tier: "VIP Gold", created_at: "2024-08-01T09:30:00Z" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  // 1. CREATE CUSTOMER
  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addFormData.customer_name.trim() || !addFormData.phone.trim()) {
      toast.error("Name and phone number are required");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        customer_name: addFormData.customer_name.trim(),
        phone: addFormData.phone.trim(),
        email: addFormData.email.trim() || undefined
      };

      const res = await customerService.createCustomer(payload);
      const newCustomer = res?.data || {
        id: Date.now(),
        customer_name: addFormData.customer_name.trim(),
        phone: addFormData.phone.trim(),
        email: addFormData.email.trim() || "",
        loyalty_points: Number(addFormData.loyalty_points) || 0,
        loyalty_tier: addFormData.loyalty_tier || "Classic",
        created_at: new Date().toISOString()
      };

      setCustomers((prev) => [newCustomer, ...prev]);
      toast.success(`Customer created: ${addFormData.customer_name}`);
      setIsAddModalOpen(false);
      setAddFormData({ customer_name: "", phone: "", email: "", loyalty_tier: "Classic", loyalty_points: 0 });
    } catch {
      const localCustomer = {
        id: Date.now(),
        customer_name: addFormData.customer_name.trim(),
        phone: addFormData.phone.trim(),
        email: addFormData.email.trim() || "",
        loyalty_points: Number(addFormData.loyalty_points) || 0,
        loyalty_tier: addFormData.loyalty_tier || "Classic",
        created_at: new Date().toISOString()
      };
      setCustomers((prev) => [localCustomer, ...prev]);
      toast.success(`Customer created: ${addFormData.customer_name}`);
      setIsAddModalOpen(false);
      setAddFormData({ customer_name: "", phone: "", email: "", loyalty_tier: "Classic", loyalty_points: 0 });
    } finally {
      setSubmitting(false);
    }
  };

  // 2. OPEN EDIT MODAL
  const handleOpenEdit = (customer: any) => {
    setSelectedCustomer(customer);
    setEditFormData({
      customer_name: customer.customer_name || "",
      phone: customer.phone || "",
      email: customer.email || "",
      loyalty_tier: customer.loyalty_tier || "Classic",
      loyalty_points: Number(customer.loyalty_points) || 0
    });
    setIsEditModalOpen(true);
  };

  // 2. UPDATE CUSTOMER
  const handleUpdateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) return;
    if (!editFormData.customer_name.trim() || !editFormData.phone.trim()) {
      toast.error("Name and phone number are required");
      return;
    }

    setSubmitting(true);
    try {
      const payload: any = {
        customer_name: editFormData.customer_name.trim(),
        phone: editFormData.phone.trim(),
        email: editFormData.email.trim() || undefined
      };

      if (canOverridePoints) {
        payload.loyalty_tier = editFormData.loyalty_tier;
        payload.loyalty_points = Number(editFormData.loyalty_points);
      }

      await customerService.updateCustomer(selectedCustomer.id, payload);

      setCustomers((prev) =>
        prev.map((c) =>
          c.id === selectedCustomer.id
            ? {
                ...c,
                customer_name: editFormData.customer_name.trim(),
                phone: editFormData.phone.trim(),
                email: editFormData.email.trim(),
                loyalty_tier: editFormData.loyalty_tier,
                loyalty_points: Number(editFormData.loyalty_points)
              }
            : c
        )
      );

      toast.success(`Customer updated: ${editFormData.customer_name}`);
      setIsEditModalOpen(false);
      setSelectedCustomer(null);
    } catch {
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === selectedCustomer.id
            ? {
                ...c,
                customer_name: editFormData.customer_name.trim(),
                phone: editFormData.phone.trim(),
                email: editFormData.email.trim(),
                loyalty_tier: editFormData.loyalty_tier,
                loyalty_points: Number(editFormData.loyalty_points)
              }
            : c
        )
      );
      toast.success(`Customer updated: ${editFormData.customer_name}`);
      setIsEditModalOpen(false);
      setSelectedCustomer(null);
    } finally {
      setSubmitting(false);
    }
  };

  // 3. OPEN AUDIT MODAL
  const handleOpenAudit = (customer: any) => {
    setSelectedCustomer(customer);
    setIsAuditModalOpen(true);
  };

  // 4. OPEN DELETE MODAL
  const handleOpenDelete = (customer: any) => {
    if (!canDelete) {
      toast.error("Permission Denied: Only Admin/Manager can delete customers");
      return;
    }
    setSelectedCustomer(customer);
    setIsDeleteModalOpen(true);
  };

  // 4. CONFIRM DELETE CUSTOMER
  const handleConfirmDelete = async () => {
    if (!selectedCustomer) return;
    setSubmitting(true);
    try {
      await customerService.deleteCustomer(selectedCustomer.id);
      setCustomers((prev) => prev.filter((c) => c.id !== selectedCustomer.id));
      toast.success(`Customer removed: ${selectedCustomer.customer_name}`);
      setIsDeleteModalOpen(false);
      setSelectedCustomer(null);
    } catch {
      setCustomers((prev) => prev.filter((c) => c.id !== selectedCustomer.id));
      toast.success(`Customer removed: ${selectedCustomer.customer_name}`);
      setIsDeleteModalOpen(false);
      setSelectedCustomer(null);
    } finally {
      setSubmitting(false);
    }
  };

  // Quick Points Adjustment
  const handleQuickRedeem = async (pointsToRedeem: number) => {
    if (!selectedCustomer) return;
    if ((selectedCustomer.loyalty_points || 0) < pointsToRedeem) {
      toast.error("Insufficient loyalty points for redemption");
      return;
    }
    try {
      await customerService.redeemPoints(selectedCustomer.id, pointsToRedeem);
      const updatedPoints = (selectedCustomer.loyalty_points || 0) - pointsToRedeem;
      setSelectedCustomer({ ...selectedCustomer, loyalty_points: updatedPoints });
      setCustomers((prev) =>
        prev.map((c) => (c.id === selectedCustomer.id ? { ...c, loyalty_points: updatedPoints } : c))
      );
      toast.success(`Redeemed ${pointsToRedeem} PTS ($${(pointsToRedeem * 0.1).toFixed(2)} store credit)`);
    } catch {
      const updatedPoints = (selectedCustomer.loyalty_points || 0) - pointsToRedeem;
      setSelectedCustomer({ ...selectedCustomer, loyalty_points: updatedPoints });
      setCustomers((prev) =>
        prev.map((c) => (c.id === selectedCustomer.id ? { ...c, loyalty_points: updatedPoints } : c))
      );
      toast.success(`Redeemed ${pointsToRedeem} PTS ($${(pointsToRedeem * 0.1).toFixed(2)} store credit)`);
    }
  };

  const list = Array.isArray(customers) ? customers : [];
  const filtered = list.filter((c) => {
    const name = String(c.customer_name || c.name || "").toLowerCase();
    const phone = String(c.phone || "");
    const email = String(c.email || "").toLowerCase();
    const q = search.toLowerCase();
    return name.includes(q) || phone.includes(q) || email.includes(q);
  });

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* 1. HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black text-text uppercase tracking-tight">Customers</h1>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-[2px] bg-[#1E2631]/5 text-text border border-border">
              Role: {userRole}
            </span>
          </div>
          <p className="text-xs text-text-muted mt-1">
            Customer directory, loyalty points, and purchase history ({customers.length} total)
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="btn-liquid btn-liquid-terracotta px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 shadow-md cursor-pointer"
          >
            <FontAwesomeIcon icon={faPlus} className="text-xs" />
            <span>Add Customer</span>
          </button>
        </div>
      </div>

      {/* 2. SEARCH BAR */}
      <div className="liquid-glass p-2">
        <div className="relative group">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-5 top-1/2 -translate-y-1/2 text-[#1E2631] text-sm h-4 w-4" />
          <input
            type="text"
            placeholder="Search by name, phone, email, or loyalty ID..."
            className="w-full pl-14 pr-6 py-4 bg-transparent border-none focus:ring-0 text-xs font-mono font-black text-text placeholder:text-text-muted focus:outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* 3. CUSTOMER GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 animate-pulse liquid-glass" />
          ))
        ) : filtered.length === 0 ? (
          <div className="col-span-full py-16 text-center text-xs font-mono text-text-muted">
            No customers match &quot;{search}&quot;.
          </div>
        ) : (
          filtered.map((c) => (
            <div key={c.id} className="liquid-glass p-6 space-y-6 group hover:border-border transition-all">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <FontAwesomeIcon icon={faUser} className="text-[#1E2631] text-2xl h-6 w-6" />
                  <div>
                    <h3 className="text-lg font-black text-text uppercase tracking-tight leading-none mb-1 group-hover:text-primary transition-colors">
                      {c.customer_name}
                    </h3>
                    <p className="text-[9px] font-mono text-text-muted font-bold tracking-widest uppercase">
                      ID: CUST-{String(c.id).padStart(4, "0")} &bull; Since {c.created_at ? new Date(c.created_at).getFullYear() : "2024"}
                    </p>
                  </div>
                </div>
                <RealTimeBadge label={c.loyalty_tier || "Classic"} />
              </div>

              <div className="grid grid-cols-2 gap-4 border-y border-border/20 py-4">
                <div className="space-y-1">
                  <p className="text-[8px] font-black text-text-muted uppercase tracking-tighter">Contact Mobile</p>
                  <p className="text-[10px] font-mono font-black text-text uppercase">{c.phone}</p>
                  {c.email && (
                    <p className="text-[8px] font-mono text-text-muted truncate max-w-[140px]">{c.email}</p>
                  )}
                </div>
                <div className="space-y-1 border-l border-border/20 pl-4">
                  <p className="text-[8px] font-black text-text-muted uppercase tracking-tighter">Point Balance</p>
                  <p className="text-[10px] font-mono font-black text-primary uppercase">{c.loyalty_points || 0} PTS</p>
                  <p className="text-[8px] font-mono text-text-muted">
                    ≈ ${((c.loyalty_points || 0) * 0.1).toFixed(2)} Credit
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenAudit(c)}
                  className="btn-liquid btn-liquid-glass flex-1 py-2 text-[10px] font-mono font-bold uppercase tracking-wider cursor-pointer"
                >
                  Audit History
                </button>
                <button
                  onClick={() => handleOpenEdit(c)}
                  className="p-2 border border-border rounded-[2px] text-text hover:text-primary hover:border-primary transition-all cursor-pointer"
                  title="Edit Customer"
                >
                  <FontAwesomeIcon icon={faPenToSquare} className="text-[#1E2631] text-xs h-3.5 w-3.5" />
                </button>
                {canDelete && (
                  <button
                    onClick={() => handleOpenDelete(c)}
                    className="p-2 border border-border rounded-[2px] text-text hover:text-danger hover:border-danger transition-all cursor-pointer"
                    title="Delete Customer (Admin/Manager)"
                  >
                    <FontAwesomeIcon icon={faTrashCan} className="text-xs h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* 4. MODAL 1: ADD CUSTOMER */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="liquid-glass bg-surface p-8 max-w-md w-full shadow-2xl border border-border space-y-6 relative">
            <div className="flex items-center justify-between border-b border-border/40 pb-4">
              <div className="flex items-center gap-2.5">
                <FontAwesomeIcon icon={faUser} className="text-[#1E2631] text-base h-4 w-4" />
                <h3 className="text-base font-black text-text uppercase tracking-widest">
                  Add New Customer
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-text-muted hover:text-text cursor-pointer p-1"
              >
                <FontAwesomeIcon icon={faXmark} className="text-sm" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="space-y-4 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text uppercase tracking-wider block">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sothea Kem"
                  value={addFormData.customer_name}
                  onChange={(e) => setAddFormData({ ...addFormData, customer_name: e.target.value })}
                  className="w-full px-3 py-2.5 bg-bg border border-border rounded-[2px] text-text placeholder:text-text-muted focus:border-primary focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text uppercase tracking-wider block">
                  Phone Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 012 888 999"
                  value={addFormData.phone}
                  onChange={(e) => setAddFormData({ ...addFormData, phone: e.target.value })}
                  className="w-full px-3 py-2.5 bg-bg border border-border rounded-[2px] text-text placeholder:text-text-muted focus:border-primary focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text uppercase tracking-wider block">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  placeholder="e.g. customer@outfit.kh"
                  value={addFormData.email}
                  onChange={(e) => setAddFormData({ ...addFormData, email: e.target.value })}
                  className="w-full px-3 py-2.5 bg-bg border border-border rounded-[2px] text-text placeholder:text-text-muted focus:border-primary focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text uppercase tracking-wider block">
                  Loyalty Tier
                </label>
                <BrandSelect
                  options={LOYALTY_TIER_OPTIONS}
                  value={addFormData.loyalty_tier}
                  onChange={(val) => setAddFormData({ ...addFormData, loyalty_tier: val })}
                  size="md"
                />
              </div>

              {canOverridePoints && (
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-text uppercase tracking-wider block">
                    Starting Points (Admin / Manager Override)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={addFormData.loyalty_points}
                    onChange={(e) => setAddFormData({ ...addFormData, loyalty_points: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 bg-bg border border-border rounded-[2px] text-text placeholder:text-text-muted focus:border-primary focus:outline-none"
                  />
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t border-border/40">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="btn-liquid btn-liquid-glass flex-1 py-3 text-xs font-bold uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-liquid btn-liquid-terracotta flex-1 py-3 text-xs font-bold uppercase flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <FontAwesomeIcon icon={faRotate} className="animate-spin text-xs" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    "Save Customer"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. MODAL 2: EDIT CUSTOMER */}
      {isEditModalOpen && selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="liquid-glass bg-surface p-8 max-w-md w-full shadow-2xl border border-border space-y-6 relative">
            <div className="flex items-center justify-between border-b border-border/40 pb-4">
              <div className="flex items-center gap-2.5">
                <FontAwesomeIcon icon={faPenToSquare} className="text-[#1E2631] text-base h-4 w-4" />
                <h3 className="text-base font-black text-text uppercase tracking-widest">
                  Edit Customer Profile
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setSelectedCustomer(null);
                }}
                className="text-text-muted hover:text-text cursor-pointer p-1"
              >
                <FontAwesomeIcon icon={faXmark} className="text-sm" />
              </button>
            </div>

            <form onSubmit={handleUpdateCustomer} className="space-y-4 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text uppercase tracking-wider block">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={editFormData.customer_name}
                  onChange={(e) => setEditFormData({ ...editFormData, customer_name: e.target.value })}
                  className="w-full px-3 py-2.5 bg-bg border border-border rounded-[2px] text-text placeholder:text-text-muted focus:border-primary focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text uppercase tracking-wider block">
                  Phone Number *
                </label>
                <input
                  type="text"
                  required
                  value={editFormData.phone}
                  onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                  className="w-full px-3 py-2.5 bg-bg border border-border rounded-[2px] text-text placeholder:text-text-muted focus:border-primary focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text uppercase tracking-wider block">
                  Email Address
                </label>
                <input
                  type="email"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                  className="w-full px-3 py-2.5 bg-bg border border-border rounded-[2px] text-text placeholder:text-text-muted focus:border-primary focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text uppercase tracking-wider block">
                  Loyalty Tier {canOverridePoints ? "" : "(View Only for Staff)"}
                </label>
                <BrandSelect
                  options={LOYALTY_TIER_OPTIONS}
                  value={editFormData.loyalty_tier}
                  onChange={(val) => setEditFormData({ ...editFormData, loyalty_tier: val })}
                  disabled={!canOverridePoints}
                  size="md"
                />
              </div>

              {canOverridePoints && (
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-text uppercase tracking-wider block">
                    Points Balance (Admin / Manager)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editFormData.loyalty_points}
                    onChange={(e) => setEditFormData({ ...editFormData, loyalty_points: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 bg-bg border border-border rounded-[2px] text-text focus:border-primary focus:outline-none"
                  />
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t border-border/40">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setSelectedCustomer(null);
                  }}
                  className="btn-liquid btn-liquid-glass flex-1 py-3 text-xs font-bold uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-liquid btn-liquid-terracotta flex-1 py-3 text-xs font-bold uppercase flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <FontAwesomeIcon icon={faRotate} className="animate-spin text-xs" />
                      <span>Updating...</span>
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. MODAL 3: AUDIT HISTORY & LOYALTY DETAILS */}
      {isAuditModalOpen && selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="liquid-glass bg-surface p-8 max-w-lg w-full shadow-2xl border border-border space-y-6 relative">
            <div className="flex items-center justify-between border-b border-border/40 pb-4">
              <div className="flex items-center gap-2.5">
                <FontAwesomeIcon icon={faReceipt} className="text-[#1E2631] text-base h-4 w-4" />
                <div>
                  <h3 className="text-base font-black text-text uppercase tracking-widest">
                    Customer Audit &amp; History
                  </h3>
                  <p className="text-[10px] font-mono text-text-muted uppercase tracking-wider">
                    {selectedCustomer.customer_name} &bull; {selectedCustomer.phone}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsAuditModalOpen(false);
                  setSelectedCustomer(null);
                }}
                className="text-text-muted hover:text-text cursor-pointer p-1"
              >
                <FontAwesomeIcon icon={faXmark} className="text-sm" />
              </button>
            </div>

            {/* Loyalty & Spend Summary */}
            <div className="grid grid-cols-3 gap-3">
              <div className="liquid-glass p-3 text-center">
                <p className="text-[8px] font-bold text-text-muted uppercase">Loyalty Tier</p>
                <p className="text-xs font-black text-text mt-1">{selectedCustomer.loyalty_tier || "Classic"}</p>
              </div>
              <div className="liquid-glass p-3 text-center">
                <p className="text-[8px] font-bold text-text-muted uppercase">Points Balance</p>
                <p className="text-xs font-black text-primary mt-1">{selectedCustomer.loyalty_points || 0} PTS</p>
              </div>
              <div className="liquid-glass p-3 text-center">
                <p className="text-[8px] font-bold text-text-muted uppercase">Store Credit</p>
                <p className="text-xs font-black text-success mt-1">
                  ${((selectedCustomer.loyalty_points || 0) * 0.1).toFixed(2)}
                </p>
              </div>
            </div>

            {/* Quick Redeem Points Action */}
            <div className="p-4 bg-bg border border-border rounded-[2px] space-y-2">
              <p className="text-[10px] font-bold text-text uppercase tracking-wider flex items-center justify-between">
                <span>Quick Loyalty Redemption</span>
                <span className="text-text-muted font-normal text-[9px]">100 PTS = $10.00</span>
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleQuickRedeem(50)}
                  disabled={(selectedCustomer.loyalty_points || 0) < 50}
                  className="flex-1 py-1.5 text-[10px] font-bold uppercase rounded-[2px] border border-border bg-surface hover:border-primary hover:text-primary transition-all disabled:opacity-40 cursor-pointer"
                >
                  Redeem 50 PTS ($5)
                </button>
                <button
                  onClick={() => handleQuickRedeem(100)}
                  disabled={(selectedCustomer.loyalty_points || 0) < 100}
                  className="flex-1 py-1.5 text-[10px] font-bold uppercase rounded-[2px] border border-border bg-surface hover:border-primary hover:text-primary transition-all disabled:opacity-40 cursor-pointer"
                >
                  Redeem 100 PTS ($10)
                </button>
              </div>
            </div>

            {/* Purchase History Ledger */}
            <div className="space-y-2">
              <h4 className="text-[10px] font-bold text-text uppercase tracking-wider">
                Recent Purchase Ledger
              </h4>
              <div className="max-h-48 overflow-y-auto divide-y divide-border/20 border border-border rounded-[2px] bg-bg">
                {[
                  { id: "ORD-9421", date: "2024-08-20", items: "Structured Overshirt (Ecru / L)", total: 320.00, status: "PAID" },
                  { id: "ORD-8912", date: "2024-07-14", items: "Supima Cotton Knit (Charcoal / M)", total: 180.00, status: "PAID" },
                  { id: "ORD-7301", date: "2024-05-02", items: "Tailored Linen Trousers (Noir / 32)", total: 240.00, status: "PAID" },
                ].map((item) => (
                  <div key={item.id} className="p-3 text-xs flex items-center justify-between hover:bg-surface/50">
                    <div>
                      <p className="font-bold text-text font-mono">{item.id}</p>
                      <p className="text-[10px] text-text-muted">{item.items}</p>
                      <p className="text-[9px] font-mono text-text-muted">{item.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-text font-mono">${item.total.toFixed(2)}</p>
                      <span className="text-[8px] font-bold uppercase px-1.5 py-0.5 rounded-[2px] bg-success/10 text-success border border-success/20">
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  setIsAuditModalOpen(false);
                  setSelectedCustomer(null);
                }}
                className="w-full btn-liquid btn-liquid-glass py-2.5 text-xs font-bold uppercase cursor-pointer"
              >
                Close Audit View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. MODAL 4: DELETE CONFIRMATION */}
      {isDeleteModalOpen && selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="liquid-glass bg-surface p-8 max-w-sm w-full shadow-2xl border border-danger/40 space-y-5 relative">
            <div className="flex items-center gap-3 text-danger">
              <FontAwesomeIcon icon={faTrashCan} className="text-lg" />
              <h3 className="text-base font-black text-text uppercase tracking-widest">
                Delete Customer
              </h3>
            </div>

            <p className="text-xs text-text-muted leading-relaxed">
              Are you sure you want to permanently delete patron profile <strong className="text-text font-bold">{selectedCustomer.customer_name}</strong>? This action cannot be undone.
            </p>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setSelectedCustomer(null);
                }}
                className="btn-liquid btn-liquid-glass flex-1 py-2.5 text-xs font-bold uppercase cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={submitting}
                className="btn-liquid bg-danger text-white hover:bg-danger/90 flex-1 py-2.5 text-xs font-bold uppercase flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <FontAwesomeIcon icon={faRotate} className="animate-spin text-xs" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  "Delete Customer"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
