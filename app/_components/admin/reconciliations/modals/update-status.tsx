"use client";

import { ReactNode, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateReconciliationAction } from "@/services/actions/reconciliations.actions";
import { showToast } from "@/lib/toast";
import { Reconciliation } from "@/types/reconciliations";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog";
import { Button } from "@/app/_components/ui/button";
import { Spinner } from "@/app/_components/ui/spinner";

export default function UpdateStatusModal({
  type,
  reconciliation,
  children,
}: {
  type: "approve" | "complete";
  reconciliation: Reconciliation;
  children: ReactNode;
}) {
  const { refresh } = useRouter();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const isApproveType = type === "approve";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    startTransition(async () => {
      try {
        const data = {
          action_type: type,
        };

        const res = await updateReconciliationAction(reconciliation.id, data);

        if (!res.error) {
          refresh();
          showToast(res.message);
          setOpen(false);
        } else {
          showToast(res.message, "error");
        }
      } catch {
        showToast("Something went wrong", "error");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        aria-describedby={undefined}
        className="flex min-h-96 flex-col items-center justify-center gap-10.5 rounded-[24px] px-13.75 py-7 sm:max-w-167.25"
      >
        <DialogHeader className="sm:text-center">
          <DialogTitle className="text-Gunmetal mx-auto max-w-100.25 text-2xl font-bold">
            Are you sure you want to {isApproveType ? "approve" : "complete"}{" "}
            this reconciliation?
          </DialogTitle>
        </DialogHeader>

        <DialogFooter>
          <DialogClose className="border-GreySuit text-MistBlue h-12 rounded-[44px] border bg-white px-13 text-sm font-semibold">
            Back
          </DialogClose>

          <form onSubmit={handleSubmit}>
            <Button
              variant="secondary"
              className="h-12 w-38 min-w-fit"
              disabled={isPending}
            >
              {isApproveType ? "Approve" : "Complete"}{" "}
              {isPending && <Spinner data-icon="inline-start" />}
            </Button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
