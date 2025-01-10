import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import ConvexClientProvider from "@/components/providers/ConvexClientProvider";
import { Toaster } from "react-hot-toast";
import StyleProvider from "@/components/providers/StyleProvider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "LogoGenix",
  description: "Generate unique, professional logos with our AI-powered platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
        >
          
          <ConvexClientProvider>
            <StyleProvider>
            {children}
            </StyleProvider>
          </ConvexClientProvider>


          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}

// https://emkc.org/api/v2/piston/runtimes