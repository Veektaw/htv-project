import { getAdminPaymentsApi } from "@/services/apis/payments.api";
import { format } from "date-fns";
import { Empty, EmptyContent } from "@/app/_components/ui/empty";
import PaymentsProvider from "./contexts/payments-provider";
import SearchWrapper from "./search-wrapper";
import TableWrapper from "./table/table-wrapper";
import TablePaginationWrapper from "./table/table-pagination-wrapper";
import { sortData } from "@/lib/sort-data";

type AdminPaymentsProps = {
  searchParamsValues: { [key: string]: string | undefined };
};

export default async function AdminPayments({
  searchParamsValues,
}: AdminPaymentsProps) {
  const { page, platform, start_date, end_date, search } = searchParamsValues;
  const res = await getAdminPaymentsApi({
    page,
    platform,
    start_date,
    end_date,
    search,
  });

  if (!res.ok) {
    const { message } = res.body;
    return (
      <div className="flex size-full items-center justify-center p-2">
        <div className="w-full max-w-150.25">
          <p className="text-center text-sm font-medium text-black">
            {message || "Error getting payments"}
          </p>
        </div>
      </div>
    );
  }

  const total = res.body.payments.length;

  if (platform && start_date && end_date && total === 0) {
    return (
      <PaymentsProvider data={res.body}>
        <section className="flex w-full flex-col gap-y-4">
          <SearchWrapper />
          <Empty className="flex w-full items-center justify-center p-2">
            <EmptyContent>
              <p className="text-MistBlue w-full max-w-84 text-center text-sm">
                No payments found for{" "}
                <span className="font-medium">&quot;{platform}&quot;</span> in
                the date range of{" "}
                <span className="font-medium">
                  {format(new Date(start_date), "dd/MM/yyyy")} to{" "}
                  {format(new Date(end_date), "dd/MM/yyyy")}
                </span>
              </p>
            </EmptyContent>
          </Empty>
        </section>
      </PaymentsProvider>
    );
  }

  if (start_date && end_date && total === 0) {
    return (
      <PaymentsProvider data={res.body}>
        <section className="flex w-full flex-col gap-y-4">
          <SearchWrapper />
          <Empty className="flex w-full items-center justify-center p-2">
            <EmptyContent>
              <p className="text-MistBlue w-full max-w-84 text-center text-sm">
                No payments found in the date range of{" "}
                <span className="font-medium">
                  {format(new Date(start_date), "dd/MM/yyyy")} to{" "}
                  {format(new Date(end_date), "dd/MM/yyyy")}
                </span>
              </p>
            </EmptyContent>
          </Empty>
        </section>
      </PaymentsProvider>
    );
  }

  if (platform && total === 0) {
    return (
      <PaymentsProvider data={res.body}>
        <section className="flex w-full flex-col gap-y-4">
          <SearchWrapper />
          <Empty className="flex flex-1 items-center justify-center p-2">
            <EmptyContent>
              <p className="text-MistBlue w-full max-w-84 text-center text-sm">
                No payments found for{" "}
                <span className="font-medium">&quot;{platform}&quot;</span>
              </p>
            </EmptyContent>
          </Empty>
        </section>
      </PaymentsProvider>
    );
  }

  if (total === 0) {
    return (
      <PaymentsProvider data={res.body}>
        <section className="flex w-full flex-col gap-y-4">
          <SearchWrapper />
          <Empty className="flex w-full items-center justify-center p-2">
            <EmptyContent>
              <p className="text-MistBlue w-full max-w-84 text-center text-sm">
                No payments yet
              </p>
            </EmptyContent>
          </Empty>
        </section>
      </PaymentsProvider>
    );
  }
  const { sortKey, sortDir } = searchParamsValues;
  const sortedPayments = sortData(res.body.payments, sortKey, sortDir);
  return (
    <PaymentsProvider data={{ ...res.body, payments: sortedPayments }}>
      <section className="flex min-h-full flex-col gap-y-4">
        <SearchWrapper />

        <section className="flex flex-1 flex-col justify-between gap-y-4 pb-6">
          <TableWrapper />

          <TablePaginationWrapper />
        </section>
      </section>
    </PaymentsProvider>
  );
}
