"use client";

import { useState, useRef, useEffect, useImperativeHandle, forwardRef } from "react";
import { Camera, ScanBarcode } from "lucide-react";
import { cn } from "@/lib/utils";

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
  loading?: boolean;
}

export interface BarcodeScannerRef {
  focus: () => void;
}

export const BarcodeScanner = forwardRef<BarcodeScannerRef, BarcodeScannerProps>(
  ({ onScan, loading }, ref) => {
    const [value, setValue] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
      focus: () => inputRef.current?.focus(),
    }));

    useEffect(() => {
      inputRef.current?.focus();
    }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onScan(value.trim());
      setValue("");
    }
  };

    return (
      <div className="flex items-center gap-2 rounded-md border border-border bg-surface p-2 shadow-sm focus-within:ring-1 focus-within:ring-primary">
        <ScanBarcode className="text-text-muted h-5 w-5" />
        <form onSubmit={handleSubmit} className="flex-1">
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Scan barcode or type SKU (F2)..."
            className="w-full bg-transparent text-sm focus:outline-none text-text"
            disabled={loading}
          />
        </form>
        <button
          type="button"
          className="rounded p-1 hover:bg-bg text-text-muted"
          title="Open Camera Scanner"
          onClick={() => alert("Camera scanner integration pending @zxing/browser setup")}
        >
          <Camera size={20} />
        </button>
      </div>
    );
  }
);

BarcodeScanner.displayName = "BarcodeScanner";
