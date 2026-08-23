"use client";

import { ReportCard } from "@/components/admin/ReportCard";
import { ExportActions } from "@/components/admin/ExportActions";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";
import { TrendingUp, DollarSign, Percent, PieChart } from "lucide-react";
import { cn } from "@/lib/utils";

const profitData = [
  { category: "Overshirts", revenue: 12400, cost: 4800, margin: 61 },
  { category: "Knits", revenue: 8900, cost: 3200, margin: 64 },
  { category: "Trousers", revenue: 9600, cost: 4100, margin: 57 },
  { category: "Accessories", revenue: 4200, cost: 1200, margin: 71 },
];

export default function ProfitMarginReport() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text uppercase tracking-tight">Profit Margin Analysis</h1>
          <p className="text-text-muted text-sm mt-1">Breakdown of gross profit and cost efficiency by product line</p>
        </div>
        <ExportActions type="sales" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <ReportCard
          title="Gross Profit"
          value="$21,800.00"
          change={8.4}
          icon={DollarSign}
          subtitle="Net after product cost"
        />
        <ReportCard
          title="Avg Margin %"
          value="63.2%"
          change={1.5}
          icon={Percent}
          subtitle="All categories combined"
        />
        <ReportCard
          title="Total Cost"
          value="$13,300.00"
          change={-2.1}
          icon={TrendingUp}
          subtitle="COGS for sold items"
        />
        <ReportCard
          title="Profit Rank"
          value="#1 Accessories"
          icon={PieChart}
          subtitle="Highest margin category"
        />
      </div>

      <div className="rounded-card border border-border bg-surface p-6 shadow-sm">
        <h3 className="text-sm font-black text-text uppercase tracking-widest mb-8">Margin by Category</h3>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={profitData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis
                dataKey="category"
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
                 cursor={{ fill: 'var(--bg)' }}
                 contentStyle={{
                    backgroundColor: 'var(--surface)',
                    borderColor: 'var(--border)',
                    borderRadius: 'var(--radius-badge)',
                    fontSize: '10px',
                    fontWeight: 800
                  }}
              />
              <Bar dataKey="revenue" fill="var(--primary)" radius={[2, 2, 0, 0]} barSize={40} name="Revenue" />
              <Bar dataKey="cost" fill="var(--border)" radius={[2, 2, 0, 0]} barSize={40} name="Cost" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
