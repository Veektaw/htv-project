import { getUsersApi } from "@/services/apis/users.api";
import { Empty, EmptyContent } from "@/app/_components/ui/empty";
import UsersProvider from "./contexts/users-provider";
import SearchWrapper from "./search-wrapper";
import TableWrapper from "./table/table-wrapper";
import TablePaginationWrapper from "./table/table-pagination-wrapper";

type AllUsersProps = {
  search?: string;
  page?: string;
  role?: string;
};

export default async function AllUsers({ search, page, role }: AllUsersProps) {
  const res = await getUsersApi({ search, page, role });

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
          <SearchWrapper />

          <Empty className="flex flex-1 items-center justify-center p-2">
            <EmptyContent>
              <p className="text-MistBlue w-full max-w-84 text-center text-sm">
                No users found for{" "}
                <span className="font-medium">&quot;{search}&quot;</span>
              </p>
            </EmptyContent>
          </Empty>
        </section>
      </UsersProvider>
    );
  }

  if (total === 0) {
    return (
      <UsersProvider data={res.body}>
        <Empty className="flex size-full items-center justify-center p-2">
          <EmptyContent>
            <p className="text-MistBlue w-full max-w-84 text-center text-sm">
              No users have been created yet. <br /> Click the “Create New User”
              button to add a new user.
            </p>
          </EmptyContent>
        </Empty>
      </UsersProvider>
    );
  }

  return (
    <UsersProvider data={res.body}>
      <section className="space-y-4">
        <SearchWrapper />
        <TableWrapper />
        <TablePaginationWrapper />
      </section>
    </UsersProvider>
  );
}
