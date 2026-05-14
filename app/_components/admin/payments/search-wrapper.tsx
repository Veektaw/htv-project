"use client";

import { usePayments } from "./contexts/payments-provider";
import SearchInput from "../../shared/search";

export default function SearchWrapper() {
  const { useSearchValues } = usePayments();
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
