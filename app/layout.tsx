"use client";

import "./globals.css";
import { useEffect, useState } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    const admin = localStorage.getItem("gym-town-admin");
    const member = localStorage.getItem("gym-town-current-member");

    setIsAdmin(admin === "true");
    setIsMember(!!member);
  }, []);

  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#030712" />
        <meta
          name="mobile-web-app-capable"
          content="yes"
        />
        <meta
          name="apple-mobile-web-app-capable"
          content="yes"
        />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta
          name="apple-mobile-web-app-title"
          content="The Gym Town"
        />
        <link rel="manifest" href="/manifest.json" />
      </head>

      <body className="bg-gray-950 text-white pb-24">
        {children}

        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-gray-950/95 backdrop-blur border-t border-gray-800">
          <div className="max-w-md mx-auto px-3 py-3">
            {isAdmin ? (
              <div className="grid grid-cols-4 gap-1">
                <a
                  href="/admin"
                  className="flex flex-col items-center justify-center gap-1 rounded-xl py-2 text-gray-400 hover:text-white"
                >
                  <span className="text-xl">📊</span>
                  <span className="text-[10px] font-semibold">
                    Dashboard
                  </span>
                </a>

                <a
                  href="/members"
                  className="flex flex-col items-center justify-center gap-1 rounded-xl py-2 text-gray-400 hover:text-white"
                >
                  <span className="text-xl">👥</span>
                  <span className="text-[10px] font-semibold">
                    Members
                  </span>
                </a>

                <a
                  href="/attendance"
                  className="flex flex-col items-center justify-center gap-1 rounded-xl py-2 text-gray-400 hover:text-white"
                >
                  <span className="text-xl">📅</span>
                  <span className="text-[10px] font-semibold">
                    Attendance
                  </span>
                </a>

                <button
                  onClick={() => {
                    localStorage.removeItem("gym-town-admin");
                    window.location.href = "/admin-login";
                  }}
                  className="flex flex-col items-center justify-center gap-1 rounded-xl py-2 text-red-400 hover:text-red-300"
                >
                  <span className="text-xl">🚪</span>
                  <span className="text-[10px] font-semibold">
                    Logout
                  </span>
                </button>
              </div>
            ) : isMember ? (
              <div className="grid grid-cols-4 gap-1">
                <a
                  href="/"
                  className="flex flex-col items-center justify-center gap-1 rounded-xl py-2 text-gray-400 hover:text-white"
                >
                  <span className="text-xl">🏠</span>
                  <span className="text-[10px] font-semibold">
                    Home
                  </span>
                </a>

                <a
                  href="/workout"
                  className="flex flex-col items-center justify-center gap-1 rounded-xl py-2 text-gray-400 hover:text-white"
                >
                  <span className="text-xl">🏋️</span>
                  <span className="text-[10px] font-semibold">
                    Workout
                  </span>
                </a>

                <a
                  href="/profile"
                  className="flex flex-col items-center justify-center gap-1 rounded-xl py-2 text-gray-400 hover:text-white"
                >
                  <span className="text-xl">👤</span>
                  <span className="text-[10px] font-semibold">
                    Profile
                  </span>
                </a>

                <button
                  onClick={() => {
                    localStorage.removeItem(
                      "gym-town-current-member"
                    );
                    window.location.href = "/login";
                  }}
                  className="flex flex-col items-center justify-center gap-1 rounded-xl py-2 text-red-400 hover:text-red-300"
                >
                  <span className="text-xl">🚪</span>
                  <span className="text-[10px] font-semibold">
                    Logout
                  </span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <a
                  href="/login"
                  className="flex items-center justify-center rounded-xl py-3 bg-white text-black font-semibold"
                >
                  Member Login
                </a>

                <a
                  href="/admin-login"
                  className="flex items-center justify-center rounded-xl py-3 bg-gray-800 text-white font-semibold"
                >
                  Admin Login
                </a>
              </div>
            )}
          </div>
        </nav>
      </body>
    </html>
  );
}