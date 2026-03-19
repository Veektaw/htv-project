"use client";

import { useSiderbar } from "@/contexts/sidebar-provider";
import SidebarLink from "./sidebar-link";

export default function SidebarLinks() {
  const { links } = useSiderbar();

  return (
    <nav className="space-y-3">
      {links.map((item) => (
        <SidebarLink key={item.name} item={item} />
      ))}
    </nav>
  );
}
