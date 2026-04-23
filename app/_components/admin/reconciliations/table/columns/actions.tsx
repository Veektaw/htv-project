import { PopoverContent } from "@/app/_components/ui/popover";
import { Reconciliation } from "@/types/reconciliations";
import UpdateStatusModal from "../../modals/update-status";
import { useState } from "react";
import { showErrorToast, showSuccessToast } from "@/lib/toast";
import {
  addReconciliationComment,
  getReconciliationComments,
} from "@/services/actions/reconciliations.actions";
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
type InvoiceComment = {
  id: string;
  message: string;
  created_at?: string;
  full_name?: string;
};
export default function Actions({
  reconciliation,
}: {
  reconciliation: Reconciliation;
}) {
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [commentMessage, setCommentMessage] = useState("");
  const [isViewCommentsModalOpen, setIsViewCommentsModalOpen] = useState(false);
  const [comments, setComments] = useState<InvoiceComment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [expandedCommentId, setExpandedCommentId] = useState<string | null>(
    null,
  );
  const [commentsError, setCommentsError] = useState<string | null>(null);
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
  const handleViewComments = async () => {
    setIsViewCommentsModalOpen(true);
    setComments([]);
    setCommentsError(null);
    setIsLoadingComments(true);

    try {
      const result = await getReconciliationComments(reconciliation.id);
      if (result.success) {
        const commentsData = result.data?.comments;
        setComments(Array.isArray(commentsData) ? commentsData : []);
      } else {
        setCommentsError(result.error || "Failed to fetch comments");
      }
    } catch (error) {
      setCommentsError("Failed to fetch comments");
      console.error("Error fetching comments:", error);
    } finally {
      setIsLoadingComments(false);
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
            <UpdateStatusModal type="void" reconciliation={reconciliation}>
              <button className="rounded-base hover:bg-Geraldine size-full px-3 py-1 text-left transition-colors duration-300 hover:text-white">
                Void
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
              onClick={handleViewComments}
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
      <Dialog
        open={isViewCommentsModalOpen}
        onOpenChange={setIsViewCommentsModalOpen}
      >
        <DialogContent className="gap-0 overflow-hidden rounded-2xl p-0 sm:max-w-125">
          <DialogHeader className="px-6 pt-6 pb-4">
            <DialogTitle className="text-lg font-semibold text-gray-900">
              Comment
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-2 px-6 pb-6">
            {isLoadingComments ? (
              <p className="py-4 text-center text-sm text-gray-500">
                Loading comments...
              </p>
            ) : commentsError ? (
              <p className="text-destructive py-4 text-center text-sm">
                {commentsError}
              </p>
            ) : comments.length === 0 ? (
              <p className="py-4 text-center text-sm text-gray-500">
                No comments found for this invoice.
              </p>
            ) : (
              <div className="divide-y divide-gray-200 overflow-hidden rounded-xl border border-gray-200">
                {comments.map((comment) => {
                  const isExpanded = expandedCommentId === comment.id;
                  const formattedDate = comment.created_at
                    ? new Date(comment.created_at).toLocaleDateString("en-US", {
                        month: "2-digit",
                        day: "2-digit",
                        year: "numeric",
                      })
                    : "";
                  const formattedTime = comment.created_at
                    ? new Date(comment.created_at).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })
                    : "";

                  return (
                    <div key={comment.id} className="bg-white">
                      {/* Collapsed header row — always visible */}
                      <div
                        className="flex cursor-pointer items-center justify-between px-4 py-3 transition-colors hover:bg-gray-50"
                        onClick={() =>
                          setExpandedCommentId(isExpanded ? null : comment.id)
                        }
                      >
                        <div className="flex items-center gap-3 text-sm">
                          <span className="font-medium text-gray-900">
                            {comment.full_name || "Unknown"}
                          </span>
                          <span className="text-gray-500">
                            Commented on{" "}
                            <span className="font-medium text-gray-700">
                              {formattedDate}
                            </span>
                            {" | "}
                            <span className="font-medium text-gray-700">
                              {formattedTime}
                            </span>
                          </span>
                        </div>
                        <svg
                          className={`h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>

                      {/* Expanded message body */}
                      {isExpanded && (
                        <div className="border-t border-gray-100 px-4 pt-1 pb-4">
                          <p className="text-sm leading-relaxed text-gray-700">
                            {comment.message}
                          </p>
                          {comment.created_at && (
                            <p className="mt-3 text-xs text-gray-400">
                              {new Date(comment.created_at).toLocaleDateString(
                                "en-US",
                                {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                },
                              )}{" "}
                              | {formattedTime}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex items-center justify-center gap-3 px-6 pb-6">
            <Button
              variant="outline"
              onClick={() => setIsViewCommentsModalOpen(false)}
              className="flex-1 rounded-full border-gray-300 font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              onClick={() => setIsCommentModalOpen(true)}
              className="flex-1 rounded-full bg-gray-900 font-medium text-white hover:bg-gray-800"
            >
              Add Comment
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
