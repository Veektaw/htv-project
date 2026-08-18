"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/app/_components/ui/dialog";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { Label } from "@/app/_components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import { usePartners } from "../../contexts/partners-context";
import { PartnerInvoice, PaymentMethod } from "@/types/partners";
import { showErrorToast } from "@/lib/toast";

type RecordPaymentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  invoice: PartnerInvoice | null;
};

function RecordPaymentForm({
  invoice,
  onClose,
}: {
  invoice: PartnerInvoice;
  onClose: () => void;
}) {
  const { recordPayment, getPaidAmountForInvoice } = usePartners();

  const alreadyPaid = getPaidAmountForInvoice(invoice.id);
  const remaining = Math.max(0, invoice.amount - alreadyPaid);

  const [method, setMethod] = useState<PaymentMethod>("adyen");
  const [amount, setAmount] = useState<string>(String(remaining));
  const [paidAt, setPaidAt] = useState<string>(
    new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  );
  const [reference, setReference] = useState<string>(
    `PAY-${invoice.number.replace("HTV-INV-", "")}`
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
      showErrorToast("Please enter a valid positive payment amount");
      return;
    }

    recordPayment({
      invoiceId: invoice.id,
      method,
      amount: numAmount,
      paidAt: paidAt.trim() || new Date().toLocaleDateString(),
      reference: reference.trim(),
    });

    onClose();
  };

  return (
    <>
      <div className="border-Iron rounded-xl border bg-GhostWhite p-4 text-xs space-y-1">
        <div className="flex justify-between">
          <span className="text-MistBlue">Total Invoice Amount:</span>
          <span className="font-bold text-RangoonGreen">€{invoice.amount.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-MistBlue">Already Paid:</span>
          <span className="font-bold text-[#1f9254]">€{alreadyPaid.toLocaleString()}</span>
        </div>
        <div className="flex justify-between border-t pt-1 font-bold">
          <span className="text-RangoonGreen">Remaining Balance:</span>
          <span className="text-PortlandOrange">€{remaining.toLocaleString()}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 py-2 text-xs">
        <div className="space-y-1.5">
          <Label className="text-xs font-bold text-CloudyGrey">
            Payment Method*
          </Label>
          <Select
            value={method}
            onValueChange={(v) => setMethod(v as PaymentMethod)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="adyen">Adyen</SelectItem>
              <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="pay-amount" className="text-xs font-bold text-CloudyGrey">
            Payment Amount (€)*
          </Label>
          <Input
            id="pay-amount"
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="pay-date" className="text-xs font-bold text-CloudyGrey">
            Date Paid*
          </Label>
          <Input
            id="pay-date"
            value={paidAt}
            onChange={(e) => setPaidAt(e.target.value)}
            placeholder="e.g. 04 Jul 2026"
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="pay-ref" className="text-xs font-bold text-CloudyGrey">
            Reference / Transaction ID
          </Label>
          <Input
            id="pay-ref"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder="e.g. ADY-88213"
          />
        </div>

        <DialogFooter className="mt-6 gap-2 pt-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="rounded-full px-5 font-bold"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-RangoonGreen hover:bg-black rounded-full px-6 font-bold text-white"
          >
            Record Payment
          </Button>
        </DialogFooter>
      </form>
    </>
  );
}

export default function RecordPaymentModal({
  isOpen,
  onClose,
  invoice,
}: RecordPaymentModalProps) {
  if (!invoice) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-RangoonGreen">
            Record Payment — {invoice.number}
          </DialogTitle>
        </DialogHeader>

        {isOpen && (
          <RecordPaymentForm
            key={`record-pay-${invoice.id}`}
            invoice={invoice}
            onClose={onClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
