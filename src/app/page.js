"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-4xl font-bold mb-8">Welcome to MyApp</h1>
      <div className="space-x-4">
        <button
          onClick={() => router.push("/login")}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
        >
          Sign In
        </button>
        <button
          onClick={() => router.push("/signup")}
          className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}