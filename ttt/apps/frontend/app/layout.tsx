import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ThemeProvider } from "@/components/theme-provider";
import PixelTrail from "@/components/PixelTrail";
import PixelSnow from "@/components/PixelSnow";

import { Inter, Anton, Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { headers } from "next/headers";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--font-anton" });

export const metadata: Metadata = {
  title: "Tea Tech Talks | College Technical Committee",
  description:
    "Join Tea Tech Talks — compete in typing challenges and tech quizzes, climb the leaderboard, and grow with our campus technical community.",
};

import { createClient } from "@/lib/supabase/server";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
import { AuthModalProvider } from "@/components/providers/auth-modal-provider";

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
          <AuthModalProvider>
            <SmoothScrollProvider>
              {!isAppRoute && <Navbar isLoggedIn={!!user} />}
              <main className="flex-1">{children}</main>
              {!isAppRoute && <Footer />}
              <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <PixelTrail
                  gridSize={60}
                  trailSize={0.1}
                  maxAge={250}
                  color="#D90429"
                  interpolate={0.5}
                  gooeyFilter={undefined}
                />
              </div>
              <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <PixelSnow
                  color="#D90429"
                  flakeSize={0.01}
                  speed={1.0}
                  density={0.3}
                  variant="snowflake"
                  farPlane={11}
                />
              </div>
            </SmoothScrollProvider>
          </AuthModalProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
