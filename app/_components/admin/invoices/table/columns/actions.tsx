import { useState } from "react";
import { PopoverContent } from "@/app/_components/ui/popover";
import { ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/app/_components/ui/dialog";
import { Button } from "@/app/_components/ui/button";
import { Textarea } from "@/app/_components/ui/textarea";
import { Invoice } from "@/types/invoices";
import {
  updateInvoiceStatus,
  addInvoiceComment,
  getInvoiceComments,
  resendInvoiceEmailAction,
  downloadInvoiceAction,
} from "@/services/actions/invoices.actions";
import { showSuccessToast, showErrorToast } from "@/lib/toast";
import { useInvoices } from "../../contexts/invoices-provider";

const STATUS_OPTIONS = ["Paid", "Under Review", "Dispute Invoice"];

const STATUS_MAP = {
  Paid: "paid",
  // Approve: "approve",
  "Under Review": "under_review",
  "Dispute Invoice": "dispute",
};

const STATUS_DISPLAY_MAP = {
  paid: "Paid",
  // approved: "Approved",
  under_review: "Under Review",
  rejected: "Dispute Invoice",
};

interface ActionsProps {
  invoice: Invoice;
}

type InvoiceComment = {
  id: string;
  message: string;
  created_at?: string;
  full_name?: string;
};

export default function Actions({ invoice }: ActionsProps) {
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [isViewCommentsModalOpen, setIsViewCommentsModalOpen] = useState(false);
  const [disputeMessage, setDisputeMessage] = useState("");
  const [commentMessage, setCommentMessage] = useState("");
  const [comments, setComments] = useState<InvoiceComment[]>([]);
  const [expandedCommentId, setExpandedCommentId] = useState<string | null>(
    null,
  );
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [commentsError, setCommentsError] = useState<string | null>(null);
  const { updateInvoice } = useInvoices();

  const handleStatusSelect = (status: string) => {
    if (status === "Dispute Invoice") {
      setIsDisputeModalOpen(true);
    } else {
      handleStatusUpdate(status);
    }
    setShowStatusDropdown(false);
  };

  const handleStatusUpdate = async (
    status: string,
    disputeMessage?: string,
  ) => {
    try {
      const actionType = STATUS_MAP[status as keyof typeof STATUS_MAP];
      const result = await updateInvoiceStatus(
        invoice.id,
        actionType,
        disputeMessage,
      );
      if (result.success) {
        const updatedInvoice = result.data || {
          ...invoice,
          status:
            actionType === "dispute"
              ? "rejected"
              : (actionType as Invoice["status"]),
        };
        updateInvoice(updatedInvoice);
        showSuccessToast(`Invoice status updated to ${status}`);
        setIsDisputeModalOpen(false);
        setDisputeMessage("");
      } else {
        showErrorToast(result.error || "Failed to update invoice status");
      }
    } catch (error) {
      showErrorToast("Failed to update invoice status");
      console.error("Error updating status:", error);
    }
  };

  const handleAddComment = async () => {
    if (!commentMessage.trim()) {
      showErrorToast("Please enter a comment");
      return;
    }

    try {
      const result = await addInvoiceComment(invoice.id, commentMessage);
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
      const result = await getInvoiceComments(invoice.id);
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

  const handleDownloadInvoice = async () => {
    try {
      const result = await downloadInvoiceAction(invoice.id);

      if (!result.error && result.base64) {
        const binary = Uint8Array.from(atob(result.base64), (c) =>
          c.charCodeAt(0),
        );
        const blob = new Blob([binary], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `invoice_${invoice.invoice_ref}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
        URL.revokeObjectURL(url);
      } else {
        showErrorToast("Failed to download invoice");
      }
    } catch (error) {
      showErrorToast("Failed to download invoice");
      console.error("Error downloading invoice:", error);
    }
  };

  const handleResendEmail = async () => {
    try {
      const result = await resendInvoiceEmailAction(invoice.id);
      if (result.success) {
        showSuccessToast(result.message || "Invoice email resent successfully");
      } else {
        showErrorToast(result.error || "Failed to resend invoice email");
      }
    } catch (error) {
      showErrorToast("Failed to resend invoice email");
      console.error("Error resending invoice email:", error);
    }
  };

  return (
    <>
      <PopoverContent className="rounded-base w-45 cursor-pointer p-2">
        <ul className="text-CloudyGrey text-xs font-semibold">
          <li
            className="rounded-base hover:bg-Geraldine block w-full cursor-pointer px-3 py-1 text-left transition-colors duration-300 hover:text-white"
            onClick={() => setIsViewModalOpen(true)}
          >
            View
          </li>

          {/* Update Status with nested dropdown */}
          <li className="rounded-base block w-full text-left">
            <button
              className="hover:bg-Geraldine flex w-full items-center justify-between rounded px-3 py-1 transition-colors duration-300 hover:text-white"
              onClick={() => setShowStatusDropdown((prev) => !prev)}
            >
              Update status
              <ChevronRight
                className={`h-3 w-3 transition-transform duration-200 ${
                  showStatusDropdown ? "rotate-90" : ""
                }`}
              />
            </button>

            {/* Status options */}
            {showStatusDropdown && (
              <ul className="bg-CloudyGrey/5 border-CloudyGrey/20 mt-1 rounded border">
                {STATUS_OPTIONS.map((status) => {
                  const isCurrentStatus =
                    status ===
                    (STATUS_DISPLAY_MAP[
                      invoice.status as keyof typeof STATUS_DISPLAY_MAP
                    ] || invoice.status);

                  return (
                    <li
                      key={status}
                      className={`px-4 py-1 text-left transition-colors duration-300 ${
                        isCurrentStatus
                          ? "cursor-not-allowed opacity-40"
                          : "hover:bg-Geraldine cursor-pointer hover:text-white"
                      }`}
                      onClick={() => {
                        if (isCurrentStatus) return;
                        handleStatusSelect(status);
                      }}
                    >
                      {status}
                      {isCurrentStatus && (
                        <span className="ml-1 text-[10px]">(current)</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </li>

          <li
            className="rounded-base hover:bg-Geraldine block w-full cursor-pointer px-3 py-1 text-left transition-colors duration-300 hover:text-white"
            onClick={() => setIsCommentModalOpen(true)}
          >
            Add Comment
          </li>
          <li
            className="rounded-base hover:bg-Geraldine block w-full cursor-pointer px-3 py-1 text-left transition-colors duration-300 hover:text-white"
            onClick={handleViewComments}
          >
            View Comment
          </li>
          <li
            className="rounded-base hover:bg-Geraldine block w-full cursor-pointer px-3 py-1 text-left transition-colors duration-300 hover:text-white"
            onClick={handleDownloadInvoice}
          >
            Download Invoice
          </li>
          <li
            className="rounded-base hover:bg-Geraldine block w-full cursor-pointer px-3 py-1 text-left transition-colors duration-300 hover:text-white"
            onClick={handleResendEmail}
          >
            Resend Mail
          </li>
          <li className="rounded-base block w-full cursor-not-allowed px-3 py-1 text-left opacity-40">
            View Receipt
          </li>
          <li className="rounded-base block w-full cursor-not-allowed px-3 py-1 text-left opacity-40">
            Upload Receipt
          </li>
        </ul>
      </PopoverContent>

      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invoice Details</DialogTitle>
            <DialogDescription>
              Details for invoice {invoice.invoice_ref}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="font-semibold">Name:</label>
              <p>{invoice.user.full_name}</p>
            </div>
            <div>
              <label className="font-semibold">Invoice ID:</label>
              <p>{invoice.invoice_ref}</p>
            </div>
            <div>
              <label className="font-semibold">Amount:</label>
              <p>
                €
                {invoice.amount.toLocaleString("en-US", {
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
            <div>
              <label className="font-semibold">Status:</label>
              <p>{invoice.status}</p>
            </div>
            <div>
              <label className="font-semibold">Date Created:</label>
              <p>{new Date(invoice.created_at).toLocaleDateString()}</p>
            </div>
            <div>
              <label className="font-semibold">Period Month:</label>
              <p>{invoice.period_month}</p>
            </div>
            <div>
              <label className="font-semibold">Platform:</label>
              <p>{invoice.platform}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isDisputeModalOpen} onOpenChange={setIsDisputeModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dispute Invoice</DialogTitle>
            <DialogDescription>
              Please provide a reason for disputing this invoice.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Dispute Message
              </label>
              <Textarea
                value={disputeMessage}
                onChange={(e) => setDisputeMessage(e.target.value)}
                placeholder="Enter the reason for disputing this invoice..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDisputeModalOpen(false);
                setDisputeMessage("");
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() =>
                handleStatusUpdate("Dispute Invoice", disputeMessage)
              }
              disabled={!disputeMessage.trim()}
            >
              Submit Dispute
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
                rows={4}
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
