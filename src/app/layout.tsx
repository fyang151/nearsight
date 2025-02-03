import { Analytics } from "@vercel/analytics/react";
import { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "nearsight.cc",
  description: "guess champions from just their pixels!",
  icons: [
    {
      rel: "icon",
      url: "/eyeIcon.ico",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-Inter">{children}</body>
      <Analytics
        mode={
          process.env.NODE_ENV === "development" ? "development" : "production"
        }
      />
    </html>
  );
}
