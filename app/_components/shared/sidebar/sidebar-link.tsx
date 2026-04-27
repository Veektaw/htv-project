// "use client";

// import { usePathname } from "next/navigation";
// import { cn } from "@/lib/utils";
// import { NavigationItem, useSiderbar } from "@/contexts/sidebar-provider";
// import Link from "next/link";

// export default function SidebarLink({ item }: { item: NavigationItem }) {
//   const pathname = usePathname();
//   const isActive = pathname.includes(item.href);

//   const { openSidebar } = useSiderbar();

//   return (
//     <Link
//       title={item.name}
//       href={item.href}
//       className={cn(
//         "hover:bg-PortlandOrange mx-auto flex items-center p-4 text-sm font-bold transition-all duration-300 hover:text-white",
//         isActive ? "bg-PortlandOrange text-white" : "text-OsloGrey",
//         openSidebar
//           ? "h-12.5 gap-3 rounded-[24px] hover:rounded-[24px]"
//           : "rounded-xls hover:rounded-xls size-12.5 justify-center",
//       )}
//     >
//       <item.icon />

//       <span
//         className={cn("transition-all duration-300", !openSidebar && "hidden")}
//       >
//         {item.name}
//       </span>
//     </Link>
//   );
// }

"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NavigationItem, useSiderbar } from "@/contexts/sidebar-provider";
import Link from "next/link";

export default function SidebarLink({ item }: { item: NavigationItem }) {
  const pathname = usePathname();
  const isActive = pathname.includes(item.href);

  const { openSidebar } = useSiderbar();

  const baseClass = cn(
    "mx-auto flex items-center p-4 text-sm font-bold transition-all duration-300",
    openSidebar
      ? "h-12.5 gap-3 rounded-[24px]"
      : "rounded-xls size-12.5 justify-center",
  );

  if (item.disabled) {
    return (
      <span
        title={`${item.name} (coming soon)`}
        className={cn(baseClass, "cursor-not-allowed opacity-40")}
      >
        <item.icon />
        <span
          className={cn(
            "transition-all duration-300",
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
        "hover:bg-PortlandOrange hover:text-white",
        isActive ? "bg-PortlandOrange text-white" : "text-OsloGrey",
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
