import { ReactNode } from "react";
import { Column } from "@/app/_components/shared/table-component/table-component";
import { Prescription } from "@/types/prescriptions";
import { format } from "date-fns";

type ColumnType = Prescription & { actions?: ReactNode };

export const prescriptionColumns: Column<ColumnType>[] = [
  {
    title: "Date",
    key: "created_at",
    render: (value) => format(new Date(value as string), "do 'of' MMMM, y"),
  },
  {
    title: "Platform",
    key: "platform",
    render: (value) => value as string,
  },
  {
    title: "Prescription(s) Signed",
    key: "prescription_count",
    render: (value) => value as string,
  },
  {
    title: "Batch ID",
    key: "batch_id",
    render: (value) => value as string,
  },
];
