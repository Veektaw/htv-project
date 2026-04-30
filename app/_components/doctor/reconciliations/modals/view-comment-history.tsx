"use client";

import { ReactNode, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { formatDate } from "@/lib/utils";
import { getDoctorReconciliationComments } from "@/services/apis/get-doctor-reconciliation-comments";
import { Reconciliation } from "@/types/reconciliations";
import { Spinner } from "@/app/_components/ui/spinner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog";
import Image from "next/image";
import arrowDown from "@/public/svgs/arrow-down.svg";

type ViewCommentHistoryModalProps = {
  children: ReactNode;
  reconciliation: Reconciliation;
};

export default function ViewCommentHistoryModal({
  children,
  reconciliation,
}: ViewCommentHistoryModalProps) {
  const [expandedCommentId, setExpandedCommentId] = useState<string | null>(
    null,
  );

  const { data, isPending, isSuccess, isError } = useQuery({
    queryKey: ["doctor-reconciliation-comments", reconciliation.id],
    queryFn: () => getDoctorReconciliationComments(reconciliation.id),
  });

  const toggleComment = (id: string) => {
    setExpandedCommentId(expandedCommentId === id ? null : id);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        aria-describedby={undefined}
        className="gap-10 rounded-[24px] sm:max-w-171.5"
      >
        <DialogHeader>
          <DialogTitle className="font-inter text-Mirage text-2xl font-bold">
            Comment History
          </DialogTitle>
        </DialogHeader>

        <div className="border-GreyCloud rounded-3xl border px-3 py-10.5">
          {isPending ? (
            <div className="flex items-center justify-center gap-2 py-8">
              <Spinner className="size-6" />
              <span className="text-sm text-gray-600">Loading comments...</span>
            </div>
          ) : isSuccess && data.data.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-sm text-gray-500">
                No comments found for this reconciliation.
              </p>
            </div>
          ) : isSuccess ? (
            <div className="flex flex-col gap-1.5">
              {data.data.map((comment) => {
                const isExpanded = expandedCommentId === comment.id;

                return (
                  <div
                    key={comment.id}
                    className="border-GreyCloud flex flex-col rounded-4xl border p-3 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-inter text-sm font-medium text-black">
                          {comment.full_name}
                        </p>
                      </div>
                      <div className="ml-4 flex items-center gap-4">
                        <p className="font-inter text-sm whitespace-nowrap text-black">
                          {formatDate(comment.created_at)}
                        </p>
                        <Image
                          src={arrowDown}
                          alt="toggle"
                          width={18}
                          height={18}
                          onClick={() => toggleComment(comment.id)}
                          className={`h-4.5 w-4.5 cursor-pointer transition-transform duration-200 ${
                            isExpanded ? "rotate-180" : "rotate-0"
                          }`}
                        />
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="mt-2 border-t border-gray-100 pt-2">
                        <p className="font-inter text-sm leading-5.5 text-gray-700">
                          {comment.message}
                        </p>
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
      </DialogContent>
    </Dialog>
  );
}
