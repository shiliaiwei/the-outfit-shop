import { api, ApiEnvelope } from "@/lib/api/client";
import { z } from "zod";

const AuditLogSchema = z.object({
  id: z.number(),
  user_id: z.number().optional(),
  username: z.string().optional(),
  action: z.string(),
  description: z.string(),
  resource: z.string().optional(),
  ip_address: z.string().optional(),
  user_agent: z.string().optional(),
  created_at: z.string(),
});

const SessionSchema = z.object({
  id: z.string(),
  device_name: z.string(),
  ip_address: z.string(),
  last_active_at: z.string(),
  is_current: z.boolean(),
});

const AuditLogListResp = ApiEnvelope(z.array(AuditLogSchema));
const SessionListResp = ApiEnvelope(z.array(SessionSchema));

export const securityService = {
  getAuditLogs: async (params?: { page?: number; per_page?: number; user_id?: number }) => {
    const data = await api.get<any>("/audit-logs", { params });
    return AuditLogListResp.parse(data);
  },

  getSessions: async () => {
    // Note: Postman shows /auth/me returns permissions, /auth/revoke-all exists.
    // Assuming a sessions list exists at /auth/sessions or similar per Section 14
    const data = await api.get<any>("/auth/sessions");
    return SessionListResp.parse(data);
  },

  revokeSession: async (sessionId: string) => {
    return await api.delete(`/auth/sessions/${sessionId}`);
  },

  revokeAllSessions: async () => {
    return await api.post("/auth/revoke-all", {});
  },

  exportCustomerData: async (customerId: number) => {
    return await api.post(`/customers/${customerId}/data-exports`, {});
  },

  requestErasure: async (customerId: number) => {
    return await api.post(`/customers/${customerId}/erasure-requests`, {});
  }
};
