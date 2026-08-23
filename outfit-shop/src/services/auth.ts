import { api, ApiEnvelope } from "@/lib/api/client";
import { LoginResponse, User } from "@/types/auth.types";
import { z } from "zod";

const LoginRespSchema = ApiEnvelope(
  z.object({
    access_token: z.string(),
    token_type: z.string().optional().default("Bearer"),
    role: z.string().optional(),
    account_type: z.string().optional(),
    device_name: z.string().optional(),
    employee: z
      .object({
        employee_id: z.number().optional(),
        username: z.string().optional(),
        role: z.string().optional(),
      })
      .passthrough()
      .optional(),
    user: z
      .object({
        id: z.number().optional(),
        name: z.string().optional(),
        username: z.string().optional(),
        email: z.string().nullable().optional(),
        position: z.string().optional(),
        role: z.string().optional(),
        permissions: z.array(z.string()).optional(),
      })
      .passthrough()
      .optional(),
  }).passthrough()
);

const UserProfileSchema = ApiEnvelope(
  z.object({
    id: z.number().optional(),
    username: z.string().optional(),
    name: z.string().optional(),
    email: z.string().nullable().optional(),
    phone: z.string().nullable().optional(),
    role: z.string().optional().default("STAFF"),
    avatar_url: z.string().nullable().optional(),
    position: z.string().optional(),
    status: z.string().optional(),
    permissions: z.array(z.string()).optional(),
  }).passthrough()
);

export const authService = {
  login: async (credentials: any) => {
    const data = await api.post<any>("/auth/login", credentials);
    const parsed = LoginRespSchema.parse(data);

    // Set cookie on success
    if (typeof document !== "undefined") {
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + 7); // 7 days
      document.cookie = `outfit_token=${parsed.data.access_token}; expires=${expiry.toUTCString()}; path=/`;
    }

    return parsed.data;
  },

  me: async () => {
    const data = await api.get<any>("/auth/me");
    return UserProfileSchema.parse(data).data;
  },

  logout: async () => {
    await api.post("/auth/logout", {});
    if (typeof document !== "undefined") {
      document.cookie = "outfit_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    }
  }
};
