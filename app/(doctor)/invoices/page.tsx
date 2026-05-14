import { Suspense } from "react";
import { Metadata } from "next";
import Header from "@/app/_components/shared/header/header";
import SubHeader from "@/app/_components/doctor/invoices/sub-header";
import DoctorInvoices from "@/app/_components/doctor/invoices/doctor-invoices";
import Loader from "@/app/_components/shared/loader";

type PageParams = {
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

export const metadata: Metadata = {
  title: "Invoices",
};

export default async function InvoicesPage({ searchParams }: PageParams) {
  const searchParamsValues = await searchParams;

  return (
    <section className="bg-GhostWhite flex h-full flex-col gap-y-3.5 px-9 py-6">
      <Header type="Doctor">
        <SubHeader />
      </Header>

      <section className="flex-1 overflow-y-auto rounded-sm bg-white px-7 py-5.5 shadow-[0px_9px_20px_0px_#101E730F]">
        <Suspense fallback={<Loader text="Getting invoices..." />}>
          <DoctorInvoices searchParamsValues={searchParamsValues} />
        </Suspense>
      </section>
    </section>
  );
}
