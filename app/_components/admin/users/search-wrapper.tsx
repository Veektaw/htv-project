"use client";

import { useUsers } from "./contexts/users-provider";
import SearchInput from "../../shared/search";

export default function SearchWrapper() {
  const { useSearchValues } = useUsers();
  const { value, handleSetParam, isPending } = useSearchValues;

  return (
    <SearchInput
      showSearchIcon
      isPending={isPending}
      searchValue={value}
      handleSearch={handleSetParam}
    />
  );
}
