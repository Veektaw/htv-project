"use client";

import { useSiderbar } from "@/contexts/sidebar-provider";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { XIcon } from "lucide-react";
import HTVLogo from "./icons/htv-logo";
import HTVLogoSmall from "./icons/htv-logo-small";
import sidebarCloseIcon from "@/public/svgs/fi_sidebar-close.svg";

export default function SidebarLogoAndButton() {
  const { isAdminRoute, isPharmacyRoute, openSidebar, setOpenSidebar, setMobileNavOpen } =
    useSiderbar();

  const isLightBackground = isAdminRoute || isPharmacyRoute;

  return (
    <div className="mt-6 mb-4 flex items-center px-3">
      <div className="flex-1">
        {!openSidebar ? (
          <>
            <button
              onClick={() => setOpenSidebar((prev) => !prev)}
              className={cn(
                "mx-auto hidden lg:block",
                isLightBackground ? "text-black" : "text-white",
              )}
            >
              <HTVLogoSmall />
            </button>
            <div
              className={cn(
                "mx-auto w-fit lg:hidden",
                isLightBackground ? "text-black" : "text-white",
              )}
            >
              <HTVLogo />
            </div>
          </>
        ) : (
          <div
            className={cn(
              "px-1",
              isLightBackground ? "text-black" : "text-white",
            )}
          >
            <HTVLogo />
          </div>
        )}
      </div>

      {openSidebar && (
        <button
          onClick={() => setOpenSidebar((prev) => !prev)}
          className="bg-CatskillWhite hidden size-7 items-center justify-center rounded-md lg:flex hover:bg-gray-200 transition-colors"
        >
          <Image src={sidebarCloseIcon} alt="collapse sidebar" className="size-4" />
        </button>
      )}

      <button
        onClick={() => setMobileNavOpen(false)}
        aria-label="Close menu"
        className={cn(
          "flex size-8 items-center justify-center rounded-sm lg:hidden",
          isLightBackground ? "bg-CatskillWhite text-black" : "bg-white/10 text-white",
        )}
      >
        <XIcon className="size-4.5" />
      </button>
    </div>
  );
}
