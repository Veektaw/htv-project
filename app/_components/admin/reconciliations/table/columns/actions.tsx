import { PopoverContent } from "@/app/_components/ui/popover";
import { Reconciliation } from "@/types/reconciliations";
import UpdateStatusModal from "../../modals/update-status";

export default function Actions({
  reconciliation,
}: {
  reconciliation: Reconciliation;
}) {
  return (
    <PopoverContent className="rounded-base w-fit p-2">
      <ul className="text-CloudyGrey text-xs font-semibold">
        {reconciliation.status !== "approved" && (
          <li>
            <UpdateStatusModal type="approve" reconciliation={reconciliation}>
              <button className="rounded-base hover:bg-Geraldine size-full px-3 py-1 text-left transition-colors duration-300 hover:text-white">
                Approve
              </button>
            </UpdateStatusModal>
          </li>
        )}
        <li>
          <UpdateStatusModal type="complete" reconciliation={reconciliation}>
            <button className="rounded-base hover:bg-Geraldine size-full px-3 py-1 text-left transition-colors duration-300 hover:text-white">
              Complete
            </button>
          </UpdateStatusModal>
        </li>
      </ul>
    </PopoverContent>
  );
}
