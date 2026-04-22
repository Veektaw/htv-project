import CreateNewUserModal from "../../admin/users/modals/create-new-user";
import { Button } from "../../ui/button";

export default function SubHeader() {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-16">
        <p className="py-2 text-base font-bold">Reconciliations</p>

        <CreateNewUserModal>
          <Button variant="secondary" className="h-9 px-13">
            Create Reconciliations
          </Button>
        </CreateNewUserModal>
      </div>
    </div>
  );
}
