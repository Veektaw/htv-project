import { getUsersApi } from "@/services/apis/users.api";
import UsersProvider from "./contexts/users-provider";
import Search from "../../shared/sidebar/search";
import TableWrapper from "./table/table-wrapper";
import TablePagination from "./table/table-pagination";

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

  const { total } = res.body;

  if (total === 0) {
    return (
      <div className="flex size-full items-center justify-center p-2">
        <p className="text-MistBlue w-full max-w-84 text-center text-sm">
          No users have been created yet. <br /> Click the “Create New User”
          button to add a new user.
        </p>
      </div>
    );
  }

  return (
    <UsersProvider data={res.body}>
      <section className="space-y-4">
        <Search />
        <TableWrapper />
        <TablePagination />
      </section>
    </UsersProvider>
  );
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
