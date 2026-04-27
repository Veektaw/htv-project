import { PopoverContent } from "@/app/_components/ui/popover";
import AddNewCommentModal from "../../add-comment-modal";
import ViewCommentHistoryModal from "../../view-comment-history-modal";
import ViewCommentModal from "../../view-comment-modal";
import { Invoice } from "@/types/invoices";
import { useState } from "react";
import { downloadDoctorInvoiceAction } from "@/services/actions/invoices.actions";
import { showSuccessToast, showErrorToast } from "@/lib/toast";

type ActionsProps = {
  invoice: Invoice;
};

export default function Actions({ invoice }: ActionsProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadInvoice = async () => {
    if (isDownloading) return;

    setIsDownloading(true);
    try {
      const result = await downloadDoctorInvoiceAction(invoice.id);

      if (result.error || !result.base64) {
        throw new Error(result.message || "No data received");
      }

      const byteCharacters = atob(result.base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      const fileName = `invoice_${invoice.invoice_ref || invoice.id}.pdf`;
      link.setAttribute("download", fileName);

      document.body.appendChild(link);
      link.click();

      link.parentNode?.removeChild(link);
      URL.revokeObjectURL(url);
      showSuccessToast("Invoice downloaded successfully");
    } catch (error) {
      console.error("Error downloading invoice:", error);
      showErrorToast("Failed to download invoice. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };
  return (
    <PopoverContent className="rounded-base w-45 cursor-pointer p-2">
      <ul className="text-CloudyGrey text-xs font-semibold">
        <ViewCommentModal invoice={invoice}>
          <li className="rounded-base hover:bg-Geraldine block w-full px-3 py-1 text-left transition-colors duration-300 hover:text-white">
            View
          </li>
        </ViewCommentModal>

        <AddNewCommentModal invoice={invoice}>
          <li className="rounded-base hover:bg-Geraldine block w-full px-3 py-1 text-left transition-colors duration-300 hover:text-white">
            Add Comment
          </li>
        </AddNewCommentModal>
        <ViewCommentHistoryModal invoice={invoice}>
          <li className="rounded-base hover:bg-Geraldine block w-full px-3 py-1 text-left transition-colors duration-300 hover:text-white">
            View Comment History
          </li>
        </ViewCommentHistoryModal>
        <li className="rounded-base hover:bg-Geraldine block w-full px-3 py-1 text-left transition-colors duration-300 hover:text-white">
          Download Receipt
        </li>
        <li
          className="rounded-base hover:bg-Geraldine block w-full px-3 py-1 text-left transition-colors duration-300 hover:text-white"
          onClick={handleDownloadInvoice}
        >
          {isDownloading ? "Downloading..." : "Download Invoice"}
        </li>
      </ul>
    </PopoverContent>
  );
}
