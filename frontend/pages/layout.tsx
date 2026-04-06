import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import ChatBot from "@/components/ChatBot";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PropAI | AI-Powered Property Platform",
  description: "Find your dream home with the help of artificial intelligence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 text-slate-900`}>
        <Navbar />
        <main className="min-h-[calc(100vh-64px)]">{children}</main>
        <ChatBot />
      </body>
    </html>
  );
}
