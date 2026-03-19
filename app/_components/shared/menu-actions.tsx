import { ReactNode } from "react";
import { EllipsisVertical } from "lucide-react";
import { Popover, PopoverTrigger } from "@/app/_components/ui/popover";

export default function MenuActions({ children }: { children: ReactNode }) {
  return (
    <Popover>
      <PopoverTrigger>
        <EllipsisVertical className="text-CloudyGrey h-4 w-6" />
      </PopoverTrigger>

      {children}
    </Popover>
  );
}
