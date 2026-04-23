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

type ViewCommentModalProps = {
  children: ReactNode;
  invoice: Invoice;
};

export default function ViewCommentModal({
  children,
  invoice,
}: ViewCommentModalProps) {
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

        <div className="rounded-3xl border border-[#B4B4B4] px-6 py-10.5">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="font-inter text-sm font-medium text-gray-600">
                Name:
              </span>
              <span className="font-inter text-sm text-black">
                {invoice.user.full_name}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-inter text-sm font-medium text-gray-600">
                Invoice ID:
              </span>
              <span className="font-inter text-sm text-black">
                {invoice.id}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-inter text-sm font-medium text-gray-600">
                Payment Date:
              </span>
              <span className="font-inter text-sm text-black">
                {invoice.created_at ? formatDate(invoice.updated_at) : "N/A"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-inter text-sm font-medium text-gray-600">
                Status:
              </span>
              <span className="font-inter text-sm text-black capitalize">
                {invoice.status.replace("_", " ")}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
