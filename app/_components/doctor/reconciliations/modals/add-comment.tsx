"use client";

import { ReactNode, useState, useTransition } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { addDoctorCommentAction } from "@/services/actions/invoices.actions";
import { showSuccessToast, showErrorToast } from "@/lib/toast";
import { Reconciliation } from "@/types/reconciliations";
import { Spinner } from "@/app/_components/ui/spinner";
import { Button } from "@/app/_components/ui/button";
import { ActiveModal } from "../table/columns/actions";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog";
import { Textarea } from "@/app/_components/ui/textarea";

type AddNewCommentModalProps = {
  children?: ReactNode;
  reconciliation: Reconciliation;
  activeModal?: ActiveModal;
  setActiveModal?: (modal: ActiveModal) => void;
};

export default function AddNewCommentModal({
  reconciliation,
  activeModal,
  children,
  setActiveModal,
}: AddNewCommentModalProps) {
  const { refresh } = useRouter();
  const [isPending, startTransition] = useTransition();
  const queryClient = useQueryClient();

  const [comment, setComment] = useState("");

  const handleAddComment = async () => {
    if (!comment.trim()) {
      showErrorToast("Please enter a comment");
      return;
    }

    startTransition(async () => {
      try {
        const result = await addDoctorCommentAction(reconciliation.id, comment);
        if (result.success) {
          refresh();
          queryClient.invalidateQueries({
            queryKey: ["reconciliation-comments", reconciliation.id],
          });
          showSuccessToast("Comment added successfully");
          setActiveModal?.(null);
          setComment("");
        } else {
          showErrorToast(result.error || "Failed to add comment");
        }
      } catch (error) {
        showErrorToast("Failed to add comment");
        console.error("Error adding comment:", error);
      }
    });
  };

  return (
    <Dialog
      open={activeModal === "addComment"}
      onOpenChange={(open) => {
        if (!open) setActiveModal?.(null);
      }}
    >
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
            className="resize-none px-3.5 py-4"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={20}
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="secondary"
              className="font-inter rounded-[44px] border border-[#BEC0CA] bg-white px-13 py-3 text-black hover:text-white"
              onClick={() => {
                setComment("");
              }}
              disabled={!comment.trim() || isPending}
            >
              Cancel
            </Button>
            <Button
              className="font-inter flex items-center gap-2 rounded-[44px] bg-black p-3 px-13"
              variant="secondary"
              onClick={handleAddComment}
              disabled={!comment.trim() || isPending}
            >
              Add Comment {isPending && <Spinner />}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
