import { Suspense } from "react";
import { Metadata } from "next";
import Header from "@/app/_components/shared/header/header";
import SubHeader from "@/app/_components/admin/dashboard/sub-header";
import Loader from "@/app/_components/shared/loader";
import Card from "@/app/_components/shared/dashboard/card";
import TotalUsersCard from "@/app/_components/admin/dashboard/total-users-card";
import FilterButton from "@/app/_components/admin/dashboard/filter-button";
import RecentInvoices from "@/app/_components/admin/dashboard/recent-invoices/recent-invoices";
import RecentNotifications from "@/app/_components/admin/dashboard/notifications/recent-notifications";
import { getDashboardApi } from "@/services/apis/dashboard.api";

type PageParams = {
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

export const metadata: Metadata = {
  title: "Admin dashboard",
};

export default async function page({ searchParams }: PageParams) {
  const searchParamsValues = await searchParams;
  const dashboardRes = await getDashboardApi();

  const totalUsers = dashboardRes.ok ? dashboardRes.body.total_users : null;
  const totalOutstanding = dashboardRes.ok
    ? dashboardRes.body.total_outstanding_count
    : null;
  return (
    <section className="bg-GhostWhite flex h-full flex-col gap-y-3.5 px-9 py-6 shadow-[0px_9px_20px_0px_#101E730F]">
      <Header type="Admin">
        <SubHeader />
      </Header>

      <section className="flex flex-1 flex-col gap-y-6 overflow-y-auto rounded-sm bg-white px-8 py-8.5">
        <div className="grid gap-6 md:grid-cols-2">
          <TotalUsersCard
            value={totalUsers?.current_value ?? 0}
            percentage={`${totalUsers?.percentage ?? 0}%`}
          />
          <Card
            text="Outstanding Payments"
            value={totalOutstanding?.current_value ?? 0}
            percentage={`${totalOutstanding?.percentage ?? 0}%`}
          />
        </div>

        {/* <div className="flex w-full flex-col justify-between border lg:flex-row"> */}
        <div className="flex flex-col justify-center gap-10 space-y-8 rounded-lg px-4 py-6 lg:flex-row">
          <div className="border-Iron w-full space-y-8 rounded-lg border-2 px-4 py-6 lg:w-1/2 lg:max-w-202.25">
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
          <div className="border-Iron w-full space-y-8 rounded-lg border px-4 py-6 lg:w-1/2">
            <Suspense fallback={<Loader text="Getting notifications..." />}>
              <RecentNotifications />
            </Suspense>
          </div>
        </div>
        {/* </div> */}
      </section>
    </section>
  );
}
