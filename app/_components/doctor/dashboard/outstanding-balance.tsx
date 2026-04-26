import { Suspense } from "react";
import { getDashboardStatsApi } from "@/services/apis/doctors-dashboard.api";
import Card, { CardLoader } from "../../shared/dashboard/card";

export default async function OutstandingBalance() {
  const res = await getDashboardStatsApi({});

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
      />
    </Suspense>
  );
}
