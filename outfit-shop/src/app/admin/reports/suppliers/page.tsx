"use client";

import { ReportCard } from "@/components/admin/ReportCard";
import { ExportActions } from "@/components/admin/ExportActions";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";
import { Truck, Star, Clock, AlertTriangle, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const performanceData = [
  { subject: 'Lead Time', A: 120, fullMark: 150 },
  { subject: 'Quality', A: 98, fullMark: 150 },
  { subject: 'Compliance', A: 86, fullMark: 150 },
  { subject: 'Pricing', A: 99, fullMark: 150 },
  { subject: 'Volume', A: 85, fullMark: 150 },
  { subject: 'Reliability', A: 65, fullMark: 150 },
];

const supplierRankings = [
  { name: "Global Textiles", score: 94, volume: 125000 },
  { name: "Haute Silk Ltd", score: 88, volume: 84000 },
  { name: "Normandy Flax Co", score: 91, volume: 92000 },
  { name: "Bespoke Mill", score: 76, volume: 45000 },
];

export default function SupplierPerformanceReport() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text uppercase tracking-tight">Supplier Performance</h1>
          <p className="text-text-muted text-sm mt-1">Vendor reliability, quality metrics, and fulfillment analytics</p>
        </div>
        <ExportActions type="inventory" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <ReportCard
          title="Avg Lead Time"
          value="14 Days"
          change={-5.2}
          icon={Clock}
          subtitle="Ordered to Received"
        />
        <ReportCard
          title="Quality Score"
          value="98.2%"
          change={1.2}
          icon={ShieldCheck}
          subtitle="Non-defective yield"
        />
        <ReportCard
          title="Active Suppliers"
          value="12"
          icon={Truck}
          subtitle="Primary vendors"
        />
        <ReportCard
          title="Risk Alerts"
          value="2"
          change={100}
          icon={AlertTriangle}
          subtitle="Delayed fulfillments"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="rounded-card border border-border bg-surface p-6 shadow-sm">
          <h3 className="text-sm font-black text-text uppercase tracking-widest mb-8">Global Vendor Scorecard</h3>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={performanceData}>
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-muted)', fontSize: 10, fontWeight: 700 }} />
                <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                <Radar
                  name="Metrics"
                  dataKey="A"
                  stroke="var(--primary)"
                  fill="var(--primary)"
                  fillOpacity={0.5}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-card border border-border bg-surface p-6 shadow-sm">
          <h3 className="text-sm font-black text-text uppercase tracking-widest mb-8">Top Vendors by Volume</h3>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={supplierRankings} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
                <XAxis
                    type="number"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'var(--text-muted)', fontSize: 10, fontWeight: 700 }}
                />
                <YAxis
                    dataKey="name"
                    type="category"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'var(--text-muted)', fontSize: 10, fontWeight: 700 }}
                    width={100}
                />
                <Tooltip />
                <Bar
                    dataKey="volume"
                    fill="var(--accent)"
                    radius={[0, 2, 2, 0]}
                    barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
