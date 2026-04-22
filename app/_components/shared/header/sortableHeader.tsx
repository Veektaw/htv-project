"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ArrowUpIcon, ArrowDownIcon, ArrowUpDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SortableHeaderProps {
  label: string;
  sortKey: string;
}

export default function SortableHeader({ label, sortKey }: SortableHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSortKey = searchParams.get("sortKey");
  const currentSortOrder = searchParams.get("sortOrder");

  const isActive = currentSortKey === sortKey;
  const isAsc = isActive && currentSortOrder === "asc";
  const isDesc = isActive && currentSortOrder === "desc";

  const handleSort = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (!isActive || isDesc) {
      params.set("sortKey", sortKey);
      params.set("sortOrder", "asc");
    } else {
      params.set("sortKey", sortKey);
      params.set("sortOrder", "desc");
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <button
      onClick={handleSort}
      className={cn(
        "flex items-center gap-1 whitespace-nowrap font-semibold transition-colors hover:text-primary",
        isActive ? "text-primary" : "text-muted-foreground"
      )}
    >
      {label}
      <span className="inline-flex">
        {isAsc ? (
          <ArrowUpIcon className="h-3.5 w-3.5" />
        ) : isDesc ? (
          <ArrowDownIcon className="h-3.5 w-3.5" />
        ) : (
          <ArrowUpDownIcon className="h-3.5 w-3.5 opacity-40" />
        )}
      </span>
    </button>
  );
}