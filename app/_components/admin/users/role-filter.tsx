"use client";

import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import { Button } from "@/app/_components/ui/button";
import { ChevronDown } from "lucide-react";
import useSetParam from "@/hooks/use-set-param";

const roles = [
  {
    name: "All",
    value: "",
  },
  {
    name: "Admin",
    value: "admin",
  },
  {
    name: "Doctor",
    value: "doctor",
  },
];

export default function RoleFilter() {
  const pathname = usePathname();
  const useRoleFilterValues = useSetParam("role");
  const { value, handleSetParam } = useRoleFilterValues;

  if (pathname !== "/admin/users") {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="group h-10.5 w-44 justify-between rounded-[24px] border border-black px-6 text-xs font-semibold text-black"
        >
          {value
            ? roles.find((item) => item.value === value)?.name ||
              "Click to select"
            : "All"}
          <ChevronDown className="transition-transform duration-300 group-data-[state=open]:rotate-180" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="rounded-base w-44 px-3 py-2">
        {roles.map((item, index) => (
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
