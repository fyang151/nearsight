import { Analytics } from "@vercel/analytics/react";
import { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "nearsight.cc",
  description: "Guess League of Legends champions from just their pixels!",
  icons: [{ rel: "icon", url: "/eyeIcon.ico" }],
  openGraph: {
    title: "NearSight.cc - Pixel League Guessing Game",
    description: "Guess League of Legends champions from just their pixels!",
    images: "/introImage.png",
    url: "https://nearsight.cc",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NearSight.cc - Pixel League Guessing Game",
    description: "Guess League of Legends champions from just their pixels!",
    images: "/introImage.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-Inter">
        <Analytics
          mode={
            process.env.NODE_ENV === "development"
              ? "development"
              : "production"
          }
        />
        {children}
      </body>
    </html>
  );
}
