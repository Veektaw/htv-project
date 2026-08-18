import { Metadata } from "next";
import Header from "@/app/_components/shared/header/header";
import PharmacyReports from "@/app/_components/admin/partners/reports/pharmacy-reports";

export const metadata: Metadata = {
  title: "Pharmacy Reports | HTV Admin",
};

export default function PharmacyReportsPage() {
  return (
    <div className="min-h-full p-4 sm:p-7 sm:px-9 sm:py-7 sm:pb-16 space-y-6">
      <Header type="Admin" />
      <PharmacyReports />
    </div>
  );
}
