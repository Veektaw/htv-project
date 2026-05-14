"use client";

import { ReactNode, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  activateUserAction,
  deactivateUserAction,
} from "@/services/actions/users.actions";
import { showToast } from "@/lib/toast";
import { User } from "@/types/auth";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog";
import { Button } from "@/app/_components/ui/button";
import { Spinner } from "@/app/_components/ui/spinner";

export default function ActivateUserModal({
  user,
  children,
}: {
  user: User;
  children: ReactNode;
}) {
  const { refresh } = useRouter();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    startTransition(async () => {
      try {
        const res = user.is_deactivated
          ? await activateUserAction(user.id)
          : await deactivateUserAction(user.id);

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
      <DialogContent className="flex min-h-127.75 flex-col items-center justify-center gap-10.5 rounded-[24px] px-13.75 py-7 sm:max-w-167.25">
        <DialogHeader className="sm:text-center">
          <DialogTitle className="text-Gunmetal mx-auto max-w-100.25 text-2xl font-bold">
            Are you sure you want to{" "}
            {user.is_deactivated ? "reactivate" : "deactivate"} this user?
          </DialogTitle>
          <DialogDescription className="mx-auto max-w-125.25 text-sm">
            {user.is_deactivated
              ? "Reactivating this account will immediately restore access to the system. The user will once again be able to log in and perform all authorized actions. All existing data and historical logs associated with the account will be fully accessible. This action can be reversed at any time by deactivating the user again."
              : "Deactivating this account will immediately revoke access to the system. The user will no longer be able to log in or perform any actions. All existing data associated with the account will be retained, but the account will remain inactive until reactivated by an administrator. This action can be reversed at any time by reactivating the user."}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose className="border-GreySuit text-MistBlue h-12 rounded-[44px] border bg-white px-13 text-sm font-semibold">
            Back
          </DialogClose>

          <form onSubmit={handleSubmit}>
            <Button
              variant="secondary"
              className="h-12 w-38"
              disabled={isPending}
            >
              {user.is_deactivated ? "Reactivate" : "Deactivate"}{" "}
              {isPending && <Spinner data-icon="inline-start" />}
            </Button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
