"use client";

import { ReactNode } from "react";
import { useSiderbar } from "@/contexts/sidebar-provider";
import { cn } from "@/lib/utils";

export default function SidebarWrapper({ children }: { children: ReactNode }) {
  const { isAdminRoute, isPharmacyRoute, openSidebar, mobileNavOpen, setMobileNavOpen } =
    useSiderbar();

  return (
    <>
      <div
        onClick={() => setMobileNavOpen(false)}
        aria-hidden="true"
        className={cn(
          "fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 lg:hidden",
          mobileNavOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        )}
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-screen shrink-0 flex-col border-r border-[#e7e9f3] bg-white transition-all duration-300 lg:static lg:z-auto lg:translate-x-0",
          isAdminRoute || isPharmacyRoute ? "bg-white" : "bg-black",
          mobileNavOpen ? "translate-x-0" : "-translate-x-full",
          openSidebar ? "w-[236px]" : "w-[72px]"
        )}
      >
        {children}
      </aside>
    </>
  );
}
