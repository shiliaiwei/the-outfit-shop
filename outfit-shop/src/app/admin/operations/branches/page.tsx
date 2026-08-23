"use client";

import { useState, useEffect } from "react";
import { opsService } from "@/services/opsService";
import { Branch } from "@/types/inventory.types";
import { Plus, Search, MapPin, Phone, Building2, MoreVertical, Edit2, Trash2, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BranchesPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await opsService.getBranches();
        setBranches(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text uppercase tracking-tight">Flagship Registry</h1>
          <p className="text-text-muted text-sm mt-1">Manage global salon locations and warehouse hubs</p>
        </div>
        <button className="flex items-center gap-2 rounded-btn bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 transition-all">
          <Plus size={18} /> New Location
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-48 animate-pulse rounded-card border border-border bg-surface"></div>
          ))
        ) : branches.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-surface rounded-card border border-border">
            <Building2 size={48} className="mx-auto text-text-muted opacity-20 mb-4" />
            <p className="text-text-muted font-mono uppercase tracking-widest">No branches registered</p>
          </div>
        ) : (
          branches.map((b) => (
            <div key={b.id} className="rounded-card border border-border bg-surface p-6 shadow-sm hover:border-primary/30 transition-all flex flex-col justify-between group">
               <div>
                  <div className="flex items-start justify-between mb-4">
                     <div className="p-3 bg-bg rounded-[2px] text-primary border border-border">
                        <Building2 size={24} />
                     </div>
                     <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 text-text-muted hover:text-primary"><Edit2 size={14} /></button>
                        <button className="p-1.5 text-text-muted hover:text-danger"><Trash2 size={14} /></button>
                     </div>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-black text-text uppercase tracking-tight">{b.branch_name}</h3>
                    <span className="text-[10px] font-mono text-primary font-bold">#{b.branch_code}</span>
                  </div>
                  <div className="space-y-2 mt-4">
                    <div className="flex items-start gap-2 text-xs text-text-muted">
                      <MapPin size={14} className="shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{b.address}, {b.city}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-text-muted">
                      <Phone size={14} className="shrink-0" />
                      <span className="font-mono">{b.phone}</span>
                    </div>
                  </div>
               </div>

               <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[10px] font-black text-success uppercase tracking-widest">
                    <div className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                    Operational
                  </div>
                  <button className="text-[10px] font-black uppercase text-primary hover:underline flex items-center gap-1">
                    Manage Stock <Globe size={10} />
                  </button>
               </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
