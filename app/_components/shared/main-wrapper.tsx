"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export default function MainWrapper({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <main
      className={cn(
        "flex-1 min-w-0 h-screen overflow-y-auto bg-[#eef1fa]",
        className
      )}
    >
      {children}
    </main>
  );
}
