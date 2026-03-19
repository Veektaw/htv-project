"use client";

import { useSiderbar } from "@/contexts/sidebar-provider";
import { cn } from "@/lib/utils";
import LogOutModal from "../modals/log-out";
import LogOutIcon from "./icons/log-out";

export default function LogOutButton() {
  const { openSidebar } = useSiderbar();

  return (
    <LogOutModal>
      <button
        className={cn(
          "hover:bg-PortlandOrnage text-OsloGrey mx-auto flex w-full items-center p-4 text-sm font-bold transition-all duration-300 hover:text-white",
          openSidebar
            ? "h-12.5 gap-3 rounded-[24px] hover:rounded-[24px]"
            : "rounded-xls hover:rounded-xls size-12.5 justify-center",
        )}
      >
        <LogOutIcon />
        <span
          className={cn(
            "transition-all duration-300",
            !openSidebar && "hidden",
          )}
        >
          Log out
        </span>
      </button>
    </LogOutModal>
  );
}
