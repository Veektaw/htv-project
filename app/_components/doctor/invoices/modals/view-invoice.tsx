"use client";

import { ReactNode } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog";
import { Invoice } from "@/types/invoices";
import { formatDate } from "@/lib/utils";
import { statuses } from "../table/columns/status";

type ViewCommentModalProps = {
  children: ReactNode;
  invoice: Invoice;
};

export default function ViewInvoiceModal({
  children,
  invoice,
}: ViewCommentModalProps) {
  const getStatusStyles = (status: string) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "text-GreenHaze";
      case "disputed":
        return "text-PortlandOrange";
      case "under review":
        return "text-LightMustard";
      default:
        return "text-gray-700";
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        aria-describedby={undefined}
        className="gap-10 rounded-[24px] sm:max-w-171.5"
      >
        <DialogHeader>
          <DialogTitle className="font-inter text-2xl font-bold text-[#1D1E25]">
            Invoice Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="font-semibold">Name:</label>
            <p>{invoice.user.full_name}</p>
          </div>
          <div>
            <label className="font-semibold">Invoice ID:</label>
            <p>{invoice.id}</p>
          </div>
          <div>
            <label className="font-semibold">Payment Date</label>
            <p>{invoice.created_at ? formatDate(invoice.updated_at) : "N/A"}</p>
          </div>
          <div>
            <label className="font-semibold">Status:</label>
            <p className={`${getStatusStyles(invoice.status)} capitalize`}>
              {statuses[invoice.status] || invoice.status}
            </p>
          </div>
          <div>
            <label className="font-semibold">Date Created:</label>
            <p>{invoice.created_at ? formatDate(invoice.updated_at) : "N/A"}</p>
          </div>
          <div>
            <label className="font-semibold">Invoice Ref</label>
            <p>{invoice.invoice_ref}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
