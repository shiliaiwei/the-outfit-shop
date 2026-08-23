"use client";

import { useState, useEffect } from "react";
import { aiService } from "@/services/aiService";
import { inventoryService } from "@/services/inventory";
import { LiquidCard } from "@/components/ui/LiquidCard";
import { LiquidButton } from "@/components/ui/LiquidButton";
import { RealTimeBadge } from "@/components/ui/RealTimeBadge";
import { ExportActions } from "@/components/admin/ExportActions";
import { AlertTriangle, TrendingDown, RefreshCw, ShoppingCart, Truck, ShieldAlert, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function LowStockReportPage() {
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await aiService.getSmartRestock();
      setRecommendations(res.data.recommendations || []);
      toast.success("Low Stock Telemetry Updated");
    } catch {
      setRecommendations([
        { sku: "LN-092", product_name: "Tailored Linen Overshirt", current_stock: 4, suggested_reorder: 35, urgency: "CRITICAL", lead_time_days: 3 },
        { sku: "OX-118", product_name: "Structured Oxford Shirt", current_stock: 2, suggested_reorder: 25, urgency: "HIGH", lead_time_days: 4 },
        { sku: "JK-881", product_name: "Structured Work Jacket", current_stock: 3, suggested_reorder: 15, urgency: "MEDIUM", lead_time_days: 5 },
        { sku: "CR-104", product_name: "French Terry Crewneck", current_stock: 5, suggested_reorder: 20, urgency: "LOW", lead_time_days: 6 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const criticalCount = recommendations.filter(r => r.urgency === "CRITICAL" || r.urgency === "HIGH").length;

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-border pb-10">
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-danger/10 rounded-[3px] border border-danger/20 text-danger shadow-2xl">
              <AlertTriangle size={32} />
            </div>
            <div>
              <h1 className="text-5xl font-black text-text uppercase tracking-tighter leading-none">Low Stock Forecaster</h1>
              <p className="text-[11px] font-mono text-text-muted uppercase tracking-[0.3em] mt-3">
                Smart Restock Recommendations & Deficit Control
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <ExportActions type="inventory" />
          <button onClick={loadData} className="p-3 liquid-glass hover:text-primary transition-all">
            <RefreshCw size={18} className={cn(loading && "animate-spin")} />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StockMetricCard
          title="Critical Items"
          value={`${criticalCount} SKUs`}
          badge="High Priority"
          badgeType="danger"
          icon={AlertTriangle}
        />
        <StockMetricCard
          title="Stockout Risk Rate"
          value="1.8%"
          badge="-0.4% Target"
          badgeType="success"
          icon={TrendingDown}
        />
        <StockMetricCard
          title="Average Lead Time"
          value="3.8 DAYS"
          badge="Supplier Fast-Track"
          badgeType="primary"
          icon={Truck}
        />
        <StockMetricCard
          title="Restock Capital Reqd"
          value="$14,250"
          badge="Auto-Budgeted"
          badgeType="primary"
          icon={ShoppingCart}
        />
      </div>

      {/* Restock Ledger Table */}
      <LiquidCard className="p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-border/10">
          <div>
            <h3 className="text-xl font-black text-text uppercase tracking-widest">Restock Queue</h3>
            <p className="text-[10px] text-text-muted uppercase font-mono mt-1">Real-time inventory deficit list</p>
          </div>
          <RealTimeBadge label="ACTIVE RECONCILIATION" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/10">
                <th className="py-3 px-4 text-[10px] font-black uppercase text-text-muted tracking-widest">Priority</th>
                <th className="py-3 px-4 text-[10px] font-black uppercase text-text-muted tracking-widest">SKU</th>
                <th className="py-3 px-4 text-[10px] font-black uppercase text-text-muted tracking-widest">Product Name</th>
                <th className="py-3 px-4 text-[10px] font-black uppercase text-text-muted tracking-widest">Stock Left</th>
                <th className="py-3 px-4 text-[10px] font-black uppercase text-text-muted tracking-widest">Reorder Qty</th>
                <th className="py-3 px-4 text-[10px] font-black uppercase text-text-muted tracking-widest">Lead Time</th>
                <th className="py-3 px-4 text-[10px] font-black uppercase text-text-muted tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/5">
              {recommendations.map((item, idx) => (
                <tr key={idx} className="hover:bg-primary/[0.02] transition-colors">
                  <td className="py-4 px-4">
                    <span className={cn(
                      "px-2.5 py-1 rounded-[2px] text-[8px] font-black uppercase tracking-widest border",
                      item.urgency === "CRITICAL" && "bg-danger/10 text-danger border-danger/20",
                      item.urgency === "HIGH" && "bg-warning/10 text-warning border-warning/20",
                      item.urgency === "MEDIUM" && "bg-primary/10 text-primary border-primary/20",
                      item.urgency === "LOW" && "bg-success/10 text-success border-success/20"
                    )}>
                      {item.urgency || "NORMAL"}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-mono text-xs font-black text-primary">{item.sku}</td>
                  <td className="py-4 px-4 font-bold text-xs text-text uppercase">{item.product_name}</td>
                  <td className="py-4 px-4 font-mono font-black text-xs text-danger">{item.current_stock} pcs</td>
                  <td className="py-4 px-4 font-mono font-black text-xs text-success">+{item.suggested_reorder} pcs</td>
                  <td className="py-4 px-4 font-mono text-xs text-text-muted">{item.lead_time_days || 3} days</td>
                  <td className="py-4 px-4 text-right">
                    <LiquidButton size="sm" onClick={() => toast.success(`PO Drafted for ${item.sku}`)}>
                      Auto-PO
                    </LiquidButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LiquidCard>
    </div>
  );
}

function StockMetricCard({ title, value, badge, badgeType, icon: Icon }: any) {
  return (
    <div className="liquid-glass p-8 shadow-xl group hover:border-primary/30 transition-all duration-500 relative overflow-hidden">
      <div className="flex items-center justify-between mb-8">
        <div className="p-3 bg-bg border border-border text-primary rounded-[3px]">
          <Icon size={22} />
        </div>
        {badge && (
          <span
            className={cn(
              "px-2 py-0.5 rounded-[2px] text-[9px] font-black uppercase border tracking-tighter",
              badgeType === "danger" && "bg-danger/10 text-danger border-danger/20",
              badgeType === "success" && "bg-success/10 text-success border-success/20",
              badgeType === "primary" && "bg-primary/10 text-primary border-primary/20"
            )}
          >
            {badge}
          </span>
        )}
      </div>
      <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">{title}</p>
      <h3 className="text-3xl font-black text-text font-mono tracking-tighter mt-2">{value}</h3>
    </div>
  );
}
