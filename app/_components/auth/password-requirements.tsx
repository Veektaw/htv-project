import { CircleQuestionMark } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

const requirements = [
  "Use 8-50 characters",
  "One number",
  "One symbol",
  "One uppercase letter",
  "One lowercase letter",
];

export default function PasswordRequirementsTooltip() {
  return (
    <Tooltip>
      <TooltipTrigger type="button">
        <CircleQuestionMark className="text-OsloGrey size-4.5" />
        {/* <Button variant="outline">Hover</Button> */}
      </TooltipTrigger>
      <TooltipContent className="rounded-base w-40 bg-black px-3 py-3.5">
        <ul className="list-disc space-y-3 pl-3 text-xs text-white">
          {requirements.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </TooltipContent>
    </Tooltip>
  );
}
