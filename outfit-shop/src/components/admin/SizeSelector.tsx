"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

const STANDARD_SIZES = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "3XL",
  "28",
  "30",
  "32",
  "34",
  "36",
  "One Size"
];

interface SizeSelectorProps {
  value: string; // Comma separated string e.g. "S, M, L, XL"
  onChange: (val: string) => void;
}

export function SizeSelector({ value, onChange }: SizeSelectorProps) {
  const [customInput, setCustomInput] = useState("");
  const [showCustom, setShowCustom] = useState(false);

  const selectedList = value
    ? value.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const toggleSize = (size: string) => {
    let updated: string[];
    if (selectedList.includes(size)) {
      updated = selectedList.filter((s) => s !== size);
    } else {
      updated = [...selectedList, size];
    }
    onChange(updated.join(", "));
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    const clean = customInput.trim().toUpperCase();
    if (!selectedList.includes(clean)) {
      const updated = [...selectedList, clean];
      onChange(updated.join(", "));
    }
    setCustomInput("");
    setShowCustom(false);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-bold text-text uppercase tracking-wider block">
          Available Sizes &bull; Options
        </label>
        <span className="text-[9px] font-mono text-text-muted">
          {selectedList.length} Selected ({selectedList.join(", ") || "None"})
        </span>
      </div>

      {/* Interactive Size Chips */}
      <div className="flex flex-wrap gap-1.5 p-2 rounded-[2px] border border-border bg-bg/40">
        {STANDARD_SIZES.map((size) => {
          const isSelected = selectedList.includes(size);
          return (
            <button
              key={size}
              type="button"
              onClick={() => toggleSize(size)}
              className={cn(
                "px-2.5 py-1 text-[10px] font-bold font-mono uppercase rounded-[2px] border transition-all cursor-pointer",
                isSelected
                  ? "bg-[#1E2631] text-white border-[#1E2631] shadow-xs"
                  : "bg-surface text-text border-border hover:border-text/40 hover:bg-bg"
              )}
            >
              {size}
            </button>
          );
        })}

        {/* Custom additional sizes already selected that are not in STANDARD_SIZES */}
        {selectedList
          .filter((s) => !STANDARD_SIZES.includes(s))
          .map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => toggleSize(size)}
              className="px-2.5 py-1 text-[10px] font-bold font-mono uppercase rounded-[2px] border bg-[#1E2631] text-white border-[#1E2631] shadow-xs cursor-pointer"
            >
              {size} &times;
            </button>
          ))}

        {/* Add custom size button */}
        {!showCustom ? (
          <button
            type="button"
            onClick={() => setShowCustom(true)}
            className="px-2 py-1 text-[10px] font-bold uppercase rounded-[2px] border border-dashed border-border text-text-muted hover:text-text hover:border-primary transition-colors cursor-pointer"
          >
            + Custom
          </button>
        ) : (
          <form onSubmit={handleAddCustom} className="flex items-center gap-1">
            <input
              type="text"
              autoFocus
              placeholder="Size (e.g. 40R)"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              className="px-2 py-0.5 text-[10px] font-mono bg-bg border border-primary rounded-[2px] text-text focus:outline-none w-24"
            />
            <button
              type="submit"
              className="px-2 py-0.5 text-[9px] font-bold uppercase bg-primary text-white rounded-[2px] cursor-pointer"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setShowCustom(false)}
              className="px-1.5 py-0.5 text-[9px] text-text-muted hover:text-text cursor-pointer"
            >
              Cancel
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
