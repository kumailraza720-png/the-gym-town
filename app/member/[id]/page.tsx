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
  paymentHistory?: Payment[];
};

type AttendanceRecord = {
  id: string;
  memberId: string;
  date: string;
  time: string;
};

export default function MemberProfile() {
  const [member, setMember] =
    useState<Member | null>(null);

  const [attendance, setAttendance] =
    useState<AttendanceRecord[]>([]);

  const [image, setImage] =
    useState("");

  useEffect(() => {
    const savedMembers =
      localStorage.getItem(
        "gym-town-members"
      );

    const savedAttendance =
      localStorage.getItem(
        "gym-town-attendance"
      );

    if (savedMembers) {
      const members: Member[] =
        JSON.parse(savedMembers);

      const memberId =
        window.location.pathname.split(
          "/"
        )[2];

      const currentMember =
        members.find(
          (item) =>
            item.id === memberId
        );

      if (currentMember) {
        setMember(currentMember);

        if (
          currentMember.profilePicture
        ) {
          setImage(
            currentMember.profilePicture
          );
        }
      }
    }

    if (savedAttendance) {
      setAttendance(
        JSON.parse(savedAttendance)
      );
    }
  }, []);

  function uploadPhoto(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0];

    if (!file || !member) {
      return;
    }

    const reader =
      new FileReader();

    reader.onload = () => {
      const result =
        reader.result as string;

      setImage(result);

      const savedMembers =
        localStorage.getItem(
          "gym-town-members"
        );

      if (!savedMembers) {
        return;
      }

      const members: Member[] =
        JSON.parse(savedMembers);

      const updatedMembers =
        members.map((item) =>
          item.id === member.id
            ? {
                ...item,
                profilePicture:
                  result,
              }
            : item
        );

      localStorage.setItem(
        "gym-town-members",
        JSON.stringify(
          updatedMembers
        )
      );

      setMember({
        ...member,
        profilePicture: result,
      });
    };

    reader.readAsDataURL(file);
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
              Member Profile
            </h1>

            <p className="text-gray-500 mt-2">
              Member not found.
            </p>

            <a
              href="/members"
              className="block text-center bg-white text-black rounded-2xl p-4 mt-6 font-semibold"
            >
              Back to Members
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
            membership:
              member.membership,
          },
        ]
      : [];

  const memberAttendance =
    attendance
      .filter(
        (record) =>
          record.memberId ===
          member.id
      )
      .slice()
      .reverse();

  const status = (() => {
    const expiryDate =
      new Date(member.expiry);

    const today =
      new Date();

    today.setHours(
      0,
      0,
      0,
      0
    );

    expiryDate.setHours(
      0,
      0,
      0,
      0
    );

    const difference =
      Math.ceil(
        (expiryDate.getTime() -
          today.getTime()) /
          (1000 *
            60 *
            60 *
            24)
      );

    if (difference < 0) {
      return {
        text: "Expired",
        className:
          "bg-red-500/10 text-red-400",
      };
    }

    if (difference <= 7) {
      return {
        text: "Expiring Soon",
        className:
          "bg-yellow-500/10 text-yellow-400",
      };
    }

    return {
      text: "Active",
      className:
        "bg-green-500/10 text-green-400",
    };
  })();

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-md mx-auto">

        {/* Header */}
        <div className="pt-4">

          <p className="text-gray-400 text-sm">
            THE GYM TOWN
          </p>

          <h1 className="text-3xl font-bold mt-2">
            Member Profile
          </h1>

          <p className="text-gray-500 mt-2">
            Complete member information
          </p>

        </div>

        {/* Profile Card */}
        <div className="mt-8 bg-gray-900 rounded-3xl p-6">

          <div className="flex items-center gap-4">

            <div className="relative">

              {image ? (
                <img
                  src={image}
                  alt={member.name}
                  className="w-20 h-20 rounded-2xl object-cover"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-gray-800 flex items-center justify-center">
                  <span className="text-3xl">
                    👤
                  </span>
                </div>
              )}

            </div>

            <div className="min-w-0 flex-1">

              <p className="text-gray-400">
                Member
              </p>

              <h2 className="text-2xl font-semibold mt-1 truncate">
                {member.name}
              </h2>

              <span
                className={`inline-block rounded-full px-3 py-1 mt-2 text-xs font-semibold ${status.className}`}
              >
                {status.text}
              </span>

            </div>

          </div>

          <label className="block text-center bg-gray-800 rounded-xl p-3 mt-5 text-sm font-semibold cursor-pointer">
            📷 Change Profile Picture

            <input
              type="file"
              accept="image/*"
              onChange={uploadPhoto}
              className="hidden"
            />
          </label>

        </div>

        {/* Membership */}
        <div className="mt-4 bg-gray-900 rounded-3xl p-6">

          <p className="text-gray-400 text-sm">
            MEMBERSHIP
          </p>

          <h2 className="text-2xl font-bold mt-2">
            {member.membership}
          </h2>

          <p className="text-gray-500 mt-2">
            Expires: {member.expiry}
          </p>

          <div className="mt-5 h-px bg-gray-800" />

          <p className="text-gray-500 text-sm mt-4">
            Current Price
          </p>

          <p className="text-xl font-bold mt-1">
            Rs.{" "}
            {member.price.toLocaleString()}
          </p>

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

            {paymentHistory.length ===
            0 ? (
              <p className="text-gray-500">
                No payments recorded.
              </p>
            ) : (
              paymentHistory
                .slice()
                .reverse()
                .map(
                  (payment) => (
                    <div
                      key={
                        payment.id
                      }
                      className="bg-gray-800 rounded-2xl p-4"
                    >

                      <div className="flex justify-between items-start">

                        <div>

                          <p className="font-semibold">
                            {
                              payment.membership
                            }
                          </p>

                          <p className="text-gray-500 text-sm mt-1">
                            {
                              payment.date
                            }
                          </p>

                        </div>

                        <p className="font-semibold">
                          Rs.{" "}
                          {payment.amount.toLocaleString()}
                        </p>

                      </div>

                    </div>
                  )
                )
            )}

          </div>

        </div>

        {/* Attendance */}
        <div className="mt-4 bg-gray-900 rounded-3xl p-6">

          <div className="flex justify-between items-center">

            <div>

              <p className="text-gray-400 text-sm">
                ATTENDANCE
              </p>

              <h2 className="text-xl font-bold mt-1">
                Check-In History
              </h2>

            </div>

            <span className="bg-gray-800 rounded-full px-3 py-1 text-xs text-gray-400">
              {memberAttendance.length}
            </span>

          </div>

          <div className="mt-5 space-y-3">

            {memberAttendance.length ===
            0 ? (
              <div className="text-center py-4">

                <div className="text-3xl">
                  📅
                </div>

                <p className="text-gray-500 mt-2">
                  No attendance recorded yet.
                </p>

              </div>
            ) : (
              memberAttendance.map(
                (record) => (
                  <div
                    key={record.id}
                    className="bg-gray-800 rounded-2xl p-4"
                  >

                    <div className="flex justify-between items-center">

                      <div>

                        <p className="font-semibold">
                          {record.date}
                        </p>

                        <p className="text-gray-500 text-sm mt-1">
                          Gym check-in
                        </p>

                      </div>

                      <div className="text-right">

                        <p className="text-green-400 text-sm font-semibold">
                          ✓ Present
                        </p>

                        <p className="text-gray-500 text-xs mt-1">
                          {record.time}
                        </p>

                      </div>

                    </div>

                  </div>
                )
              )
            )}

          </div>

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

          <a
            href="/workout"
            className="block text-center bg-gray-800 rounded-2xl p-4 mt-5 font-semibold"
          >
            View Workout →
          </a>

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

        <a
          href="/members"
          className="block text-center bg-white text-black rounded-2xl p-4 mt-5 font-semibold"
        >
          ← Back to Members
        </a>

        <p className="text-center text-gray-600 text-xs mt-8 pb-4">
          THE GYM TOWN • MEMBER PROFILE
        </p>

      </div>
    </main>
  );
}