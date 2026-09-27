"use client";

import { useEffect, useState } from "react";

type Payment = {
  id: string;
  amount: number;
  date: string;
  membership: string;
};

type Member = {
  id: string;
  name: string;
  phone: string;
  membership: string;
  price: number;
  paymentDate: string;
  expiry: string;
  profilePicture?: string;
  workoutPlan?: string;
  pin?: string;
  paymentHistory?: Payment[];
};

export default function Profile() {
  const [member, setMember] = useState<Member | null>(null);

  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [pinMessage, setPinMessage] = useState("");

  useEffect(() => {
    const currentMemberId = localStorage.getItem(
      "gym-town-current-member"
    );

    const savedMembers = localStorage.getItem(
      "gym-town-members"
    );

    if (!currentMemberId || !savedMembers) {
      return;
    }

    const members: Member[] = JSON.parse(savedMembers);

    const currentMember = members.find(
      (item) => item.id === currentMemberId
    );

    if (currentMember) {
      setMember(currentMember);
    }
  }, []);

  function changePin() {
    setPinError("");
    setPinMessage("");

    if (!member) {
      return;
    }

    if (!member.pin) {
      setPinError(
        "Your account does not have a PIN yet. Please ask the gym admin to set one."
      );
      return;
    }

    if (currentPin !== member.pin) {
      setPinError("Current PIN is incorrect.");
      return;
    }

    if (!/^\d{4}$/.test(newPin)) {
      setPinError("New PIN must be exactly 4 digits.");
      return;
    }

    if (newPin !== confirmPin) {
      setPinError("New PINs do not match.");
      return;
    }

    if (newPin === currentPin) {
      setPinError(
        "Your new PIN must be different from your current PIN."
      );
      return;
    }

    const savedMembers = localStorage.getItem(
      "gym-town-members"
    );

    if (!savedMembers) {
      setPinError("Could not update your PIN.");
      return;
    }

    const members: Member[] = JSON.parse(savedMembers);

    const updatedMembers = members.map((item) => {
      if (item.id === member.id) {
        return {
          ...item,
          pin: newPin,
        };
      }

      return item;
    });

    localStorage.setItem(
      "gym-town-members",
      JSON.stringify(updatedMembers)
    );

    setMember({
      ...member,
      pin: newPin,
    });

    setCurrentPin("");
    setNewPin("");
    setConfirmPin("");

    setPinMessage(
      "Your PIN has been changed successfully."
    );
  }

  function logout() {
    localStorage.removeItem(
      "gym-town-current-member"
    );

    window.location.href = "/login";
  }

  function getExpiryDate(dateString: string) {
    const parts = dateString.split("/");

    if (parts.length === 3) {
      const day = Number(parts[0]);
      const month = Number(parts[1]) - 1;
      const year = Number(parts[2]);

      return new Date(year, month, day);
    }

    return new Date(dateString);
  }

  if (!member) {
    return (
      <main className="min-h-screen bg-gray-950 text-white p-6">
        <div className="max-w-md mx-auto">
          <div className="pt-4">
            <p className="text-gray-400 text-sm">
              THE GYM TOWN
            </p>

            <h1 className="text-3xl font-bold mt-2">
              Profile
            </h1>

            <p className="text-gray-500 mt-2">
              Please log in to view your profile.
            </p>

            <a
              href="/login"
              className="block text-center bg-white text-black rounded-2xl p-4 mt-6 font-semibold"
            >
              Member Login
            </a>
          </div>
        </div>
      </main>
    );
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expiryDate = getExpiryDate(member.expiry);
  expiryDate.setHours(0, 0, 0, 0);

  const daysUntilExpiry = Math.ceil(
    (expiryDate.getTime() - today.getTime()) /
      (1000 * 60 * 60 * 24)
  );

  const isExpiringSoon =
    daysUntilExpiry >= 0 && daysUntilExpiry <= 2;

  const isExpired = daysUntilExpiry < 0;

  const paymentHistory =
    member.paymentHistory &&
    member.paymentHistory.length > 0
      ? member.paymentHistory
      : member.paymentDate
      ? [
          {
            id: "initial-payment",
            amount: member.price,
            date: member.paymentDate,
            membership: member.membership,
          },
        ]
      : [];

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-md mx-auto">

        <div className="pt-4">
          <p className="text-gray-400 text-sm">
            THE GYM TOWN
          </p>

          <h1 className="text-3xl font-bold mt-2">
            Profile
          </h1>

          <p className="text-gray-500 mt-2">
            Your Gym Town profile
          </p>
        </div>

        <div className="mt-8 bg-gray-900 rounded-3xl p-6">
          <div className="flex items-center gap-4">
            {member.profilePicture ? (
              <img
                src={member.profilePicture}
                alt={member.name}
                className="w-20 h-20 rounded-2xl object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-gray-800 flex items-center justify-center shrink-0">
                <span className="text-3xl">
                  👤
                </span>
              </div>
            )}

            <div className="min-w-0">
              <p className="text-gray-400">
                Member
              </p>

              <h2 className="text-2xl font-semibold mt-1 truncate">
                {member.name}
              </h2>

              <p className="text-gray-500 mt-1">
                Gym Member
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 bg-gray-900 rounded-3xl p-6">
          <p className="text-gray-400">
            Membership
          </p>

          <h2 className="text-xl font-semibold mt-1">
            {member.membership}
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Expires: {member.expiry}
          </p>

          {isExpired && (
            <div className="mt-4 bg-red-950/40 border border-red-900 rounded-2xl p-4">
              <p className="text-red-400 font-semibold">
                Membership expired
              </p>

              <p className="text-red-300/70 text-sm mt-1">
                Please renew your membership to continue training.
              </p>
            </div>
          )}

          {isExpiringSoon && (
            <div className="mt-4 bg-yellow-950/40 border border-yellow-900 rounded-2xl p-4">
              <p className="text-yellow-400 font-semibold">
                Membership expires soon
              </p>

              <p className="text-yellow-300/70 text-sm mt-1">
                Your membership expires in{" "}
                {daysUntilExpiry === 0
                  ? "less than a day"
                  : `${daysUntilExpiry} day${
                      daysUntilExpiry === 1 ? "" : "s"
                    }`}
                . Please renew your membership.
              </p>
            </div>
          )}
        </div>

        <div className="mt-4 bg-gray-900 rounded-3xl p-6">
          <p className="text-gray-400 text-sm">
            PAYMENT
          </p>

          <h2 className="text-2xl font-bold mt-2">
            Rs. {member.price.toLocaleString()}
          </h2>

          <p className="text-gray-500 mt-1">
            Last payment: {member.paymentDate}
          </p>
        </div>

        <div className="mt-4 bg-gray-900 rounded-3xl p-6">
          <p className="text-gray-400 text-sm">
            ASSIGNED WORKOUT
          </p>

          <h2 className="text-xl font-bold mt-2">
            {member.workoutPlan ||
              "No workout assigned"}
          </h2>
        </div>

        <div className="mt-4 bg-gray-900 rounded-3xl p-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-sm">
                PAYMENTS
              </p>

              <h2 className="text-xl font-bold mt-1">
                Payment History
              </h2>
            </div>

            <span className="bg-gray-800 rounded-full px-3 py-1 text-xs text-gray-400">
              {paymentHistory.length}
            </span>
          </div>

          <div className="mt-5 space-y-3">
            {paymentHistory.length === 0 ? (
              <p className="text-gray-500">
                No payments recorded.
              </p>
            ) : (
              paymentHistory
                .slice()
                .reverse()
                .map((payment) => (
                  <div
                    key={payment.id}
                    className="bg-gray-800 rounded-2xl p-4"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">
                          {payment.membership}
                        </p>

                        <p className="text-gray-500 text-sm mt-1">
                          {payment.date}
                        </p>
                      </div>

                      <p className="font-semibold">
                        Rs.{" "}
                        {payment.amount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>

        <div className="mt-4 bg-gray-900 rounded-3xl p-6">
          <p className="text-gray-400 text-sm">
            CONTACT
          </p>

          <h2 className="text-xl font-bold mt-2">
            Phone Number
          </h2>

          <p className="text-gray-300 mt-2">
            {member.phone}
          </p>
        </div>

        <div className="mt-4 bg-gray-900 rounded-3xl p-6">
          <p className="text-gray-400 text-sm">
            SECURITY
          </p>

          <h2 className="text-xl font-bold mt-2">
            Change PIN
          </h2>

          <p className="text-gray-500 text-sm mt-2">
            Change the 4-digit PIN you use to log in.
          </p>

          <div className="mt-5 space-y-3">
            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              placeholder="Current PIN"
              value={currentPin}
              onChange={(e) => {
                setCurrentPin(
                  e.target.value.replace(/\D/g, "")
                );
                setPinError("");
                setPinMessage("");
              }}
              className="w-full bg-gray-800 rounded-xl p-4 text-white outline-none"
            />

            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              placeholder="New 4-digit PIN"
              value={newPin}
              onChange={(e) => {
                setNewPin(
                  e.target.value.replace(/\D/g, "")
                );
                setPinError("");
                setPinMessage("");
              }}
              className="w-full bg-gray-800 rounded-xl p-4 text-white outline-none"
            />

            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              placeholder="Confirm new PIN"
              value={confirmPin}
              onChange={(e) => {
                setConfirmPin(
                  e.target.value.replace(/\D/g, "")
                );
                setPinError("");
                setPinMessage("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  changePin();
                }
              }}
              className="w-full bg-gray-800 rounded-xl p-4 text-white outline-none"
            />

            {pinError && (
              <p className="text-red-400 text-sm">
                {pinError}
              </p>
            )}

            {pinMessage && (
              <p className="text-green-400 text-sm">
                {pinMessage}
              </p>
            )}

            <button
              onClick={changePin}
              className="w-full bg-white text-black rounded-2xl p-4 font-semibold"
            >
              Change PIN
            </button>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full mt-4 bg-gray-900 text-red-400 rounded-2xl p-4 font-semibold"
        >
          Log Out
        </button>

        <p className="text-center text-gray-600 text-xs mt-8 pb-4">
          THE GYM TOWN • PROFILE
        </p>

      </div>
    </main>
  );
}