import { Metadata } from "next";
import Header from "@/app/_components/shared/header/header";
import PharmacyDashboard from "@/app/_components/pharmacy/pharmacy-dashboard";

export const metadata: Metadata = {
  title: "Dashboard | HTV Pharmacy",
};

export default function Page() {
  return (
    <div className="min-h-full p-4 sm:p-7 sm:px-9 sm:py-7 sm:pb-16 space-y-6">
      <Header type="Pharmacy" />
      <PharmacyDashboard />
    </div>
  );
}
