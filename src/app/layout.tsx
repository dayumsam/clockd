import type { Metadata } from "next";
import { racingSansOne, lexend, oswald } from '@/lib/fonts';  // adjust path as needed
import "./globals.css";


export const metadata: Metadata = {
  title: "Clockd",
  description: "Counting up the hours",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${lexend.variable} ${oswald.variable} ${racingSansOne.variable} antialiased `}
      >
        {children}
      </body>
    </html>
  );
}
