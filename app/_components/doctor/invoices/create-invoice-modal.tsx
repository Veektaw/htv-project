"use client";

import { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog";

import { Button } from "@/app/_components/ui/button";

export default function CreateNewInvoiceModal({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        aria-describedby={undefined}
        className="gap-10 rounded-[24px]"
      >
        <DialogHeader className="items-center justify-center">
          <DialogTitle className="font-inter text-center text-2xl leading-7.5 font-bold text-[#1D1E25]">
            Create new invoice manually <br /> or automatically
          </DialogTitle>
        </DialogHeader>

        <div className="mx-auto flex items-center gap-3">
          <Button
            variant="secondary"
            className="font-inter border border-[#BEC0CA] bg-white px-13 py-3 text-sm leading-5.5 font-semibold text-[#6E7079] hover:text-white"
          >
            Create manually
          </Button>

          <Button
            variant="secondary"
            className="font-inter border border-[#BEC0CA] bg-white px-13 py-3 text-sm leading-5.5 font-semibold text-[#6E7079] hover:text-white"
          >
            Create automatically
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
