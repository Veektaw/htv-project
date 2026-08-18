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
import { usePartners, VAT_RATE } from "../../contexts/partners-context";
import { PartnerInvoice, Pharmacy } from "@/types/partners";
import { Plus, MessageSquare, CreditCard, Send } from "lucide-react";
import RecordPaymentModal from "./record-payment-modal";

type ViewInvoiceModalProps = {
  isOpen: boolean;
  onClose: () => void;
  invoice: PartnerInvoice | null;
  pharmacy: Pharmacy;
};

export default function ViewInvoiceModal({
  isOpen,
  onClose,
  invoice,
  pharmacy,
}: ViewInvoiceModalProps) {
  const {
    getPaymentsForInvoice,
    getPaidAmountForInvoice,
    getComments,
    addComment,
  } = usePartners();

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [commentText, setCommentText] = useState("");

  if (!invoice) return null;

  const payments = getPaymentsForInvoice(invoice.id);
  const paid = getPaidAmountForInvoice(invoice.id);
  const comments = getComments("invoice", invoice.id);

  const net = invoice.amount / (1 + VAT_RATE / 100);
  const vat = invoice.amount - net;

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment("invoice", invoice.id, "Dr. Adaora Isaac (Admin)", commentText.trim());
    setCommentText("");
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[760px]">
          <DialogHeader>
            <div className="flex flex-wrap items-center justify-between gap-2 pr-6">
              <div>
                <DialogTitle className="text-xl font-bold text-RangoonGreen">
                  {invoice.number}
                </DialogTitle>
                <p className="text-MistBlue text-xs">
                  {invoice.direction === "htv_to_pharmacy"
                    ? `HTV → ${pharmacy.name}`
                    : `${pharmacy.name} → HTV`}{" "}
                  · {invoice.month} · Created {invoice.dateCreated}
                </p>
              </div>

              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${
                  invoice.status === "paid"
                    ? "bg-[#e1f5ea] text-[#1f9254]"
                    : invoice.status === "under_review"
                    ? "bg-[#fdf3d8] text-[#a9790a]"
                    : "bg-[#e4eefb] text-[#2a6fc9]"
                }`}
              >
                {invoice.status === "under_review"
                  ? "Under Review"
                  : invoice.status === "paid"
                  ? "Paid"
                  : "Pending"}
              </span>
            </div>
          </DialogHeader>

          <div className="space-y-6 py-2 text-xs">
            {/* Line Items Table */}
            <div className="border-Iron overflow-hidden rounded-xl border bg-white">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#eef0f7] text-CloudyGrey font-bold uppercase">
                  <tr>
                    <th className="px-4 py-3">Line Item Description</th>
                    <th className="px-4 py-3">Qty</th>
                    <th className="px-4 py-3">Unit Price</th>
                    <th className="px-4 py-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-Iron divide-y">
                  {invoice.lines.map((line, idx) => (
                    <tr key={idx} className="hover:bg-GhostWhite">
                      <td className="text-RangoonGreen px-4 py-3 font-medium">
                        {line.desc}
                        {line.type === "platform_fee" && (
                          <span className="bg-[#fdf3d8] text-[#a9790a] ml-2 inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold">
                            Platform Fee
                          </span>
                        )}
                      </td>
                      <td className="text-MistBlue px-4 py-3">
                        {line.qty ? line.qty.toLocaleString() : "—"}
                      </td>
                      <td className="text-MistBlue px-4 py-3">
                        {line.unitPrice ? `€${line.unitPrice.toFixed(2)}` : "—"}
                      </td>
                      <td className="text-RangoonGreen px-4 py-3 text-right font-bold">
                        €{line.amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-GhostWhite/50 text-MistBlue">
                    <td colSpan={3} className="px-4 py-2 text-right font-medium">
                      Subtotal (Net)
                    </td>
                    <td className="px-4 py-2 text-right font-medium">
                      €{net.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                  <tr className="bg-GhostWhite/50 text-MistBlue">
                    <td colSpan={3} className="px-4 py-2 text-right font-medium">
                      VAT ({VAT_RATE}% Standard)
                    </td>
                    <td className="px-4 py-2 text-right font-medium">
                      €{vat.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                  <tr className="bg-GhostWhite text-RangoonGreen font-extrabold text-sm border-t">
                    <td colSpan={3} className="px-4 py-3 text-right">
                      Total (Gross)
                    </td>
                    <td className="px-4 py-3 text-right text-PortlandOrange">
                      €{invoice.amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Recorded Payments Section */}
            <div className="border-Iron space-y-3 rounded-xl border bg-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="text-PortlandOrange size-4" />
                  <h4 className="text-RangoonGreen font-bold">
                    Recorded Payments (€{paid.toLocaleString()} of €{invoice.amount.toLocaleString()})
                  </h4>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsPaymentModalOpen(true)}
                  className="rounded-full text-xs font-bold"
                >
                  <Plus className="mr-1 size-3.5" /> Record Payment
                </Button>
              </div>

              {payments.length === 0 ? (
                <p className="text-MistBlue py-3 text-center text-xs">
                  No payments recorded for this invoice yet.
                </p>
              ) : (
                <div className="border-Iron overflow-hidden rounded-lg border">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#eef0f7] text-CloudyGrey font-bold uppercase">
                      <tr>
                        <th className="px-3.5 py-2">Method</th>
                        <th className="px-3.5 py-2">Amount</th>
                        <th className="px-3.5 py-2">Date Paid</th>
                        <th className="px-3.5 py-2">Reference</th>
                      </tr>
                    </thead>
                    <tbody className="divide-Iron divide-y">
                      {payments.map((p) => (
                        <tr key={p.id} className="hover:bg-GhostWhite">
                          <td className="px-3.5 py-2">
                            <span className="bg-BlueChalk text-RangoonGreen inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold capitalize">
                              {p.method === "adyen" ? "Adyen" : "Bank Transfer"}
                            </span>
                          </td>
                          <td className="px-3.5 py-2 font-bold text-[#1f9254]">
                            €{p.amount.toLocaleString()}
                          </td>
                          <td className="px-3.5 py-2 text-MistBlue">
                            {p.paidAt}
                          </td>
                          <td className="px-3.5 py-2 font-mono text-[11px] text-MistBlue">
                            {p.reference || "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Comment Thread */}
            <div className="border-Iron space-y-3 rounded-xl border bg-white p-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="text-PortlandOrange size-4" />
                <h4 className="text-RangoonGreen font-bold">
                  Invoice Discussion &amp; Notes ({comments.length})
                </h4>
              </div>

              {comments.length > 0 && (
                <div className="space-y-2">
                  {comments.map((c) => (
                    <div
                      key={c.id}
                      className="border-Iron rounded-lg border bg-GhostWhite p-3"
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-RangoonGreen">
                          {c.author}
                        </span>
                        <span className="text-MistBlue">{c.date}</span>
                      </div>
                      <p className="text-RangoonGreen mt-1 text-xs">{c.text}</p>
                    </div>
                  ))}
                </div>
              )}

              <form onSubmit={handlePostComment} className="flex gap-2 pt-1">
                <Input
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Leave a note or dispute explanation for this invoice..."
                  className="text-xs"
                />
                <Button
                  type="submit"
                  disabled={!commentText.trim()}
                  className="bg-RangoonGreen hover:bg-black rounded-full px-4 text-xs font-bold text-white"
                >
                  <Send className="mr-1 size-3.5" /> Post
                </Button>
              </form>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <RecordPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        invoice={invoice}
      />
    </>
  );
}
