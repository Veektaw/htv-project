"use client";

import { usePartners } from "./contexts/partners-context";
import { cn } from "@/lib/utils";

export default function PortalSwitcher() {
  const { portalView, setPortalView } = usePartners();

  return (
    <div className="border-border-strong bg-white inline-flex items-center gap-1.5 rounded-full border p-1 shadow-xs">
      <button
        type="button"
        onClick={() => setPortalView("admin")}
        className={cn(
          "rounded-full px-4 py-1.5 text-xs font-bold transition-colors",
          portalView === "admin"
            ? "bg-RangoonGreen text-white shadow-xs"
            : "text-MistBlue hover:text-RangoonGreen"
        )}
      >
        Admin Portal
      </button>

      <button
        type="button"
        onClick={() => setPortalView("pharmacy")}
        className={cn(
          "rounded-full px-4 py-1.5 text-xs font-bold transition-colors",
          portalView === "pharmacy"
            ? "bg-RangoonGreen text-white shadow-xs"
            : "text-MistBlue hover:text-RangoonGreen"
        )}
      >
        Pharmacy Portal →
      </button>
    </div>
  );
}
