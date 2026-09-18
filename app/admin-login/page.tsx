"use client";

import { useState } from "react";

export default function AdminLogin() {
  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  function login() {
    if (
      username === "admin" &&
      password === "1234"
    ) {
      localStorage.setItem(
        "gym-town-admin",
        "true"
      );

      window.location.href = "/admin";
      return;
    }

    setError(
      "Incorrect username or password."
    );
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-md mx-auto">

        {/* Logo */}
        <div className="text-center pt-16">

          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white text-black text-3xl font-black">
            GT
          </div>

          <h1 className="text-3xl font-black tracking-widest mt-6">
            THE GYM TOWN
          </h1>

          <p className="text-gray-500 text-sm mt-2">
            ADMIN PORTAL
          </p>

        </div>

        {/* Login Card */}
        <div className="mt-12 bg-gray-900 rounded-3xl p-6">

          <p className="text-gray-400 text-sm">
            ADMIN LOGIN
          </p>

          <h2 className="text-2xl font-bold mt-2">
            Welcome back
          </h2>

          <p className="text-gray-500 mt-2">
            Sign in to manage your gym.
          </p>

          <div className="mt-6 space-y-4">

            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
              className="w-full bg-gray-800 rounded-xl p-4 text-white outline-none"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  login();
                }
              }}
              className="w-full bg-gray-800 rounded-xl p-4 text-white outline-none"
            />

            {error && (
              <p className="text-red-400 text-sm">
                {error}
              </p>
            )}

            <button
              onClick={login}
              className="w-full bg-white text-black rounded-2xl p-4 font-semibold"
            >
              Login
            </button>

          </div>

        </div>

        <p className="text-center text-gray-600 text-xs mt-8">
          THE GYM TOWN • ADMIN
        </p>

      </div>
    </main>
  );
}