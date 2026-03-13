import { ReactNode } from "react";
import SidebarProvider from "@/contexts/sidebar-provider";
import Sidebar from "../_components/shared/sidebar/sidebar";

export default function layout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <SidebarProvider>
      <section className="flex h-screen">
        <Sidebar />

        <main className="flex-1 bg-white">{children}</main>
      </section>
    </SidebarProvider>
  );
}
