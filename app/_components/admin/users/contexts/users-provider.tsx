"use client";

import { createContext, ReactNode, use } from "react";
import { GetUsersResponse } from "@/types/users";
import { User } from "@/types/auth";
import usePagination from "@/hooks/use-pagination";

type UsersContextType = {
  users: User[];
  pagination: ReturnType<typeof usePagination>;
};

const UsersContext = createContext<UsersContextType>({} as UsersContextType);

export default function UsersProvider({
  data,
  children,
}: {
  data: GetUsersResponse;
  children: ReactNode;
}) {
  const { users, total, page, limit } = data;

  const pagination = usePagination({
    total,
    page,
    limit,
  });

  const value: UsersContextType = {
    users,
    pagination,
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
