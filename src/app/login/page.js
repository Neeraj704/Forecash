"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaSpinner, FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingOAuth, setLoadingOAuth] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError("Login failed: " + res.error);
        setLoading(false);
      } else {
        router.push("/");
      }
    } catch (err) {
      console.error("SignIn error:", err);
      setError("Something went wrong.");
      setLoading(false);
    }
  };

  const handleOAuth = async (provider) => {
    setLoadingOAuth(provider);
    await signIn(provider, { callbackUrl: "/" });
    setLoadingOAuth("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg transform hover:scale-[1.01] transition">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Sign In
        </h2>

        {error && (
          <p className="mb-4 text-red-600 text-sm text-center">{error}</p>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block">
            <span className="text-gray-700">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </label>

          <label className="block">
            <span className="text-gray-700">Password</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition cursor-pointer ${
              loading ? "opacity-70" : ""
            }`}
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin mr-2" /> Signing In…
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* OR Separator */}
        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-300" />
          <span className="px-2 text-gray-500">OR</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* OAuth Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => handleOAuth("google")}
            disabled={!!loadingOAuth}
            className={`w-full flex items-center justify-center py-3 border rounded-xl hover:shadow-md transition cursor-pointer bg-white ${
              loadingOAuth === "google" ? "opacity-70" : ""
            }`}
          >
            {loadingOAuth === "google" ? (
              <FaSpinner className="animate-spin mr-2 text-gray-700" />
            ) : (
              <FcGoogle className="mr-2 text-2xl" />
            )}
            <span className="font-medium text-gray-700">
              {loadingOAuth === "google"
                ? "Redirecting…"
                : "Continue with Google"}
            </span>
          </button>

          <button
            onClick={() => handleOAuth("github")}
            disabled={!!loadingOAuth}
            className={`w-full flex items-center justify-center py-3 border rounded-xl hover:shadow-md transition cursor-pointer ${
              loadingOAuth === "github"
                ? "opacity-70"
                : "bg-gray-900 hover:bg-gray-800"
            }`}
          >
            {loadingOAuth === "github" ? (
              <FaSpinner className="animate-spin mr-2 text-white" />
            ) : (
              <FaGithub className="mr-2 text-xl text-white" />
            )}
            <span className="font-medium text-white">
              {loadingOAuth === "github"
                ? "Redirecting…"
                : "Continue with GitHub"}
            </span>
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link
            href="/signup"
            className="text-blue-600 hover:underline font-medium cursor-pointer"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
