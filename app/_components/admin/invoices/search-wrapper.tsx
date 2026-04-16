"use client";

import { useInvoices } from "./contexts/invoices-provider";
import SearchInput from "../../shared/search";

export default function SearchWrapper() {
  const { useSearchValues } = useInvoices();
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
