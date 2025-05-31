import { Toaster } from "@/components/ui/sonner";
import { StoreProvider } from "@/store/provider";
import { ThemeProvider } from "@/utils/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import type { Metadata } from "next";
import { Rethink_Sans } from "next/font/google";
import "./globals.css";
import { ServerStatus } from "@/components/ServerStatus";
import { Providers } from "./providers";

const rethink = Rethink_Sans({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "School Management System",
  description: "A comprehensive school management system built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <StoreProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${rethink.className} max-w-[1300px] antialiased`}
          suppressHydrationWarning
        >
          <Providers>
            <ServerStatus>
              <AuthProvider>
                {children}
              </AuthProvider>
            </ServerStatus>
          </Providers>
          <Toaster visibleToasts={1} richColors={true} position="top-right" />
        </body>
      </html>
    </StoreProvider>
  );
}
