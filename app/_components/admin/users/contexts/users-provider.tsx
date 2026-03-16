"use client";

import { createContext, ReactNode, use } from "react";
import { User } from "@/types/auth";

type UsersContextType = {
  users: User[];
};

const UsersContext = createContext<UsersContextType>({} as UsersContextType);

export default function UsersProvider({
  users,
  children,
}: {
  users: User[];
  children: ReactNode;
}) {
  const value: UsersContextType = {
    users,
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
