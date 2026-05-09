"use client";

import { usePrescriptions } from "../contexts/prescriptions-provider";
import { prescriptionColumns } from "./columns";
import TableComponent from "@/app/_components/shared/table-component/table-component";

export default function TableWrapper() {
  const { prescriptions } = usePrescriptions();

  return (
    <TableComponent
      title="Doctors Prescriptions"
      columns={prescriptionColumns}
      data={prescriptions}
    />
  );
}
