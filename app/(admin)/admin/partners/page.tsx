import { Metadata } from "next";
import Header from "@/app/_components/shared/header/header";
import PharmacyList from "@/app/_components/admin/partners/pharmacy-list/pharmacy-list";

export const metadata: Metadata = {
  title: "Pharmacies | HTV Admin",
};

export default function PartnersPage() {
  return (
    <div className="min-h-full p-4 sm:p-7 sm:px-9 sm:py-7 sm:pb-16 space-y-6">
      <Header type="Admin" />
      <PharmacyList />
    </div>
  );
}
