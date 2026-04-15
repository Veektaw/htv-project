"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog";
import { Button } from "@/app/_components/ui/button";
import { deletePaymentAction } from "@/services/actions/payments.actions";
// import { toast } from "@/lib/toast";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

interface DeletePaymentModalProps {
  paymentId: string;
}

export default function DeletePaymentModal({ paymentId }: DeletePaymentModalProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const result = await deletePaymentAction(paymentId);
      if (result.error) {
        // toast.error(result.message);
      } else {
        // toast.success(result.message);
        setOpen(false);
        router.refresh();
      }
    } catch {
    //   toast.error("An error occurred while deleting the payment");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Delete Payment</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this payment? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}