import { Suspense } from "react";
import { getDashboardStatsApi } from "@/services/apis/doctors-dashboard.api";
import Card, { CardLoader } from "../../shared/dashboard/card";

export default async function AllEarningsCard() {
  const res = await getDashboardStatsApi({});

  let totalEarnings = 0;

  if (res.ok) {
    totalEarnings = res.body.summary.total_paid ?? 0;
  }

  return (
    <Suspense fallback={<CardLoader />}>
      <Card text="Earnings" value={totalEarnings} percentage="+0%" />
    </Suspense>
  );
}
