import { Suspense } from "react";
import { Metadata } from "next";
import Header from "@/app/_components/shared/header/header";
import SubHeader from "@/app/_components/doctor/dashboard/sub-header";
import Loader from "@/app/_components/shared/loader";
import AllPrescriptionsCard from "@/app/_components/doctor/dashboard/all-prescriptions";
import AllEarningsCard from "@/app/_components/doctor/dashboard/earnings";
import OutstandingBalance from "@/app/_components/doctor/dashboard/outstanding-balance";
import OutstandingPayments from "@/app/_components/doctor/dashboard/outstanding-payments";
import FilterButton from "@/app/_components/doctor/dashboard/filter-button";
import FilterButtonTwo from "@/app/_components/doctor/dashboard/recent-invoices/filter-button";
import RecentInvoices from "@/app/_components/doctor/dashboard/recent-invoices/recent-invoices";
import RecentNotifications, {
  NotificationsLoader,
} from "@/app/_components/doctor/dashboard/notifications/recent-notifications";

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
        <div className="flex items-center justify-end">
          <FilterButton />
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <AllPrescriptionsCard searchParamsValues={searchParamsValues} />
          <AllEarningsCard searchParamsValues={searchParamsValues} />
          <OutstandingBalance searchParamsValues={searchParamsValues} />
          <OutstandingPayments searchParamsValues={searchParamsValues} />
        </div>

        <div className="flex flex-1 flex-col gap-4 lg:flex-row">
          <div className="border-Iron w-[calc(100%-424px)] space-y-2 rounded-lg border px-2 py-3 lg:px-4 lg:py-6">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-2">
                <h2 className="text-MediumGrey text-sm">Invoice</h2>
                <h3 className="text-DarkJungleGreen text-xl font-bold lg:text-2xl">
                  Recent Invoices
                </h3>
              </div>

              <FilterButtonTwo />
            </div>

            <Suspense fallback={<Loader text="Getting invoices..." />}>
              <RecentInvoices searchParamsValues={searchParamsValues} />
            </Suspense>
          </div>

          <Suspense fallback={<NotificationsLoader />}>
            <RecentNotifications />
          </Suspense>
        </div>
      </section>
    </section>
  );
}
