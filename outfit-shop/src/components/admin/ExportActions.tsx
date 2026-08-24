"use client";

import { useState } from "react";
import { reportService } from "@/services/reportService";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ExportActionsProps {
  type: 'inventory' | 'stock-movements' | 'sales';
  params?: any;
  className?: string;
}

export function ExportActions({ type, params, className }: ExportActionsProps) {
  const [exporting, setExporting] = useState<string | null>(null);

  const handleExport = async (format: 'excel' | 'csv' | 'pdf') => {
    setExporting(format);
    try {
      await reportService.exportReport(type, format, params);
      toast.success(`${format.toUpperCase()} export generated`);
    } catch (err: any) {
      toast.error(err?.message || "Export failed");
    } finally {
      setExporting(null);
    }
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <button
        onClick={() => handleExport('excel')}
        disabled={!!exporting}
        className="px-3 py-1.5 rounded-[2px] bg-success/10 text-success border border-success/20 text-[10px] font-mono font-black uppercase tracking-wider hover:bg-success/20 transition-all disabled:opacity-50 cursor-pointer"
      >
        {exporting === 'excel' ? "Exporting..." : "Excel"}
      </button>

      <button
        onClick={() => handleExport('csv')}
        disabled={!!exporting}
        className="px-3 py-1.5 rounded-[2px] bg-primary/10 text-primary border border-primary/20 text-[10px] font-mono font-black uppercase tracking-wider hover:bg-primary/20 transition-all disabled:opacity-50 cursor-pointer"
      >
        {exporting === 'csv' ? "Exporting..." : "CSV"}
      </button>

      <button
        onClick={() => handleExport('pdf')}
        disabled={!!exporting}
        className="px-3 py-1.5 rounded-[2px] bg-danger/10 text-danger border border-danger/20 text-[10px] font-mono font-black uppercase tracking-wider hover:bg-danger/20 transition-all disabled:opacity-50 cursor-pointer"
      >
        {exporting === 'pdf' ? "Exporting..." : "PDF"}
      </button>
    </div>
  );
}
