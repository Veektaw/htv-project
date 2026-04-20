import { getAllInvoicesApi } from "@/services/apis/invoices.api";
import { invoicesColumns } from "./table/columns";
import { statuses } from "../../invoices/table/columns/status";
import { Empty, EmptyContent } from "@/app/_components/ui/empty";
import TableComponent from "../../../shared/table-component/table-component";
import { InvoiceStatus } from "@/types/invoices";

type InvoicesProps = {
  searchParamsValues: { [key: string]: string | undefined };
};

export default async function RecentInvoices({
  searchParamsValues,
}: InvoicesProps) {
  const { status } = searchParamsValues;

  const res = await getAllInvoicesApi({
    status,
  });

  if (!res.ok) {
    const { message } = res.body;
    return (
      <div className="flex size-full items-center justify-center p-2">
        <div className="w-full max-w-150.25">
          <p className="text-center text-sm font-medium text-black">
            {message || "Error getting reconciliations"}
          </p>
        </div>
      </div>
    );
  }

  const total = res.body.invoices.length;

  if (status && total === 0) {
    return (
      <section className="flex size-full flex-col gap-y-4 group-has-data-[statusfilterpending=true]:animate-pulse">
        <Empty className="flex flex-1 items-center justify-center p-2">
          <EmptyContent>
            <p className="text-MistBlue w-full max-w-84 text-center text-sm">
              No invoices found for{" "}
              <span className="font-medium">
                &quot;{statuses[status as InvoiceStatus]}&quot;
              </span>
            </p>
          </EmptyContent>
        </Empty>
      </section>
    );
  }

  if (total === 0) {
    return (
      <section className="flex size-full flex-col gap-y-4 group-has-data-[statusfilterpending=true]:animate-pulse">
        <Empty className="flex flex-1 items-center justify-center p-2">
          <EmptyContent>
            <p className="text-MistBlue w-full max-w-84 text-center text-sm">
              No recent invoices
            </p>
          </EmptyContent>
        </Empty>
      </section>
    );
  }

  // console.log({ res: res.body });

  return (
    <section className="h-full">
      <TableComponent
        title="Invoices"
        columns={invoicesColumns}
        data={res.body.invoices}
      />
    </section>
  );
}
