"use client";

import { useState, useEffect } from "react";
import { customerService } from "@/services/customerService";
import { LiquidCard } from "@/components/ui/LiquidCard";
import { LiquidButton } from "@/components/ui/LiquidButton";
import { RealTimeBadge } from "@/components/ui/RealTimeBadge";
import { Search, Plus, User as UserIcon, Phone, Mail, Award, History, Edit3, Trash2, Filter } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    async function load() {
      try {
        const res = await customerService.getCustomers();
        setCustomers(res.data);
      } catch (err) {
        toast.error("CRM Sync Error");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const list = Array.isArray(customers) ? customers : [];
  const filtered = list.filter(c => {
    const name = String(c.customer_name || c.name || "").toLowerCase();
    const phone = String(c.phone || "");
    const q = search.toLowerCase();
    return name.includes(q) || phone.includes(q);
  });

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8">
        <div>
          <h1 className="text-4xl font-black text-text uppercase tracking-tighter">Client Registry</h1>
          <p className="text-[10px] font-mono text-text-muted uppercase tracking-[0.3em] mt-2">Master CRM • {customers.length} Profiles Authenticated</p>
        </div>
        <div className="flex gap-3">
          <RealTimeBadge label="Database Online" />
          <LiquidButton variant="terracotta" onClick={() => toast.info("Profile Creation Locked")}>
            <Plus size={16} className="mr-2" /> New Patron
          </LiquidButton>
        </div>
      </div>

      <LiquidCard className="p-2">
        <div className="relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={18} />
          <input
            type="text"
            placeholder="AUTHENTICATE BY NAME, PHONE, OR LOYALTY ID..."
            className="w-full pl-14 pr-6 py-5 bg-transparent border-none focus:ring-0 text-xs font-mono font-black uppercase"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </LiquidCard>

      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 animate-pulse liquid-glass" />
          ))
        ) : filtered.map(c => (
          <LiquidCard key={c.id} className="p-0 overflow-hidden group">
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  <div className="h-14 w-14 liquid-glass bg-bg flex items-center justify-center text-text-muted border-border/10">
                    <UserIcon size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-text uppercase tracking-tight leading-none mb-1 group-hover:text-primary transition-colors">{c.customer_name}</h3>
                    <p className="text-[9px] font-mono text-text-muted font-bold tracking-widest uppercase">Member Since: {new Date(c.created_at).getFullYear()}</p>
                  </div>
                </div>
                <RealTimeBadge label={c.loyalty_tier || "Classic"} />
              </div>

              <div className="grid grid-cols-2 gap-4 border-y border-border/5 py-4">
                <div className="space-y-1">
                  <p className="text-[8px] font-black text-text-muted uppercase tracking-tighter">Contact Mobile</p>
                  <p className="text-[10px] font-mono font-black text-text uppercase">{c.phone}</p>
                </div>
                <div className="space-y-1 border-l border-border/5 pl-4">
                  <p className="text-[8px] font-black text-text-muted uppercase tracking-tighter">Point Balance</p>
                  <p className="text-[10px] font-mono font-black text-primary uppercase">{c.loyalty_points || 0} PTS</p>
                </div>
              </div>

              <div className="flex gap-2">
                <LiquidButton size="sm" className="flex-1">
                   Audit History
                </LiquidButton>
                <button className="p-2 bg-bg border border-border text-text-muted hover:text-primary transition-all">
                  <Edit3 size={16} />
                </button>
              </div>
            </div>
          </LiquidCard>
        ))}
      </div>
    </div>
  );
}
