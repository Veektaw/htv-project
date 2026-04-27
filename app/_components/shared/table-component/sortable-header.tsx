"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SortableHeaderProps {
  label: string;
  sortKey: string;
}

export default function SortableHeader({
  label,
  sortKey,
}: SortableHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSortKey = searchParams.get("sortKey");
  const currentSortDir = searchParams.get("sortDir");

  const isActive = currentSortKey === sortKey;
  const isAsc = isActive && currentSortDir === "asc";
  const isDesc = isActive && currentSortDir === "desc";

  const handleSort = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (!isActive || currentSortDir === null) {
      // Start with asc
      params.set("sortKey", sortKey);
      params.set("sortDir", "asc");
    } else if (isAsc) {
      // Move to desc
      params.set("sortKey", sortKey);
      params.set("sortDir", "desc");
    } else {
      // Reset — remove sort params
      params.delete("sortKey");
      params.delete("sortDir");
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <button
      type="button"
      onClick={handleSort}
      className="inline-flex cursor-pointer items-center justify-center gap-1.5 select-none"
    >
      {label}
      <span className="inline-flex flex-col">
        <ChevronUp
          size={12}
          className={cn(
            "transition-colors",
            isAsc ? "text-black" : "text-gray-300",
          )}
        />
        <ChevronDown
          size={12}
          className={cn(
            "-mt-1 transition-colors",
            isDesc ? "text-black" : "text-gray-300",
          )}
        />
      </span>
    </button>
  );
}
