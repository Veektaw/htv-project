"use client";

import { useSiderbar } from "@/contexts/sidebar-provider";
import { cn } from "@/lib/utils";
import Image from "next/image";
import HTVLogo from "./icons/htv-logo";
import HTVLogoSmall from "./icons/htv-logo-small";
import sidebarCloseIcon from "@/public/svgs/fi_sidebar-close.svg";

export default function SidebarLogoAndButton() {
  const { isAdminRoute, openSidebar, setOpenSidebar } = useSiderbar();

  return (
    <div className="my-11 flex items-center px-2.25">
      <div className="flex-1">
        {!openSidebar ? (
          <button
            onClick={() => setOpenSidebar((prev) => !prev)}
            className={cn(
              "mx-auto block",
              isAdminRoute ? "text-black" : "text-white",
            )}
          >
            <HTVLogoSmall />
          </button>
        ) : (
          <div
            className={cn(
              "mx-auto w-fit",
              isAdminRoute ? "text-black" : "text-white",
            )}
          >
            <HTVLogo />
          </div>
        )}
      </div>

      {openSidebar && (
        <button
          onClick={() => setOpenSidebar((prev) => !prev)}
          className="bg-CatskillWhite flex size-8 items-center justify-center rounded-sm"
        >
          <Image src={sidebarCloseIcon} alt="arrow left" />
        </button>
      )}
    </div>
  );
}
