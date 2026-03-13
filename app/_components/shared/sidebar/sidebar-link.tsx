"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NavigationItem, useSiderbar } from "@/contexts/sidebar-provider";
import Link from "next/link";

export default function SidebarLink({ item }: { item: NavigationItem }) {
  const pathname = usePathname();
  const isActive = pathname.includes(item.href);

  const { openSidebar } = useSiderbar();

  return (
    <Link
      href={item.href}
      className={cn(
        "hover:bg-PortlandOrnage mx-auto flex items-center p-4 text-sm font-bold transition-all duration-300 hover:text-white",
        isActive ? "bg-PortlandOrnage text-white" : "text-OsloGrey",
        openSidebar
          ? "h-12.5 gap-3 rounded-[24px] hover:rounded-[24px]"
          : "rounded-xls hover:rounded-xls size-12.5 justify-center",
      )}
    >
      <item.icon />

      <span
        className={cn("transition-all duration-300", !openSidebar && "hidden")}
      >
        {item.name}
      </span>
    </Link>
  );
}
