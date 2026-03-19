import { ReactNode } from "react";
import SidebarProvider from "@/contexts/sidebar-provider";
import Sidebar from "../_components/shared/sidebar/sidebar";
import MainWrapper from "../_components/shared/main-wrapper";

export default function layout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <SidebarProvider>
      <section className="flex h-screen">
        <Sidebar />

        <MainWrapper>{children}</MainWrapper>
      </section>
    </SidebarProvider>
  );
}
