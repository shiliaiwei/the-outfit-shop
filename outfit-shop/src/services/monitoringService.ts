import { api, ApiEnvelope } from "@/lib/api/client";
import { z } from "zod";

const PulseSchema = z.object({
  status: z.string(),
  services: z.array(z.object({
    name: z.string(),
    status: z.enum(["ONLINE", "DEGRADED", "OFFLINE"]),
    latency_ms: z.number().nullable()
  })),
  uptime_seconds: z.number()
});

const PerformanceSchema = z.object({
  cpu_usage: z.number().nullable(),
  memory_usage: z.number().nullable(),
  error_rate_24h: z.number().nullable(),
  telemetry_available: z.boolean()
});

const ApiAnalyticsSchema = z.object({
  total_requests: z.number(),
  p95_latency: z.number(),
  throughput: z.number()
});

const PulseResp = ApiEnvelope(PulseSchema);
const PerformanceResp = ApiEnvelope(PerformanceSchema);
const ApiAnalyticsResp = ApiEnvelope(ApiAnalyticsSchema);

export const monitoringService = {
  getMasterPulse: async () => {
    const data = await api.get<any>("/admin/master-pulse");
    return PulseResp.parse(data);
  },

  getPerformance: async () => {
    const data = await api.get<any>("/admin/performance");
    return PerformanceResp.parse(data);
  },

  getApiAnalytics: async () => {
    const data = await api.get<any>("/admin/api-analytics");
    return ApiAnalyticsResp.parse(data);
  },

  broadcastAlert: async (payload: { title: string; message: string; severity: string }) => {
    return await api.post("/admin/broadcast-alert", payload);
  }
};
