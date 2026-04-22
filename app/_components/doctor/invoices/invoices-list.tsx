import TableWrapper from "./table/table-wrapper";
import TablePaginationWrapper from "./table/table-pagination-wrapper";
import { Empty, EmptyContent } from "@/app/_components/ui/empty";
import InvoicesProvider from "./contexts/invoices-provider";
import { getDoctorInvoicesApi } from "@/services/apis/doctor-invoices.api";

type InvoicesListProps = {
  searchParamsValues: { [key: string]: string | undefined };
};

export default async function InvoicesList({
  searchParamsValues,
}: InvoicesListProps) {
  const { page, user_id } = searchParamsValues;

  const res = await getDoctorInvoicesApi({ page, user_id });

  if (!res.ok) {
    const { message } = res.body;
    return (
      <div className="flex size-full items-center justify-center p-2">
        <div className="w-full max-w-150.25">
          <p className="text-center text-sm font-medium text-black">
            {message || "Error getting invoices"}
          </p>
        </div>
      </div>
    );
  }

  const total = res.body.invoices.length;
  if (user_id && total === 0) {
    return (
      <InvoicesProvider data={res.body}>
        <section className="flex size-full flex-col gap-y-4">
          <Empty className="flex flex-1 items-center justify-center p-2">
            <EmptyContent>
              <p className="text-MistBlue w-full max-w-84 text-center text-sm">
                No invoices found for user ID:
                <span className="font-medium">&quot;{user_id}&quot;</span>
              </p>
            </EmptyContent>
          </Empty>
        </section>
      </InvoicesProvider>
    );
  }

  if (total === 0) {
    return (
      <InvoicesProvider data={res.body}>
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
    <InvoicesProvider data={res.body}>
      <section className="flex h-full flex-col gap-y-4">
        <section className="flex flex-1 flex-col justify-between gap-y-4 pb-6">
          <TableWrapper />
          <TablePaginationWrapper />
        </section>
      </section>
    </InvoicesProvider>
  );
}
