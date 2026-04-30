"use client";

import { ReactNode, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog";
import { Reconciliation } from "@/types/reconciliations";
import { UserSessionData } from "@/types/auth";

import ManualInvoiceForm from "../manual-invoice-form";

export default function CreateNewInvoiceModal({
  children,
  reconciliation,
  user,
}: {
  children: ReactNode;
  reconciliation?: Reconciliation;
  user?: UserSessionData;
}) {
  const [open, setOpen] = useState(false);
  const title = reconciliation ? "Create invoice" : "Create invoice manually";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        aria-describedby={undefined}
        className="gap-10 rounded-[24px] sm:max-w-251"
      >
        <DialogHeader>
          <DialogTitle className="font-inter text-Mirage text-2xl font-bold">
            {title}
          </DialogTitle>
        </DialogHeader>

        <ManualInvoiceForm
          key={reconciliation?.id ?? user?.id ?? "manual-invoice-form"}
          reconciliation={reconciliation}
          user={user}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
