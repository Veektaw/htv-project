import { Button } from "../../ui/button";
import CreateReconciliationModal from "./modals/create-reconciliation";

export default function SubHeader() {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-16">
        <p className="py-2 text-base font-bold">Reconciliations</p>

        <CreateReconciliationModal>
          <Button variant="secondary" className="h-9 px-13">
            Create Reconciliations
          </Button>
        </CreateReconciliationModal>
      </div>
    </div>
  );
}
