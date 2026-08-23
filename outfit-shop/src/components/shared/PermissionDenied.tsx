import { ShieldX } from "lucide-react";
import { cn } from "@/lib/utils";

export function PermissionDenied({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <div className="flex items-center gap-3 rounded-md border border-danger/20 bg-danger/5 p-4 text-danger">
        <ShieldX size={20} />
        <span className="text-sm font-medium">Insufficient permissions to view this component.</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-danger/10 p-4 text-danger mb-4">
        <ShieldX size={32} />
      </div>
      <h3 className="text-lg font-bold text-text">Permission Required</h3>
      <p className="text-sm text-text-muted mt-1">Your role does not grant access to this feature.</p>
    </div>
  );
}
