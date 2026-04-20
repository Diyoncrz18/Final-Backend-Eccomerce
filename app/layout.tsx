import type { Metadata } from "next";
import "./globals.css";
import ChatbotWrapper from "./components/ChatbotWrapper";

export const metadata: Metadata = {
  title: "Maison — Premium Interior Design",
  description:
    "Temukan koleksi furnitur dan dekorasi interior premium untuk menciptakan rumah impian Anda. Desain eksklusif, kualitas terbaik.",
  keywords: "interior, furnitur premium, dekorasi rumah, desain interior, home decor",
  openGraph: {
    title: "Maison — Premium Interior Design",
    description: "Koleksi furnitur dan dekorasi interior premium.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col antialiased">
        {children}
        <ChatbotWrapper />
      </body>
    </html>
  );
}

