import { useState } from "react";
import { PopoverContent } from "@/app/_components/ui/popover";
import { ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/app/_components/ui/dialog";
import { Invoice } from "@/types/invoices";
import { updateInvoiceStatus } from "@/services/actions/invoices.actions";
import { showSuccessToast, showErrorToast } from "@/lib/toast";
import { useInvoices } from "../../contexts/invoices-provider";

const STATUS_OPTIONS = [
  "Paid",
  "Under Review",
  "Dispute Invoice",
];

const STATUS_MAP = {
  "Paid": "paid",
  "Under Review": "under_review",
  "Dispute Invoice": "rejected",
};

interface ActionsProps {
  invoice: Invoice;
}

export default function Actions({ invoice }: ActionsProps) {
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const { updateInvoice } = useInvoices();

  const handleStatusUpdate = async (status: string) => {
    try {
      const apiStatus = STATUS_MAP[status as keyof typeof STATUS_MAP];
      const result = await updateInvoiceStatus(invoice.id, apiStatus);
      if (result.success) {
        // Update the local state with the new status
        updateInvoice({ ...invoice, status: apiStatus });
        showSuccessToast(`Invoice status updated to ${status}`);
      } else {
        showErrorToast(result.error || "Failed to update invoice status");
      }
      setShowStatusDropdown(false);
    } catch (error) {
      showErrorToast("Failed to update invoice status");
      console.error("Error updating status:", error);
    }
  };

  return (
    <>
      <PopoverContent className="rounded-base w-45 cursor-pointer p-2">
        <ul className="text-CloudyGrey text-xs font-semibold">
          <li
            className="rounded-base hover:bg-Geraldine block w-full px-3 py-1 text-left transition-colors duration-300 hover:text-white cursor-pointer"
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
                    status === invoice.status;

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
                        handleStatusUpdate(status);
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

          <li className="rounded-base hover:bg-Geraldine block w-full px-3 py-1 text-left transition-colors duration-300 hover:text-white">
            Add Comment
          </li>
          <li className="rounded-base hover:bg-Geraldine block w-full px-3 py-1 text-left transition-colors duration-300 hover:text-white">
            View Comment
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
              <p>€{invoice.amount.toLocaleString("en-US", { maximumFractionDigits: 2 })}</p>
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
            {invoice.notes && (
              <div>
                <label className="font-semibold">Notes:</label>
                <p>{invoice.notes}</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}