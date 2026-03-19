"use client";

import { cn } from "@/lib/utils";
import { useUsers } from "../contexts/users-provider";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function TablePagination() {
  const { pagination } = useUsers();

  const {
    currentPage,
    totalPages,
    handlePrev,
    handleNext,
    goToPageNumber,
    previousBtnState,
    nextBtnState,
  } = pagination;

  return (
    <div className="text-BalticSea flex flex-wrap items-center gap-3.5 text-xs">
      <div className="text-Grey flex items-center gap-1">
        <button
          disabled={previousBtnState}
          onClick={handlePrev}
          className="border-Mercury flex size-8 items-center justify-center border disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronLeft className="text-Dune size-4" />
        </button>

        {renderPageNumbers(currentPage, totalPages, goToPageNumber)}

        <button
          disabled={nextBtnState}
          onClick={handleNext}
          className="border-Mercury flex size-8 items-center justify-center border disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronRight className="text-Dune size-4" />
        </button>
      </div>

      <p className="text-IronsideGrey">
        of {totalPages} {totalPages === 1 ? "page" : "pages"}
      </p>
    </div>
  );
}

export function PageNumber({
  currentPage,
  index,
  goToPageNumber,
}: {
  currentPage: number;
  index: number;
  goToPageNumber: (pageNumber: number) => void;
}) {
  return (
    <button
      onClick={() => goToPageNumber(index)}
      className={cn(
        "flex size-8 items-center justify-center rounded-xs px-1.5 py-2",
        currentPage === index ? "bg-black text-white" : "border-Mercury border",
      )}
    >
      {index}
    </button>
  );
}

export const renderPageNumbers = (
  currentPage: number,
  totalPages: number,
  goToPageNumber: (pageNumber: number) => void,
) => {
  const pageNumbers = [];

  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <PageNumber
          key={i}
          currentPage={currentPage}
          index={i}
          goToPageNumber={goToPageNumber}
        />,
      );
    }
  } else {
    // Always show first page number
    pageNumbers.push(
      <PageNumber
        key={1}
        currentPage={currentPage}
        index={1}
        goToPageNumber={goToPageNumber}
      />,
    );

    // Show dots if there are more than 5 pages and we're not in the first 3 pages
    if (currentPage > 3) {
      pageNumbers.push(
        <span key="ellipsis1" className="size-6">
          ...
        </span>,
      );
    }

    // Show current page number and one before and after
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <PageNumber
          key={i}
          currentPage={currentPage}
          index={i}
          goToPageNumber={goToPageNumber}
        />,
      );
    }

    // Show dots if there are more pages
    if (currentPage < totalPages - 3) {
      pageNumbers.push(
        <span key="ellipsis2" className="size-6">
          ...
        </span>,
      );
    }

    // Calculate how to show last two page numbers
    const startPage2 =
      currentPage >= totalPages - 2 ? totalPages : totalPages - 1;

    for (let i = startPage2; i <= totalPages; i++) {
      pageNumbers.push(
        <PageNumber
          key={i}
          currentPage={currentPage}
          index={i}
          goToPageNumber={goToPageNumber}
        />,
      );
    }
  }

  return pageNumbers;
};
