import type { Metadata } from "next";
import { inter } from "@/public/fonts";
import { Toaster } from "sonner";
import { TooltipProvider } from "./_components/ui/tooltip";
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
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} text-RangoonGreen text-sm antialiased`}
      >
        <TooltipProvider>{children}</TooltipProvider>
        <Toaster position="top-right" className="font-inter!" />
      </body>
    </html>
  );
}
