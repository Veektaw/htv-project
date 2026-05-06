"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";

export default function SortableHeader({
  label,
  sort_by,
}: {
  label: string;
  sort_by: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSortKey = searchParams.get("sort_by");
  const currentSortDir = searchParams.get("sort_order");

  const handleSort = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (currentSortKey === sort_by) {
      // Toggle direction
      params.set("sort_order", currentSortDir === "asc" ? "desc" : "asc");
    } else {
      // New column — default to asc
      params.set("sort_by", sort_by);
      params.set("sort_order", "asc");
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  const isActive = currentSortKey === sort_by;

  return (
    <button
      onClick={handleSort}
      className="flex items-center gap-1 font-medium"
    >
      {label}
      {isActive ? (
        currentSortDir === "asc" ? (
          <ArrowUp size={14} />
        ) : (
          <ArrowDown size={14} />
        )
      ) : (
        <ArrowUpDown size={14} className="opacity-40" />
      )}
    </button>
  );
}
