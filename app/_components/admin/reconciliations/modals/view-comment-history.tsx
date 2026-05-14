"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { getReconciliationComments } from "@/services/apis/get-reconciliation-comments";
import { Reconciliation } from "@/types/reconciliations";
import { Spinner } from "@/app/_components/ui/spinner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/_components/ui/dialog";
import { Button } from "@/app/_components/ui/button";
import { ActiveModal } from "../table/columns/actions";

type ViewCommentHistoryModalProps = {
  reconciliation: Reconciliation;
  activeModal: ActiveModal;
  setActiveModal: (modal: ActiveModal) => void;
};

export default function ViewCommentHistoryModal({
  reconciliation,
  activeModal,
  setActiveModal,
}: ViewCommentHistoryModalProps) {
  const [expandedCommentId, setExpandedCommentId] = useState<string | null>(
    null,
  );

  const { data, isPending, isSuccess, isError } = useQuery({
    queryKey: ["reconciliation-comments", reconciliation.id],
    queryFn: () => getReconciliationComments(reconciliation.id),
  });

  return (
    <Dialog
      open={activeModal === "viewComments"}
      onOpenChange={(open) => {
        if (!open) setActiveModal(null);
      }}
    >
      <DialogContent
        aria-describedby={undefined}
        className="gap-10 rounded-[24px] sm:max-w-171.5"
      >
        <DialogHeader>
          <DialogTitle className="font-inter text-Mirage text-2xl font-bold">
            Comment History
          </DialogTitle>
        </DialogHeader>

        <div className="rounded-3xl border border-[#] px-3 py-10.5">
          {isPending ? (
            <div className="flex items-center justify-center gap-2 py-8">
              <Spinner className="size-6" />
              <span className="text-sm text-gray-600">Loading comments...</span>
            </div>
          ) : isSuccess && data.data?.comments.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-sm text-gray-500">
                No comments found for this reconciliation.
              </p>
            </div>
          ) : isSuccess ? (
            <div className="flex flex-col gap-1.5">
              {data.data?.comments.map((comment) => {
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
                        className={cn(
                          "size-4 shrink-0 text-gray-400 transition-transform duration-200",
                          isExpanded && "rotate-180",
                        )}
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
          ) : isError ? (
            <div className="flex items-center justify-center gap-2 py-8">
              <p className="text-sm text-red-600">
                Failed to load comments. Please try again.
              </p>
            </div>
          ) : null}
        </div>

        <DialogFooter className="flex items-center justify-center gap-3 px-6 pb-6">
          <DialogClose className="border-GreySuit text-MistBlue h-12 min-w-32 rounded-[44px] border bg-white text-sm font-semibold">
            Cancel
          </DialogClose>

          <Button
            onClick={() => setActiveModal("addComment")}
            className="h-12 rounded-full bg-gray-900 font-medium text-white hover:bg-gray-800"
          >
            Add Comment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
