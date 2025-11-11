import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Boba Tea POS",
  description: "Boba shop ordering and inventory system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
