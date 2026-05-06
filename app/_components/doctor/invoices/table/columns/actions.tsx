import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { downloadDoctorInvoiceAction } from "@/services/actions/invoices.actions";
import { showSuccessToast, showErrorToast } from "@/lib/toast";
import { Invoice } from "@/types/invoices";
import { PopoverContent } from "@/app/_components/ui/popover";
import AddNewCommentModal from "../../modals/add-comment";
import ViewCommentHistoryModal from "../../modals/view-comment-history";
import ViewInvoiceModal from "../../modals/view-invoice";

let count = 0;

export type ActiveModal =
  | null
  | "viewComments"
  | "addComment"
  | "viewDetails"
  | "approve"
  | "complete"
  | "void";

type ActionsProps = {
  invoice: Invoice;
};

export default function Actions({ invoice }: ActionsProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const searchParams = useSearchParams();
  const entityId = searchParams.get("entity_id");
  const type = searchParams.get("type");

  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const hasAutoOpened = useRef(false);

  useEffect(() => {
    if (entityId !== String(invoice.id) || type !== "admin_comment_added")
      return;
    hasAutoOpened.current = true;

    queueMicrotask(() => {
      setActiveModal("viewComments");
      count++;

      // TO-DO: Find better implementation for
      if (count === 1) {
        console.log("Here");
        setActiveModal(null);
      }
    });
  }, [entityId, type, invoice.id]);

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
    <>
      <PopoverContent className="rounded-base w-45 cursor-pointer p-2">
        <ul className="text-CloudyGrey text-xs font-semibold">
          <ViewInvoiceModal invoice={invoice}>
            <li className="rounded-base hover:bg-Geraldine block w-full px-3 py-1 text-left transition-colors duration-300 hover:text-white">
              View
            </li>
          </ViewInvoiceModal>

          <AddNewCommentModal invoice={invoice}>
            <li
              className="rounded-base hover:bg-Geraldine block w-full px-3 py-1 text-left transition-colors duration-300 hover:text-white"
              onClick={() => setActiveModal("addComment")}
            >
              Add Comment
            </li>
          </AddNewCommentModal>
          <ViewCommentHistoryModal invoice={invoice}>
            <li
              className="rounded-base hover:bg-Geraldine block w-full px-3 py-1 text-left transition-colors duration-300 hover:text-white"
              onClick={() => setActiveModal("viewComments")}
            >
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

      <AddNewCommentModal
        invoice={invoice}
        activeModal={activeModal}
        setActiveModal={setActiveModal}
      />

      <ViewCommentHistoryModal
        invoice={invoice}
        activeModal={activeModal}
        setActiveModal={setActiveModal}
      />
    </>
  );
}
