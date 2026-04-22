import { PopoverContent } from "@/app/_components/ui/popover";
import CreateNewInvoiceModal from "../../../invoices/create-invoice-modal";
import { Reconciliation } from "@/types/reconciliations";

export default function Actions({ reconciliation }: { reconciliation: Reconciliation }) {
  return (
    <PopoverContent className="rounded-base w-fit p-2">
      <ul className="text-CloudyGrey text-xs font-semibold">
        <CreateNewInvoiceModal reconciliation={reconciliation}>
          <li className="rounded-base hover:bg-Geraldine inline-block size-full cursor-pointer px-3 py-1 text-left transition-colors duration-300 hover:text-white">
            Create invoice
          </li>
        </CreateNewInvoiceModal>
      </ul>
    </PopoverContent>
  );
}
