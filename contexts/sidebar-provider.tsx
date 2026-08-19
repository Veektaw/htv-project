"use client";

import {
  createContext,
  Dispatch,
  JSX,
  ReactNode,
  SetStateAction,
  use,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import DashboardIcon from "@/app/_components/shared/sidebar/icons/dashboard";
import UsersIcon from "@/app/_components/shared/sidebar/icons/users";
import InvoicesIcon from "@/app/_components/shared/sidebar/icons/invoices";
import PrescriptionsIcon from "@/app/_components/shared/sidebar/icons/prescriptions";
import PaymentsIcon from "@/app/_components/shared/sidebar/icons/payments";
import ReconciliationsIcon from "@/app/_components/shared/sidebar/icons/reconciliations";
import AppointmentsIcon from "@/app/_components/shared/sidebar/icons/appointments";
import PharmacyIcon from "@/app/_components/shared/sidebar/icons/pharmacy";
import FeesIcon from "@/app/_components/shared/sidebar/icons/fees";
import ReportsIcon from "@/app/_components/shared/sidebar/icons/reports";
import SettingsIcon from "@/app/_components/shared/sidebar/icons/settings";
import ProfileIcon from "@/app/_components/shared/sidebar/icons/profile";
import PortalInvoicesIcon from "@/app/_components/shared/sidebar/icons/portal-invoices";
import PortalTeamIcon from "@/app/_components/shared/sidebar/icons/portal-team";

export type NavigationItem = {
  name: string;
  href: string;
  disabled?: boolean;
  isNew?: boolean;
  sectionHeader?: string;
  icon: () => JSX.Element;
};

type SidebarContextType = {
  isAdminRoute: boolean;
  isPharmacyRoute: boolean;
  links: NavigationItem[];
  openSidebar: boolean;
  setOpenSidebar: Dispatch<SetStateAction<boolean>>;
  mobileNavOpen: boolean;
  setMobileNavOpen: Dispatch<SetStateAction<boolean>>;
};

const adminLinks: NavigationItem[] = [
  { name: "Dashboard", href: "/admin/dashboard", icon: DashboardIcon },
  { name: "Users", href: "/admin/users", icon: UsersIcon },
  { name: "Invoices", href: "/admin/invoices", icon: InvoicesIcon },
  {
    name: "Cases",
    href: "/admin/cases",
    icon: PrescriptionsIcon,
  },
  { name: "Payments", href: "/admin/payments", icon: PaymentsIcon },
  {
    name: "Reconciliations",
    href: "/admin/reconciliations",
    icon: ReconciliationsIcon,
  },
  {
    name: "Appointments",
    href: "/admin/appointments",
    icon: AppointmentsIcon,
    disabled: true,
  },
  {
    name: "Pharmacy",
    href: "/admin/partners",
    icon: PharmacyIcon,
    sectionHeader: "PARTNERS",
  },
  {
    name: "Platform Fees",
    href: "/admin/platform-fees",
    icon: FeesIcon,
    sectionHeader: "PHARMACY ADMIN",
  },
  {
    name: "Pharmacy Reports",
    href: "/admin/pharmacy-reports",
    icon: ReportsIcon,
  },
  { name: "Settings", href: "/admin/settings", icon: SettingsIcon },
];

const pharmacyLinks: NavigationItem[] = [
  {
    name: "Dashboard",
    href: "/pharmacy/dashboard",
    icon: DashboardIcon,
    sectionHeader: "LAGOS CENTRAL PHARMACY",
  },
  {
    name: "My Products",
    href: "/pharmacy/products",
    icon: PharmacyIcon,
  },
  {
    name: "My Invoices",
    href: "/pharmacy/invoices",
    icon: PortalInvoicesIcon,
  },
  {
    name: "My Team",
    href: "/pharmacy/team",
    icon: PortalTeamIcon,
  },
];

const doctorLinks: NavigationItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: DashboardIcon },
  { name: "Invoices", href: "/invoices", icon: InvoicesIcon },
  { name: "Cases", href: "/cases", icon: PrescriptionsIcon },
  { name: "Payments", href: "/payments", icon: PaymentsIcon },
  {
    name: "Reconciliations",
    href: "/reconciliations",
    icon: ReconciliationsIcon,
  },
  { name: "Profile", href: "/profile", icon: ProfileIcon },
];

const SidebarContext = createContext<SidebarContextType>(
  {} as SidebarContextType,
);

export default function SidebarProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [openSidebar, setOpenSidebar] = useState(true);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);

  const segment = pathname.split("/")[1];
  const isAdminRoute = segment === "admin";
  const isPharmacyRoute = segment === "pharmacy";

  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMobileNavOpen(false);
  }

  const activeLinks = isAdminRoute
    ? adminLinks
    : isPharmacyRoute
    ? pharmacyLinks
    : doctorLinks;

  const value: SidebarContextType = {
    isAdminRoute,
    isPharmacyRoute,
    links: activeLinks,
    openSidebar,
    setOpenSidebar,
    mobileNavOpen,
    setMobileNavOpen,
  };

  return <SidebarContext value={value}>{children}</SidebarContext>;
}

export function useSiderbar() {
  const context = use(SidebarContext);

  if (context === undefined) {
    throw new Error("useSiderbar must be used within a SidebarProvider");
  }

  return context;
}
