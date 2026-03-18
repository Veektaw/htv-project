import { getUsersApi } from "@/services/apis/users.api";
import UsersProvider from "./contexts/users-provider";
import Search from "./search";
import TableWrapper from "./table/table-wrapper";
import TablePagination from "./table/table-pagination";

type AllUsersProps = {
  search?: string;
  page?: string;
};

export default async function AllUsers({ search, page }: AllUsersProps) {
  const res = await getUsersApi({ search, page });

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

  const total = res.body.users.length;

  if (search && total === 0) {
    return (
      <UsersProvider data={res.body}>
        <section className="flex size-full flex-col gap-y-4">
          <Search />

          <div className="flex flex-1 items-center justify-center p-2">
            <p className="text-MistBlue w-full max-w-84 text-center text-sm">
              No users found for{" "}
              <span className="font-medium">&quot;{search}&quot;</span>
            </p>
          </div>
        </section>
      </UsersProvider>
    );
  }

  if (total === 0) {
    return (
      <UsersProvider data={res.body}>
        <section className="flex size-full flex-col gap-y-4">
          <Search />

          <div className="flex size-full flex-1 items-center justify-center p-2">
            <p className="text-MistBlue w-full max-w-84 text-center text-sm">
              No users have been created yet. <br /> Click the “Create New User”
              button to add a new user.
            </p>
          </div>
          <TablePagination />
        </section>
      </UsersProvider>
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
