"use client";

import { useUsers } from "./contexts/users-provider";
import { debouncer } from "@/lib/utils";
import { Search } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../../ui/input-group";

export default function SearchInput() {
  const { useSearchValues } = useUsers();
  const { isPending, value, handleSetParam } = useSearchValues;
  const debouncedSearch = debouncer(handleSetParam, 350);

  return (
    <InputGroup className="h-10.5 w-full max-w-94.5 rounded-[24px]! border border-black px-6">
      <InputGroupInput
        data-pending={isPending ? "" : undefined}
        type="text"
        placeholder="Search"
        className="font-semibold placeholder:text-xs placeholder:font-semibold placeholder:text-black"
        defaultValue={value}
        onChange={(e) => debouncedSearch(e.target.value)}
      />
      <InputGroupAddon>
        <Search className="text-black" />
      </InputGroupAddon>
    </InputGroup>
  );
}
