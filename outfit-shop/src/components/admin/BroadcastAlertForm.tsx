"use client";

import { useState } from "react";
import { monitoringService } from "@/services/monitoringService";
import { Megaphone, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { BrandSelect } from "@/components/shared/BrandSelect";

export function BroadcastAlertForm() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    severity: "INFO"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await monitoringService.broadcastAlert(formData);
      toast.success("Broadcast alert sent to all active sessions.");
      setFormData({ title: "", message: "", severity: "INFO" });
    } catch (err: any) {
      toast.error(err.message || "Failed to send alert");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-card border border-border bg-surface p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-danger/10 rounded-[2px] text-danger">
          <Megaphone size={20} />
        </div>
        <h3 className="text-sm font-black text-text uppercase tracking-widest">Broadcast System Alert</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Alert Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Maintenance Window"
              className="w-full rounded-md border border-border bg-bg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Severity</label>
            <BrandSelect
              value={formData.severity}
              onChange={(val) => setFormData({ ...formData, severity: val })}
              options={[
                { value: "INFO", label: "INFO (Blue)", badge: "INFO" },
                { value: "WARNING", label: "WARNING (Orange)", badge: "WARN" },
                { value: "CRITICAL", label: "CRITICAL (Red)", badge: "ALERT" },
              ]}
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Message Body</label>
          <textarea
            required
            rows={3}
            placeholder="Describe the maintenance or issue..."
            className="w-full rounded-md border border-border bg-bg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center rounded-btn bg-danger py-2 text-[10px] font-black uppercase text-white tracking-widest shadow-md hover:bg-danger/90 disabled:opacity-50 transition-all"
        >
          {loading ? <Loader2 className="animate-spin mr-2" size={14} /> : "Transmit Globally"}
        </button>
      </form>
    </div>
  );
}
