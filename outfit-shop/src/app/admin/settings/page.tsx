"use client";

import { useState, useEffect } from "react";
import { settingsService } from "@/services/settingsService";
import { Settings, Volume2, Globe, Building2, Save, Loader2, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { BrandSelect } from "@/components/shared/BrandSelect";

export default function SettingsPage() {
  const [currency, setCurrency] = useState("USD");
  const [audio, setAudio] = useState({
    scan_success_enabled: true,
    error_alert_enabled: true,
    volume: 80
  });
  const [loading, setLoading] = useState(false);

  const handleSaveAudio = async () => {
    setLoading(true);
    try {
      await settingsService.updateAudioSettings(audio);
      toast.success("Audio preferences updated.");
    } catch (err: any) {
      toast.error(err.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-text uppercase tracking-tight flex items-center gap-3">
          <Settings className="text-text-muted" size={28} />
          System Settings
        </h1>
        <p className="text-text-muted text-sm mt-1">Configure global application defaults and operational parameters</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Terminal Audio Settings */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
             <div className="p-1.5 bg-primary/10 rounded-[2px] text-primary">
                <Volume2 size={18} />
             </div>
             <h2 className="text-sm font-black text-text uppercase tracking-widest">Terminal Cues</h2>
          </div>

          <div className="rounded-card border border-border bg-surface p-6 shadow-sm space-y-6">
             <div className="flex items-center justify-between">
                <div>
                   <p className="text-xs font-bold text-text uppercase">Scan Success Sound</p>
                   <p className="text-[10px] text-text-muted mt-0.5">Play a chime when a barcode is resolved</p>
                </div>
                <input
                  type="checkbox"
                  checked={audio.scan_success_enabled}
                  onChange={(e) => setAudio({ ...audio, scan_success_enabled: e.target.checked })}
                  className="h-4 w-4 accent-primary"
                />
             </div>
             <div className="flex items-center justify-between">
                <div>
                   <p className="text-xs font-bold text-text uppercase">Error Alerts</p>
                   <p className="text-[10px] text-text-muted mt-0.5">Haptic or audio feedback on validation failure</p>
                </div>
                <input
                  type="checkbox"
                  checked={audio.error_alert_enabled}
                  onChange={(e) => setAudio({ ...audio, error_alert_enabled: e.target.checked })}
                  className="h-4 w-4 accent-primary"
                />
             </div>
             <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                   <p className="text-[10px] font-black text-text uppercase tracking-widest">Master Volume</p>
                   <span className="text-xs font-mono font-bold text-primary">{audio.volume}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={audio.volume}
                  onChange={(e) => setAudio({ ...audio, volume: parseInt(e.target.value) })}
                  className="w-full h-1.5 bg-bg rounded-lg appearance-none cursor-pointer accent-primary"
                />
             </div>
             <button
               onClick={handleSaveAudio}
               disabled={loading}
               className="flex w-full items-center justify-center gap-2 rounded-btn bg-primary py-2.5 text-[10px] font-black uppercase text-white tracking-widest shadow-md hover:bg-primary/90 transition-all"
             >
               {loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
               Save Audio Cues
             </button>
          </div>
        </section>

        {/* Localization & Payments */}
        <section className="space-y-4">
           <div className="flex items-center gap-2">
             <div className="p-1.5 bg-accent/10 rounded-[2px] text-accent">
                <Globe size={18} />
             </div>
             <h2 className="text-sm font-black text-text uppercase tracking-widest">Market Context</h2>
          </div>

          <div className="rounded-card border border-border bg-surface p-6 shadow-sm space-y-6">
             <div className="space-y-1">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Base Currency</label>
                <BrandSelect
                  value={currency}
                  onChange={setCurrency}
                  options={[
                    { value: "USD", label: "USD - US Dollar ($)", badge: "USD" },
                    { value: "KHR", label: "KHR - Khmer Riel (៛)", badge: "KHR" },
                    { value: "EUR", label: "EUR - Euro (€)", badge: "EUR" },
                  ]}
                />
             </div>
             <div className="space-y-1">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Tax Rate (%)</label>
                <input
                  type="number"
                  defaultValue="0.00"
                  className="w-full rounded-md border border-border bg-bg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                />
             </div>
             <div className="pt-4 border-t border-border">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-success/10 rounded-[2px] text-success">
                      <CreditCard size={18} />
                   </div>
                   <div>
                      <p className="text-xs font-bold text-text uppercase">KHQR Integration</p>
                      <p className="text-[10px] text-text-muted mt-0.5">Bakong gateway is currently ACTIVE</p>
                   </div>
                </div>
             </div>
          </div>
        </section>
      </div>
    </div>
  );
}
