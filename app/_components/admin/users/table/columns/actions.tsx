import { User } from "@/types/auth";
import { PopoverContent } from "@/app/_components/ui/popover";
import Link from "next/link";
import ActivateUserModal from "../../modals/activate-user";

export default function Actions({ user }: { user: User }) {
  return (
    <PopoverContent className="rounded-base w-25.25 p-2">
      <ul className="text-CloudyGrey text-xs font-semibold">
        <li>
          <Link
            href={`/admin/users/${user.id}`}
            className="rounded-base hover:bg-Geraldine inline-block size-full px-3 py-1 text-left transition-colors duration-300 hover:text-white"
          >
            View
          </Link>
        </li>

        {/* <li>
          <button className="rounded-base hover:bg-Geraldine size-full px-3 py-1 text-left transition-colors duration-300 hover:text-white">
            Edit
          </button>
        </li> */}

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
