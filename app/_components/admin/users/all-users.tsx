import { getUsersApi } from "@/services/apis/users.api";
import TableWrapper from "./table/table-wrapper";

export default async function AllUsers() {
  const res = await getUsersApi();

  if (!res.ok) {
    const { message } = res.body;
    return (
      <div className="flex size-full items-center justify-center p-2">
        <div className="w-full max-w-150.25">
          <p className="text-center text-sm font-medium text-black">
            {message || "Error getting data"}
          </p>
        </div>
      </div>
    );
  }

  const { total, users } = res.body;

  if (total === 0) {
    return (
      <div className="flex size-full items-center justify-center p-2">
        <div className="w-full max-w-150.25">
          <p className="text-MistBlue text-center text-sm">
            No users have been created yet. Click the “Create New User” button
            to add a new user.
          </p>
        </div>
      </div>
    );
  }

  return <TableWrapper data={users} />;
}

export function Loader() {
  return (
    <div className="flex size-full items-center justify-center p-2">
      <div className="w-full max-w-150.25">
        <p className="text-center text-sm font-medium text-black">
          Getting data...
        </p>
      </div>
    </div>
  );
}
