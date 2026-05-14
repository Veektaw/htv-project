"use client";

import { cn, debouncer } from "@/lib/utils";
import { Search } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/app/_components/ui/input-group";

type SearchInputProps = {
  handleSearch: (val: string) => void;
  isPending: boolean;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  searchValue?: string;
  showSearchIcon?: boolean;
};

export default function SearchInput({
  placeholder,
  isPending,
  className,
  inputClassName,
  searchValue,
  handleSearch,
  showSearchIcon = true,
}: SearchInputProps) {
  const debouncedSearch = debouncer(handleSearch, 350);

  return (
    <InputGroup
      className={cn(
        "h-10.5 w-full max-w-94.5 rounded-[24px]! border border-black px-6",
        className,
      )}
    >
      <InputGroupInput
        data-searchpending={isPending}
        type="text"
        placeholder={placeholder || "Search"}
        className={cn(
          "font-semibold placeholder:text-xs placeholder:font-semibold placeholder:text-black",
          inputClassName,
        )}
        defaultValue={searchValue}
        onChange={(e) => debouncedSearch(e.target.value)}
      />
      {showSearchIcon && (
        <InputGroupAddon>
          <Search className="text-black" />
        </InputGroupAddon>
      )}
    </InputGroup>
  );
}
