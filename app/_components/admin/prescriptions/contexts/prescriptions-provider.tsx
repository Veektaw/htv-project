"use client";

import { createContext, ReactNode, use } from "react";
import { User } from "@/types/auth";
import { GetDoctorPrescriptions, Prescription } from "@/types/prescriptions";
import useSetParam from "@/hooks/use-set-param";
import usePagination from "@/hooks/use-pagination";

type PrescriptionsContextType = {
  user: User | undefined;
  prescriptions: Prescription[];
  useSearchValues: ReturnType<typeof useSetParam>;
  useRoleFilterValues: ReturnType<typeof useSetParam>;
  pagination: ReturnType<typeof usePagination>;
  isPending: boolean;
};

const PrescriptionsContext = createContext<PrescriptionsContextType>(
  {} as PrescriptionsContextType,
);

export default function PrescriptionsProvider({
  user,
  data,
  children,
}: {
  user: User | undefined;
  data: GetDoctorPrescriptions;
  children: ReactNode;
}) {
  const { prescriptions, total, page, limit, total_page } = data;

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

  const value: PrescriptionsContextType = {
    user,
    prescriptions,
    pagination,
    useSearchValues,
    useRoleFilterValues,
    isPending,
  };

  return <PrescriptionsContext value={value}>{children}</PrescriptionsContext>;
}

export function usePrescriptions() {
  const context = use(PrescriptionsContext);

  if (context === undefined) {
    throw new Error(
      "usePrescriptions must be used within a PrescriptionsProvider",
    );
  }

  return context;
}
