import { Button } from "../../ui/button";
import CreateNewUserModal from "./modals/create-new-user";
import RoleFilter from "./role-filter";

export default function SubHeader() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 lg:flex-nowrap lg:gap-4">
      <div className="flex flex-wrap items-center gap-3 sm:gap-8 lg:gap-16">
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
