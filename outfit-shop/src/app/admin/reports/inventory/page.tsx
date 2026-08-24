"use client";

import { useState, useEffect } from "react";
import { reportService } from "@/services/reportService";
import { LiquidCard } from "@/components/ui/LiquidCard";
import { LiquidButton } from "@/components/ui/LiquidButton";
import { RealTimeBadge } from "@/components/ui/RealTimeBadge";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar
} from "recharts";
import { Box, Package, ShieldCheck, Download, RefreshCw, BarChart3, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const COLORS = ['var(--primary)', 'var(--accent)', 'var(--success)', 'var(--warning)'];

export default function InventoryReportPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  const stockData = [
    { name: 'Overshirts', value: 420 },
    { name: 'Knits', value: 310 },
    { name: 'Trousers', value: 280 },
    { name: 'Accs', value: 140 },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-border pb-10">
        <div className="space-y-3">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-primary/10 rounded-[3px] border border-primary/20 text-primary shadow-2xl">
                <Box size={32} />
             </div>
             <div>
                <h1 className="text-5xl font-black text-text uppercase tracking-tighter leading-none">Stock Valuation</h1>
                <p className="text-[11px] font-mono text-text-muted uppercase tracking-[0.3em] mt-3">Inventory Maturity • Asset Distribution Analytics</p>
             </div>
          </div>
        </div>
        <div className="flex gap-4">
           <LiquidButton variant="glass" onClick={() => toast.info("Asset Inventory Exported")}>
              <Download size={16} className="mr-2" /> Ledger Export
           </LiquidButton>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <LiquidCard className="p-12 h-[550px] flex flex-col">
           <h3 className="text-xl font-black text-text uppercase tracking-[0.2em] mb-12">Asset Distribution</h3>
           <div className="flex-1 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart className="outline-none focus:outline-none select-none">
                  <Pie
                    data={stockData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={140}
                    paddingAngle={8}
                    dataKey="value"
                    animationDuration={1500}
                    className="outline-none focus:outline-none cursor-pointer"
                  >
                    {stockData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        stroke="var(--surface)"
                        strokeWidth={4}
                        className="outline-none focus:outline-none"
                        tabIndex={-1}
                      />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '3px', fontWeight: 900, fontSize: '10px' }} />
                  <Legend verticalAlign="bottom" height={36} formatter={(value) => <span className="text-[10px] font-black uppercase text-text-muted tracking-widest">{value}</span>} />
                </PieChart>
              </ResponsiveContainer>
           </div>
        </LiquidCard>

        <div className="space-y-8">
           <LiquidCard className="p-10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-10 opacity-[0.03] text-primary group-hover:opacity-[0.08] transition-opacity">
                 <Package size={120} strokeWidth={1} />
              </div>
              <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] mb-4">Total Inventory Value</p>
              <h4 className="text-5xl font-black text-text font-mono tracking-tighter">$1,248,500</h4>
              <div className="mt-8 flex items-center gap-4">
                 <RealTimeBadge label="Assets Audited" />
                 <span className="text-[10px] font-mono font-bold text-success uppercase">+4.2% VALUE DRIFT</span>
              </div>
           </LiquidCard>

           <div className="grid grid-cols-2 gap-6">
              <div className="liquid-glass p-8 space-y-4">
                 <Layers size={20} className="text-primary" />
                 <p className="text-[9px] font-black text-text-muted uppercase tracking-widest leading-none">SKU Density</p>
                 <p className="text-2xl font-black text-text font-mono">142 PIECES</p>
              </div>
              <div className="liquid-glass p-8 space-y-4">
                 <ShieldCheck size={20} className="text-success" />
                 <p className="text-[9px] font-black text-text-muted uppercase tracking-widest leading-none">Loss Variance</p>
                 <p className="text-2xl font-black text-text font-mono">0.02%</p>
              </div>
           </div>

           <LiquidCard className="p-10 bg-primary/[0.02] border-primary/20">
              <div className="flex gap-6 items-center">
                 <div className="p-4 bg-primary/10 rounded-[3px] text-primary">
                    <BarChart3 size={24} />
                 </div>
                 <div className="space-y-1">
                    <h5 className="text-sm font-black text-text uppercase tracking-widest">Efficiency Protocol</h5>
                    <p className="text-xs text-text-muted font-bold uppercase leading-relaxed">System recommending 12% stock rotation from Milan to Phnom Penh hub.</p>
                 </div>
              </div>
           </LiquidCard>
        </div>
      </div>
    </div>
  );
}
