import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "./components/AuthProvider";

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
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
