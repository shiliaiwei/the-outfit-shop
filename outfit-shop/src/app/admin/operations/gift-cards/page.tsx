"use client";

import { useState, useEffect, useMemo } from "react";
import { opsService } from "@/services/opsService";
import { GiftCard } from "@/types/inventory.types";
import { LiquidCard } from "@/components/ui/LiquidCard";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import {
  Plus,
  Ticket,
  Search,
  CheckCircle2,
  Trash2,
  RefreshCw,
  X,
  DollarSign,
  Copy,
  Calendar,
  Sparkles,
  CreditCard,
  UserCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function GiftCardsPage() {
  const [cards, setCards] = useState<GiftCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modals
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; code: string } | null>(null);

  // Form State
  const [issueForm, setIssueForm] = useState({
    code: `GC-OUTFIT-${Math.floor(1000 + Math.random() * 9000)}`,
    amount: "100",
    customer_name: "VIP Patron",
    expiry_date: "2027-12-31"
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await opsService.getGiftCards();
      setCards(res?.data || []);
    } catch {
      // Handled in service
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredCards = useMemo(() => {
    return cards.filter((c) => {
      const q = search.toLowerCase();
      return (
        search === "" ||
        (c.code && c.code.toLowerCase().includes(q)) ||
        (c.status && c.status.toLowerCase().includes(q)) ||
        ((c as any).customer_name && (c as any).customer_name.toLowerCase().includes(q))
      );
    });
  }, [cards, search]);

  // KPI Metrics
  const stats = useMemo(() => {
    const total = cards.length;
    const active = cards.filter((c) => c.status === "ACTIVE").length;
    const totalValue = cards.reduce((sum, c) => sum + Number(c.current_balance ?? 0), 0);
    return { total, active, totalValue };
  }, [cards]);

  // Open Issue Modal
  const handleOpenIssue = () => {
    setIssueForm({
      code: `GC-OUTFIT-${Math.floor(1000 + Math.random() * 9000)}`,
      amount: "100",
      customer_name: "VIP Patron",
      expiry_date: "2027-12-31"
    });
    setIsIssueModalOpen(true);
  };

  // Submit Issue
  const handleIssueSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(issueForm.amount) || 100;
    const payload = {
      code: issueForm.code.trim() || `GC-OUTFIT-${Math.floor(1000 + Math.random() * 9000)}`,
      amount: amt,
      initial_balance: amt,
      customer_name: issueForm.customer_name.trim() || "VIP Patron",
      expiry_date: issueForm.expiry_date || "2027-12-31"
    };

    const res = await opsService.issueGiftCard(payload);
    const created = (res as any)?.data || {
      id: Date.now(),
      ...payload,
      current_balance: amt,
      status: "ACTIVE"
    };

    setCards((prev) => [created, ...prev.filter((c) => c.id !== created.id)]);
    toast.success(`Gift Card ${payload.code} ($${amt}) issued successfully`);
    setIsIssueModalOpen(false);
  };

  // Copy Code
  const handleCopyCode = (code?: string) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    toast.success(`Copied code: ${code}`);
  };

  // Delete Confirm
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    await opsService.deleteGiftCard(deleteTarget.id);
    setCards((prev) => prev.filter((c) => c.id !== deleteTarget.id));
    toast.success(`Gift Card "${deleteTarget.code}" decommissioned`);
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* 1. HERO HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black text-text uppercase tracking-tight">Gift Card Manager</h1>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-[2px] bg-primary/10 text-primary border border-primary/20">
              VIP Credit Ledger
            </span>
          </div>
          <p className="text-xs text-text-muted mt-1">
            Issue, redeem, and track digital store credit vouchers for VIP customer patronage
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            className="btn-liquid btn-liquid-glass p-2.5 shadow-sm cursor-pointer"
            title="Refresh Cards"
          >
            <RefreshCw size={14} className={cn("text-[#1E2631]", loading && "animate-spin")} />
          </button>
          <button
            onClick={handleOpenIssue}
            className="btn-liquid btn-liquid-terracotta px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 shadow-md cursor-pointer"
          >
            <Plus size={14} />
            <span>Issue New Card</span>
          </button>
        </div>
      </div>

      {/* 2. KPI METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <LiquidCard className="p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-[3px] bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
            <Ticket size={22} />
          </div>
          <div>
            <p className="text-[10px] font-mono font-bold text-text-muted uppercase tracking-wider">Total Cards Issued</p>
            <p className="text-2xl font-black text-text font-mono mt-0.5">{stats.total}</p>
          </div>
        </LiquidCard>

        <LiquidCard className="p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-[3px] bg-success/10 text-success flex items-center justify-center flex-shrink-0">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <p className="text-[10px] font-mono font-bold text-text-muted uppercase tracking-wider">Active In-Circulation</p>
            <p className="text-2xl font-black text-text font-mono mt-0.5">{stats.active}</p>
          </div>
        </LiquidCard>

        <LiquidCard className="p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-[3px] bg-accent/10 text-accent flex items-center justify-center flex-shrink-0">
            <CreditCard size={22} />
          </div>
          <div>
            <p className="text-[10px] font-mono font-bold text-text-muted uppercase tracking-wider">Total Outstanding Credit</p>
            <p className="text-2xl font-black text-text font-mono mt-0.5">${stats.totalValue.toFixed(2)}</p>
          </div>
        </LiquidCard>
      </div>

      {/* 3. SEARCH & CONTROLS */}
      <div className="liquid-glass p-1.5 shadow-md flex items-center max-w-md">
        <div className="relative w-full flex items-center">
          <Search className="absolute left-4 text-[#1E2631] text-xs h-4 w-4" />
          <input
            type="text"
            placeholder="Search by Card Code (e.g. GC-VIP-250) or Cardholder..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2 bg-transparent text-xs font-sans text-text placeholder:text-text-muted focus:outline-none"
          />
        </div>
      </div>

      {/* 4. GIFT CARDS TABLE */}
      <div className="liquid-glass border border-border shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg/40 border-b border-border text-[10px] font-mono font-bold uppercase tracking-wider text-text-muted">
                <th className="px-6 py-3.5">Card Identifier</th>
                <th className="px-6 py-3.5">Patron / Recipient</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Initial Credit</th>
                <th className="px-6 py-3.5">Live Balance</th>
                <th className="px-6 py-3.5">Expiry Date</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-xs">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={7} className="px-6 py-4">
                      <div className="h-5 bg-white/20 rounded w-full" />
                    </td>
                  </tr>
                ))
              ) : filteredCards.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-text-muted italic">
                    No gift cards registered. Click &quot;Issue New Card&quot; above.
                  </td>
                </tr>
              ) : (
                filteredCards.map((c) => (
                  <tr key={c.id} className="hover:bg-bg/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Ticket size={15} className="text-primary flex-shrink-0" />
                        <button
                          onClick={() => handleCopyCode(c.code)}
                          className="font-mono font-bold text-text hover:text-primary select-all uppercase flex items-center gap-1 cursor-pointer"
                          title="Click to copy"
                        >
                          <span>{c.code}</span>
                          <Copy size={11} className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-text uppercase text-xs">
                        {(c as any).customer_name || "VIP Patron"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <CardStatusBadge status={c.status} />
                    </td>
                    <td className="px-6 py-4 font-mono text-text-muted">
                      ${Number(c.initial_balance ?? 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 font-mono font-black text-sm text-text">
                      ${Number(c.current_balance ?? 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 font-mono text-text-muted text-[11px]">
                      {c.expiry_date ? new Date(c.expiry_date).toLocaleDateString() : "2027-12-31"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setDeleteTarget({ id: Number(c.id), code: c.code || "Gift Card" })}
                        className="p-1.5 text-text-muted hover:text-danger transition-colors cursor-pointer"
                        title="Decommission Card"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. ISSUE NEW CARD MODAL */}
      {isIssueModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="liquid-glass w-full max-w-md p-6 sm:p-8 space-y-5 shadow-2xl border border-border">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-terracotta" />
                <h2 className="text-base font-bold text-text uppercase tracking-tight">
                  Issue Digital Gift Card
                </h2>
              </div>
              <button onClick={() => setIsIssueModalOpen(false)} className="text-text-muted hover:text-text cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleIssueSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] font-bold uppercase text-text-muted mb-1">
                  Card Identifier Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={issueForm.code}
                    onChange={(e) => setIssueForm({ ...issueForm, code: e.target.value })}
                    className="w-full bg-bg/50 border border-border px-3 py-2 text-text text-xs font-mono uppercase focus:outline-none focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setIssueForm({
                        ...issueForm,
                        code: `GC-OUTFIT-${Math.floor(1000 + Math.random() * 9000)}`
                      })
                    }
                    className="btn-liquid btn-liquid-glass px-3 py-2 text-[10px] font-mono font-bold uppercase whitespace-nowrap cursor-pointer"
                  >
                    Generate
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-text-muted mb-1">
                  Patron / Recipient Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sovan Sophea (VIP Emerald)"
                  value={issueForm.customer_name}
                  onChange={(e) => setIssueForm({ ...issueForm, customer_name: e.target.value })}
                  className="w-full bg-bg/50 border border-border px-3 py-2 text-text text-xs focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-text-muted mb-1">
                  Initial Stored Credit (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono font-bold text-text-muted">$</span>
                  <input
                    type="number"
                    step="5"
                    required
                    value={issueForm.amount}
                    onChange={(e) => setIssueForm({ ...issueForm, amount: e.target.value })}
                    className="w-full pl-7 pr-3 py-2 bg-bg/50 border border-border text-text text-xs font-mono font-bold focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="flex gap-2 mt-2">
                  {["50", "100", "250", "500"].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setIssueForm({ ...issueForm, amount: val })}
                      className="px-2.5 py-1 bg-bg border border-border text-[10px] font-mono font-bold uppercase hover:border-primary cursor-pointer text-text rounded-[2px]"
                    >
                      ${val}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-text-muted mb-1">
                  Expiry Date
                </label>
                <input
                  type="date"
                  value={issueForm.expiry_date}
                  onChange={(e) => setIssueForm({ ...issueForm, expiry_date: e.target.value })}
                  className="w-full bg-bg/50 border border-border px-3 py-2 text-text text-xs font-mono focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border/40">
                <button
                  type="button"
                  onClick={() => setIsIssueModalOpen(false)}
                  className="btn-liquid btn-liquid-glass px-4 py-2 text-xs font-mono font-bold uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-liquid btn-liquid-terracotta px-5 py-2 text-xs font-mono font-bold uppercase cursor-pointer"
                >
                  Issue Credit Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. DELETE CONFIRMATION MODAL */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Decommission Gift Card"
        description={`Are you sure you want to deactivate and decommission the card "${deleteTarget?.code}"? Outstanding balances will no longer be redeemable at checkout.`}
        confirmLabel="Decommission"
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteTarget(null)}
        variant="danger"
      />
    </div>
  );
}

function CardStatusBadge({ status }: { status?: string }) {
  const s = status || "ACTIVE";
  const styles: any = {
    ACTIVE: "bg-success/10 text-success border-success/20",
    REDEEMED: "bg-accent/10 text-accent border-accent/20",
    EXPIRED: "bg-danger/10 text-danger border-danger/20",
  };

  return (
    <span
      className={cn(
        "px-2.5 py-0.5 rounded-[2px] text-[9px] font-mono font-bold border uppercase tracking-wider inline-flex items-center gap-1",
        styles[s] || "bg-bg text-text-muted border-border"
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          s === "ACTIVE" ? "bg-success" : s === "REDEEMED" ? "bg-accent" : "bg-danger"
        )}
      />
      <span>{s}</span>
    </span>
  );
}
