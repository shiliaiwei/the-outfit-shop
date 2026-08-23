import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_API_BASE:   z.string().url().default("https://api.kesararamwithdigital.tech/api/v1"),
  NEXT_PUBLIC_APP_DOMAIN: z.string().default("outfit.kesararamwithdigital.tech"),
  NODE_ENV:               z.enum(["development","test","production"]).default("development"),
});

export const env = envSchema.parse({
  NEXT_PUBLIC_API_BASE:   process.env.NEXT_PUBLIC_API_BASE,
  NEXT_PUBLIC_APP_DOMAIN: process.env.NEXT_PUBLIC_APP_DOMAIN,
  NODE_ENV:               process.env.NODE_ENV,
});
