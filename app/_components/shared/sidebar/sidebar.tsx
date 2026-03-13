import SidebarWrapper from "./sidebar-wrapper";
import SidebarLogoAndButton from "./sidebar-logo-and-button";
import SidebarLinks from "./sidebar-links";

export default function Sidebar() {
  return (
    <SidebarWrapper>
      <SidebarLogoAndButton />
      <SidebarLinks />
    </SidebarWrapper>
  );
}
