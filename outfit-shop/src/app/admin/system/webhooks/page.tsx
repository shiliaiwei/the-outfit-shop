"use client";

import { useState, useEffect } from "react";
import { opsService } from "@/services/opsService";
import { WebhookSubscription } from "@/types/inventory.types";
import { Guard } from "@/components/auth/Guard";
import { Zap, Plus, Globe, Code, Trash2, Activity, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function WebhooksPage() {
  const [webhooks, setWebhooks] = useState<WebhookSubscription[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const res = await opsService.getWebhooks();
      setWebhooks(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Permanently unsubscribe this webhook?")) return;
    try {
      await opsService.deleteWebhook(id);
      toast.success("Webhook deleted");
      load();
    } catch (err: any) {
      toast.error(err.message || "Action failed");
    }
  };

  return (
    <Guard allowedRoles={["ADMIN"]}>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text uppercase tracking-tight flex items-center gap-3">
              <Zap className="text-primary" size={28} />
              Developer Webhooks
            </h1>
            <p className="text-text-muted text-sm mt-1">Configure event-driven HTTP triggers for external integrations</p>
          </div>
          <button className="flex items-center gap-2 rounded-btn bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 transition-all">
            <Plus size={18} /> Add Endpoint
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {loading ? (
             Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="h-24 animate-pulse rounded-card border border-border bg-surface"></div>
             ))
          ) : webhooks.length === 0 ? (
            <div className="py-20 text-center bg-surface rounded-card border border-border">
              <Code size={48} className="mx-auto text-text-muted opacity-20 mb-4" />
              <p className="text-text-muted font-mono uppercase tracking-widest">No active subscriptions</p>
            </div>
          ) : (
            webhooks.map((webhook) => (
              <div key={webhook.id} className="rounded-card border border-border bg-surface p-6 shadow-sm hover:border-primary/30 transition-all flex flex-col md:flex-row items-center gap-6 group">
                 <div className="flex-shrink-0 p-3 bg-bg rounded-[2px] text-primary">
                    <Globe size={24} />
                 </div>

                 <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                       <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded-[2px] bg-success/10 text-success border border-success/20">Active</span>
                       <span className="text-[10px] font-mono text-text-muted font-bold uppercase tracking-widest">{webhook.event_type}</span>
                    </div>
                    <h3 className="text-sm font-bold text-text truncate font-mono">{webhook.url}</h3>
                 </div>

                 <div className="flex items-center gap-4">
                    <div className="text-right">
                       <p className="text-[8px] font-black text-text-muted uppercase tracking-tighter">Verified Since</p>
                       <p className="text-[10px] font-mono font-bold text-text uppercase">{new Date(webhook.created_at).toLocaleDateString()}</p>
                    </div>
                    <button
                      onClick={() => handleDelete(webhook.id)}
                      className="p-2 text-text-muted hover:text-danger opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                       <Trash2 size={18} />
                    </button>
                 </div>
              </div>
            ))
          )}
        </div>

        <div className="rounded-card border border-border bg-bg/50 p-6">
           <div className="flex gap-4">
              <ShieldCheck className="text-success shrink-0" size={20} />
              <div className="space-y-1">
                 <h4 className="text-xs font-black text-text uppercase tracking-widest">Security Protocol</h4>
                 <p className="text-xs text-text-muted leading-relaxed">
                   All webhooks are signed with a <strong>SHA-256 HMAC</strong> secret. Endpoints must return a 2xx status within 3 seconds to be marked as successful.
                 </p>
              </div>
           </div>
        </div>
      </div>
    </Guard>
  );
}
