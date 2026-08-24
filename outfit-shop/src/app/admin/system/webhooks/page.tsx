"use client";

import { useState, useEffect } from "react";
import { opsService } from "@/services/opsService";
import { WebhookSubscription } from "@/types/inventory.types";
import { Guard } from "@/components/auth/Guard";
import { toast } from "sonner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrashCan, faBolt } from "@fortawesome/free-solid-svg-icons";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

export default function WebhooksPage() {
  const [webhooks, setWebhooks] = useState<WebhookSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  async function load() {
    try {
      const res = await opsService.getWebhooks();
      setWebhooks(res.data || []);
    } catch {
      setWebhooks([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    try {
      await opsService.deleteWebhook(deletingId);
      toast.success("Webhook deleted");
      setDeletingId(null);
      load();
    } catch (err: any) {
      toast.error(err.message || "Action failed");
    }
  };

  return (
    <Guard allowedRoles={["ADMIN"]}>
      <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-700">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-text uppercase tracking-tight">
              Developer Webhooks
            </h1>
            <p className="text-xs text-text-muted mt-1">Configure event-driven HTTP triggers for external integrations</p>
          </div>
          <button
            onClick={() => toast.info("New webhook endpoint modal ready")}
            className="btn-liquid btn-liquid-terracotta px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 shadow-md cursor-pointer self-start sm:self-auto"
          >
            <FontAwesomeIcon icon={faPlus} className="text-xs" />
            <span>Add Endpoint</span>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:gap-4">
          {loading ? (
             Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="h-24 animate-pulse liquid-glass" />
             ))
          ) : webhooks.length === 0 ? (
            <div className="py-20 text-center liquid-glass">
              <p className="text-xs text-text-muted font-mono uppercase tracking-widest">No active subscriptions</p>
            </div>
          ) : (
            webhooks.map((webhook) => (
              <div key={webhook.id} className="liquid-glass p-4 sm:p-5 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
                 <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 mb-1">
                       <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded-[2px] bg-success/10 text-success border border-success/20">Active</span>
                       <span className="text-[10px] font-mono text-text-muted font-bold uppercase tracking-widest">{webhook.event_type}</span>
                    </div>
                    <h3 className="text-xs sm:text-sm font-bold text-text truncate font-mono">{webhook.url}</h3>
                 </div>

                 <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 border-border/20 pt-2 sm:pt-0">
                    <div className="text-left sm:text-right">
                       <p className="text-[8px] font-black text-text-muted uppercase tracking-tighter">Verified Since</p>
                       <p className="text-[10px] font-mono font-bold text-text uppercase">{new Date(webhook.created_at).toLocaleDateString()}</p>
                    </div>
                    <button
                      onClick={() => setDeletingId(webhook.id)}
                      className="p-2 text-text-muted hover:text-danger cursor-pointer"
                      title="Delete Webhook"
                    >
                       <FontAwesomeIcon icon={faTrashCan} className="text-xs text-[#1E2631]" />
                    </button>
                 </div>
              </div>
            ))
          )}
        </div>

        {/* Compact Confirm Modal */}
        <ConfirmModal
          isOpen={Boolean(deletingId)}
          onClose={() => setDeletingId(null)}
          onConfirm={handleConfirmDelete}
          title="Unsubscribe Webhook"
          description="Are you sure you want to permanently remove this event-driven HTTP trigger?"
          confirmLabel="Delete Webhook"
          cancelLabel="Cancel"
          variant="danger"
        />
      </div>
    </Guard>
  );
}
