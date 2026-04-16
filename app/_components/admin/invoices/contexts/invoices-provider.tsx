"use client";

import { createContext, ReactNode, use } from "react";
import { GetInvoicesResponse, Invoice } from "@/types/invoices";
import useSetParam from "@/hooks/use-set-param";
import usePagination from "@/hooks/use-pagination";

type InvoicesContextType = {
  invoices: Invoice[];
  useSearchValues: ReturnType<typeof useSetParam>;
  useRoleFilterValues: ReturnType<typeof useSetParam>;
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
  data: GetInvoicesResponse;
  children: ReactNode;
}) {
  const { invoices, total, page, limit, total_page } = data;

  const useSearchValues = useSetParam("search");
  const useRoleFilterValues = useSetParam("role");

  const pagination = usePagination({
    total,
    page,
    limit,
    total_page,
  });

  const isPending =
    useSearchValues.isPending ||
    useRoleFilterValues.isPending ||
    pagination.isPending;

  const value: InvoicesContextType = {
    invoices,
    pagination,
    useSearchValues,
    useRoleFilterValues,
    isPending,
  };

  return (
    <InvoicesContext.Provider value={value}>
      {children}
    </InvoicesContext.Provider>
  );
}

export const useInvoices = () => {
  const context = use(InvoicesContext);
  if (!context) {
    throw new Error("useInvoices must be used within an InvoicesProvider");
  }
  return context;
};