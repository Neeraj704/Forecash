'use client'; // ✅ This layout handles interactivity like signOut()

import { SessionProvider } from "next-auth/react";

export default function DashboardLayout({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}