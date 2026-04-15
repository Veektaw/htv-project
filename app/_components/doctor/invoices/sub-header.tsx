import CreateNewInvoiceModal from "./create-invoice-modal";
import { Button } from "../../ui/button";

export default function SubHeader() {
  return (
    <div className="flex items-center gap-4">
      <p className="py-2 text-base font-bold">Invoices</p>

      <CreateNewInvoiceModal>
        <Button variant="secondary" className="h-9 px-13">
          Create new invoice
        </Button>
      </CreateNewInvoiceModal>
    </div>
  );
}
