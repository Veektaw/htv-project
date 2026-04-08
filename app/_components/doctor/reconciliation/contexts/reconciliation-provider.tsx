"use client";

import { createContext, ReactNode, use } from "react";
import {
  GetDoctorReconciliation,
  Reconciliation,
} from "@/types/reconciliation";
import useSetParam from "@/hooks/use-set-param";
import usePagination from "@/hooks/use-pagination";

type ReconciliationContextType = {
  reconciliations: Reconciliation[];
  useSearchValues: ReturnType<typeof useSetParam>;
  useRoleFilterValues: ReturnType<typeof useSetParam>;
  pagination: ReturnType<typeof usePagination>;
  isPending: boolean;
};

const ReconciliationContext = createContext<ReconciliationContextType>(
  {} as ReconciliationContextType,
);

export default function ReconciliationProvider({
  data,
  children,
}: {
  data: GetDoctorReconciliation;
  children: ReactNode;
}) {
  const { reconciliations, total, page, limit, total_page } = data;

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

  const value: ReconciliationContextType = {
    reconciliations,
    pagination,
    useSearchValues,
    useRoleFilterValues,
    isPending,
  };

  return (
    <ReconciliationContext value={value}>{children}</ReconciliationContext>
  );
}

export function useReconciliation() {
  const context = use(ReconciliationContext);

  if (context === undefined) {
    throw new Error(
      "useReconciliation must be used within a ReconciliationProvider",
    );
  }

  return context;
}
