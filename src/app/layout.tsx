import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "REvuBOT - AI Thailand Tour Guide | Navigate Thailand With AI",
  description: "Your AI-powered travel companion for Thailand. Get instant answers on destinations, hotels, street food, visa rules, safety alerts, and budget planning — all in real-time.",
  keywords: ["Thailand", "Travel Guide", "AI Chatbot", "Bangkok", "Phuket", "Chiang Mai", "Thai Tourism", "Beach Guide", "Hotel Booking"],
  authors: [{ name: "REvuBOT AI" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "REvuBOT - AI Thailand Tour Guide",
    description: "Navigate Thailand with AI. Expert travel intelligence for destinations, hotels, beaches, food, and safety.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
