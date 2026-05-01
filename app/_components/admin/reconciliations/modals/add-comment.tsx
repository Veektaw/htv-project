import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { addReconciliationCommentAction } from "@/services/actions/reconciliations.actions";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/_components/ui/dialog";
import { Button } from "@/app/_components/ui/button";
import { Spinner } from "@/app/_components/ui/spinner";
import { Textarea } from "@/app/_components/ui/textarea";
import { Reconciliation } from "@/types/reconciliations";
import { ActiveModal } from "../table/columns/actions";

export default function AddCommentModal({
  reconciliation,
  activeModal,
  setActiveModal,
}: {
  reconciliation: Reconciliation;
  activeModal: ActiveModal;
  setActiveModal: (modal: ActiveModal) => void;
}) {
  const { refresh } = useRouter();
  const [isPending, startTransition] = useTransition();
  const queryClient = useQueryClient();

  const [commentMessage, setCommentMessage] = useState("");

  const handleAddComment = async () => {
    if (!commentMessage.trim()) {
      showErrorToast("Please enter a comment");
      return;
    }

    startTransition(async () => {
      try {
        const result = await addReconciliationCommentAction(
          reconciliation.id,
          commentMessage,
        );
        if (result.success) {
          refresh();
          queryClient.invalidateQueries({
            queryKey: ["reconciliation-comments", reconciliation.id],
          });
          showSuccessToast("Comment added successfully");
          setActiveModal(null);
          setCommentMessage("");
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
        if (!open) setActiveModal(null);
      }}
    >
      <DialogContent aria-describedby={undefined}>
        <DialogHeader className="flex flex-col items-center justify-center gap-1 px-6 pt-6 pb-4 text-center">
          <DialogTitle>Add Comment</DialogTitle>
          <DialogDescription className="text-center">
            Add a comment help users better understand what needs to be done.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Enter your reasons here
            </label>
            <Textarea
              value={commentMessage}
              onChange={(e) => setCommentMessage(e.target.value)}
              placeholder="Enter your comment..."
              rows={20}
              className="resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <DialogClose className="border-GreySuit text-MistBlue h-12 min-w-32 rounded-[44px] border bg-white text-sm font-semibold">
            Cancel
          </DialogClose>

          <Button
            onClick={handleAddComment}
            disabled={!commentMessage.trim() || isPending}
            className="h-12 rounded-full bg-gray-900 font-medium text-white hover:bg-gray-800"
          >
            Add Comment {isPending && <Spinner />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
