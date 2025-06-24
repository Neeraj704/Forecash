import React, { useState } from "react";
import { login } from "../api/auth";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const [email, setEmail] = useState(""),
    [pw, setPw] = useState("");
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  const handle = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password: pw });
      setAuth({ user: res.data.user, token: res.data.accessToken });
      sessionStorage.setItem("accessToken", res.data.accessToken);
      navigate("/dashboard", { replace: true });
    } catch {
      alert("Login failed");
    }
  };
  return (
    <form onSubmit={handle} className="space-y-4">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border p-2"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={pw}
        onChange={(e) => setPw(e.target.value)}
        className="w-full border p-2"
        required
      />
      <button type="submit" className="w-full bg-blue-500 text-white p-2">
        Login
      </button>
    </form>
  );
}
