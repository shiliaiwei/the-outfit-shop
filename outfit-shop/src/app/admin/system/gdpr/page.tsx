"use client";

import { useState } from "react";
import { securityService } from "@/services/securityService";
import { Guard } from "@/components/auth/Guard";
import { toast } from "sonner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShieldHalved, faMagnifyingGlass, faFileExport, faUserSlash } from "@fortawesome/free-solid-svg-icons";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

export default function GdprCompliancePage() {
  const [customerId, setCustomerId] = useState("");
  const [loading, setLoading] = useState<string | null>(null);
  const [isErasureConfirmOpen, setIsErasureConfirmOpen] = useState(false);

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

  const handleErasureConfirm = async () => {
    if (!customerId) return;
    setLoading("erasure");
    try {
      await securityService.requestErasure(parseInt(customerId));
      toast.success("Customer data flagged for erasure (financial tax ledger preserved).");
      setIsErasureConfirmOpen(false);
      setCustomerId("");
    } catch (err: any) {
      toast.error(err.message || "Erasure failed");
    } finally {
      setLoading(null);
    }
  };

  return (
    <Guard allowedRoles={["ADMIN"]}>
      <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-700">
        <div className="border-b border-border pb-6">
          <h1 className="text-2xl sm:text-3xl font-black text-text uppercase tracking-tight">
            GDPR Compliance
          </h1>
          <p className="text-xs text-text-muted mt-1">Execute data portability and erasure requests (Art. 17 &amp; 20)</p>
        </div>

        <div className="max-w-2xl">
          <div className="liquid-glass p-6 sm:p-8 shadow-xl space-y-6">
            <h2 className="text-xs font-black text-text uppercase tracking-widest">Process Data Request</h2>

            <div className="space-y-4">
               <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Customer ID / Email</label>
                  <div className="relative">
                    <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#1E2631]" />
                    <input
                      type="text"
                      placeholder="e.g. 1042 or user@example.com"
                      className="w-full rounded-[2px] border border-border bg-bg pl-9 pr-4 py-2.5 text-xs text-text focus:outline-none focus:border-primary font-mono"
                      value={customerId}
                      onChange={(e) => setCustomerId(e.target.value)}
                    />
                  </div>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={handleExport}
                    disabled={!customerId || !!loading}
                    className="p-5 rounded-[2px] border border-border bg-bg/40 hover:border-primary hover:bg-bg/80 transition-all text-left group disabled:opacity-40 cursor-pointer"
                  >
                    <span className="text-[11px] font-black uppercase tracking-wider text-text block">Export Data</span>
                    <span className="text-[9px] text-text-muted uppercase mt-0.5 block">Right to Portability (JSON Archive)</span>
                  </button>

                  <button
                    onClick={() => setIsErasureConfirmOpen(true)}
                    disabled={!customerId || !!loading}
                    className="p-5 rounded-[2px] border border-border bg-bg/40 hover:border-danger/60 hover:bg-danger/5 transition-all text-left group disabled:opacity-40 cursor-pointer"
                  >
                    <span className="text-[11px] font-black uppercase tracking-wider text-danger block">Anonymize Records</span>
                    <span className="text-[9px] text-text-muted uppercase mt-0.5 block">Right to Erasure (Art. 17)</span>
                  </button>
               </div>
            </div>
          </div>
        </div>

        {/* Compact Confirm Modal */}
        <ConfirmModal
          isOpen={isErasureConfirmOpen}
          onClose={() => setIsErasureConfirmOpen(false)}
          onConfirm={handleErasureConfirm}
          loading={loading === "erasure"}
          title="Anonymize Customer Data"
          description={`Are you sure you want to anonymize records for ID ${customerId}? This action is irreversible.`}
          confirmLabel="Erase Data"
          cancelLabel="Cancel"
          variant="danger"
        />
      </div>
    </Guard>
  );
}
