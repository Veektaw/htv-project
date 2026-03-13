import Image from "next/image";
import arrowUp from "@/public/svgs/green-arrow-up.svg";

export default function Card() {
  return (
    <div className="border-Iron flex min-h-37 gap-4 rounded-lg border px-4 py-6">
      <span className="bg-DarkJungleGreen w-0.75 rounded-md"></span>

      <div className="flex-1 space-y-8">
        <div className="flex items-center justify-between gap-2">
          <p className="text-MediumGrey text-sm">Total Users</p>
        </div>

        <div className="flex items-center justify-between gap-2">
          <p className="text-DarkJungleGreen text-2xl font-black">5,000</p>

          <div className="flex items-center gap-0.5">
            <p className="text-DeepSea text-sm font-black">+68%</p>
            <Image src={arrowUp} alt="green arrow up" />
          </div>
        </div>
      </div>
    </div>
  );
}
