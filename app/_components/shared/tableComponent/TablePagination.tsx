"use client";

// import Image from "next/image";

export default function TablePagination() {
  // const {
  //   currentPage,
  //   totalPages,
  //   handlePrev,
  //   handleNext,
  //   goToPageNumber,
  //   previousBtnState,
  //   nextBtnState,
  //   setPageLimit,
  // } = useAssets();

  return;
  // (
  //   <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-CharcoalGrey">
  //     <div className="hidden items-center gap-2.5 sm:flex">
  //       <label htmlFor="rows-per-page">Rows per page</label>

  //       <div className="flex items-center border-b border-Heather px-1.5 py-0.5">
  //         <select
  //           id="rows-per-page"
  //           onChange={(e) => setPageLimit(e.target.value)}
  //           className="size-full outline-Black"
  //         >
  //           <option value="10">10</option>
  //           <option value="20">20</option>
  //         </select>
  //       </div>
  //     </div>

  //     <div className="flex items-center gap-2 text-Grey">
  //       <button
  //         disabled={previousBtnState}
  //         onClick={handlePrev}
  //         className="flex size-6 items-center justify-center border border-Platinum disabled:cursor-not-allowed disabled:opacity-50"
  //       >
  //         <Image src={LeftCaret} alt="left caret" />
  //       </button>

  //       {renderPageNumbers(currentPage, totalPages, goToPageNumber)}

  //       <button
  //         disabled={nextBtnState}
  //         onClick={handleNext}
  //         className="flex size-6 items-center justify-center border border-Platinum disabled:cursor-not-allowed disabled:opacity-50"
  //       >
  //         <Image src={LeftCaret} alt="left caret" className="rotate-180" />
  //       </button>
  //     </div>

  //     <div className="flex items-center gap-2.5">
  //       <span>Go to page</span>

  //       <button
  //         onClick={() => goToPageNumber(totalPages)}
  //         className="font-semibold text-Haiti"
  //       >
  //         {totalPages}
  //       </button>
  //     </div>
  //   </div>
  // );
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
      className={`size-6 ${currentPage === index ? "text-Heading-300 font-semibold" : ""}`}
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
