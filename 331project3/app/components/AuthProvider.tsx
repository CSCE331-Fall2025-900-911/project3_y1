"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";

type Props = {
  children?: React.ReactNode;
};

// for wrapping the app with session provider
export default function AuthProvider({ children }: Props) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}