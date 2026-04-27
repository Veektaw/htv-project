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
import SettingsIcon from "@/app/_components/shared/sidebar/icons/settings";
import ProfileIcon from "@/app/_components/shared/sidebar/icons/profile";

export type NavigationItem = {
  name: string;
  href: string;
  disabled?: boolean;
  icon: () => JSX.Element;
};

type SidebarContextType = {
  isAdminRoute: boolean;
  links: NavigationItem[];
  openSidebar: boolean;
  setOpenSidebar: Dispatch<SetStateAction<boolean>>;
};

const adminLinks = [
  { name: "Dashboard", href: "/admin/dashboard", icon: DashboardIcon },
  { name: "Users", href: "/admin/users", icon: UsersIcon },
  { name: "Invoices", href: "/admin/invoices", icon: InvoicesIcon },
  {
    name: "Prescriptions",
    href: "/admin/prescriptions",
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
  { name: "Settings", href: "/admin/settings", icon: SettingsIcon },
];

const links = [
  { name: "Dashboard", href: "/dashboard", icon: DashboardIcon },
  { name: "Invoices", href: "/invoices", icon: InvoicesIcon },
  { name: "Prescriptions", href: "/prescriptions", icon: PrescriptionsIcon },
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

  const isAdminRoute = pathname.split("/")[1] === "admin";

  const value: SidebarContextType = {
    isAdminRoute,
    links: isAdminRoute ? adminLinks : links,
    openSidebar,
    setOpenSidebar,
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
