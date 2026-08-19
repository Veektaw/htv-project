import { ReactNode } from "react";
import SidebarProvider from "@/contexts/sidebar-provider";
import Sidebar from "../_components/shared/sidebar/sidebar";
import MainWrapper from "../_components/shared/main-wrapper";
import { PartnersProvider } from "../_components/admin/partners/contexts/partners-context";

export default function layout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <PartnersProvider>
      <SidebarProvider>
        <div className="flex h-screen w-screen overflow-hidden bg-[#eef1fa]">
          <Sidebar />
          <MainWrapper className="bg-[#eef1fa]">{children}</MainWrapper>
        </div>
      </SidebarProvider>
    </PartnersProvider>
  );
}
