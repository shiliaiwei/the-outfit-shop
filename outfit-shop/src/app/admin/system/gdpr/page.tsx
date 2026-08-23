"use client";

import { useState } from "react";
import { securityService } from "@/services/securityService";
import { Guard } from "@/components/auth/Guard";
import { FileDown, UserX, ShieldAlert, CheckCircle2, Loader2, Search } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function GdprCompliancePage() {
  const [customerId, setCustomerId] = useState("");
  const [loading, setLoading] = useState<string | null>(null);

  const handleExport = async () => {
    if (!customerId) return;
    setLoading("export");
    try {
      await securityService.exportCustomerData(parseInt(customerId));
      toast.success("Data export initiated. Download link will be sent to the customer.");
    } catch (err: any) {
      toast.error(err.message || "Export failed");
    } finally {
      setLoading(null);
    }
  };

  const handleErasure = async () => {
    if (!customerId) return;
    if (!confirm("Are you sure? This action is IRREVERSIBLE and will anonymize all customer personal data.")) return;

    setLoading("erasure");
    try {
      await securityService.requestErasure(parseInt(customerId));
      toast.success("Customer data has been flagged for erasure (7-year tax ledger preserved).");
    } catch (err: any) {
      toast.error(err.message || "Erasure failed");
    } finally {
      setLoading(null);
    }
  };

  return (
    <Guard allowedRoles={["ADMIN"]}>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-text uppercase tracking-tight flex items-center gap-3">
            <ShieldAlert className="text-primary" size={28} />
            GDPR Compliance Portal
          </h1>
          <p className="text-text-muted text-sm mt-1">Execute data portability and erasure requests (Art. 17 & 20)</p>
        </div>

        <div className="max-w-2xl">
          <div className="rounded-card border border-border bg-surface p-8 shadow-md">
            <h2 className="text-sm font-black text-text uppercase tracking-widest mb-6">Process Request</h2>

            <div className="space-y-6">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Customer ID / Email</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                    <input
                      type="text"
                      placeholder="e.g. 1042 or user@example.com"
                      className="w-full rounded-md border border-border bg-bg pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                      value={customerId}
                      onChange={(e) => setCustomerId(e.target.value)}
                    />
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  <button
                    onClick={handleExport}
                    disabled={!customerId || !!loading}
                    className="flex flex-col items-center justify-center p-6 rounded-card border border-border bg-bg/20 hover:border-primary hover:bg-primary/5 transition-all group disabled:opacity-40"
                  >
                    {loading === "export" ? <Loader2 className="animate-spin text-primary mb-3" size={24} /> : <FileDown className="text-text-muted group-hover:text-primary mb-3" size={24} />}
                    <span className="text-[10px] font-black uppercase tracking-widest text-text">Right to Portability</span>
                    <span className="text-[8px] text-text-muted uppercase mt-1">Generate Data Export</span>
                  </button>

                  <button
                    onClick={handleErasure}
                    disabled={!customerId || !!loading}
                    className="flex flex-col items-center justify-center p-6 rounded-card border border-border bg-bg/20 hover:border-danger hover:bg-danger/5 transition-all group disabled:opacity-40"
                  >
                    {loading === "erasure" ? <Loader2 className="animate-spin text-danger mb-3" size={24} /> : <UserX className="text-text-muted group-hover:text-danger mb-3" size={24} />}
                    <span className="text-[10px] font-black uppercase tracking-widest text-text">Right to Erasure</span>
                    <span className="text-[8px] text-text-muted uppercase mt-1">Permanently Anonymize</span>
                  </button>
               </div>
            </div>

            <div className="mt-8 p-4 rounded-[2px] bg-bg/50 border border-border">
               <div className="flex gap-3">
                  <CheckCircle2 size={16} className="text-success shrink-0" />
                  <p className="text-[10px] text-text-muted leading-relaxed uppercase font-mono">
                    All compliance actions are logged to the <strong>master audit trail</strong> with a 7-year retention policy for financial ledger consistency.
                  </p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </Guard>
  );
}
