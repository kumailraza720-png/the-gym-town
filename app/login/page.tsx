"use client";

import { useEffect, useState } from "react";

type Member = {
  id: string;
  name: string;
  phone: string;
  pin?: string;
  membership: string;
  expiry: string;
};

export default function Login() {
  const [members, setMembers] = useState<Member[]>([]);
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);

  useEffect(() => {
    const savedMembers =
      localStorage.getItem("gym-town-members");

    if (savedMembers) {
      setMembers(JSON.parse(savedMembers));
    }
  }, []);

  function normalizePhone(value: string) {
    return value.replace(/\D/g, "");
  }

  function continueLogin() {
    setError("");

    const enteredPhone =
      normalizePhone(phone);

    if (!enteredPhone) {
      setError(
        "Please enter your phone number."
      );
      return;
    }

    const member = members.find(
      (item) =>
        normalizePhone(item.phone) ===
        enteredPhone
    );

    if (!member) {
      setError(
        "No member found with this phone number."
      );
      return;
    }

    setStep(2);
  }

  function login() {
    setError("");

    const enteredPhone =
      normalizePhone(phone);

    const member = members.find(
      (item) =>
        normalizePhone(item.phone) ===
        enteredPhone
    );

    if (!member) {
      setError(
        "No member found with this phone number."
      );
      return;
    }

    if (!/^\d{4}$/.test(pin)) {
      setError(
        "Please enter your 4-digit PIN."
      );
      return;
    }

    if ((member.pin || "1234") !== pin) {
      setError(
        "Incorrect PIN."
      );
      return;
    }

    localStorage.setItem(
      "gym-town-current-member",
      member.id
    );

    window.location.href = "/";
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
            TRAIN • GROW • REPEAT
          </p>

        </div>

        {/* Login Card */}
        <div className="mt-12 bg-gray-900 rounded-3xl p-6">

          {step === 1 ? (
            <>
              <p className="text-gray-400 text-sm">
                MEMBER LOGIN
              </p>

              <h2 className="text-2xl font-bold mt-2">
                Welcome back
              </h2>

              <p className="text-gray-500 mt-2">
                Enter the phone number registered
                with the gym.
              </p>

              <div className="mt-6">

                <label className="text-gray-400 text-sm">
                  Phone Number
                </label>

                <input
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setError("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      continueLogin();
                    }
                  }}
                  className="w-full bg-gray-800 rounded-xl p-4 mt-2 text-white outline-none placeholder:text-gray-600"
                />

                {error && (
                  <p className="text-red-400 text-sm mt-3">
                    {error}
                  </p>
                )}

                <button
                  onClick={continueLogin}
                  className="w-full bg-white text-black rounded-2xl p-4 mt-5 font-semibold"
                >
                  Continue
                </button>

              </div>
            </>
          ) : (
            <>
              <p className="text-gray-400 text-sm">
                MEMBER LOGIN
              </p>

              <h2 className="text-2xl font-bold mt-2">
                Enter your PIN
              </h2>

              <p className="text-gray-500 mt-2">
                Enter the 4-digit PIN given to you
                by the gym.
              </p>

              <div className="mt-6">

                <label className="text-gray-400 text-sm">
                  4-Digit PIN
                </label>

                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  placeholder="••••"
                  value={pin}
                  onChange={(e) => {
                    setPin(
                      e.target.value.replace(
                        /\D/g,
                        ""
                      )
                    );
                    setError("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      login();
                    }
                  }}
                  className="w-full bg-gray-800 rounded-xl p-4 mt-2 text-white text-center text-2xl tracking-[0.5em] outline-none placeholder:text-gray-600"
                />

                {error && (
                  <p className="text-red-400 text-sm mt-3">
                    {error}
                  </p>
                )}

                <button
                  onClick={login}
                  className="w-full bg-white text-black rounded-2xl p-4 mt-5 font-semibold"
                >
                  Login
                </button>

                <button
                  onClick={() => {
                    setStep(1);
                    setPin("");
                    setError("");
                  }}
                  className="w-full text-gray-500 p-3 mt-2 text-sm"
                >
                  ← Change phone number
                </button>

              </div>
            </>
          )}

        </div>

        <p className="text-center text-gray-600 text-xs mt-8">
          THE GYM TOWN
        </p>

      </div>
    </main>
  );
}