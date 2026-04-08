"use client";

import { useReconciliations } from "../../doctor/reconciliations/contexts/reconciliations-provider";
import SearchInput from "../../shared/search";

export default function SearchWrapper() {
  const { useSearchValues } = useReconciliations();
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
