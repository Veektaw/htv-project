"use client";

import { useReconciliations } from "@/app/_components/doctor/reconciliations/contexts/reconciliations-provider";
import { reconciliationColumns } from "./columns";
import TableComponent from "@/app/_components/shared/table-component/table-component";

export default function TableWrapper() {
  const { reconciliations } = useReconciliations();

  return (
    <TableComponent
      title="All Reconciliations"
      columns={reconciliationColumns}
      data={reconciliations}
    />
  );
}
