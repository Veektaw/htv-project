"use client";

import { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog";
import { Reconciliation } from "@/types/reconciliations";

import ManualInvoiceForm from "./manual-invoice-form";

export default function CreateNewInvoiceModal({
  children,
  reconciliation,
}: {
  children: ReactNode;
  reconciliation?: Reconciliation;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      {/* Set the width directly to the manual form size (max-w-251) */}
      <DialogContent
        aria-describedby={undefined}
        className="gap-10 rounded-[24px] sm:max-w-251"
      >
        <DialogHeader>
          <DialogTitle className="font-inter text-2xl font-bold text-[#1D1E25]">
            Create invoice manually
          </DialogTitle>
        </DialogHeader>

        <ManualInvoiceForm
          key={reconciliation?.id ?? "manual-invoice-form"}
          reconciliation={reconciliation}
        />
      </DialogContent>
    </Dialog>
  );
}
