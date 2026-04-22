import { ReactNode } from "react";
import { Column } from "@/app/_components/shared/table-component/table-component";
import { Invoice, InvoiceStatus } from "@/types/invoices";
import {
  formatInvoiceCreatedAtDate,
  formatPrescriptionDate,
} from "@/lib/utils";
import Status from "./columns/status";
import MenuActions from "@/app/_components/shared/menu-actions";
import Actions from "./columns/actions";

type ColumnType = Invoice & { actions?: ReactNode };

export const invoiceColumns: Column<ColumnType>[] = [
  {
    title: "Name",
    key: "full_name",
    render: (_, record) => record.user.full_name,
  },
  {
    title: "Month",
    key: "period_month",
    render: (value) => formatPrescriptionDate(value as string),
  },
  {
    title: "Invoice ID",
    key: "invoice_ref",
    render: (value) => value as string,
  },
  {
    title: "Amount",
    key: "amount",
    render: (value) =>
      `€${(value as number).toLocaleString("en-US", {
        maximumFractionDigits: 2,
      })}`,
  },
  {
    title: "Status",
    key: "status",
    render: (value) => <Status value={value as InvoiceStatus} />,
  },
  {
    title: "Date Created",
    key: "created_at",
    render: (value) => formatInvoiceCreatedAtDate(value as string),
  },
  {
    title: "",
    key: "actions",
    render: (_, record) => (
      <MenuActions>
        <Actions invoice={record} />
      </MenuActions>
    ),
  },
];
