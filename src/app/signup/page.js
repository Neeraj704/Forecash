"use client";
import { useState } from "react";
import axios from "axios";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await axios.post("/api/signup", { name, email, password });
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      if (result.error) throw new Error(result.error);
      router.push("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow">
        <h2 className="text-2xl font-semibold mb-6 text-center">Create Account</h2>
        {error && <p className="mb-4 text-red-600 text-sm text-center">{error}</p>}

        <form onSubmit={handleSubmit}>
          <label className="block mb-4">
            <span className="text-gray-700">Username</span>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </label>

          <label className="block mb-4">
            <span className="text-gray-700">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </label>

          <label className="block mb-6">
            <span className="text-gray-700">Password</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </label>

          <button
            type="submit"
            className="w-full py-3 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition mb-4"
          >
            Sign Up
          </button>
        </form>

        <div className="flex flex-col space-y-3 mb-4">
          <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="flex items-center justify-center py-3 border rounded-xl hover:bg-gray-50 transition"
          >
            <img src="/icons/google.svg" alt="Google" className="w-5 h-5 mr-2" />
            Continue with Google
          </button>
          <button
            onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
            className="flex items-center justify-center py-3 border rounded-xl hover:bg-gray-50 transition"
          >
            <img src="/icons/github.svg" alt="GitHub" className="w-5 h-5 mr-2" />
            Continue with GitHub
          </button>
        </div>

        <p className="text-center text-sm">
          Already have an account?{" "}
          <button
            onClick={() => router.push("/login")}
            className="text-blue-600 hover:underline"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
}