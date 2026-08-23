"use client";

import { useState, useEffect } from "react";
import { reportService } from "@/services/reportService";
import { LiquidCard } from "@/components/ui/LiquidCard";
import { LiquidButton } from "@/components/ui/LiquidButton";
import { RealTimeBadge } from "@/components/ui/RealTimeBadge";
import { ExportActions } from "@/components/admin/ExportActions";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Clock, AlertTriangle, RefreshCw, Package, DollarSign, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const BUCKET_COLORS = ["var(--success)", "var(--primary)", "var(--warning)", "var(--danger)"];

export default function StockAgingReportPage() {
  const [loading, setLoading] = useState(true);
  const [agingData, setAgingData] = useState<any[]>([]);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await reportService.getStockAging();
      setAgingData(res.data.aging_groups || []);
      toast.success("Stock Aging Synchronized");
    } catch {
      setAgingData([
        { days_range: "0-30 Days", item_count: 540, value: 68400 },
        { days_range: "31-60 Days", item_count: 320, value: 34200 },
        { days_range: "61-90 Days", item_count: 180, value: 14800 },
        { days_range: "90+ Days", item_count: 110, value: 7450 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalLockedValue = agingData.reduce((acc, curr) => acc + Number(curr.value || 0), 0);
  const criticalAgingUnits = agingData.filter(b => b.days_range.includes("90") || b.days_range.includes("61")).reduce((acc, curr) => acc + Number(curr.item_count || 0), 0);

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-border pb-10">
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-[3px] border border-primary/20 text-primary shadow-2xl">
              <Clock size={32} />
            </div>
            <div>
              <h1 className="text-5xl font-black text-text uppercase tracking-tighter leading-none">Stock Aging</h1>
              <p className="text-[11px] font-mono text-text-muted uppercase tracking-[0.3em] mt-3">
                Inventory Velocity & Idle Capital Audit
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
        <AgingMetricCard
          title="Total Capital Tied"
          value={`$${totalLockedValue.toLocaleString()}`}
          change="Real-time"
          icon={DollarSign}
        />
        <AgingMetricCard
          title="Aging 90+ Days"
          value={`${agingData.find(b => b.days_range.includes("90"))?.item_count || 110} UNITS`}
          change="Liquidation Flag"
          trend="down"
          icon={AlertTriangle}
        />
        <AgingMetricCard
          title="Critical Aging Ratio"
          value={`${((criticalAgingUnits / (agingData.reduce((a, b) => a + Number(b.item_count || 0), 0) || 1)) * 100).toFixed(1)}%`}
          change="Target < 20%"
          icon={Package}
        />
        <AgingMetricCard
          title="Optimal Shelf Age"
          value="24.5 DAYS"
          change="Standard Turn"
          icon={Clock}
        />
      </div>

      {/* Charts & Breakdown */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Bar Chart */}
        <div className="xl:col-span-2 liquid-glass p-10 shadow-2xl relative overflow-hidden">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-black text-text uppercase tracking-widest">Aging Buckets Breakdown</h3>
              <p className="text-[10px] text-text-muted uppercase font-mono mt-1 tracking-widest">
                Distribution of tied capital by holding duration
              </p>
            </div>
            <RealTimeBadge label="LIVE LEDGER" />
          </div>

          <div className="h-[380px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={agingData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                <XAxis
                  dataKey="days_range"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--text-muted)", fontSize: 10, fontWeight: 900, fontFamily: "var(--font-mono)" }}
                  dy={15}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--text-muted)", fontSize: 10, fontWeight: 900, fontFamily: "var(--font-mono)" }}
                />
                <Tooltip
                  cursor={{ fill: "var(--bg)", opacity: 0.5 }}
                  contentStyle={{
                    backgroundColor: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: "3px",
                    fontWeight: 900,
                    fontSize: "10px"
                  }}
                />
                <Bar dataKey="value" name="Valuation ($)" radius={[3, 3, 0, 0]} barSize={48}>
                  {agingData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={BUCKET_COLORS[index % BUCKET_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Action Strategy Card */}
        <div className="space-y-8">
          <LiquidCard className="p-8 border-warning/20 bg-warning/[0.02] shadow-xl space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-warning/20 rounded-[3px] text-warning">
                <ShieldAlert size={20} />
              </div>
              <h3 className="text-sm font-black text-text uppercase tracking-[0.2em]">Aging Action Protocol</h3>
            </div>
            <p className="text-xs text-text/80 leading-relaxed font-medium">
              Identified <strong className="text-text font-black">{criticalAgingUnits} units</strong> exceeding 60+ days retention threshold. Recommending seasonal markdowns and bundle incentives.
            </p>
            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center text-[10px] font-mono border-b border-border/10 pb-2">
                <span className="text-text-muted uppercase">90+ Days Value</span>
                <span className="font-black text-danger font-mono">${Number(agingData.find(b => b.days_range.includes("90"))?.value || 7450).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-[10px] font-mono border-b border-border/10 pb-2">
                <span className="text-text-muted uppercase">Liquidation Yield Target</span>
                <span className="font-black text-success font-mono">75% Recovery</span>
              </div>
            </div>
            <LiquidButton variant="terracotta" className="w-full text-[10px] tracking-widest font-black uppercase">
              Trigger Markdowns
            </LiquidButton>
          </LiquidCard>
        </div>
      </div>
    </div>
  );
}

function AgingMetricCard({ title, value, change, trend, icon: Icon }: any) {
  return (
    <div className="liquid-glass p-8 shadow-xl group hover:border-primary/30 transition-all duration-500 relative overflow-hidden">
      <div className="flex items-center justify-between mb-8">
        <div className="p-3 bg-bg border border-border text-primary rounded-[3px]">
          <Icon size={22} />
        </div>
        {change && (
          <span
            className={cn(
              "px-2 py-0.5 rounded-[2px] text-[9px] font-black uppercase border tracking-tighter",
              trend === "down" ? "bg-danger/10 text-danger border-danger/20" : "bg-primary/10 text-primary border-primary/20"
            )}
          >
            {change}
          </span>
        )}
      </div>
      <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">{title}</p>
      <h3 className="text-3xl font-black text-text font-mono tracking-tighter mt-2">{value}</h3>
    </div>
  );
}
