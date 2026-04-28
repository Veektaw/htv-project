import { getDashboardStatsApi } from "@/services/apis/doctors-dashboard.api";
import { Suspense } from "react";
import { CardProps } from "./all-prescriptions";
import Card, { CardLoader } from "../../shared/dashboard/card";

export default async function OutstandingPayments({
  searchParamsValues,
}: CardProps) {
  const res = await getDashboardStatsApi({
    preset: searchParamsValues?.period,
  });

  let outstandingInvoice = 0;

  if (res.ok) {
    outstandingInvoice = res.body.summary.total_outstanding_count ?? 0;
  }

  return (
    <Suspense fallback={<CardLoader />}>
      <Card
        text="Outstanding Payments"
        value={outstandingInvoice}
        percentage="+0%"
      />
    </Suspense>
  );
}
