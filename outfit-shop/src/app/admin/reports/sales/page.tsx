"use client";

import { useState, useEffect } from "react";
import { reportService } from "@/services/reportService";
import { LiquidCard } from "@/components/ui/LiquidCard";
import { LiquidButton } from "@/components/ui/LiquidButton";
import { RealTimeBadge } from "@/components/ui/RealTimeBadge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line
} from "recharts";
import { TrendingUp, DollarSign, ShoppingBag, Download, RefreshCw, Filter, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function SalesReportPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await reportService.getSalesPerformance({ timeframe: "30d" });
      setData(res.data.chart);
      toast.success("Sales Analytics Reconciled");
    } catch (err) {
      toast.error("Analytics Stream Interrupted");
      // Fallback
      setData([
        { date: "Cycle 1", revenue: 4200, orders: 12 },
        { date: "Cycle 2", revenue: 3800, orders: 10 },
        { date: "Cycle 3", revenue: 5100, orders: 18 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-border pb-10">
        <div className="space-y-3">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-primary/10 rounded-[3px] border border-primary/20 text-primary shadow-2xl">
                <TrendingUp size={32} />
             </div>
             <div>
                <h1 className="text-5xl font-black text-text uppercase tracking-tighter leading-none">Sales Intelligence</h1>
                <p className="text-[11px] font-mono text-text-muted uppercase tracking-[0.3em] mt-3">Revenue Velocity • POS Fulfillment Analytics</p>
             </div>
          </div>
        </div>
        <div className="flex gap-4">
           <LiquidButton variant="glass" onClick={() => toast.info("Data Export Processing...")}>
              <Download size={16} className="mr-2" /> PDF Export
           </LiquidButton>
           <button onClick={loadData} className="p-3 liquid-glass hover:text-primary transition-all">
              <RefreshCw size={18} className={cn(loading && "animate-spin")} />
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <StatBox label="Gross GMV" value="$142,800" change="+12.5%" trend="up" icon={DollarSign} />
        <StatBox label="Auth Volume" value="1,284" change="+8.2%" trend="up" icon={ShoppingBag} />
        <StatBox label="Basket Index" value="$112.42" change="-2.1%" trend="down" icon={Filter} />
        <StatBox label="Cycle Range" value="30 DAYS" icon={Calendar} />
      </div>

      <LiquidCard className="p-12 relative overflow-hidden group shadow-2xl">
         <div className="absolute top-0 right-0 p-10 opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] transition-opacity">
            <TrendingUp size={180} strokeWidth={1} />
         </div>
         <div className="flex items-center justify-between mb-16">
            <h3 className="text-2xl font-black text-text uppercase tracking-[0.2em]">GMV Performance</h3>
            <RealTimeBadge label="LIVE RECONCILIATION" />
         </div>
         <div className="h-[450px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 10, fontWeight: 900, fontFamily: 'var(--font-mono)' }} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 10, fontWeight: 900, fontFamily: 'var(--font-mono)' }} />
                <Tooltip cursor={{ fill: 'var(--bg)', opacity: 0.5 }} contentStyle={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '3px', fontWeight: 900, fontSize: '10px' }} />
                <Bar dataKey="revenue" fill="var(--primary)" radius={[3, 3, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
         </div>
      </LiquidCard>
    </div>
  );
}

function StatBox({ label, value, change, trend, icon: Icon }: any) {
   return (
      <LiquidCard className="p-8 group hover:border-primary/20">
         <div className="flex items-center justify-between mb-8">
            <div className="p-3 bg-bg border border-border/10 rounded-[3px] text-primary">
               <Icon size={20} />
            </div>
            {change && (
               <span className={cn(
                 "text-[9px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-[2px] border",
                 trend === "up" ? "bg-success/10 text-success border-success/20" : "bg-danger/10 text-danger border-danger/20"
               )}>{change}</span>
            )}
         </div>
         <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">{label}</p>
         <h4 className="text-3xl font-black text-text font-mono mt-2 tracking-tighter">{value}</h4>
      </LiquidCard>
   );
}
