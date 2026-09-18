"use client";

import { useEffect, useState } from "react";

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
  paymentHistory?: {
    id: string;
    amount: number;
    date: string;
    membership: string;
  }[];
};

export default function Profile() {
  const [member, setMember] =
    useState<Member | null>(null);

  useEffect(() => {
    const currentMemberId =
      localStorage.getItem(
        "gym-town-current-member"
      );

    const savedMembers =
      localStorage.getItem("gym-town-members");

    if (!currentMemberId || !savedMembers) {
      return;
    }

    const members: Member[] =
      JSON.parse(savedMembers);

    const currentMember = members.find(
      (item) =>
        item.id === currentMemberId
    );

    if (currentMember) {
      setMember(currentMember);
    }
  }, []);

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

        {/* Header */}
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

        {/* Member */}
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

        {/* Membership */}
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

        </div>

        {/* Payment */}
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

        {/* Workout */}
        <div className="mt-4 bg-gray-900 rounded-3xl p-6">

          <p className="text-gray-400 text-sm">
            ASSIGNED WORKOUT
          </p>

          <h2 className="text-xl font-bold mt-2">
            {member.workoutPlan ||
              "No workout assigned"}
          </h2>

        </div>

        {/* Payment History */}
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

        {/* Contact */}
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

        <p className="text-center text-gray-600 text-xs mt-8 pb-4">
          THE GYM TOWN • PROFILE
        </p>

      </div>
    </main>
  );
}