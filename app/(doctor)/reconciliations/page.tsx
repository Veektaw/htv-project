import { Suspense } from "react";
import { Metadata } from "next";
import Header from "@/app/_components/shared/header/header";
import SubHeader from "@/app/_components/doctor/reconciliation/sub-header";
import Loader from "@/app/_components/shared/loader";
import DoctorReconciliations from "@/app/_components/doctor/reconciliation/doctor-reconciliations";

type PageParams = {
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

export const metadata: Metadata = {
  title: "Reconciliations",
};

export default async function page({ searchParams }: PageParams) {
  const searchParamsValues = await searchParams;

  return (
    <section className="bg-GhostWhite flex h-full flex-col gap-y-3.5 px-9 py-6">
      <Header type="Doctor">
        <SubHeader />
      </Header>

      <section className="flex-1 overflow-y-auto rounded-sm bg-white px-7 py-5.5 shadow-[0px_9px_20px_0px_#101E730F]">
        <Suspense fallback={<Loader text="Getting reconciliations..." />}>
          <DoctorReconciliations searchParamsValues={searchParamsValues} />
        </Suspense>
      </section>
    </section>
  );
}
