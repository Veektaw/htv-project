import { getDashboardStatsApi } from "@/services/apis/doctors-dashboard.api";
import { Suspense } from "react";
import { CardProps } from "./all-prescriptions";
import Card, { CardLoader } from "../../shared/dashboard/card";

export default async function AllEarningsCard({
  searchParamsValues,
}: CardProps) {
  const res = await getDashboardStatsApi({
    preset: searchParamsValues?.period,
  });

  let totalEarnings = 0;

  if (res.ok) {
    totalEarnings = res.body.summary.total_paid ?? 0;
  }

  return (
    <Suspense fallback={<CardLoader />}>
      <Card text="Earnings" value={totalEarnings} percentage="+0%" showEuro />
    </Suspense>
  );
}
