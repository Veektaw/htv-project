"use client";

import { ReactNode, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { addDoctorCommentAction } from "@/services/actions/invoices.actions";
import { showSuccessToast, showErrorToast } from "@/lib/toast";
import { Invoice } from "@/types/invoices";
import { Spinner } from "@/app/_components/ui/spinner";
import { Button } from "@/app/_components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog";
import { Textarea } from "@/app/_components/ui/textarea";

type AddNewCommentModalProps = {
  children: ReactNode;
  invoice: Invoice;
};

export default function AddNewCommentModal({
  children,
  invoice,
}: AddNewCommentModalProps) {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAddComment = async () => {
    if (!comment.trim()) {
      showErrorToast("Please enter a comment");
      return;
    }

    try {
      setIsLoading(true);
      const result = await addDoctorCommentAction(
        invoice.id,
        comment,
        "invoice",
      );

      if (result.success) {
        queryClient.invalidateQueries({
          queryKey: ["invoice-comments", invoice.id],
        });
        showSuccessToast("Comment was added successfully");
        setComment("");
        setOpen(false);
      } else {
        showErrorToast(result.error || "Failed to add comment");
      }
    } catch {
      showErrorToast("An error occurred while adding the comment");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        aria-describedby={undefined}
        className="gap-10 rounded-[24px] sm:max-w-167.25"
      >
        <DialogHeader className="space-y-2">
          <DialogTitle className="font-inter text-Mirage text-2xl font-bold">
            Add comment
          </DialogTitle>
          <p className="font-inter text-sm leading-5.5 font-normal text-[#6E7079]">
            Add a comment helps users better understand what needs to be done
          </p>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="Add a comment"
            className="min-h-34.75 resize-none overflow-y-auto px-3.5 py-4"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={isLoading}
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="secondary"
              className="font-inter rounded-[44px] border border-[#BEC0CA] bg-white px-13 py-3 text-black hover:text-white"
              onClick={() => {
                setComment("");
                setOpen(false);
              }}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              className="font-inter flex items-center gap-2 rounded-[44px] bg-black p-3 px-13"
              variant="secondary"
              onClick={handleAddComment}
              disabled={isLoading}
            >
              {isLoading && <Spinner className="h-4 w-4" />}
              Add Comment
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
