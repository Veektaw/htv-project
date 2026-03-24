import { getUserApi } from "@/services/apis/users.api";
import { Button } from "@/app/_components/ui/button";
import ActivateUserModal from "@/app/_components/admin/users/modals/activate-user";
import UserDetailsForm from "./form";

type UserDetailsProps = {
  userId: string;
};

export default async function UserDetails({ userId }: UserDetailsProps) {
  const res = await getUserApi(userId);

  if (!res.ok) {
    const { message } = res.body;

    return (
      <section className="flex h-full flex-col">
        <h2 className="text-[2rem] font-bold">User Profile</h2>

        <div className="flex flex-1 items-center justify-center">
          <p>{message || "Error getting user details"}</p>
        </div>
      </section>
    );
  }

  const user = res.body;

  return (
    <section className="flex h-full flex-col gap-10">
      <div className="flex items-center justify-between">
        <h2 className="text-[2rem] font-bold">User Profile</h2>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            className="h-12 w-44 rounded-[24px] border border-black px-6 text-sm font-semibold text-black"
          >
            Edit Profile
          </Button>

          <ActivateUserModal user={res.body}>
            <Button variant="secondary" className="h-12 px-13">
              {user.is_deactivated ? "Reactivate" : "Deactivate"} User
            </Button>
          </ActivateUserModal>
        </div>
      </div>

      <div className="pb-10">
        <UserDetailsForm user={user} />
      </div>
    </section>
  );
}
