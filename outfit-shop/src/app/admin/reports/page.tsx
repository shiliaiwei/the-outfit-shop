"use client";

import Link from "next/link";
import {
  BarChart3,
  LineChart,
  PieChart,
  ArrowRight,
  FileText,
  DollarSign,
  Package,
  Users,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ReportsHub() {
  const reportCategories = [
    {
      title: "Financial Reports",
      description: "Analyze revenue, profit margins, and cash flow dynamics.",
      icon: DollarSign,
      color: "bg-success/10 text-success",
      links: [
        { name: "Sales Performance", href: "/admin/reports/sales", icon: LineChart },
        { name: "Profit Margin Analysis", href: "/admin/reports/profit", icon: BarChart3 },
        { name: "Cash Flow Statement", href: "/admin/reports/cashflow", icon: FileText },
      ]
    },
    {
      title: "Inventory Reports",
      description: "Monitor stock value, aging patterns, and turnover rates.",
      icon: Package,
      color: "bg-primary/10 text-primary",
      links: [
        { name: "Inventory Valuation", href: "/admin/reports/inventory", icon: PieChart },
        { name: "Stock Aging Analysis", href: "/admin/reports/aging", icon: Clock },
        { name: "Low Stock Forecaster", href: "/admin/reports/low-stock", icon: BarChart3 },
      ]
    },
    {
      title: "Operational Analytics",
      description: "Track staff performance, supplier reliability, and AI forecasts.",
      icon: Users,
      color: "bg-accent/10 text-accent",
      links: [
        { name: "Supplier Performance", href: "/admin/reports/suppliers", icon: Users },
        { name: "AI Sales Forecasting", href: "/admin/reports/ai-forecast", icon: LineChart },
        { name: "Audit & Compliance", href: "/admin/reports/audit", icon: FileText },
      ]
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-text uppercase tracking-tight">Reporting Engine</h1>
        <p className="text-text-muted text-sm mt-1">Management Information System (MIS) for data-driven decisions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {reportCategories.map((cat) => (
          <div key={cat.title} className="flex flex-col rounded-card border border-border bg-surface overflow-hidden shadow-sm">
            <div className="p-6 border-b border-border">
              <div className={cn("h-12 w-12 rounded-[2px] flex items-center justify-center mb-4 border border-current/10", cat.color)}>
                <cat.icon size={24} />
              </div>
              <h3 className="text-lg font-black text-text uppercase tracking-widest">{cat.title}</h3>
              <p className="text-xs text-text-muted mt-1 leading-relaxed">{cat.description}</p>
            </div>

            <div className="flex-1 p-2 bg-bg/10">
              <div className="space-y-1">
                {cat.links.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="flex items-center justify-between p-3 rounded-[2px] hover:bg-surface hover:shadow-sm transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <link.icon size={16} className="text-text-muted group-hover:text-primary transition-colors" />
                      <span className="text-xs font-bold text-text uppercase tracking-tight">{link.name}</span>
                    </div>
                    <ArrowRight size={14} className="text-text-muted opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
