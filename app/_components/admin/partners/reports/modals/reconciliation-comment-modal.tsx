"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/_components/ui/dialog";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { usePartners } from "../../contexts/partners-context";
import { Pharmacy } from "@/types/partners";
import { MessageSquare, Send } from "lucide-react";

type ReconciliationCommentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  pharmacy: Pharmacy | null;
};

export default function ReconciliationCommentModal({
  isOpen,
  onClose,
  pharmacy,
}: ReconciliationCommentModalProps) {
  const { getComments, addComment } = usePartners();
  const [commentText, setCommentText] = useState("");

  if (!pharmacy) return null;

  const comments = getComments("reconciliation", pharmacy.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    addComment(
      "reconciliation",
      pharmacy.id,
      "Dr. Adaora Isaac (Admin)",
      commentText.trim()
    );
    setCommentText("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[620px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <MessageSquare className="text-PortlandOrange size-5" />
            <div>
              <DialogTitle className="text-xl font-bold text-RangoonGreen">
                Reconciliation Notes — {pharmacy.name}
              </DialogTitle>
              <p className="text-MistBlue text-xs">
                Raise discrepancy queries or document manual adjustments regarding this pharmacy&apos;s settlement.
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          {comments.length === 0 ? (
            <p className="text-MistBlue py-6 text-center text-xs">
              No reconciliation notes posted for {pharmacy.name} yet.
            </p>
          ) : (
            <div className="space-y-2.5">
              {comments.map((c) => (
                <div
                  key={c.id}
                  className="border-Iron rounded-xl border bg-GhostWhite p-3.5"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-RangoonGreen">
                      {c.author}
                    </span>
                    <span className="text-MistBlue">{c.date}</span>
                  </div>
                  <p className="text-RangoonGreen mt-1 text-xs leading-relaxed">
                    {c.text}
                  </p>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex gap-2 pt-2">
            <Input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Post a note or inquiry on this reconciliation..."
              className="text-xs"
            />
            <Button
              type="submit"
              disabled={!commentText.trim()}
              className="bg-RangoonGreen hover:bg-black rounded-full px-5 text-xs font-bold text-white"
            >
              <Send className="mr-1 size-3.5" /> Post
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
