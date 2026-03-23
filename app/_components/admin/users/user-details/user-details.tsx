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

        <ActivateUserModal user={res.body}>
          <Button variant="secondary" className="h-9 px-13">
            {user.is_deactivated ? "Reactivate" : "Deactivate"} User
          </Button>
        </ActivateUserModal>
      </div>

      <div className="pb-10">
        <UserDetailsForm user={user} />
      </div>
    </section>
  );
}
