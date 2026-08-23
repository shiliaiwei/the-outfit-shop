"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BrandSelectOption {
  value: string;
  label: string;
  badge?: string;
  icon?: React.ComponentType<{ className?: string; size?: number }>;
  disabled?: boolean;
}

interface BrandSelectProps {
  options: BrandSelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  triggerClassName?: string;
  popupClassName?: string;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
}

export function BrandSelect({
  options,
  value,
  onChange,
  placeholder = "Select option...",
  className,
  triggerClassName,
  popupClassName,
  disabled = false,
  size = "md",
}: BrandSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (!isOpen) return;
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const sizeClasses = {
    sm: "px-2.5 py-1.5 text-xs",
    md: "px-3 py-2 text-xs",
    lg: "px-4 py-2.5 text-sm",
  };

  return (
    <div ref={containerRef} className={cn("relative w-full select-none", className)}>
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between rounded-md border border-border bg-bg text-text text-left transition-all duration-150",
          "hover:border-[#C84428] focus:outline-none focus:ring-1 focus:ring-[#C84428]",
          isOpen && "border-[#C84428] ring-1 ring-[#C84428] shadow-sm",
          disabled && "opacity-50 cursor-not-allowed",
          sizeClasses[size],
          triggerClassName
        )}
      >
        <span className="truncate font-medium flex items-center gap-2">
          {selectedOption?.icon && (
            <selectedOption.icon className="w-3.5 h-3.5 text-[#C84428] shrink-0" />
          )}
          <span className={!selectedOption ? "text-text-muted" : "text-[#1E2631]"}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </span>

        <ChevronDown
          size={14}
          className={cn(
            "text-text-muted transition-transform duration-200 shrink-0 ml-2",
            isOpen && "transform rotate-180 text-[#C84428]"
          )}
        />
      </button>

      {/* Floating Options Popup */}
      {isOpen && (
        <div
          className={cn(
            "absolute left-0 right-0 top-full mt-1.5 z-50 overflow-hidden rounded-md border border-[#E5E0D8] bg-white shadow-xl shadow-black/10 animate-in fade-in-0 zoom-in-95 duration-100",
            popupClassName
          )}
        >
          <div className="max-h-56 overflow-y-auto py-1 scrollbar-thin scrollbar-thumb-[#E5E0D8]">
            {options.map((option) => {
              const isSelected = option.value === value;
              const OptionIcon = option.icon;

              return (
                <button
                  key={option.value}
                  type="button"
                  disabled={option.disabled}
                  onClick={() => {
                    if (option.disabled) return;
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-left transition-colors duration-100",
                    isSelected
                      ? "bg-[#F8F7F4] text-[#C84428] font-semibold"
                      : "text-[#1E2631] hover:bg-[#F8F7F4] hover:text-[#C84428]",
                    option.disabled && "opacity-40 cursor-not-allowed"
                  )}
                >
                  <div className="flex items-center gap-2 truncate">
                    {OptionIcon && (
                      <OptionIcon
                        className={cn(
                          "w-3.5 h-3.5 shrink-0",
                          isSelected ? "text-[#C84428]" : "text-text-muted"
                        )}
                      />
                    )}
                    <span className="truncate">{option.label}</span>
                    {option.badge && (
                      <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-[2px] bg-black/5 text-[#1E2631]/70">
                        {option.badge}
                      </span>
                    )}
                  </div>

                  {isSelected && (
                    <Check size={14} className="text-[#C84428] shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
