"use client";

import { useState } from "react";
import { usePrescriptions } from "./contexts/prescriptions-provider";
import { format } from "date-fns";
import { ChevronDownIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/_components/ui/popover";
import { Button } from "@/app/_components/ui/button";
import { Calendar } from "@/app/_components/ui/calendar";
import useSetParam from "@/hooks/use-set-param";
import Image from "next/image";
import calendarIcon from "@/public/svgs/calendar.svg";

export default function SortAndDateFilter() {
  const { user } = usePrescriptions();
  const usePlatformFilterValues = useSetParam("platform");
  const { value, handleSetParam, isPending } = usePlatformFilterValues;

  const useStartDateFilterValues = useSetParam("start_date");
  const useEndDateFilterValues = useSetParam("end_date");
  const {
    value: startDate,
    isPending: isStartDatePending,
    setParams,
  } = useStartDateFilterValues;

  const { value: endDate, isPending: isEndDatePending } =
    useEndDateFilterValues;
  const isDateFilterPending = isStartDatePending || isEndDatePending;

  const [date, setDate] = useState<Date | undefined>(() => {
    const dateValue = startDate;
    return dateValue ? new Date(dateValue) : undefined;
  });

  const [date2, setDate2] = useState<Date | undefined>(() => {
    const dateValue = endDate;
    return dateValue ? new Date(dateValue) : undefined;
  });

  const handleSetDate = (dateValue1: Date, dateValue2: Date) => {
    if (dateValue1 && dateValue2) {
      const formattedDate = format(dateValue1, "yyyy-MM-dd");
      const formattedDate2 = format(dateValue2, "yyyy-MM-dd");

      setParams({
        start_date: formattedDate,
        end_date: formattedDate2,
      });
    }
  };

  return (
    <div className="border-GreyCloud rounded-base flex w-fit gap-8 border px-5 py-4">
      <div className="space-y-1">
        <p className="text-xs font-medium text-black">Sort By Platform</p>

        <Select value={value} onValueChange={handleSetParam}>
          <SelectTrigger
            data-platformfilterpending={isPending}
            className="h-7! w-47.75 rounded-[24px] border-black px-4 py-1.5 text-xs capitalize data-placeholder:text-black"
          >
            <SelectValue placeholder="Platform" />
          </SelectTrigger>

          <SelectContent>
            <SelectGroup>
              {user!.all_platforms.map((platform) => (
                <SelectItem
                  key={platform}
                  value={platform}
                  className="text-xs capitalize"
                >
                  {platform}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div
        data-datefilterpending={isDateFilterPending}
        className="flex flex-wrap items-center gap-3"
      >
        <div className="space-y-1">
          <p className="text-xs font-medium text-black">From</p>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                data-empty={!date}
                className="h-7 min-w-28.5 justify-between rounded-[24px] border border-black px-4 py-1.5 text-left text-xs capitalize data-placeholder:text-black"
              >
                {date ? (
                  format(date, "PPP")
                ) : (
                  <Image src={calendarIcon} alt="calendar icon" />
                )}
                <ChevronDownIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(dateValue) => {
                  setDate(dateValue);
                  if (dateValue && date2) {
                    handleSetDate(dateValue, date2);
                  }
                }}
                defaultMonth={date ? new Date(date) : undefined}
                endMonth={new Date()}
                disabled={(date) => date > new Date()}
                className="w-full"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-1">
          <p className="text-xs font-medium text-black">To</p>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                data-empty={!date2}
                className="h-7 min-w-28.5 justify-between rounded-[24px] border border-black px-4 py-1.5 text-left text-xs capitalize data-placeholder:text-black"
              >
                {date2 ? (
                  format(date2, "PPP")
                ) : (
                  <Image src={calendarIcon} alt="calendar icon" />
                )}

                <ChevronDownIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-0" align="start">
              <Calendar
                mode="single"
                selected={date2}
                onSelect={(dateValue) => {
                  setDate2(dateValue);
                  if (date && dateValue) {
                    handleSetDate(date, dateValue);
                  }
                }}
                defaultMonth={date2 ? date2 : undefined}
                endMonth={new Date()}
                disabled={(date) => date > new Date()}
                className="w-full"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}
