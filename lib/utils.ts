import { clsx, type ClassValue } from "clsx";
import { format, parse, parseISO } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateRandomId = () => {
  return "id-" + Math.random().toString(36).substring(2, 11);
};

export function debouncer<T>(func: (val: T) => void, delay: number) {
  let timeoutId: NodeJS.Timeout | null = null;

  return (val: T) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func(val);
    }, delay);
  };
}

export function formatPrescriptionDate(dateString: string) {
  const date = parse(dateString, "yyyy-MM", new Date());

  const formattedDate = format(date, "MMMM, yyyy");

  return formattedDate;
}

export function formatInvoiceCreatedAtDate(dateString: string) {
  const formatted = format(parseISO(dateString), "dd MMMM, yyyy");

  return formatted;
}
