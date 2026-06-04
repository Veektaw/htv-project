import { ReactNode } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/_components/ui/accordion";

export default function AdvancedSettingsSkeleton({
  children,
  addPlatformButton,
}: {
  children: ReactNode;
  addPlatformButton?: ReactNode;
}) {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-2" className="space-y-3">
        <AccordionTrigger
          className="bg-CloudyGrey rounded-xls px-5 py-4.5 text-lg font-medium text-white hover:no-underline"
          chevronDownClassName="size-6 text-GreyCloud"
        >
          Advanced Settings
        </AccordionTrigger>

        <AccordionContent className="border-GreyCloud rounded-xls space-y-9 border px-10 py-7">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-black">
              Platform Configuration
            </h2>

            {addPlatformButton}
          </div>

          {children}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
