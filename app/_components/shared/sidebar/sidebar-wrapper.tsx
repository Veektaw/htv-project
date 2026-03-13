"use client";

import { ReactNode } from "react";
import { useSiderbar } from "@/contexts/sidebar-provider";
import { cn } from "@/lib/utils";

export default function SidebarWrapper({ children }: { children: ReactNode }) {
  const { isAdminRoute, openSidebar } = useSiderbar();

  return (
    <aside
      className={cn(
        "h-full transition-all duration-300",
        isAdminRoute ? "bg-white" : "bg-black",
        openSidebar ? "w-sidebar-open" : "w-sidebar-close",
      )}
    >
      {children}
    </aside>
  );
}
