// "use client";

// import { useRouter, useSearchParams, usePathname } from "next/navigation";
// import { ArrowUpIcon, ArrowDownIcon, ArrowUpDownIcon } from "lucide-react";
// import { cn } from "@/lib/utils";

// interface SortableHeaderProps {
//   label: string;
//   sortKey: string;
// }

// export default function SortableHeader({ label, sortKey }: SortableHeaderProps) {
//   const router = useRouter();
//   const pathname = usePathname();
//   const searchParams = useSearchParams();

//   const currentSortKey = searchParams.get("sortKey");
//   const currentSortOrder = searchParams.get("sortOrder");

//   const isActive = currentSortKey === sortKey;
//   const isAsc = isActive && currentSortOrder === "asc";
//   const isDesc = isActive && currentSortOrder === "desc";

//   const handleSort = () => {
//     const params = new URLSearchParams(searchParams.toString());

//     if (!isActive || isDesc) {
//       params.set("sortKey", sortKey);
//       params.set("sortOrder", "asc");
//     } else {
//       params.set("sortKey", sortKey);
//       params.set("sortOrder", "desc");
//     }

//     router.push(`${pathname}?${params.toString()}`);
//   };

//   return (
//     <button
//       onClick={handleSort}
//       className={cn(
//         "flex items-center gap-1 whitespace-nowrap font-semibold transition-colors hover:text-primary",
//         isActive ? "text-primary" : "text-muted-foreground"
//       )}
//     >
//       {label}
//       <span className="inline-flex">
//         {isAsc ? (
//           <ArrowUpIcon className="h-3.5 w-3.5" />
//         ) : isDesc ? (
//           <ArrowDownIcon className="h-3.5 w-3.5" />
//         ) : (
//           <ArrowUpDownIcon className="h-3.5 w-3.5 opacity-40" />
//         )}
//       </span>
//     </button>
//   );
// }

// app/_components/shared/header/sortableHeader.tsx
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
