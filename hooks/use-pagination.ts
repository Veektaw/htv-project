import { useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Pagination } from "@/types/users";

export default function usePagination(paginationData: Pagination) {
  const [isPending, startTransition] = useTransition();
  const { replace } = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();

  const currentPage = Number(searchParams.get("page") || "1");

  const totalPages = paginationData.total_page || 0;
  const perPage = paginationData.limit || 10;
  const totalItems = paginationData.total || 0;

  const createPageURL = (page: number | string, key?: string) => {
    const params = new URLSearchParams(searchParams);
    if (key) {
      params.set("page", "1");
      params.set(key, page.toString());
    } else {
      params.set("page", page.toString());
    }
    return `${pathName}?${params.toString()}`;
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      const pageUrl = createPageURL(prevPage);
      startTransition(() => {
        replace(pageUrl);
      });
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      const prevPage = currentPage + 1;
      const pageUrl = createPageURL(prevPage);
      startTransition(() => {
        replace(pageUrl);
      });
    }
  };

  const goToPageNumber = (pageNumber: number) => {
    if (pageNumber <= totalPages && currentPage !== pageNumber) {
      const pageURl = createPageURL(pageNumber);
      startTransition(() => {
        replace(pageURl);
      });
    }
  };

  const getShowingCount = () => {
    if (totalItems < Number(perPage)) {
      return totalItems;
    }

    if (totalItems < currentPage * Number(perPage)) {
      return totalItems;
    }

    return currentPage * Number(perPage);
  };

  const previousBtnState = currentPage === 1;
  const nextBtnState = currentPage === totalPages;

  return {
    currentPage,
    totalPages,
    perPage,
    totalItems,
    isPending,
    handlePrev,
    handleNext,
    goToPageNumber,
    getShowingCount,
    previousBtnState,
    nextBtnState,
  };
}
