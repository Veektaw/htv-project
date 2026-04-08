"use client";

import { useReconciliation } from "../contexts/reconciliation-provider";
import { reconciliationColumns } from "./columns";
import TableComponent from "@/app/_components/shared/table-component/table-component";

export default function TableWrapper() {
  const { reconciliations } = useReconciliation();

  return (
    <TableComponent
      title="Doctors Reconciliations"
      columns={reconciliationColumns}
      data={reconciliations}
    />
  );
}
