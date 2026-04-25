import { PopoverContent } from "@/app/_components/ui/popover";
import AddNewCommentModal from "../../add-comment-modal";
import ViewCommentHistoryModal from "../../view-comment-history-modal";
import ViewCommentModal from "../../view-comment-modal";
import { Invoice } from "@/types/invoices";

type ActionsProps = {
  invoice: Invoice;
};

export default function Actions({ invoice }: ActionsProps) {
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
        <li className="rounded-base hover:bg-Geraldine block w-full px-3 py-1 text-left transition-colors duration-300 hover:text-white">
          Download Invoice
        </li>
      </ul>
    </PopoverContent>
  );
}
