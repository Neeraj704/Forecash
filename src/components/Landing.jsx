"use client";

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-4xl font-bold mb-8">Welcome to Forecash</h1>
      <div className="space-x-4">
        <button
          onClick={() => window.location.href = "/login"}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition cursor-pointer"
        >
          Sign In
        </button>
        <button
          onClick={() => window.location.href = "/signup"}
          className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition cursor-pointer"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}