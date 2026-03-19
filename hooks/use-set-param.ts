import { useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function useSetParam(paramKey: string) {
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const [isPending, startTransition] = useTransition();

  const value = searchParams.get(paramKey)?.toString();

  const handleSetParam = (term: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");

    if (term) {
      params.set(paramKey, term);
    } else {
      params.delete(paramKey);
    }

    startTransition(() => {
      replace(`${pathName}?${params.toString()}`);
    });
  };

  const clearParam = () => {
    const params = new URLSearchParams(searchParams);

    params.set("page", "1");

    params.delete(paramKey);

    startTransition(() => {
      replace(`${pathName}?${params.toString()}`);
    });
  };

  return {
    isPending,
    value,
    handleSetParam,
    clearParam,
  };
}
