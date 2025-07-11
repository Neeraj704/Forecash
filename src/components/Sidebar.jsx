"use client";
import Link from "next/link";

export default function Sidebar() {

  return (
    <>
      <div className="space-y-2 flex flex-col min-h-screen">
        <Link
            href="/transactions"
            className="text-blue-600 hover:underline font-medium cursor-pointer"
          >
            Transactions
        </Link>
        <Link
            href="/goals"
            className="text-blue-600 hover:underline font-medium cursor-pointer"
          >
            Goals
        </Link>
        <Link
            href="/chatbot"
            className="text-blue-600 hover:underline font-medium cursor-pointer"
          >
            Chatbot
        </Link>
        <Link
            href="/receipt"
            className="text-blue-600 hover:underline font-medium cursor-pointer"
          >
            Receipt
        </Link>
        <Link
            href="/report"
            className="text-blue-600 hover:underline font-medium cursor-pointer"
          >
            Report
        </Link>
      </div>
    </>
  );
}