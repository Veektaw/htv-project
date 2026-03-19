"use client";

import { createContext, ReactNode, use } from "react";
import { GetUsersResponse } from "@/types/users";
import { User } from "@/types/auth";
import useSetParam from "@/hooks/use-set-param";
import usePagination from "@/hooks/use-pagination";

type UsersContextType = {
  users: User[];
  useSearchValues: ReturnType<typeof useSetParam>;
  pagination: ReturnType<typeof usePagination>;
  isPending: boolean;
};

const UsersContext = createContext<UsersContextType>({} as UsersContextType);

export default function UsersProvider({
  data,
  children,
}: {
  data: GetUsersResponse;
  children: ReactNode;
}) {
  const { users, total, page, limit, total_page } = data;

  const useSearchValues = useSetParam("search");

  const pagination = usePagination({
    total,
    page,
    limit,
    total_page,
  });

  const isPending = useSearchValues.isPending || pagination.isPending;

  const value: UsersContextType = {
    users,
    pagination,
    useSearchValues,
    isPending,
  };

  return <UsersContext value={value}>{children}</UsersContext>;
}

export function useUsers() {
  const context = use(UsersContext);

  if (context === undefined) {
    throw new Error("useUsers must be used within a UsersProvider");
  }

  return context;
}
