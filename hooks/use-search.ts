import { useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { debouncer } from "@/lib/utils";

export default function useSearch() {
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const [isPending, startTransition] = useTransition();

  const searchValue = searchParams.get("search")?.toString();

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");

    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
    }

    startTransition(() => {
      replace(`${pathName}?${params.toString()}`);
    });
  };

  const clearSearch = () => {
    const params = new URLSearchParams(searchParams);

    params.set("page", "1");

    params.delete("search");

    startTransition(() => {
      replace(`${pathName}?${params.toString()}`);
    });
  };

  const debouncedSearch = debouncer(handleSearch, 350);

  return {
    searchValue,
    handleSearch,
    debouncedSearch,
    clearSearch,
    isPending,
  };
}
