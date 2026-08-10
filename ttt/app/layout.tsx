import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ThemeProvider } from "@/components/theme-provider";

import { Inter, Anton, Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { headers } from "next/headers";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--font-anton" });

export const metadata: Metadata = {
  title: "Tea Tech Talks | College Technical Committee",
  description:
    "Join Tea Tech Talks — compete in typing challenges and tech quizzes, climb the leaderboard, and grow with our campus technical community.",
};

import { createClient } from "@/lib/supabase/server";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? headersList.get("x-invoke-path") ?? "";
  // Hide navbar/footer for admin and activity room routes
  const isAppRoute = pathname.startsWith("/admin") || pathname.startsWith("/room") || pathname.startsWith("/join");

  return (
    <html lang="en" suppressHydrationWarning className={cn("h-full", "antialiased", inter.variable, anton.variable, "font-sans", geist.variable)}>
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-[var(--color-brand)] selection:text-[#fff] font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {!isAppRoute && <Navbar isLoggedIn={!!user} />}
          <main className="flex-1">{children}</main>
          {!isAppRoute && <Footer />}
        </ThemeProvider>
      </body>
    </html>
  );
}
