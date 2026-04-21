import { PopoverContent } from "@/app/_components/ui/popover";
import { Reconciliation } from "@/types/reconciliations";
import UpdateStatusModal from "../../modals/update-status";
import { useState } from "react";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import { addReconciliationComment } from "@/services/actions/reconciliations.actions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/app/_components/ui/dialog";
import { Textarea } from "@/app/_components/ui/textarea";
import { Button } from "@/app/_components/ui/button";
export default function Actions({
  reconciliation,
}: {
  reconciliation: Reconciliation;
}) {
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [commentMessage, setCommentMessage] = useState("");
  const handleAddComment = async () => {
    if (!commentMessage.trim()) {
      showErrorToast("Please enter a comment");
      return;
    }

    try {
      const result = await addReconciliationComment(
        reconciliation.id,
        commentMessage,
      );
      if (result.success) {
        showSuccessToast("Comment added successfully");
        setIsCommentModalOpen(false);
        setCommentMessage("");
      } else {
        showErrorToast(result.error || "Failed to add comment");
      }
    } catch (error) {
      showErrorToast("Failed to add comment");
      console.error("Error adding comment:", error);
    }
  };

  return (
    <>
      <PopoverContent className="rounded-base w-fit p-2">
        <ul className="text-CloudyGrey text-xs font-semibold">
          {reconciliation.status !== "approved" && (
            <li>
              <UpdateStatusModal type="approve" reconciliation={reconciliation}>
                <button className="rounded-base hover:bg-Geraldine size-full px-3 py-1 text-left transition-colors duration-300 hover:text-white">
                  Approve
                </button>
              </UpdateStatusModal>
            </li>
          )}
          <li>
            <UpdateStatusModal type="complete" reconciliation={reconciliation}>
              <button className="rounded-base hover:bg-Geraldine size-full px-3 py-1 text-left transition-colors duration-300 hover:text-white">
                Complete
              </button>
            </UpdateStatusModal>
          </li>
          <li>
            <button
              onClick={() => setIsCommentModalOpen(true)}
              className="rounded-base hover:bg-Geraldine size-full px-3 py-1 text-left transition-colors duration-300 hover:text-white"
            >
              Add Comment
            </button>
          </li>
          <li>
            <button
              onClick={() => setIsViewCommentsModalOpen(true)}
              className="rounded-base hover:bg-Geraldine size-full px-3 py-1 text-left transition-colors duration-300 hover:text-white"
            >
              View Comment
            </button>
          </li>
        </ul>
      </PopoverContent>
      <Dialog open={isCommentModalOpen} onOpenChange={setIsCommentModalOpen}>
        <DialogContent>
          <DialogHeader className="flex flex-col items-center justify-center gap-1 px-6 pt-6 pb-4 text-center">
            <DialogTitle>Add Comment</DialogTitle>
            <DialogDescription>
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
            <Button
              variant="outline"
              onClick={() => {
                setIsCommentModalOpen(false);
                setCommentMessage("");
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddComment}
              disabled={!commentMessage.trim()}
              className="rounded-full bg-gray-900 font-medium text-white hover:bg-gray-800"
            >
              Add Comment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
