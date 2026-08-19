import { ReactNode } from "react";
import Username from "./username";
import MobileNavTrigger from "./mobile-nav-trigger";
import { cn } from "@/lib/utils";

export default function Header({
  type,
  children,
}: {
  type: string;
  children?: ReactNode;
}) {
  const isPharmacy = type.toLowerCase() === "pharmacy";

  return (
    <header className="space-y-6">
      <section className="flex h-14 items-center justify-between gap-2 sm:gap-4">
        <div className="flex min-w-0 items-center gap-2 sm:gap-4">
          <MobileNavTrigger />

          <div className="shrink-0">
            <span
              className={cn(
                "inline-flex items-center justify-center rounded-2xl px-3.5 py-1.5 text-xs font-bold whitespace-nowrap text-white shadow-xs",
                isPharmacy ? "bg-[#2a6fc9]" : "bg-PortlandOrange"
              )}
            >
              {type}
            </span>
          </div>
        </div>

        <div className="min-w-0 shrink truncate text-right">
          <Username />
        </div>
      </section>

      {children}
    </header>
  );
}
