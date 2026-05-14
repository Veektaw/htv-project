import { getDashboardStatsApi } from "@/services/apis/doctors-dashboard.api";
import { Suspense } from "react";
import Card, { CardLoader } from "../../shared/dashboard/card";

export type CardProps = {
  searchParamsValues: { [key: string]: string | undefined };
};

export default async function AllPrescriptionsCard({
  searchParamsValues,
}: CardProps) {
  const res = await getDashboardStatsApi({
    preset: searchParamsValues?.period,
  });

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
