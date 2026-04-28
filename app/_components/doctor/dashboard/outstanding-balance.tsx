import { getDashboardStatsApi } from "@/services/apis/doctors-dashboard.api";
import { Suspense } from "react";
import { CardProps } from "./all-prescriptions";
import Card, { CardLoader } from "../../shared/dashboard/card";

export default async function OutstandingBalance({
  searchParamsValues,
}: CardProps) {
  const res = await getDashboardStatsApi({
    preset: searchParamsValues?.period,
  });

  let outstandingBalance = 0;

  if (res.ok) {
    outstandingBalance = res.body.summary.total_outstanding ?? 0;
  }

  return (
    <Suspense fallback={<CardLoader />}>
      <Card
        text="Outstanding Balance"
        value={outstandingBalance}
        percentage="+0%"
        showEuro
      />
    </Suspense>
  );
}
