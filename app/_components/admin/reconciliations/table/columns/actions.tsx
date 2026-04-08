import { PopoverContent } from "@/app/_components/ui/popover";

export default function Actions() {
  return (
    <PopoverContent className="rounded-base w-fit p-2">
      <ul className="text-CloudyGrey text-xs font-semibold">
        <li className="rounded-base hover:bg-Geraldine inline-block size-full px-3 py-1 text-left transition-colors duration-300 hover:text-white">
          Create invoice
        </li>
      </ul>
    </PopoverContent>
  );
}
