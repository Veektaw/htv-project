import { User } from "@/types/auth";
import { PopoverContent } from "@/app/_components/ui/popover";
import ActivateUserModal from "../../modals/activate-user";

export default function Actions({ user }: { user: User }) {
  return (
    <PopoverContent className="rounded-base w-25.25 p-2">
      <ul className="text-CloudyGrey text-xs font-semibold">
        <li>
          <button className="rounded-base hover:bg-Geraldine size-full px-3 py-1 text-left transition-colors duration-300 hover:text-white">
            View
          </button>
        </li>

        <li>
          <button className="rounded-base hover:bg-Geraldine size-full px-3 py-1 text-left transition-colors duration-300 hover:text-white">
            Edit
          </button>
        </li>

        <li>
          <ActivateUserModal user={user}>
            <button className="rounded-base hover:bg-Geraldine size-full px-3 py-1 text-left transition-colors duration-300 hover:text-white">
              {user.is_deactivated ? "Activate" : "Deactivate"}
            </button>
          </ActivateUserModal>
        </li>
      </ul>
    </PopoverContent>
  );
}
