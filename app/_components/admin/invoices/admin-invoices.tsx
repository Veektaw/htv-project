import { getAdminInvoicesAction } from "@/services/actions/invoices.actions";
import { Empty, EmptyContent } from "@/app/_components/ui/empty";
import InvoicesProvider from "./contexts/invoices-provider";
import TableWrapper from "./table/table-wrapper";
import TablePaginationWrapper from "./table/table-pagination-wrapper";

type AdminInvoicesProps = {
  searchParamsValues: { [key: string]: string | undefined };
};

export default async function AdminInvoices({
  searchParamsValues,
}: AdminInvoicesProps) {
  const { page, doctor_id } = searchParamsValues;
  const result = await getAdminInvoicesAction({
    page,
    doctor_id,
  });

  if (result.error) {
    return (
      <div className="flex size-full items-center justify-center p-2">
        <div className="w-full max-w-150.25">
          <p className="text-center text-sm font-medium text-black">
            {result.message || "Error getting invoices"}
          </p>
        </div>
      </div>
    );
  }

  const total = result.data.invoices.length;

  if (total === 0) {
    return (
      <InvoicesProvider data={result.data}>
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

  return (
    <InvoicesProvider data={result.data}>
      <section className="flex h-full flex-col gap-y-4">
        <section className="flex flex-1 flex-col justify-between gap-y-4 pb-6">
          <TableWrapper />
          <TablePaginationWrapper />
        </section>
      </section>
    </InvoicesProvider>
  );
}
