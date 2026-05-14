"use client";

import { useReconciliations } from "@/app/_components/doctor/reconciliations/contexts/reconciliations-provider";
import { reconciliationColumns } from "./columns";
import TableComponent from "@/app/_components/shared/table-component/table-component";
import { Suspense } from "react";

export default function TableWrapper() {
  const { reconciliations } = useReconciliations();

  return (
    <Suspense
      fallback={
        <p className="text-center text-sm font-medium text-black">Loading...</p>
      }
    >
      <TableComponent
        title="All Reconciliations"
        columns={reconciliationColumns}
        data={reconciliations}
      />
    </Suspense>
  );
}
