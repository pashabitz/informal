import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ConvexClientProvider from "./ConvexClientProvider";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { ConvexProviderWithClerk } from "convex/react-clerk";

import "./globals.css";
import Header from "./Header";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Informal",
  description: "Make forms with Convex and Love",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="https://zany.sh/favicon.svg?emoji=📋"></link>
      </head>
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
        <ConvexClientProvider>
        <Header />
        <main className="container flex-grow mx-auto m-2">
        {children}
        </main>
        <Toaster />
        </ConvexClientProvider>
        <footer className="flex justify-center items-center">Made with ❤️ and&nbsp;<a href="https://convex.dev" target="_blank">Convex</a></footer>
        </div>
        </body>
    </html>
  );
}
