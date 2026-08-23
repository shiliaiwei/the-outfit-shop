import { api, ApiEnvelope } from "@/lib/api/client";
import { z } from "zod";

const BranchSchema = z.object({
  id: z.number(),
  branch_name: z.string(),
  branch_code: z.string(),
  phone: z.string(),
  address: z.string(),
  city: z.string(),
});

const AudioSettingsSchema = z.object({
  scan_success_enabled: z.boolean(),
  error_alert_enabled: z.boolean(),
  volume: z.number().min(0).max(100),
});

const BranchListResp = ApiEnvelope(z.array(BranchSchema));
const AudioSettingsResp = ApiEnvelope(AudioSettingsSchema);

export const settingsService = {
  getBranches: async () => {
    const data = await api.get<any>("/branches");
    return BranchListResp.parse(data);
  },

  createBranch: async (payload: any) => {
    return await api.post("/branches", payload);
  },

  getAudioSettings: async () => {
    const data = await api.get<any>("/settings/audio-cues");
    return AudioSettingsResp.parse(data);
  },

  updateAudioSettings: async (payload: z.infer<typeof AudioSettingsSchema>) => {
    return await api.patch("/settings/audio-cues", payload);
  },

  getAuditRetention: async () => {
    return await api.get<any>("/compliance/audit-retention-policy");
  }
};
