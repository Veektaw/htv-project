import Image from "next/image";
import arrowUp from "@/public/svgs/green-arrow-up.svg";

type CardProps = {
  text: string;
  value: number;
  percentage: string;
  showEuro?: boolean;
};

export default function Card({ text, value, percentage, showEuro }: CardProps) {
  return (
    <div className="border-Iron flex min-h-37 gap-4 rounded-lg border px-4 py-6">
      <span className="bg-DarkJungleGreen w-0.75 rounded-md"></span>

      <div className="flex-1 space-y-8">
        <div className="flex items-center justify-between gap-2">
          <p className="text-MediumGrey text-sm">{text}</p>
        </div>

        <div className="flex items-center justify-between gap-2">
          <p className="text-DarkJungleGreen text-2xl font-black">
            {showEuro ? `€${value}` : value}
          </p>

          <div className="flex items-center gap-0.5">
            <p className="text-DeepSea text-sm font-black">{percentage}</p>
            <Image src={arrowUp} alt="green arrow up" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function CardLoader() {
  return (
    <div className="border-Iron bg-BlueChalk flex min-h-37 animate-pulse gap-4 rounded-lg border px-4 py-6">
      <span className="bg-DarkJungleGreen w-0.75 rounded-md"></span>
    </div>
  );
}
