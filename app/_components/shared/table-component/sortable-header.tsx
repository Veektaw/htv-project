"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SortableHeaderProps {
  label: string;
  sort_by: string;
}

export default function SortableHeader({
  label,
  sort_by,
}: SortableHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSortKey = searchParams.get("sort_by");
  const currentSortDir = searchParams.get("sort_order");

  const isActive = currentSortKey === sort_by;
  const isAsc = isActive && currentSortDir === "asc";
  const isDesc = isActive && currentSortDir === "desc";

  const handleSort = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (!isActive || currentSortDir === null) {
      // Start with asc
      params.set("sort_by", sort_by);
      params.set("sort_order", "asc");
    } else if (isAsc) {
      // Move to desc
      params.set("sort_by", sort_by);
      params.set("sort_order", "desc");
    } else {
      // Reset — remove sort params
      params.delete("sort_by");
      params.delete("sort_order");
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
