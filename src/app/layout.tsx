
import type { Metadata } from "next";
import "@/styles/globals.css";
import localFont from "next/font/local"
import Navbar from "@/components/header/Navbar";
import AuthProvider from "@/context/AuthProvider";
import { ThemeProvider } from "@/context/ThemeProvider";

const monexa = localFont({
  src: './fonts/Figtree-VariableFont_wght.woff',
  variable : '--font-monexa',
  weight:'100 900'
})

export const metadata: Metadata = {
  title: "Monexa",
  description: "Intelligence That Grows Your Wealth",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" className={monexa.variable}>
      <AuthProvider>
        <body className="w-full h-full">
        <ThemeProvider attribute='class' defaultTheme="system" enableSystem>
          <div className="relative w-full h-full">
          {/* LiquidEther Background - Full interactive area */}
          <div className="w-full h-full bg-black z-0">
            {children}
          </div>
          
          {/* Navbar - Above background but with pointer-events-none except for interactive elements */}
          <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
            <div className="pointer-events-auto">
              <Navbar />
            </div>
          </header>
        </div>
        </ThemeProvider>
      </body>
      </AuthProvider>
    </html>
  );
}