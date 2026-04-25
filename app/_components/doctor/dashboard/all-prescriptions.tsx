import { Suspense } from "react";
import { getDashboardStatsApi } from "@/services/apis/doctors-dashboard.api";
import Card, { CardLoader } from "../../shared/dashboard/card";

export default async function AllPrescriptionsCard() {
  const res = await getDashboardStatsApi({});

  let prescriptionCount = 0;

  if (res.ok) {
    prescriptionCount = res.body.summary.total_prescription_count ?? 0;
  }

  return (
    <Suspense fallback={<CardLoader />}>
      <Card
        text="All prescriptions"
        value={prescriptionCount}
        percentage="+0%"
      />
    </Suspense>
  );
}
