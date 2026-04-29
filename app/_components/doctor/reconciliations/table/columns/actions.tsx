import { Reconciliation } from "@/types/reconciliations";
import { PopoverContent } from "@/app/_components/ui/popover";
import AddNewCommentModal from "../../modals/add-comment";
import ViewCommentHistoryModal from "../../modals/view-comment-history";
import ViewReconciliationModal from "../../modals/view-reconciliation";
import CreateNewInvoiceModal from "../../../invoices/modals/create-invoice";

export default function Actions({
  reconciliation,
}: {
  reconciliation: Reconciliation;
}) {
  const canCreateInvoice =
    reconciliation.status !== "completed" &&
    reconciliation.status !== "void" &&
    reconciliation.status !== "pending";

  return (
    <PopoverContent className="rounded-base w-fit p-2">
      <ul className="text-CloudyGrey text-xs font-semibold">
        <ViewReconciliationModal reconciliation={reconciliation}>
          <li className="rounded-base hover:bg-Geraldine block w-full px-3 py-1 text-left transition-colors duration-300 hover:text-white">
            View
          </li>
        </ViewReconciliationModal>
        <AddNewCommentModal reconciliation={reconciliation}>
          <li className="rounded-base hover:bg-Geraldine block w-full cursor-pointer px-3 py-1 text-left transition-colors duration-300 hover:text-white">
            Add Comment
          </li>
        </AddNewCommentModal>
        <ViewCommentHistoryModal reconciliation={reconciliation}>
          <li className="rounded-base hover:bg-Geraldine block w-full cursor-pointer px-3 py-1 text-left transition-colors duration-300 hover:text-white">
            View Comment
          </li>
        </ViewCommentHistoryModal>
        {canCreateInvoice ? (
          <CreateNewInvoiceModal reconciliation={reconciliation}>
            <li className="rounded-base hover:bg-Geraldine inline-block size-full cursor-pointer px-3 py-1 text-left transition-colors duration-300 hover:text-white">
              Create invoice
            </li>
          </CreateNewInvoiceModal>
        ) : (
          <li className="rounded-base block w-full cursor-not-allowed px-3 py-1 text-left text-gray-400">
            Create invoice
          </li>
        )}
      </ul>
    </PopoverContent>
  );
}
