import { getUserApi } from "@/services/apis/users.api";
import UserDetails from "./user-details";

export default async function UserDetailsWrapper({
  userId,
}: {
  userId: string;
}) {
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

  return <UserDetails user={user} />;
}
