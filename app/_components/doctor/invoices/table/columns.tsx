import { ReactNode } from "react";
import { Column } from "@/app/_components/shared/table-component/table-component";
import { Invoice, InvoiceStatus } from "@/types/invoices";
import Status from "./columns/status";
import MenuActions from "@/app/_components/shared/menu-actions";
import Actions from "./columns/actions";

type ColumnType = Invoice & { actions?: ReactNode };

export const InvoiceColumns: Column<ColumnType>[] = [
  {
    title: "Invoice ID",
    key: "invoice_id",
    render: (value) => value as string,
  },
  {
    title: "Date created",
    key: "created_at",
    render: (value) => value as string,
  },
  {
    title: "Status",
    key: "status",
    render: (value) => <Status value={value as InvoiceStatus} />,
  },
  {
    title: "Payment Date",
    key: "payment_date",
    render: (value) => value as string,
  },
 {
    title: "",
    key: "actions",
    render: (_, record) => (
      <MenuActions>
        <Actions currentStatus={record.status} />
      </MenuActions>
    ),
  },
];
