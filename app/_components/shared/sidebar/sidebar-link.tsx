"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NavigationItem, useSiderbar } from "@/contexts/sidebar-provider";
import Link from "next/link";

export default function SidebarLink({ item }: { item: NavigationItem }) {
  const pathname = usePathname();
  const { openSidebar } = useSiderbar();

  const isActive =
    pathname === item.href ||
    (item.href === "/admin/partners" && pathname.startsWith("/admin/partners")) ||
    (item.href !== "/admin" &&
      item.href !== "/admin/dashboard" &&
      item.href !== "/pharmacy/dashboard" &&
      item.href !== "/dashboard" &&
      pathname.startsWith(item.href));

  const baseClass = cn(
    "flex items-center text-[14px] font-semibold transition-all duration-200 cursor-pointer",
    openSidebar
      ? "h-11 px-3.5 gap-2.5 rounded-full"
      : "size-11 justify-center rounded-full mx-auto",
  );

  if (item.disabled) {
    return (
      <span
        title={`${item.name} (coming soon)`}
        className={cn(baseClass, "text-MistBlue/60 cursor-not-allowed opacity-50")}
      >
        <item.icon />
        <span
          className={cn(
            "transition-all duration-200",
            !openSidebar && "hidden",
          )}
        >
          {item.name}
        </span>
      </span>
    );
  }

  return (
    <Link
      title={item.name}
      href={item.href}
      className={cn(
        baseClass,
        isActive
          ? "bg-PortlandOrange text-white shadow-xs"
          : "text-MistBlue hover:bg-gray-100 hover:text-RangoonGreen",
      )}
    >
      <item.icon />
      <span
        className={cn(
          "flex flex-1 items-center justify-between transition-all duration-200",
          !openSidebar && "hidden",
        )}
      >
        <span>{item.name}</span>
      </span>
    </Link>
  );
}
