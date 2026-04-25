"use client";

import { InvoiceStatus } from "@/types/invoices";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import Image from "next/image";
import filterIcon from "@/public/svgs/filter.svg";
import useSetParam from "@/hooks/use-set-param";

const statuses: { name: string; value: InvoiceStatus | "" }[] = [
  {
    name: "All",
    value: "",
  },
  {
    name: "Under Review",
    value: "under_review",
  },
  {
    name: "Approved",
    value: "approved",
  },
  {
    name: "Paid",
    value: "paid",
  },
  {
    name: "Disputed",
    value: "rejected",
  },
];

export default function FilterButton() {
  const useStatusFilterValues = useSetParam("status");
  const { value, handleSetParam, isPending } = useStatusFilterValues;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          data-statusfilterpending={isPending}
          className="bg-GreenHaze flex min-w-22.75 items-center justify-between gap-2 rounded-[32px] p-4 text-sm text-white"
        >
          <span>
            {value
              ? statuses.find((item) => item.value === value)?.name || "Filter"
              : "Filter"}
          </span>
          <Image src={filterIcon} alt="filter icon" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="rounded-base w-44 px-3 py-2">
        {statuses.map((item, index) => (
          <DropdownMenuItem
            key={index}
            onSelect={() => handleSetParam(item.value)}
          >
            {item.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
