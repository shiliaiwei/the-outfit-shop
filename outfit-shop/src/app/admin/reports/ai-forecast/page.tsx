"use client";

import { ReportCard } from "@/components/admin/ReportCard";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { BrainCircuit, Sparkles, TrendingUp, Target } from "lucide-react";
import { cn } from "@/lib/utils";

const forecastData = [
  { date: "Oct 26", actual: 42000, predicted: 43500 },
  { date: "Nov 26", actual: 48000, predicted: 47000 },
  { date: "Dec 26", actual: null, predicted: 62000 },
  { date: "Jan 27", actual: null, predicted: 45000 },
  { date: "Feb 27", actual: null, predicted: 41000 },
  { date: "Mar 27", actual: null, predicted: 54000 },
];

export default function AIForecastReport() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text uppercase tracking-tight flex items-center gap-3">
             <BrainCircuit className="text-primary" />
             AI Sales Forecasting
          </h1>
          <p className="text-text-muted text-sm mt-1">Deep-learning projections based on multi-year seasonal patterns</p>
        </div>
        <button className="rounded-md border border-border bg-surface px-4 py-2 text-xs font-black uppercase text-text hover:bg-bg transition-all">
          Retrain Neural Network
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <ReportCard
          title="Predicted Q4 GMV"
          value="$152,500.00"
          change={14.8}
          icon={TrendingUp}
          subtitle="Confidence: 91.2%"
        />
        <ReportCard
          title="Forecast Accuracy"
          value="96.4%"
          icon={Target}
          subtitle="Last 90 days variance"
        />
        <ReportCard
          title="Growth Drift"
          value="+4.2%"
          change={1.2}
          icon={Sparkles}
          subtitle="Above seasonal baseline"
        />
        <ReportCard
          title="Next Peak Day"
          value="Dec 14"
          subtitle="Winter Solstice Drop"
        />
      </div>

      <div className="rounded-card border border-border bg-surface p-6 shadow-sm">
        <h3 className="text-sm font-black text-text uppercase tracking-widest mb-8">Long-term Revenue Projection</h3>
        <div className="h-[450px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={forecastData}>
              <defs>
                <linearGradient id="colorPred" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'var(--text-muted)', fontSize: 10, fontWeight: 700 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'var(--text-muted)', fontSize: 10, fontWeight: 700 }}
              />
              <Tooltip
                contentStyle={{
                    backgroundColor: 'var(--surface)',
                    borderColor: 'var(--border)',
                    borderRadius: 'var(--radius-badge)',
                    fontSize: '10px',
                    fontWeight: 800
                }}
              />
              <Area
                type="monotone"
                dataKey="actual"
                stroke="var(--primary)"
                strokeWidth={3}
                fillOpacity={0}
                name="Actual Revenue"
              />
              <Area
                type="monotone"
                dataKey="predicted"
                stroke="var(--primary)"
                strokeWidth={2}
                strokeDasharray="5 5"
                fillOpacity={1}
                fill="url(#colorPred)"
                name="AI Prediction"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
