"use client";

import { ReactNode, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog";

import { Button } from "@/app/_components/ui/button";
import ManualInvoiceForm from "./manual-invoice-form";
import { cn } from "@/lib/utils";

export default function CreateNewInvoiceModal({
  children,
}: {
  children: ReactNode;
}) {
  const [step, setStep] = useState<"choice" | "manual" | "automatic">("choice");

  const handleOpenChange = (open: boolean) => {
    if (!open) setStep("choice");
  };

  return (
    <Dialog onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        aria-describedby={undefined}
        className={cn(
          "gap-10 rounded-[24px] transition-all duration-300",
          step === "manual" ? "sm:max-w-251" : "sm:max-w-167.25",
        )}
      >
        {step === "choice" && (
          <>
            <DialogHeader className="items-center justify-center">
              <DialogTitle className="font-inter text-center text-2xl leading-7.5 font-bold text-[#1D1E25]">
                Create new invoice manually <br /> or automatically
              </DialogTitle>
            </DialogHeader>

            <div className="mx-auto flex items-center gap-3">
              <Button
                onClick={() => setStep("manual")}
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
          </>
        )}

        {step === "manual" && (
          <>
            <DialogHeader>
              <DialogTitle className="font-inter text-2xl font-bold text-[#1D1E25]">
                Create invoice manually
              </DialogTitle>
            </DialogHeader>

            <ManualInvoiceForm />
          </>
        )}

        {step === "automatic" && (
          <>
            <DialogHeader>
              <DialogTitle className="font-inter text-2xl font-bold text-[#1D1E25]">
                Create invoice automatically
              </DialogTitle>
            </DialogHeader>

            <p className="text-center text-sm text-[#6E7079]">
              Automatic invoice creation is not available yet. Please choose
              manual creation for now.
            </p>

            <div className="mx-auto mt-6 flex items-center gap-3">
              <Button
                onClick={() => setStep("choice")}
                variant="secondary"
                className="font-inter border border-[#BEC0CA] bg-white px-13 py-3 text-sm leading-5.5 font-semibold text-[#6E7079] hover:text-white"
              >
                Back
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
