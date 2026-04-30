import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Reconciliation } from "@/types/reconciliations";
import { PopoverContent } from "@/app/_components/ui/popover";
import AddNewCommentModal from "../../modals/add-comment";
import ViewCommentHistoryModal from "../../modals/view-comment-history";
import ViewReconciliationModal from "../../modals/view-reconciliation";
import CreateNewInvoiceModal from "../../../invoices/modals/create-invoice";

let count = 0;

export type ActiveModal =
  | null
  | "viewComments"
  | "addComment"
  | "viewDetails"
  | "approve"
  | "complete"
  | "void";

export default function Actions({
  reconciliation,
}: {
  reconciliation: Reconciliation;
}) {
  const searchParams = useSearchParams();
  const entityId = searchParams.get("entity_id");
  const type = searchParams.get("type");

  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const hasAutoOpened = useRef(false);

  useEffect(() => {
    if (
      entityId !== String(reconciliation.id) ||
      type !== "admin_comment_added"
    )
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
  }, [entityId, type, reconciliation.id]);

  const canCreateInvoice =
    reconciliation.status !== "completed" &&
    reconciliation.status !== "void" &&
    reconciliation.status !== "pending";

  return (
    <>
      <PopoverContent className="rounded-base w-fit p-2">
        <ul className="text-CloudyGrey text-xs font-semibold">
          <ViewReconciliationModal reconciliation={reconciliation}>
            <li className="rounded-base hover:bg-Geraldine block w-full px-3 py-1 text-left transition-colors duration-300 hover:text-white">
              View
            </li>
          </ViewReconciliationModal>
          <AddNewCommentModal reconciliation={reconciliation}>
            <li
              className="rounded-base hover:bg-Geraldine block w-full cursor-pointer px-3 py-1 text-left transition-colors duration-300 hover:text-white"
              onClick={() => setActiveModal("addComment")}
            >
              Add Comment
            </li>
          </AddNewCommentModal>
          <ViewCommentHistoryModal reconciliation={reconciliation}>
            <li
              className="rounded-base hover:bg-Geraldine block w-full cursor-pointer px-3 py-1 text-left transition-colors duration-300 hover:text-white"
              onClick={() => setActiveModal("viewComments")}
            >
              View Comment History
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

      <AddNewCommentModal
        reconciliation={reconciliation}
        activeModal={activeModal}
        setActiveModal={setActiveModal}
      />

      <ViewCommentHistoryModal
        reconciliation={reconciliation}
        activeModal={activeModal}
        setActiveModal={setActiveModal}
      />
    </>
  );
}
