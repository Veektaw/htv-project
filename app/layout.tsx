import { ReactNode } from "react";
import type { Metadata } from "next";
import { inter } from "@/public/fonts";
import QueryProvider from "@/contexts/query-provider";
import { TooltipProvider } from "./_components/ui/tooltip";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | HTV",
    default: "HTV",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <QueryProvider>
        <body
          className={`${inter.className} text-RangoonGreen overflow-clip text-sm antialiased`}
        >
          <TooltipProvider>{children}</TooltipProvider>
          <Toaster position="top-right" className="font-inter!" />
        </body>
      </QueryProvider>
    </html>
  );
}
