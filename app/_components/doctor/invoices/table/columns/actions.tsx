import { useState } from "react";
import { PopoverContent } from "@/app/_components/ui/popover";
import { ChevronRight } from "lucide-react";

const STATUS_OPTIONS = [
  "Pending",
  "In Progress",
  "Completed",
  "Cancelled",
  "On Hold",
];

interface ActionsProps {
  currentStatus: string;
}

export default function Actions({ currentStatus }: ActionsProps) {
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  return (
    <PopoverContent className="rounded-base w-45 cursor-pointer p-2">
      <ul className="text-CloudyGrey text-xs font-semibold">
        <li className="rounded-base hover:bg-Geraldine inline-block size-full px-3 py-1 text-left transition-colors duration-300 hover:text-white">
          View
        </li>

        {/* Update Status with nested dropdown */}
        <li className="rounded-base size-full text-left">
          <button
            className="hover:bg-Geraldine flex w-full items-center justify-between rounded px-3 py-1 transition-colors duration-300 hover:text-white"
            onClick={() => setShowStatusDropdown((prev) => !prev)}
          >
            Update status
            <ChevronRight
              className={`h-3 w-3 transition-transform duration-200 ${
                showStatusDropdown ? "rotate-90" : ""
              }`}
            />
          </button>

          {/* Status options */}
          {showStatusDropdown && (
            <ul className="bg-CloudyGrey/5 border-CloudyGrey/20 mt-1 rounded border">
              {STATUS_OPTIONS.map((status) => {
                const isCurrentStatus =
                  status.toLowerCase() === currentStatus.toLowerCase();

                return (
                  <li
                    key={status}
                    className={`px-4 py-1 text-left transition-colors duration-300 ${
                      isCurrentStatus
                        ? "cursor-not-allowed opacity-40"
                        : "hover:bg-Geraldine cursor-pointer hover:text-white"
                    }`}
                    onClick={() => {
                      if (isCurrentStatus) return;
                      console.log("Selected status:", status);
                      setShowStatusDropdown(false);
                    }}
                  >
                    {status}
                    {isCurrentStatus && (
                      <span className="ml-1 text-[10px]">(current)</span>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </li>

        <li className="rounded-base hover:bg-Geraldine inline-block size-full px-3 py-1 text-left transition-colors duration-300 hover:text-white">
          Add Comment
        </li>
        <li className="rounded-base hover:bg-Geraldine inline-block size-full px-3 py-1 text-left transition-colors duration-300 hover:text-white">
          View Comment
        </li>
        <li className="rounded-base inline-block size-full cursor-not-allowed px-3 py-1 text-left opacity-40">
          View Receipt
        </li>
        <li className="rounded-base inline-block size-full cursor-not-allowed px-3 py-1 text-left opacity-40">
          Upload Receipt
        </li>
      </ul>
    </PopoverContent>
  );
}