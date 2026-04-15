import { Suspense } from "react";
import { Metadata } from "next";
import Header from "@/app/_components/shared/header/header";
import SubHeader from "@/app/_components/admin/dashboard/sub-header";
import Loader from "@/app/_components/shared/loader";
import Card from "@/app/_components/shared/dashboard/card";
import TotalUsersCard from "@/app/_components/admin/dashboard/total-users-card";
import FilterButton from "@/app/_components/admin/dashboard/filter-button";
import RecentInvoices from "@/app/_components/admin/dashboard/recent-invoices";

type PageParams = {
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

export const metadata: Metadata = {
  title: "Admin dashboard",
};

export default async function page({ searchParams }: PageParams) {
  const searchParamsValues = await searchParams;

  return (
    <section className="bg-GhostWhite flex h-full flex-col gap-y-3.5 px-9 py-6 shadow-[0px_9px_20px_0px_#101E730F]">
      <Header type="Admin">
        <SubHeader />
      </Header>

      <section className="flex flex-1 flex-col gap-y-6 overflow-y-auto rounded-sm bg-white px-8 py-8.5">
        <div className="grid grid-cols-2 gap-6">
          <TotalUsersCard />
          <Card text="Outstanding Invoices" value={0} />
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
