"use client";

import { ReportCard } from "@/components/admin/ReportCard";
import { ExportActions } from "@/components/admin/ExportActions";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { Activity, ArrowRightLeft, DollarSign, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

const cashflowData = [
  { month: "Mar", inflow: 45000, outflow: 32000 },
  { month: "Apr", inflow: 52000, outflow: 38000 },
  { month: "May", inflow: 48000, outflow: 41000 },
  { month: "Jun", inflow: 61000, outflow: 35000 },
  { month: "Jul", inflow: 55000, outflow: 42000 },
  { month: "Aug", inflow: 71000, outflow: 45000 },
];

export default function CashFlowReport() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text uppercase tracking-tight">Cash Flow Statement</h1>
          <p className="text-text-muted text-sm mt-1">Real-time liquidity tracking and operational solvency</p>
        </div>
        <ExportActions type="sales" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <ReportCard
          title="Net Cash Flow"
          value="+$26,000.00"
          change={15.2}
          icon={Activity}
          subtitle="Current month surplus"
        />
        <ReportCard
          title="Total Inflow"
          value="$71,000.00"
          change={12.5}
          icon={DollarSign}
          subtitle="Revenue + Other income"
        />
        <ReportCard
          title="Total Outflow"
          value="$45,000.00"
          change={8.2}
          icon={ArrowRightLeft}
          subtitle="Expenses + Purchasing"
        />
        <ReportCard
          title="Cash on Hand"
          value="$142,500.00"
          icon={Wallet}
          subtitle="Available across accounts"
        />
      </div>

      <div className="rounded-card border border-border bg-surface p-6 shadow-sm">
        <h3 className="text-sm font-black text-text uppercase tracking-widest mb-8">Inflow vs Outflow</h3>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={cashflowData}>
              <defs>
                <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--success)" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="var(--success)" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorOut" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--danger)" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="var(--danger)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis
                dataKey="month"
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
                dataKey="inflow"
                stroke="var(--success)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorIn)"
                name="Inflow"
              />
              <Area
                type="monotone"
                dataKey="outflow"
                stroke="var(--danger)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorOut)"
                name="Outflow"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
