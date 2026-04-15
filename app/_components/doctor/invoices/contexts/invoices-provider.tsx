"use client";

import { createContext, ReactNode, use } from "react";
import { GetDoctorInvoices, Invoice } from "@/types/invoices";
import useSetParam from "@/hooks/use-set-param";
import usePagination from "@/hooks/use-pagination";

type InvoicesContextType = {
  invoices: Invoice[];
  useSearchValues: ReturnType<typeof useSetParam>;
  useStatusFilterValues: ReturnType<typeof useSetParam>;
  pagination: ReturnType<typeof usePagination>;
  isPending: boolean;
};

const InvoicesContext = createContext<InvoicesContextType>(
  {} as InvoicesContextType,
);

export default function InvoicesProvider({
  data,
  children,
}: {
  data: GetDoctorInvoices;
  children: ReactNode;
}) {
  const { invoices, total, page, limit, total_page } = data;

  const useSearchValues = useSetParam("search");
  const useStatusFilterValues = useSetParam("status");

  const pagination = usePagination({
    total,
    page,
    limit,
    total_page,
  });

  const isPending =
    useSearchValues.isPending ||
    useStatusFilterValues.isPending ||
    pagination.isPending;

  const value: InvoicesContextType = {
    invoices,
    pagination,
    useSearchValues,
    useStatusFilterValues,
    isPending,
  };

  return <InvoicesContext value={value}>{children}</InvoicesContext>;
}

export function useInvoices() {
  const context = use(InvoicesContext);

  if (context === undefined) {
    throw new Error("useInvoices must be used within an InvoicesProvider");
  }

  return context;
}
