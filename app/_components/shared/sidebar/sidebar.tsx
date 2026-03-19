import SidebarWrapper from "./sidebar-wrapper";
import SidebarLogoAndButton from "./sidebar-logo-and-button";
import SidebarLinks from "./sidebar-links";
import LogOutButton from "./log-out-button";

export default function Sidebar() {
  return (
    <SidebarWrapper>
      <SidebarLogoAndButton />
      <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-2.25 pb-6">
        <SidebarLinks />
        <LogOutButton />
      </div>
    </SidebarWrapper>
  );
}
