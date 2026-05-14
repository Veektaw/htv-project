"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import Image from "next/image";
import filterIcon from "@/public/svgs/filter.svg";
import useSetParam from "@/hooks/use-set-param";

const periods = [
  {
    name: "All",
    value: "all_time",
  },
  {
    name: "Today",
    value: "today",
  },
  {
    name: "Yesterday",
    value: "yesterday",
  },
  {
    name: "Last Week",
    value: "last_week",
  },
  {
    name: "Last Month",
    value: "last_month",
  },
  {
    name: "Last Quarter",
    value: "last_quarter",
  },
  {
    name: "Last 6 Months",
    value: "last_6_months",
  },
  {
    name: "Last Year",
    value: "last_year",
  },
];

export default function FilterButton() {
  const usePeriodFilterValues = useSetParam("period");
  const { value, handleSetParam, isPending } = usePeriodFilterValues;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          data-periodfilterpending={isPending}
          className="bg-GreenHaze flex min-w-22.75 items-center justify-between gap-2 rounded-[32px] p-4 text-sm text-white"
        >
          <span>
            {value
              ? periods.find((item) => item.value === value)?.name || "Filter"
              : "Filter"}
          </span>
          <Image src={filterIcon} alt="filter icon" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="rounded-base w-44 px-3 py-2">
        {periods.map((item, index) => (
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
