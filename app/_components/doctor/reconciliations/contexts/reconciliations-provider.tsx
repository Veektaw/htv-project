"use client";

import { createContext, ReactNode, use } from "react";
import {
  GetDoctorReconciliations,
  Reconciliation,
} from "@/types/reconciliations";
import useSetParam from "@/hooks/use-set-param";
import usePagination from "@/hooks/use-pagination";

type ReconciliationsContextType = {
  reconciliations: Reconciliation[];
  useSearchValues: ReturnType<typeof useSetParam>;
  useRoleFilterValues: ReturnType<typeof useSetParam>;
  pagination: ReturnType<typeof usePagination>;
  isPending: boolean;
};

const ReconciliationsContext = createContext<ReconciliationsContextType>(
  {} as ReconciliationsContextType,
);

export default function ReconciliationsProvider({
  data,
  children,
}: {
  data: GetDoctorReconciliations;
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

  const value: ReconciliationsContextType = {
    reconciliations,
    pagination,
    useSearchValues,
    useRoleFilterValues,
    isPending,
  };

  return (
    <ReconciliationsContext value={value}>{children}</ReconciliationsContext>
  );
}

export function useReconciliations() {
  const context = use(ReconciliationsContext);

  if (context === undefined) {
    throw new Error(
      "useReconciliations must be used within a ReconciliationsProvider",
    );
  }

  return context;
}
