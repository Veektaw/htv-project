import { Suspense } from "react";
import { getDashboardStatsApi } from "@/services/apis/doctors-dashboard.api";
import Card, { CardLoader } from "../../shared/dashboard/card";

export default async function OutstandingInvoice() {
  const res = await getDashboardStatsApi({});

  let outstandingInvoice = 0;

  if (res.ok) {
    outstandingInvoice = res.body.summary.total_outstanding_count ?? 0;
  }

  return (
    <Suspense fallback={<CardLoader />}>
      <Card
        text="Outstanding Invoices"
        value={outstandingInvoice}
        percentage="+0%"
      />
    </Suspense>
  );
}
