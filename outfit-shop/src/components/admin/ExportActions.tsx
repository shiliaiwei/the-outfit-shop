"use client";

import { useState } from "react";
import { Download, FileSpreadsheet, FileText, File as FilePdf, Loader2 } from "lucide-react";
import { reportService } from "@/services/reportService";
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
    } catch (err) {
      console.error(err);
      alert("Export failed");
    } finally {
      setExporting(null);
    }
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <button
        onClick={() => handleExport('excel')}
        disabled={!!exporting}
        className="flex items-center gap-2 px-3 py-1.5 rounded-[2px] bg-success/10 text-success border border-success/20 text-[10px] font-black uppercase tracking-widest hover:bg-success/20 transition-all disabled:opacity-50"
      >
        {exporting === 'excel' ? <Loader2 size={14} className="animate-spin" /> : <FileSpreadsheet size={14} />}
        Excel
      </button>

      <button
        onClick={() => handleExport('csv')}
        disabled={!!exporting}
        className="flex items-center gap-2 px-3 py-1.5 rounded-[2px] bg-primary/10 text-primary border border-primary/20 text-[10px] font-black uppercase tracking-widest hover:bg-primary/20 transition-all disabled:opacity-50"
      >
        {exporting === 'csv' ? <Loader2 size={14} className="animate-spin" /> : <FileText size={14} />}
        CSV
      </button>

      <button
        onClick={() => handleExport('pdf')}
        disabled={!!exporting}
        className="flex items-center gap-2 px-3 py-1.5 rounded-[2px] bg-danger/10 text-danger border border-danger/20 text-[10px] font-black uppercase tracking-widest hover:bg-danger/20 transition-all disabled:opacity-50"
      >
        {exporting === 'pdf' ? <Loader2 size={14} className="animate-spin" /> : <FilePdf size={14} />}
        PDF
      </button>
    </div>
  );
}
