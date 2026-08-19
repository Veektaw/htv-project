"use client";

import { MenuIcon } from "lucide-react";
import { useSiderbar } from "@/contexts/sidebar-provider";

export default function MobileNavTrigger() {
  const { setMobileNavOpen } = useSiderbar();

  return (
    <button
      type="button"
      aria-label="Open menu"
      onClick={() => setMobileNavOpen(true)}
      className="bg-BlueChalk flex size-9 shrink-0 items-center justify-center rounded-xl lg:hidden"
    >
      <MenuIcon className="size-5" />
    </button>
  );
}
