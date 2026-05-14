"use client";

import { useReconciliations } from "../contexts/reconciliations-provider";
import { reconciliationColumns } from "./columns";
import TableComponent from "@/app/_components/shared/table-component/table-component";

export default function TableWrapper() {
  const { reconciliations } = useReconciliations();

  return (
    <TableComponent
      title="Doctors Reconciliations"
      columns={reconciliationColumns}
      data={reconciliations}
    />
  );
}
