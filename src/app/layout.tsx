

import type { Metadata } from "next";
import "@/styles/globals.css";
import localFont from "next/font/local";
import { AuthProvider} from "@/context/AuthProvider";
import { ThemeProvider } from "@/context/ThemeProvider";
import ClientNavbar from "@/components/header/clientNavbar";

const monexa = localFont({
    src: "../../public/fonts/Figtree-VariableFont_wght.woff",
    variable: "--font-monexa",
    weight: "100 900",
});

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
            <body className="w-full h-full bg-black">
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                >
                    <AuthProvider>
                        <div className="relative w-full h-full">

                            <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
                                <div className="pointer-events-auto">
                                    <ClientNavbar/>
                                </div>
                            </header>

                            <div className="w-full h-full  z-0">{children}</div>

                            
                        </div>
                    </AuthProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
