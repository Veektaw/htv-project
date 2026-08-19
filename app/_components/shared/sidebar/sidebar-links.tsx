"use client";

import { useSiderbar } from "@/contexts/sidebar-provider";
import SidebarLink from "./sidebar-link";

export default function SidebarLinks() {
  const { links, openSidebar } = useSiderbar();

  return (
    <nav className="space-y-1">
      {links.map((item) => (
        <div key={item.name} className="space-y-1">
          {item.sectionHeader && openSidebar && (
            <div className="text-MistBlue px-3.5 pt-3 pb-1 text-[11px] font-bold tracking-wider uppercase">
              {item.sectionHeader}
            </div>
          )}
          <SidebarLink item={item} />
        </div>
      ))}
    </nav>
  );
}
