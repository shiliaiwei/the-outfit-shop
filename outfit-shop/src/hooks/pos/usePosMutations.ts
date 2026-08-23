"use client";

import { useState } from "react";
import { api } from "@/lib/api/client";
import { CheckoutPayload, Shift } from "@/types/pos.types";

export function usePosMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkout = async (payload: CheckoutPayload) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post<any>("/orders/checkout", payload);
      return res.data;
    } catch (err: any) {
      setError(err.message || "Checkout failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const openShift = async (opening_float_usd: number, opening_float_khr: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post<any>("/shifts/open", {
        opening_float_usd,
        opening_float_khr,
      });
      return res.data;
    } catch (err: any) {
      setError(err.message || "Failed to open shift");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const closeShift = async (closing_cash_usd: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post<any>("/shifts/close", {
        closing_cash_usd,
      });
      return res.data;
    } catch (err: any) {
      setError(err.message || "Failed to close shift");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getCurrentShift = async (): Promise<Shift | null> => {
    try {
      const res = await api.get<any>("/shifts/current");
      return res.success ? res.data : null;
    } catch (err) {
      return null;
    }
  };

  return {
    checkout,
    openShift,
    closeShift,
    getCurrentShift,
    loading,
    error,
  };
}
