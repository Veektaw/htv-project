import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Reconciliation } from "@/types/reconciliations";
import { PopoverContent } from "@/app/_components/ui/popover";
import ViewReconciliationDetailsModal from "../../modals/view-reconciliation-details";
import UpdateStatusModal from "../../modals/update-status";
import AddCommentModal from "../../modals/add-comment";
import ViewCommentHistoryModal from "../../modals/view-comment-history";

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
    if (entityId !== String(reconciliation.id) || type !== "comment_added")
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

  return (
    <>
      <PopoverContent className="rounded-base w-fit p-2">
        <ul className="text-CloudyGrey text-xs font-semibold">
          <li>
            <ViewReconciliationDetailsModal reconciliation={reconciliation}>
              <button className="rounded-base hover:bg-Geraldine size-full px-3 py-1 text-left transition-colors duration-300 hover:text-white">
                View
              </button>
            </ViewReconciliationDetailsModal>
          </li>

          {reconciliation.status !== "approved" && (
            <li>
              <UpdateStatusModal type="approve" reconciliation={reconciliation}>
                <button className="rounded-base hover:bg-Geraldine size-full px-3 py-1 text-left transition-colors duration-300 hover:text-white">
                  Approve
                </button>
              </UpdateStatusModal>
            </li>
          )}

          {reconciliation.status !== "completed" && (
            <li>
              <UpdateStatusModal
                type="complete"
                reconciliation={reconciliation}
              >
                <button className="rounded-base hover:bg-Geraldine size-full px-3 py-1 text-left transition-colors duration-300 hover:text-white">
                  Complete
                </button>
              </UpdateStatusModal>
            </li>
          )}

          <li>
            <UpdateStatusModal type="void" reconciliation={reconciliation}>
              <button className="rounded-base hover:bg-Geraldine size-full px-3 py-1 text-left transition-colors duration-300 hover:text-white">
                Void
              </button>
            </UpdateStatusModal>
          </li>

          <li>
            <button
              onClick={() => setActiveModal("addComment")}
              className="rounded-base hover:bg-Geraldine size-full px-3 py-1 text-left transition-colors duration-300 hover:text-white"
            >
              Add Comment
            </button>
          </li>

          <li>
            <button
              onClick={() => setActiveModal("viewComments")}
              className="rounded-base hover:bg-Geraldine size-full px-3 py-1 text-left transition-colors duration-300 hover:text-white"
            >
              View Comment
            </button>
          </li>
        </ul>
      </PopoverContent>

      <AddCommentModal
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
