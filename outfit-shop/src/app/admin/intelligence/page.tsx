"use client";

import { useState, useEffect } from "react";
import { aiService } from "@/services/aiService";
import { LiquidCard } from "@/components/ui/LiquidCard";
import { RealTimeBadge } from "@/components/ui/RealTimeBadge";
import { LiquidButton } from "@/components/ui/LiquidButton";
import {
  BrainCircuit,
  Zap,
  TrendingUp,
  BarChart3,
  Sparkles,
  Target,
  RefreshCw,
  Lightbulb,
  ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function AIInsightsPage() {
  const [insights, setInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadInsights = async () => {
    setLoading(true);
    try {
      const res = await aiService.getInsights();
      setInsights(res.data);
      toast.success("OUTFIT NEURAL NETWORK SYNCED");
    } catch (err) {
      // Fallback
      setInsights([
        { id: 1, type: "OPPORTUNITY", title: "Overshirt Surge", description: "22% demand increase predicted in Paris sector." },
        { id: 2, type: "ANOMALY", title: "Stock Drift", description: "SKU-LN-902 showing 12% lower than expected velocity." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInsights();
  }, []);

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-border pb-10">
        <div className="space-y-3">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-primary/10 rounded-[3px] border border-primary/20 text-primary shadow-2xl">
                <BrainCircuit size={32} />
             </div>
             <div>
                <h1 className="text-5xl font-black text-text uppercase tracking-tighter leading-none">Intelligence</h1>
                <p className="text-[11px] font-mono text-text-muted uppercase tracking-[0.3em] mt-3">Predictive Neural Engine • Multi-Cluster Insights</p>
             </div>
          </div>
        </div>
        <div className="flex gap-4">
           <RealTimeBadge label="Engine Active" />
           <button onClick={loadInsights} className="p-3 liquid-glass hover:text-primary transition-all">
              <RefreshCw size={18} className={cn(loading && "animate-spin")} />
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Core Insights */}
        <div className="lg:col-span-2 space-y-8">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <LiquidCard className="p-10 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                    <Target size={120} strokeWidth={1} />
                 </div>
                 <h3 className="text-sm font-black text-text uppercase tracking-[0.2em] mb-8">Forecast Precision</h3>
                 <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-text font-mono tracking-tighter">98.2%</span>
                    <span className="text-xs font-black text-success uppercase">+0.4%</span>
                 </div>
              </LiquidCard>

              <LiquidCard className="p-10 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                    <Sparkles size={120} strokeWidth={1} />
                 </div>
                 <h3 className="text-sm font-black text-text uppercase tracking-[0.2em] mb-8">Asset Velocity</h3>
                 <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-text font-mono tracking-tighter">2.4x</span>
                    <span className="text-xs font-black text-text-muted uppercase font-mono">CYCLE/MO</span>
                 </div>
              </LiquidCard>
           </div>

           <div className="space-y-6">
              <h3 className="text-sm font-black text-text uppercase tracking-[0.2em] flex items-center gap-3">
                 <Lightbulb className="text-primary" size={18} /> Strategic Recommendations
              </h3>
              <div className="grid grid-cols-1 gap-6">
                 {insights.map(i => (
                    <LiquidCard key={i.id} className="p-8 border-primary/5 hover:border-primary/20 transition-all flex gap-8 items-center">
                       <div className="p-4 bg-primary/10 rounded-[3px] text-primary">
                          <Zap size={24} fill="currentColor" />
                       </div>
                       <div className="flex-1">
                          <p className="text-[9px] font-black text-primary uppercase tracking-widest mb-1">{i.type}</p>
                          <h4 className="text-lg font-black text-text uppercase tracking-tight">{i.title}</h4>
                          <p className="text-xs text-text-muted mt-2 uppercase font-bold leading-relaxed">{i.description}</p>
                       </div>
                       <LiquidButton size="sm">Action</LiquidButton>
                    </LiquidCard>
                 ))}
              </div>
           </div>
        </div>

        {/* Sidebar Intel */}
        <div className="space-y-10">
           <LiquidCard className="p-8 space-y-6 bg-primary/[0.02]">
              <h3 className="text-xs font-black text-text uppercase tracking-[0.2em]">Operational Pulse</h3>
              <div className="space-y-4">
                 <div className="flex justify-between items-center py-3 border-b border-border/5">
                    <span className="text-[10px] font-black text-text-muted uppercase">Global Conversion</span>
                    <span className="text-xs font-mono font-black text-text">4.82%</span>
                 </div>
                 <div className="flex justify-between items-center py-3 border-b border-border/5">
                    <span className="text-[10px] font-black text-text-muted uppercase">Retention Index</span>
                    <span className="text-xs font-mono font-black text-text">92.0</span>
                 </div>
                 <div className="flex justify-between items-center py-3 border-b border-border/5">
                    <span className="text-[10px] font-black text-text-muted uppercase">Supply Chain Stability</span>
                    <span className="text-xs font-mono font-black text-success tracking-widest uppercase">STABLE</span>
                 </div>
              </div>
           </LiquidCard>

           <div className="text-center py-10 opacity-20 hover:opacity-100 transition-opacity p-8 border border-dashed border-border rounded-[3px]">
              <ShieldCheck className="mx-auto mb-4" size={32} />
              <p className="text-[8px] font-mono font-black text-text-muted uppercase tracking-[0.4em] leading-relaxed">
                NEURAL ENGINE ENCRYPTED • TIER 4 CLEARANCE GRANTED
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
