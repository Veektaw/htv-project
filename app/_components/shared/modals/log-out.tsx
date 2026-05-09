"use client";

import { ReactNode, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { logoutAction } from "@/services/actions/auth.actions";
import { showToast } from "@/lib/toast";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog";
import { Button } from "../../ui/button";
import { Spinner } from "../../ui/spinner";
import Image from "next/image";
import logOutIcon from "@/public/svgs/log-out.svg";

export default function LogOutModal({ children }: { children: ReactNode }) {
  const { push } = useRouter();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    startTransition(async () => {
      try {
        await logoutAction();
        push("/sign-in");
      } catch {
        showToast("Error logging out", "error");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent
        aria-describedby={undefined}
        className="flex min-h-138.25 flex-col items-center justify-center gap-9 rounded-[24px] sm:max-w-167.25"
      >
        <Image src={logOutIcon} alt="log-out" />

        <DialogHeader className="sm:text-center">
          <DialogTitle className="text-Gunmetal mx-auto max-w-80 text-2xl font-bold">
            Oh no! You are leaving... Are you sure?
          </DialogTitle>
        </DialogHeader>

        <DialogFooter>
          <DialogClose className="border-GreySuit text-MistBlue h-12 rounded-[44px] border bg-white px-13 text-sm font-semibold">
            Cancel
          </DialogClose>

          <form onSubmit={handleSubmit}>
            <Button
              variant="secondary"
              className="h-12 w-53"
              disabled={isPending}
            >
              Yes, log me out
              {isPending && <Spinner data-icon="inline-start" />}
            </Button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
