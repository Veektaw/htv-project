import { Button } from "../../ui/button";
import CreateNewUserModal from "./modals/create-new-user";
import RoleFilter from "./role-filter";

export default function SubHeader() {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-16">
        <p className="py-2 text-base font-bold">Users</p>

        <CreateNewUserModal>
          <Button variant="secondary" className="h-9 px-13">
            Create new user
          </Button>
        </CreateNewUserModal>
      </div>

      <RoleFilter />
    </div>
  );
}
