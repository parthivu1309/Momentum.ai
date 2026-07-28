import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Momentum.AI",
  description: "Your personal discipline and productivity coach.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <body className="h-dvh flex bg-background text-foreground overflow-hidden">
        <Sidebar />
        <main className="flex-1 min-w-0 overflow-y-auto bg-background">
          <div className="max-w-7xl mx-auto p-6 md:p-10 min-h-[calc(100vh-2rem)] flex flex-col">
            {children}
          </div>
        </main>
        <Toaster position="top-center" theme="dark" />
      </body>
    </html>
  );
}
