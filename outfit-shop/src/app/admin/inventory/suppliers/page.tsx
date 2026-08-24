"use client";

import { useState, useEffect } from "react";
import { inventoryDeepService } from "@/services/inventoryDeep";
import { RealTimeBadge } from "@/components/ui/RealTimeBadge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStore,
  faPlus,
  faLocationDot,
  faPhone,
  faEnvelope,
  faArrowUpRightFromSquare,
  faShieldHalved,
  faArrowTrendUp,
  faRotate,
  faXmark
} from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    supplier_name: "",
    contact_name: "",
    phone: "",
    email: "",
    address: ""
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await inventoryDeepService.getSuppliers();
      if (res?.data && Array.isArray(res.data)) {
        setSuppliers(res.data);
      } else {
        setSuppliers([
          { id: 1, supplier_name: "Global Textiles", contact_name: "John Mill", phone: "+44 20 7946 0958", email: "orders@globaltex.com", address: "London, UK" },
          { id: 2, supplier_name: "Normandy Flax Co", contact_name: "Marc Pierre", phone: "+33 1 42 68 53 00", email: "flax@normandy.fr", address: "Normandy, FR" }
        ]);
      }
    } catch {
      setSuppliers([
        { id: 1, supplier_name: "Global Textiles", contact_name: "John Mill", phone: "+44 20 7946 0958", email: "orders@globaltex.com", address: "London, UK" },
        { id: 2, supplier_name: "Normandy Flax Co", contact_name: "Marc Pierre", phone: "+33 1 42 68 53 00", email: "flax@normandy.fr", address: "Normandy, FR" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRegisterVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.supplier_name.trim()) {
      toast.error("Vendor name is required");
      return;
    }

    setSubmitting(true);
    try {
      const newVendor = {
        supplier_name: formData.supplier_name.trim(),
        contact_name: formData.contact_name.trim() || "Account Rep",
        phone: formData.phone.trim() || "N/A",
        email: formData.email.trim() || "orders@vendor.com",
        address: formData.address.trim() || "Global Hub"
      };

      const res = await inventoryDeepService.createSupplier(newVendor);
      const created = (res as any)?.data || { id: Date.now(), ...newVendor };
      setSuppliers((prev) => [created, ...prev.filter(s => s.id !== created.id)]);
      toast.success(`Vendor Registered: ${formData.supplier_name}`);
      setIsModalOpen(false);
      setFormData({ supplier_name: "", contact_name: "", phone: "", email: "", address: "" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6 border-b border-border pb-6 sm:pb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-text uppercase tracking-tight">Suppliers</h1>
          <p className="text-xs text-text-muted mt-1">
            Supplier directory and vendor contacts ({suppliers.length} total)
          </p>
        </div>
        <div className="flex items-center gap-3">
           <button
             onClick={() => setIsModalOpen(true)}
             className="btn-liquid btn-liquid-terracotta px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 shadow-md cursor-pointer"
           >
              <FontAwesomeIcon icon={faPlus} className="text-xs" />
              <span>Add Supplier</span>
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 animate-pulse liquid-glass" />
          ))
        ) : (
          suppliers.map(s => (
            <div key={s.id} className="liquid-glass p-5 sm:p-7 space-y-5 sm:space-y-6 group hover:border-border transition-all">
               <div className="flex justify-between items-start">
                  <div className="space-y-1">
                     <p className="text-[9px] font-mono font-black text-primary uppercase tracking-widest">ID: VEND-{String(s.id).padStart(4, '0')}</p>
                     <h3 className="text-lg sm:text-xl font-black text-text uppercase tracking-tight group-hover:text-primary transition-colors">{s.supplier_name}</h3>
                  </div>
                  <FontAwesomeIcon icon={faShieldHalved} className="text-[#1E2631] text-sm h-4 w-4" />
               </div>

               <div className="space-y-2.5 sm:space-y-3">
                  <div className="flex items-center gap-3 text-xs text-text/80 font-bold uppercase tracking-tight">
                     <FontAwesomeIcon icon={faLocationDot} className="text-[#1E2631] text-xs h-3.5 w-3.5 shrink-0" /> <span className="truncate">{s.address}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-text/80 font-bold uppercase tracking-tight">
                     <FontAwesomeIcon icon={faPhone} className="text-[#1E2631] text-xs h-3.5 w-3.5 shrink-0" /> <span>{s.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-text/80 font-bold uppercase tracking-tight">
                     <FontAwesomeIcon icon={faEnvelope} className="text-[#1E2631] text-xs h-3.5 w-3.5 shrink-0" /> <span className="truncate">{s.email}</span>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4 pt-4 sm:pt-6 border-t border-border/20">
                  <div className="space-y-1">
                     <p className="text-[8px] font-black text-text-muted uppercase tracking-tighter">Performance</p>
                     <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faArrowTrendUp} className="text-[#1E2631] text-xs h-3 w-3" />
                        <span className="text-[10px] font-mono font-black text-text">98.2%</span>
                     </div>
                  </div>
                  <div className="text-right">
                     <button
                       onClick={() => toast.info(`Accessing catalog for ${s.supplier_name}`)}
                       className="btn-liquid btn-liquid-glass px-3 py-1.5 text-[10px] font-mono font-bold uppercase flex items-center gap-1.5 ml-auto cursor-pointer"
                     >
                        <span>Catalog</span>
                        <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-[10px]" />
                     </button>
                  </div>
               </div>
            </div>
          ))
        )}
      </div>

      {/* REGISTRATION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="liquid-glass bg-surface p-8 max-w-md w-full shadow-2xl border border-border space-y-6 relative">
            <div className="flex items-center justify-between border-b border-border/40 pb-4">
              <div className="flex items-center gap-2.5">
                <FontAwesomeIcon icon={faStore} className="text-[#1E2631] text-base h-4 w-4" />
                <h3 className="text-base font-black text-text uppercase tracking-widest">
                  Add Supplier
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-text-muted hover:text-text cursor-pointer p-1"
              >
                <FontAwesomeIcon icon={faXmark} className="text-sm" />
              </button>
            </div>

            <form onSubmit={handleRegisterVendor} className="space-y-4 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text uppercase tracking-wider block">
                  Supplier / Company Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Normandy Linen Mills"
                  value={formData.supplier_name}
                  onChange={(e) => setFormData({ ...formData, supplier_name: e.target.value })}
                  className="w-full px-3 py-2.5 bg-bg border border-border rounded-[2px] text-text placeholder:text-text-muted focus:border-primary focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text uppercase tracking-wider block">
                  Contact Person
                </label>
                <input
                  type="text"
                  placeholder="e.g. Pierre Dubois"
                  value={formData.contact_name}
                  onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                  className="w-full px-3 py-2.5 bg-bg border border-border rounded-[2px] text-text placeholder:text-text-muted focus:border-primary focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text uppercase tracking-wider block">
                  Phone Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. +33 1 42 68 53 00"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2.5 bg-bg border border-border rounded-[2px] text-text placeholder:text-text-muted focus:border-primary focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text uppercase tracking-wider block">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="e.g. procurement@normandy.fr"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2.5 bg-bg border border-border rounded-[2px] text-text placeholder:text-text-muted focus:border-primary focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-text uppercase tracking-wider block">
                  Address / Headquarters
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rouen, Normandy, FR"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2.5 bg-bg border border-border rounded-[2px] text-text placeholder:text-text-muted focus:border-primary focus:outline-none"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-border/40">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
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
                    "Save Supplier"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
