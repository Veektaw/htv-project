"use client";

import { createContext, ReactNode, use } from "react";
import { AdminPayments, GetAdminPayments } from "@/types/payments";
import useSetParam from "@/hooks/use-set-param";
import usePagination from "@/hooks/use-pagination";

type PaymentsContextType = {
  payments: GetAdminPayments[];
  useSearchValues: ReturnType<typeof useSetParam>;
  usePlatformFilterValues: ReturnType<typeof useSetParam>;
  pagination: ReturnType<typeof usePagination>;
  isPending: boolean;
};

const PaymentsContext = createContext<PaymentsContextType>(
  {} as PaymentsContextType,
);

export default function PaymentsProvider({
  data,
  children,
}: {
  data: AdminPayments;
  children: ReactNode;
}) {
  const { payments, total, page, limit, total_page } = data;

  const useSearchValues = useSetParam("search");
  const usePlatformFilterValues = useSetParam("platform");

  const pagination = usePagination({
    total,
    page,
    limit,
    total_page,
  });

  const isPending =
    useSearchValues.isPending ||
    usePlatformFilterValues.isPending ||
    pagination.isPending;

  const value: PaymentsContextType = {
    payments,
    pagination,
    useSearchValues,
    usePlatformFilterValues,
    isPending,
  };

  return (
    <PaymentsContext.Provider value={value}>
      {children}
    </PaymentsContext.Provider>
  );
}

export const usePayments = () => {
  const context = use(PaymentsContext);
  if (!context) {
    throw new Error("usePayments must be used within a PaymentsProvider");
  }
  return context;
};