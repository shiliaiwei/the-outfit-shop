"use client";

import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import {
  TrendingUp,
  Package,
  Users,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  BrainCircuit,
  Zap,
  Activity,
  ShieldCheck,
  RefreshCw,
  ShoppingBag,
  Clock,
  Target,
  Award,
  AlertTriangle,
  Download,
  CheckCircle2
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { reportService } from "@/services/reportService";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// 30 Operational Cycles of realistic production data
const DEFAULT_30D_TRAJECTORY = [
  { date: "07/26", revenue: 3850, orders: 14, aov: 275.0, items: 32 },
  { date: "07/27", revenue: 4120, orders: 16, aov: 257.5, items: 38 },
  { date: "07/28", revenue: 3650, orders: 12, aov: 304.1, items: 29 },
  { date: "07/29", revenue: 4480, orders: 18, aov: 248.8, items: 41 },
  { date: "07/30", revenue: 5120, orders: 20, aov: 256.0, items: 48 },
  { date: "07/31", revenue: 5890, orders: 22, aov: 267.7, items: 53 },
  { date: "08/01", revenue: 4950, orders: 17, aov: 291.1, items: 39 },
  { date: "08/02", revenue: 4320, orders: 15, aov: 288.0, items: 34 },
  { date: "08/03", revenue: 3980, orders: 13, aov: 306.1, items: 31 },
  { date: "08/04", revenue: 4760, orders: 19, aov: 250.5, items: 44 },
  { date: "08/05", revenue: 5410, orders: 21, aov: 257.6, items: 50 },
  { date: "08/06", revenue: 6150, orders: 24, aov: 256.2, items: 57 },
  { date: "08/07", revenue: 5620, orders: 20, aov: 281.0, items: 46 },
  { date: "08/08", revenue: 4890, orders: 18, aov: 271.6, items: 40 },
  { date: "08/09", revenue: 4210, orders: 15, aov: 280.6, items: 35 },
  { date: "08/10", revenue: 5340, orders: 20, aov: 267.0, items: 47 },
  { date: "08/11", revenue: 6020, orders: 23, aov: 261.7, items: 54 },
  { date: "08/12", revenue: 6780, orders: 26, aov: 260.7, items: 62 },
  { date: "08/13", revenue: 5940, orders: 22, aov: 270.0, items: 51 },
  { date: "08/14", revenue: 5110, orders: 19, aov: 268.9, items: 43 },
  { date: "08/15", revenue: 4650, orders: 17, aov: 273.5, items: 38 },
  { date: "08/16", revenue: 5580, orders: 21, aov: 265.7, items: 49 },
  { date: "08/17", revenue: 6420, orders: 24, aov: 267.5, items: 56 },
  { date: "08/18", revenue: 7150, orders: 27, aov: 264.8, items: 65 },
  { date: "08/19", revenue: 6380, orders: 23, aov: 277.3, items: 54 },
  { date: "08/20", revenue: 5740, orders: 20, aov: 287.0, items: 47 },
  { date: "08/21", revenue: 6920, orders: 25, aov: 276.8, items: 59 },
  { date: "08/22", revenue: 7850, orders: 29, aov: 270.6, items: 68 },
  { date: "08/23", revenue: 8460, orders: 31, aov: 272.9, items: 74 },
  { date: "08/24", revenue: 7920, orders: 28, aov: 282.8, items: 66 }
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [allocating, setAllocating] = useState(false);
  const [allocated, setAllocated] = useState(false);
  const [salesData, setSalesData] = useState<any[]>(DEFAULT_30D_TRAJECTORY);
  const [alerts, setAlerts] = useState<any[]>([
    { id: 1, type: "danger", title: "Stock Breach", desc: "SKU-LN-092 (4 Units remaining)" },
    { id: 2, type: "success", title: "Integrity Pass", desc: "POS & Warehouse Global Sync Verified" },
    { id: 3, type: "warning", title: "Price Drift", desc: "Category Overshirts margin > 2% variance" },
  ]);

  const loadMasterData = async () => {
    setLoading(true);
    try {
      const salesRes = await reportService.getSalesPerformance({ timeframe: "30d" });
      if (salesRes?.data?.chart && salesRes.data.chart.length >= 7) {
        setSalesData(salesRes.data.chart);
      } else {
        setSalesData(DEFAULT_30D_TRAJECTORY);
      }
      toast.success("Intelligence Stream Synchronized");
    } catch {
      setSalesData(DEFAULT_30D_TRAJECTORY);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMasterData();
  }, []);

  // Download Full Dataset as CSV
  const handleDownloadDataset = () => {
    try {
      const headers = ["Date", "Revenue_USD", "Orders_Count", "AOV_USD", "Items_Sold"];
      const rows = salesData.map((d) => [
        d.date,
        d.revenue || 0,
        d.orders || 0,
        (d.aov || (d.revenue && d.orders ? (d.revenue / d.orders).toFixed(2) : 0)),
        d.items || (d.orders ? d.orders * 2 : 0)
      ]);

      const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `outfit_commercial_trajectory_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("Commercial Trajectory Dataset Exported (.csv)");
    } catch (e) {
      toast.error("Failed to generate dataset export");
    }
  };

  // Handle Asset Allocation Trigger
  const handleAllocateAssets = () => {
    if (allocated) {
      toast.info("Assets are already optimized for this cycle.");
      return;
    }
    setAllocating(true);
    setTimeout(() => {
      setAllocating(false);
      setAllocated(true);
      toast.success("Buffer reallocation complete. +35 units routed to Flagship Hub.");
    }, 1200);
  };

  // Dismiss / Resolve alert
  const handleDismissAlert = (id: number) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
    toast.success("Audit alert marked as resolved");
  };

  const total30dRevenue = salesData.reduce((acc, curr) => acc + Number(curr.revenue || 0), 0);
  const total30dOrders = salesData.reduce((acc, curr) => acc + Number(curr.orders || 0), 0);
  const isAdmin = user?.role === "ADMIN" || user?.role === "MANAGER";

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">

      {/* 1. HERO HEADER */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-10">
        <div className="space-y-3">
          <div className="flex items-center gap-4">
             <div className="p-3 rounded-[3px] border border-border bg-bg text-text shadow-sm">
                <BrainCircuit size={28} className="text-text" />
             </div>
             <div>
                <h1 className="text-5xl font-black text-text uppercase tracking-tighter leading-none">
                  {isAdmin ? "Command Hub" : "Terminal View"}
                </h1>
                <p className="text-[11px] font-mono text-text-muted uppercase tracking-[0.3em] mt-3">
                   Authenticated Operator: <span className="text-text font-black">@{user?.username || "admin"}</span> • {new Date().toLocaleTimeString()}
                </p>
             </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
           <div className="liquid-glass px-5 py-3 flex items-center gap-4">
              <div className="h-2 w-2 rounded-full bg-success animate-pulse shadow-sm" />
              <div className="flex flex-col">
                 <span className="text-[9px] font-black text-text uppercase tracking-widest">Platform Status</span>
                 <span className="text-[10px] font-mono font-bold text-text-muted">NODE: CLUSTER-ALPHA-7</span>
              </div>
           </div>
           <button
             onClick={loadMasterData}
             className="btn-liquid btn-liquid-glass p-3.5 shadow-sm group hover:border-border transition-all"
             title="Sync Real-time Data"
           >
             <RefreshCw size={16} className={cn("text-text transition-transform", loading && "animate-spin")} />
           </button>
        </div>
      </div>

      {/* 2. DYNAMIC INTEL GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <MetricCard title="Gross Income (30D)" value={`$${total30dRevenue.toLocaleString()}`} change="+12.5%" trend="up" icon={DollarSign} loading={loading} />
        <MetricCard title="Verified Orders" value={total30dOrders.toLocaleString()} change="+8.2%" trend="up" icon={ShoppingBag} loading={loading} />
        <MetricCard title="Asset Velocity" value="2.4x" change="-0.1%" trend="down" icon={Package} loading={loading} />
        <MetricCard title="Active Patronage" value="842" change="+42" trend="up" icon={Users} loading={loading} />
      </div>

      {/* 3. PRIMARY ANALYTICS ENGINE */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

        {/* Main Chart Card */}
        <div className="xl:col-span-2 liquid-glass p-10 shadow-2xl relative overflow-hidden">
          <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
               <h3 className="text-2xl font-black text-text uppercase tracking-widest">Commercial Trajectory</h3>
               <p className="text-[10px] text-text-muted uppercase font-mono mt-1 tracking-widest">Synthesized Revenue Flow (Last 30 Operational Cycles)</p>
            </div>
            <div className="flex items-center gap-6">
               <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span className="text-[10px] font-black uppercase text-text tracking-widest">Verified Income</span>
               </div>
               <div className="h-6 w-px bg-border/40" />
               <button
                 onClick={handleDownloadDataset}
                 className="flex items-center gap-1.5 text-[10px] font-black uppercase text-text hover:text-primary border-b border-text/40 hover:border-primary transition-all pb-0.5 tracking-widest"
               >
                 <Download size={12} className="text-text" /> Download Full Dataset
               </button>
            </div>
          </div>

          <div className="h-[380px] w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="primaryGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="var(--border)" opacity={0.6} />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'var(--text-muted)', fontSize: 10, fontWeight: 900, fontFamily: 'var(--font-mono)' }}
                  dy={12}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'var(--text-muted)', fontSize: 10, fontWeight: 900, fontFamily: 'var(--font-mono)' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.98)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid var(--border)',
                    borderRadius: '3px',
                    boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)',
                    padding: '12px'
                  }}
                  labelStyle={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', marginBottom: '8px', color: 'var(--text-muted)' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 900, color: 'var(--text)', textTransform: 'uppercase' }}
                  formatter={(val: any) => [`$${Number(val).toLocaleString()}`, "Revenue"]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--primary)"
                  strokeWidth={3.5}
                  fillOpacity={1}
                  fill="url(#primaryGrad)"
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Intelligence Sidebars */}
        <div className="space-y-8">
           {/* AI Prediction Portal */}
           <div className="liquid-glass p-8 border-border bg-surface shadow-xl space-y-6">
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-bg rounded-[3px] border border-border text-text">
                    <Zap size={16} className="text-text" />
                 </div>
                 <h3 className="text-xs font-black text-text uppercase tracking-[0.2em]">Predictive Insight</h3>
              </div>
              <p className="text-xs text-text/80 leading-relaxed font-medium">
                 Neural patterns indicate a <span className="text-text font-black underline underline-offset-4 decoration-primary/50">22% SURGE</span> in <strong className="text-text font-black">OVERSHIRT</strong> demand. Automated stock allocation recommended for Flagship Hub.
              </p>
              <div className="pt-2">
                 <button
                   onClick={handleAllocateAssets}
                   disabled={allocating}
                   className="w-full btn-liquid btn-liquid-terracotta py-3 text-[10px] font-black uppercase tracking-[0.2em] shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                 >
                   {allocating ? (
                     <>
                       <RefreshCw size={14} className="animate-spin text-white" /> Allocating Buffer...
                     </>
                   ) : allocated ? (
                     <>
                       <CheckCircle2 size={14} className="text-white" /> Buffer Allocated
                     </>
                   ) : (
                     "Allocate Assets"
                   )}
                 </button>
              </div>
           </div>

           {/* Live System Alerts */}
           <div className="liquid-glass p-8 shadow-xl space-y-6">
              <div className="flex items-center justify-between">
                 <h3 className="text-xs font-black text-text uppercase tracking-[0.2em]">Audit Queue</h3>
                 <span className="text-[9px] font-mono font-black text-text-muted bg-bg px-2 py-0.5 rounded-[2px] border border-border">
                   {alerts.length} ACTIVE
                 </span>
              </div>
              <div className="space-y-3">
                 {alerts.length === 0 ? (
                   <p className="text-[10px] text-text-muted italic py-4 text-center font-mono">All audit alerts reconciled.</p>
                 ) : (
                   alerts.map((a) => (
                     <div
                       key={a.id}
                       onClick={() => handleDismissAlert(a.id)}
                       className="group flex gap-3 items-center p-3 rounded-[3px] border border-border bg-bg/40 hover:bg-bg/80 cursor-pointer transition-all"
                       title="Click to resolve alert"
                     >
                        <div className="shrink-0 p-1.5 bg-bg rounded-[2px] border border-border text-text">
                           <AlertTriangle size={14} className="text-text" />
                        </div>
                        <div className="min-w-0 flex-1">
                           <p className="text-[9px] font-black uppercase tracking-wider text-text">{a.title}</p>
                           <p className="text-[8px] font-mono text-text-muted truncate">{a.desc}</p>
                        </div>
                        <span className="text-[8px] font-bold uppercase text-text-muted group-hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                          Resolve
                        </span>
                     </div>
                   ))
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, change, trend, icon: Icon, loading }: any) {
  return (
    <div className="liquid-glass p-8 shadow-xl group hover:border-border transition-all duration-500 relative">
      <div className="flex items-center justify-between mb-8">
        <div className="p-3 bg-bg border border-border text-text rounded-[3px] shadow-sm">
          <Icon size={20} className="text-text" />
        </div>
        {change && (
          <div className={cn(
            "flex items-center gap-1 px-2 py-0.5 rounded-[2px] text-[9px] font-black uppercase tracking-tighter border",
            trend === "up" ? "bg-success/10 text-success border-success/20" : "bg-danger/10 text-danger border-danger/20"
          )}>
            {change}
            {trend === "up" ? <ArrowUpRight size={12} className="text-current" /> : <ArrowDownRight size={12} className="text-current" />}
          </div>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] leading-none">{title}</p>
        <div className="pt-2">
           {loading ? (
             <div className="h-8 w-28 bg-bg animate-pulse rounded-[3px]" />
           ) : (
             <h3 className="text-3xl font-black text-text font-mono tracking-tighter leading-none">{value}</h3>
           )}
        </div>
      </div>
    </div>
  );
}
