"use client";

import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
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
  AlertTriangle
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { reportService } from "@/services/reportService";
import { monitoringService } from "@/services/monitoringService";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function DashboardPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [salesData, setSalesData] = useState<any[]>([]);

  const loadMasterData = async () => {
    setLoading(true);
    try {
      const [salesRes] = await Promise.all([
        reportService.getSalesPerformance({ timeframe: "30d" })
      ]);

      setStats(salesRes.data.summary);
      setSalesData(salesRes.data.chart);
      toast.success("OUTFIT INTELLIGENCE SYNCED");
    } catch (err) {
      console.error(err);
      // Fallback visual data
      setSalesData([
        { date: "08/17", revenue: 4200, orders: 12 },
        { date: "08/18", revenue: 3100, orders: 9 },
        { date: "08/19", revenue: 2500, orders: 7 },
        { date: "08/20", revenue: 5900, orders: 15 },
        { date: "08/21", revenue: 4900, orders: 13 },
        { date: "08/22", revenue: 6400, orders: 18 },
        { date: "08/23", revenue: 7600, orders: 21 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMasterData();
  }, []);

  const isAdmin = user?.role === "ADMIN" || user?.role === "MANAGER";

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">

      {/* 1. ROLE-ADAPTIVE HERO HEADER */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-10">
        <div className="space-y-3">
          <div className="flex items-center gap-4">
             <div className={cn(
               "p-3 rounded-[3px] border shadow-2xl",
               isAdmin ? "bg-primary/10 border-primary/20 text-primary" : "bg-accent/10 border-accent/20 text-accent"
             )}>
                {isAdmin ? <BrainCircuit size={32} /> : <Target size={32} />}
             </div>
             <div>
                <h1 className="text-5xl font-black text-text uppercase tracking-tighter leading-none">
                  {isAdmin ? "Command Hub" : "Terminal View"}
                </h1>
                <p className="text-[11px] font-mono text-text-muted uppercase tracking-[0.3em] mt-3">
                   Authenticated Operator: <span className="text-primary font-black">@{user?.username}</span> • {new Date().toLocaleTimeString()}
                </p>
             </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
           <div className="liquid-glass px-5 py-3 flex items-center gap-4">
              <div className="h-2 w-2 rounded-full bg-success animate-pulse shadow-[0_0_10px_rgba(120,140,93,0.8)]" />
              <div className="flex flex-col">
                 <span className="text-[9px] font-black text-text uppercase tracking-widest">Platform Status</span>
                 <span className="text-[10px] font-mono font-bold text-text-muted">NODE: CLUSTER-ALPHA-7</span>
              </div>
           </div>
           <button
             onClick={loadMasterData}
             className="btn-liquid btn-liquid-glass p-3.5 shadow-xl group"
           >
             <RefreshCw size={18} className={cn("group-hover:text-primary transition-colors", loading && "animate-spin")} />
           </button>
        </div>
      </div>

      {/* 2. DYNAMIC INTEL GRID (Role-Specific) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {isAdmin ? (
          <>
            <MetricCard title="Gross Income" value="$142.8K" change="+12.5%" trend="up" icon={DollarSign} loading={loading} />
            <MetricCard title="Retail Conversion" value="4.82%" change="+0.8%" trend="up" icon={Activity} loading={loading} />
            <MetricCard title="Asset Velocity" value="2.4x" change="-0.1%" trend="down" icon={Package} loading={loading} />
            <MetricCard title="Active Patronage" value="842" change="+42" trend="up" icon={Users} loading={loading} />
          </>
        ) : (
          <>
            <MetricCard title="Shift Sales" value="$4,280" change="92% of Goal" trend="up" icon={ShoppingBag} loading={loading} />
            <MetricCard title="Avg Basket" value="$185" icon={DollarSign} loading={loading} />
            <MetricCard title="Performance" value="TOP 3" icon={Award} loading={loading} />
            <MetricCard title="Shift Clock" value="06:42:10" icon={Clock} loading={loading} />
          </>
        )}
      </div>

      {/* 3. PRIMARY ANALYTICS ENGINE */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

        {/* Main Chart Card */}
        <div className="xl:col-span-2 liquid-glass p-10 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none transition-opacity group-hover:opacity-10">
             <BrainCircuit size={200} strokeWidth={1} />
          </div>

          <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
               <h3 className="text-2xl font-black text-text uppercase tracking-widest">Commercial Trajectory</h3>
               <p className="text-[10px] text-text-muted uppercase font-mono mt-2 tracking-widest">Synthesized Revenue Flow (Last 30 Operational Cycles)</p>
            </div>
            <div className="flex items-center gap-6">
               <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span className="text-[10px] font-black uppercase text-text tracking-widest">Verified Income</span>
               </div>
               <div className="h-8 w-px bg-border/20" />
               <button className="text-[10px] font-black uppercase text-primary border-b border-primary/40 hover:border-primary transition-all pb-1 tracking-widest">Download Full Dataset</button>
            </div>
          </div>

          <div className="h-[400px] w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="primaryGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="var(--border)" opacity={0.5} />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'var(--text-muted)', fontSize: 10, fontWeight: 900, fontFamily: 'var(--font-mono)' }}
                  dy={15}
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
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--primary)"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#primaryGrad)"
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Intelligence Sidebars */}
        <div className="space-y-8">
           {/* AI Prediction Portal */}
           <div className="liquid-glass p-8 border-primary/20 bg-primary/[0.03] shadow-xl relative overflow-hidden group">
              <div className="absolute -bottom-4 -right-4 text-primary opacity-[0.03] transform rotate-12 transition-transform group-hover:scale-110">
                 <Zap size={140} fill="currentColor" />
              </div>
              <div className="flex items-center gap-3 mb-6">
                 <div className="p-2 bg-primary/20 rounded-[3px] text-primary">
                    <Zap size={18} fill="currentColor" />
                 </div>
                 <h3 className="text-sm font-black text-text uppercase tracking-[0.2em]">Predictive Insight</h3>
              </div>
              <p className="text-xs text-text/80 leading-[1.8] font-medium">
                 Neural patterns indicate a <span className="text-primary font-black underline underline-offset-4 decoration-primary/40">22% SURGE</span> in <span className="text-text font-black">OVERSHIRT</span> demand. Stock optimization recommended for Paris hub.
              </p>
              <div className="mt-8 pt-6 border-t border-primary/10">
                 <button className="w-full btn-liquid btn-liquid-terracotta py-3 text-[10px] font-black uppercase tracking-[0.2em] shadow-xl">
                    Allocate Assets
                 </button>
              </div>
           </div>

           {/* Live System Alerts */}
           <div className="liquid-glass p-8 shadow-xl">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-sm font-black text-text uppercase tracking-[0.2em]">Audit Queue</h3>
                 <span className="text-[9px] font-mono font-black text-text-muted bg-bg px-2 py-1 rounded-[3px]">ACTIVE</span>
              </div>
              <div className="space-y-4">
                 <AlertCard type="danger" icon={AlertTriangle} title="Stock Breach" desc="SKU-LN-902 (0 Units)" />
                 <AlertCard type="success" icon={ShieldCheck} title="Integrity Pass" desc="Global Sync Complete" />
                 <AlertCard type="warning" icon={TrendingUp} title="Price Drift" desc="Category #1 > 2% variance" />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, change, trend, icon: Icon, loading }: any) {
  return (
    <div className="liquid-glass p-8 shadow-xl group hover:border-primary/30 transition-all duration-500 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-[0.03] transition-opacity">
         <Icon size={64} />
      </div>
      <div className="flex items-center justify-between mb-8">
        <div className="p-3 bg-bg border border-border text-primary rounded-[3px] shadow-inner">
          <Icon size={24} />
        </div>
        {change && (
          <div className={cn(
            "flex items-center gap-1.5 px-2 py-1 rounded-[3px] text-[10px] font-black uppercase tracking-tighter border",
            trend === "up" ? "bg-success/10 text-success border-success/20" : "bg-danger/10 text-danger border-danger/20"
          )}>
            {change}
            {trend === "up" ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          </div>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-[11px] font-black text-text-muted uppercase tracking-[0.2em] leading-none">{title}</p>
        <div className="pt-2">
           {loading ? (
             <div className="h-10 w-28 bg-bg animate-pulse rounded-[3px]" />
           ) : (
             <h3 className="text-3xl font-black text-text font-mono tracking-tighter leading-none">{value}</h3>
           )}
        </div>
      </div>
    </div>
  );
}

function AlertCard({ type, title, desc, icon: Icon }: any) {
  const colors = {
    danger: "text-danger bg-danger/10 border-danger/20",
    success: "text-success bg-success/10 border-success/20",
    warning: "text-warning bg-warning/10 border-warning/20",
  };

  return (
    <div className={cn("flex gap-4 items-center p-4 rounded-[3px] border shadow-sm transition-all hover:translate-x-1", (colors as any)[type])}>
       <div className="shrink-0 p-2 bg-white/20 rounded-[3px]">
          <Icon size={16} />
       </div>
       <div className="min-w-0">
          <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">{title}</p>
          <p className="text-[9px] font-mono font-bold opacity-80 uppercase truncate">{desc}</p>
       </div>
    </div>
  );
}
