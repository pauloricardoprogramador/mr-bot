import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const Sans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "MrBot",
  description: "Seu agente pessoal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${Sans.variable} antialiased`}>
        <div className="min-h-screen bg-slate-50  font-dm_sans ">
          {children}
        </div>
      </body>
    </html>
  );
}
