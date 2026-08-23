"use client";

import { ReportCard } from "@/components/admin/ReportCard";
import { ExportActions } from "@/components/admin/ExportActions";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid
} from "recharts";
import { ShieldCheck, UserX, AlertOctagon, History } from "lucide-react";
import { cn } from "@/lib/utils";

const eventBreakdown = [
  { name: "Success", value: 42500, color: "#788C5D" },
  { name: "Blocked", value: 120, color: "#D97757" },
  { name: "Warning", value: 45, color: "#6A9BCC" },
  { name: "Failure", value: 8, color: "#CF222E" },
];

export default function SecurityAuditReport() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text uppercase tracking-tight flex items-center gap-3">
             <ShieldCheck className="text-success" />
             Security Audit & Compliance
          </h1>
          <p className="text-text-muted text-sm mt-1">Platform integrity analytics and user access governance</p>
        </div>
        <ExportActions type="sales" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <ReportCard
          title="System Integrity"
          value="100.0%"
          icon={ShieldCheck}
          subtitle="Critical service uptime"
        />
        <ReportCard
          title="Auth Blocks"
          value="120"
          change={12.5}
          icon={UserX}
          subtitle="Failed login attempts"
        />
        <ReportCard
          title="Security Incidents"
          value="0"
          icon={AlertOctagon}
          subtitle="Last 30 days"
        />
        <ReportCard
          title="Audit Log Depth"
          value="90 Days"
          icon={History}
          subtitle="Hot storage retention"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="rounded-card border border-border bg-surface p-6 shadow-sm">
          <h3 className="text-sm font-black text-text uppercase tracking-widest mb-8">Access Event Breakdown</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={eventBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {eventBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="var(--surface)" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value) => <span className="text-[10px] font-black uppercase text-text-muted">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-card border border-border bg-surface p-6 shadow-sm flex flex-col justify-center text-center">
           <AlertOctagon size={48} className="mx-auto text-success opacity-20 mb-4" />
           <h4 className="text-sm font-black text-text uppercase tracking-widest">Compliance Status: PASS</h4>
           <p className="text-xs text-text-muted mt-2 leading-relaxed max-w-xs mx-auto">
             Platform security parameters are in full compliance with **ISO/IEC 27001** standards and **GDPR** Art. 17 data protection protocols.
           </p>
           <button className="mt-8 rounded-btn border border-border bg-bg px-6 py-2 text-[10px] font-black uppercase tracking-widest text-text hover:bg-surface transition-all mx-auto">
              Download Certification Report
           </button>
        </div>
      </div>
    </div>
  );
}
