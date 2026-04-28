"use client";

import { ReactNode, useState } from "react";
import Image from "next/image";
import arrowDown from "@/public/svgs/arrow-down.svg";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog";
import { Invoice } from "@/types/invoices";
import { Spinner } from "@/app/_components/ui/spinner";
import { showErrorToast } from "@/lib/toast";
import { getDoctorComments } from "@/services/actions/invoices.actions";
import { formatDate } from "@/lib/utils";

type Comment = {
  id: string;
  full_name: string;
  message: string;
  created_at: string;
};

type ViewCommentHistoryModalProps = {
  children: ReactNode;
  invoice: Invoice;
};

export default function ViewCommentHistoryModal({
  children,
  invoice,
}: ViewCommentHistoryModalProps) {
  const [open, setOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  const [expandedCommentId, setExpandedCommentId] = useState<string | null>(
    null,
  );

  const fetchComments = async () => {
    if (hasFetched) return;

    try {
      setIsLoading(true);
      const result = await getDoctorComments(invoice.id, "invoice");

      console.log({ result });

      if (result.success) {
        setComments(result.data.comments || []);
        setHasFetched(true);
      } else {
        showErrorToast(result.error || "Failed to load comments");
      }
    } catch {
      // showErrorToast("An error occurred while loading comments");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen && !hasFetched) {
      fetchComments();
    }
  };

  const toggleComment = (id: string) => {
    setExpandedCommentId(expandedCommentId === id ? null : id);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        aria-describedby={undefined}
        className="gap-10 rounded-[24px] sm:max-w-171.5"
      >
        <DialogHeader>
          <DialogTitle className="font-inter text-2xl font-bold text-[#1D1E25]">
            Comment History
          </DialogTitle>
        </DialogHeader>

        <div className="rounded-3xl border border-[#B4B4B4] px-3 py-10.5">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Spinner className="h-6 w-6" />
              <span className="ml-2 text-sm text-gray-600">
                Loading comments...
              </span>
            </div>
          ) : comments.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-sm text-gray-500">
                No comments found for this invoice.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              {comments.map((comment) => {
                const isExpanded = expandedCommentId === comment.id;

                return (
                  <div
                    key={comment.id}
                    className="flex flex-col rounded-4xl border border-[#B4B4B4] p-3 transition-all duration-300"
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
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
