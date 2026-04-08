import { getDoctorPrescriptionsApi } from "@/services/apis/prescriptions.api";
import { format } from "date-fns";
import { Empty, EmptyContent } from "@/app/_components/ui/empty";
import PrescriptionsProvider from "./contexts/prescriptions-provider";
import TableWrapper from "./table/table-wrapper";
import SortAndDateFilter from "./sort-and-date-filter";
import TablePaginationWrapper from "./table/table-pagination-wrapper";

type DoctorPrescriptionsProps = {
  searchParamsValues: { [key: string]: string | undefined };
};

export default async function DoctorPrescriptions({
  searchParamsValues,
}: DoctorPrescriptionsProps) {
  const { page, platform, start_date, end_date } = searchParamsValues;
  const res = await getDoctorPrescriptionsApi({
    page,
    platform,
    start_date,
    end_date,
  });

  if (!res.ok) {
    const { message } = res.body;
    return (
      <div className="flex size-full items-center justify-center p-2">
        <div className="w-full max-w-150.25">
          <p className="text-center text-sm font-medium text-black">
            {message || "Error getting prescriptions"}
          </p>
        </div>
      </div>
    );
  }

  // console.log({ res: res.body });

  const total = res.body.prescriptions.length;

  if (platform && start_date && end_date && total === 0) {
    return (
      <PrescriptionsProvider data={res.body}>
        <section className="flex size-full flex-col gap-y-4">
          <SortAndDateFilter />

          <Empty className="flex flex-1 items-center justify-center p-2">
            <EmptyContent>
              <p className="text-MistBlue w-full max-w-84 text-center text-sm">
                No prescriptions found for{" "}
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
      </PrescriptionsProvider>
    );
  }

  if (start_date && end_date && total === 0) {
    return (
      <PrescriptionsProvider data={res.body}>
        <section className="flex size-full flex-col gap-y-4">
          <SortAndDateFilter />

          <Empty className="flex flex-1 items-center justify-center p-2">
            <EmptyContent>
              <p className="text-MistBlue w-full max-w-84 text-center text-sm">
                No prescriptions found in the date range of{" "}
                <span className="font-medium">
                  {format(new Date(start_date), "dd/MM/yyyy")} to{" "}
                  {format(new Date(end_date), "dd/MM/yyyy")}
                </span>
              </p>
            </EmptyContent>
          </Empty>
        </section>
      </PrescriptionsProvider>
    );
  }

  if (platform && total === 0) {
    return (
      <PrescriptionsProvider data={res.body}>
        <section className="flex size-full flex-col gap-y-4">
          <SortAndDateFilter />

          <Empty className="flex flex-1 items-center justify-center p-2">
            <EmptyContent>
              <p className="text-MistBlue w-full max-w-84 text-center text-sm">
                No prescriptions found for{" "}
                <span className="font-medium">&quot;{platform}&quot;</span>
              </p>
            </EmptyContent>
          </Empty>
        </section>
      </PrescriptionsProvider>
    );
  }

  if (total === 0) {
    return (
      <PrescriptionsProvider data={res.body}>
        <Empty className="flex size-full items-center justify-center p-2">
          <EmptyContent>
            <p className="text-MistBlue w-full max-w-84 text-center text-sm">
              No prescriptions yet
            </p>
          </EmptyContent>
        </Empty>
      </PrescriptionsProvider>
    );
  }

  return (
    <PrescriptionsProvider data={res.body}>
      <section className="flex h-full flex-col gap-y-4">
        <SortAndDateFilter />
        <section className="flex flex-1 flex-col justify-between gap-y-4 pb-6">
          <TableWrapper />

          <TablePaginationWrapper />
        </section>
      </section>
    </PrescriptionsProvider>
  );
}
