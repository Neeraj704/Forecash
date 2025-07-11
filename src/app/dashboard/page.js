'use client'; // ✅ You already have this — good!

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Sidebar from "@/components/Sidebar";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading…</p>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-white p-8 flex gap-16">
      <Sidebar />
      <div>
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <p className="mb-2">
          Welcome, <span className="font-medium">{session.user.name || session.user.email}</span>!
        </p>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}