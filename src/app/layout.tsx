import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tempowala: Shared Truck Pooling for Artisans & Small Makers",
  description:
    "A working prototype demonstrating multi-maker shared truck pooling along the Moradabad-Delhi corridor, cutting logistics freight costs and diesel CO₂ emissions by 50%. Integrated with Bhashini vernacular AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-50 text-slate-900 min-h-screen">
        {children}
      </body>
    </html>
  );
}
