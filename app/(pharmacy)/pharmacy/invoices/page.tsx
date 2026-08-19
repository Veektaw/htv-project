import { Metadata } from "next";
import Header from "@/app/_components/shared/header/header";
import PharmacyInvoicesView from "@/app/_components/pharmacy/pharmacy-invoices-view";

export const metadata: Metadata = {
  title: "My Invoices | HTV Pharmacy",
};

export default function Page() {
  return (
    <div className="min-h-full p-4 sm:p-7 sm:px-9 sm:py-7 sm:pb-16 space-y-6">
      <Header type="Pharmacy" />
      <PharmacyInvoicesView />
    </div>
  );
}
