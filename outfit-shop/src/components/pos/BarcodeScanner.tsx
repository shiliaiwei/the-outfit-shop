"use client";

import { useState, useRef, useEffect, useImperativeHandle, forwardRef } from "react";
import { Camera, ScanBarcode } from "lucide-react";
import { cn } from "@/lib/utils";

import { toast } from "sonner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBarcode, faCamera } from "@fortawesome/free-solid-svg-icons";

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
      <div className="flex items-center gap-2 rounded-[2px] border border-border bg-surface p-2 shadow-sm focus-within:ring-1 focus-within:ring-primary">
        <FontAwesomeIcon icon={faBarcode} className="text-[#1E2631] text-base" />
        <form onSubmit={handleSubmit} className="flex-1">
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Scan barcode or type SKU (F2)..."
            className="w-full bg-transparent text-xs font-mono focus:outline-none text-text"
            disabled={loading}
          />
        </form>
        <button
          type="button"
          className="p-1 text-text-muted hover:text-text cursor-pointer"
          title="Optical recognition"
          onClick={() => toast.info("Optical barcode recognition active")}
        >
          <FontAwesomeIcon icon={faCamera} className="text-sm text-[#1E2631]" />
        </button>
      </div>
    );
  }
);

BarcodeScanner.displayName = "BarcodeScanner";
