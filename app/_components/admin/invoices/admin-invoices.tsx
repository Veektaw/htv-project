import { getAllInvoicesApi } from "@/services/apis/invoices.api";
import { Empty, EmptyContent } from "@/app/_components/ui/empty";
import InvoicesProvider from "./contexts/invoices-provider";
import SearchWrapper from "./search-wrapper";
import TableWrapper from "./table/table-wrapper";
import TablePaginationWrapper from "./table/table-pagination-wrapper";
import { sortData } from "@/lib/sort-data";

type AdminInvoicesProps = {
  searchParamsValues: { [key: string]: string | undefined };
};

export default async function AdminInvoices({
  searchParamsValues,
}: AdminInvoicesProps) {
  const { page, search, sortKey, sortDir } = searchParamsValues;

  const result = await getAllInvoicesApi({
    page,
    search,
  });

  if (!result.ok) {
    return (
      <div className="flex size-full items-center justify-center p-2">
        <div className="w-full max-w-150.25">
          <p className="text-center text-sm font-medium text-black">
            {result.body.message || "Error getting invoices"}
          </p>
        </div>
      </div>
    );
  }

  const total = result.body.invoices.length;
  if (total === 0) {
    return (
      <InvoicesProvider data={result.body}>
        <section className="flex size-full flex-col gap-y-4">
          {" "}
          {/* Added flex-col */}
          <SearchWrapper /> {/* Added missing SearchWrapper */}
          <Empty className="flex flex-1 items-center justify-center p-2">
            <EmptyContent>
              <p className="text-MistBlue w-full max-w-84 text-center text-sm">
                No invoices yet
              </p>
            </EmptyContent>
          </Empty>
        </section>
      </InvoicesProvider>
    );
  }

  if (total === 0) {
    return (
      <InvoicesProvider data={result.body}>
        <SearchWrapper />
        <Empty className="flex size-full items-center justify-center p-2">
          <EmptyContent>
            <p className="text-MistBlue w-full max-w-84 text-center text-sm">
              No invoices yet
            </p>
          </EmptyContent>
        </Empty>
      </InvoicesProvider>
    );
  }
  const sortedInvoices = sortData(result.body.invoices, sortKey, sortDir);

  return (
    <InvoicesProvider data={{ ...result.body, invoices: sortedInvoices }}>
      <section className="flex min-h-full flex-col gap-y-4">
        <SearchWrapper />
        <section className="flex flex-1 flex-col justify-between gap-y-4 pb-6">
          <TableWrapper />
          <TablePaginationWrapper />
        </section>
      </section>
    </InvoicesProvider>
  );
}
