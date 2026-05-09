"use client";

import { createContext, ReactNode, use } from "react";
import { GetDoctorPayments, Payment } from "@/types/doctors-payments";
import useSetParam from "@/hooks/use-set-param";
import usePagination from "@/hooks/use-pagination";

type PaymentsContextType = {
  payments: Payment[];
  useSearchValues: ReturnType<typeof useSetParam>;
  useStatusFilterValues: ReturnType<typeof useSetParam>;
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
  data: GetDoctorPayments;
  children: ReactNode;
}) {
  const { payments, total, page, limit, total_page } = data;

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

  const value: PaymentsContextType = {
    payments,
    pagination,
    useSearchValues,
    useStatusFilterValues,
    isPending,
  };

  return <PaymentsContext value={value}>{children}</PaymentsContext>;
}

export function usePayments() {
  const context = use(PaymentsContext);

  if (context === undefined) {
    throw new Error("usePayments must be used within a PaymentsProvider");
  }

  return context;
}
