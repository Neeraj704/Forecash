"use client";

import { useState } from "react";
import axios from "axios";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaSpinner, FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export default function SignUpPage() {
  const [name, setName] = useState("");
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
      await axios.post("/api/signup", { name, email, password });
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      if (res.error) {
        setError(res.error);
        setLoading(false);
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong.");
      setLoading(false);
    }
  };

  const handleOAuth = async (provider) => {
    setLoadingOAuth(provider);
    await signIn(provider, { callbackUrl: "/dashboard" });
    setLoadingOAuth("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-teal-50 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg transform hover:scale-[1.01] transition">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Create Account
        </h2>

        {error && (
          <p className="mb-4 text-red-600 text-sm text-center">{error}</p>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block">
            <span className="text-gray-700">Username</span>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            />
          </label>

          <label className="block">
            <span className="text-gray-700">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            />
          </label>

          <label className="block">
            <span className="text-gray-700">Password</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition cursor-pointer ${
              loading ? "opacity-70" : ""
            }`}
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin mr-2" /> Signing Up…
              </>
            ) : (
              "Sign Up"
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
                : "Sign up with Google"}
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
                : "Sign up with GitHub"}
            </span>
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-green-600 hover:underline font-medium cursor-pointer"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
