import { Suspense } from "react";
import { Metadata } from "next";
import Header from "@/app/_components/shared/header/header";
import SubHeader from "@/app/_components/doctor/dashboard/sub-header";
import Loader from "@/app/_components/shared/loader";
import AllPrescriptionsCard from "@/app/_components/doctor/dashboard/all-prescriptions";
import AllEarningsCard from "@/app/_components/doctor/dashboard/earnings";
import OutstandingBalance from "@/app/_components/doctor/dashboard/outstanding-balance";
import OutstandingInvoice from "@/app/_components/doctor/dashboard/outstanding-invoices";
import FilterButton from "@/app/_components/doctor/dashboard/filter-button";
import RecentInvoices from "@/app/_components/doctor/dashboard/recent-invoices/recent-invoices";

type PageParams = {
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

export const metadata: Metadata = {
  title: "Doctor dashboard",
};

export default async function page({ searchParams }: PageParams) {
  const searchParamsValues = await searchParams;

  return (
    <section className="bg-GhostWhite flex h-full flex-col gap-y-3.5 px-9 py-6 shadow-[0px_9px_20px_0px_#101E730F]">
      <Header type="Doctor">
        <SubHeader />
      </Header>

      <section className="flex flex-1 flex-col gap-y-6 overflow-y-auto rounded-sm bg-white px-8 py-8.5">
        <div className="grid gap-6 md:grid-cols-4">
          <AllPrescriptionsCard />
          <AllEarningsCard />
          <OutstandingBalance />
          <OutstandingInvoice />
        </div>

        <div className="border-Iron flex-1 space-y-8 rounded-lg border px-4 py-6">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-2">
              <h2 className="text-MediumGrey text-sm">Invoice</h2>
              <h3 className="text-DarkJungleGreen text-2xl font-bold">
                Recent Invoices
              </h3>
            </div>

            <FilterButton />
          </div>

          <Suspense fallback={<Loader text="Getting invoices..." />}>
            <RecentInvoices searchParamsValues={searchParamsValues} />
          </Suspense>
        </div>
      </section>
    </section>
  );
}
