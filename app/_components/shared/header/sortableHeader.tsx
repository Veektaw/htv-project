"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";

export default function SortableHeader({
  label,
  sortKey,
}: {
  label: string;
  sortKey: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSortKey = searchParams.get("sortKey");
  const currentSortDir = searchParams.get("sortDir");

  const handleSort = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (currentSortKey === sortKey) {
      // Toggle direction
      params.set("sortDir", currentSortDir === "asc" ? "desc" : "asc");
    } else {
      // New column — default to asc
      params.set("sortKey", sortKey);
      params.set("sortDir", "asc");
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  const isActive = currentSortKey === sortKey;

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
