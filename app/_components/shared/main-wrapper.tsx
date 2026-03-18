"use client";

import { useSiderbar } from "@/contexts/sidebar-provider";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export default function MainWrapper({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const { openSidebar } = useSiderbar();

  return (
    <main
      className={cn(
        "bg-white",
        className,
        openSidebar
          ? "w-[calc(100%-var(--sidebar-width-open))]"
          : "w-[calc(100%-var(--sidebar-width-close))]",
      )}
    >
      {children}
    </main>
  );
}
