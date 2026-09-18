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
  workoutPlan?: string;
  customWorkoutId?: string;
  paymentHistory?: {
    id: string;
    amount: number;
    date: string;
    membership: string;
  }[];
};

type AttendanceRecord = {
  id: string;
  memberId: string;
  date: string;
  time: string;
};

export default function Home() {
  const [member, setMember] =
    useState<Member | null>(null);

  const [checkedIn, setCheckedIn] =
    useState(false);

  const [checkInTime, setCheckInTime] =
    useState("");

  useEffect(() => {
    const currentMemberId =
      localStorage.getItem(
        "gym-town-current-member"
      );

    const savedMembers =
      localStorage.getItem(
        "gym-town-members"
      );

    if (
      !currentMemberId ||
      !savedMembers
    ) {
      return;
    }

    const members: Member[] =
      JSON.parse(savedMembers);

    const currentMember =
      members.find(
        (item) =>
          item.id ===
          currentMemberId
      );

    if (currentMember) {
      setMember(currentMember);

      const savedAttendance =
        localStorage.getItem(
          "gym-town-attendance"
        );

      if (savedAttendance) {
        const attendance: AttendanceRecord[] =
          JSON.parse(
            savedAttendance
          );

        const now = new Date();

        const today =
          now.getFullYear() +
          "-" +
          String(
            now.getMonth() + 1
          ).padStart(2, "0") +
          "-" +
          String(
            now.getDate()
          ).padStart(2, "0");

        const todayRecord =
          attendance.find(
            (record) =>
              record.memberId ===
                currentMember.id &&
              record.date === today
          );

        if (todayRecord) {
          setCheckedIn(true);
          setCheckInTime(
            todayRecord.time
          );
        }
      }
    }
  }, []);

  function getToday() {
    const now = new Date();

    return (
      now.getFullYear() +
      "-" +
      String(
        now.getMonth() + 1
      ).padStart(2, "0") +
      "-" +
      String(
        now.getDate()
      ).padStart(2, "0")
    );
  }

  function getCurrentTime() {
    return new Date().toLocaleTimeString(
      [],
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  }

  function checkIn() {
    if (!member || checkedIn) {
      return;
    }

    const savedAttendance =
      localStorage.getItem(
        "gym-town-attendance"
      );

    const attendance: AttendanceRecord[] =
      savedAttendance
        ? JSON.parse(
            savedAttendance
          )
        : [];

    const time =
      getCurrentTime();

    const newRecord: AttendanceRecord =
      {
        id: `attendance-${Date.now()}`,
        memberId: member.id,
        date: getToday(),
        time,
      };

    const updatedAttendance = [
      ...attendance,
      newRecord,
    ];

    localStorage.setItem(
      "gym-town-attendance",
      JSON.stringify(
        updatedAttendance
      )
    );

    setCheckedIn(true);
    setCheckInTime(time);
  }

  if (!member) {
    return (
      <main className="min-h-screen bg-gray-950 text-white p-6">
        <div className="max-w-md mx-auto">
          <div className="text-center pt-20">

            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white text-black text-2xl font-black">
              GT
            </div>

            <h1 className="text-2xl font-black tracking-widest mt-4">
              THE GYM TOWN
            </h1>

            <p className="text-gray-500 text-sm mt-1">
              TRAIN • GROW • REPEAT
            </p>

            <p className="text-gray-400 mt-10">
              Please log in to continue.
            </p>

            <a
              href="/login"
              className="block bg-white text-black rounded-2xl p-4 mt-5 font-semibold"
            >
              Member Login
            </a>

          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-md mx-auto">

        {/* Header */}
        <div className="text-center pt-4">

          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white text-black text-2xl font-black">
            GT
          </div>

          <h1 className="text-2xl font-black tracking-widest mt-4">
            THE GYM TOWN
          </h1>

          <p className="text-gray-500 text-sm mt-1">
            TRAIN • GROW • REPEAT
          </p>

        </div>

        {/* Welcome */}
        <div className="mt-10">

          <p className="text-gray-400">
            Welcome back 👋
          </p>

          <h2 className="text-4xl font-bold mt-1">
            {member.name}
          </h2>

          <p className="text-gray-500 mt-2">
            Ready for today's session?
          </p>

        </div>

        {/* Check In */}
        <div className="mt-8 bg-gray-900 rounded-3xl p-6">

          <div className="flex justify-between items-start">

            <div>

              <p className="text-gray-400 text-sm">
                TODAY'S ATTENDANCE
              </p>

              <h2 className="text-2xl font-bold mt-2">
                {checkedIn
                  ? "You're checked in"
                  : "Not checked in"}
              </h2>

              {checkedIn && (
                <p className="text-gray-500 mt-2">
                  Checked in at{" "}
                  {checkInTime}
                </p>
              )}

            </div>

            <div className="text-4xl">
              {checkedIn
                ? "✅"
                : "📍"}
            </div>

          </div>

          {!checkedIn ? (
            <button
              onClick={checkIn}
              className="w-full bg-white text-black rounded-2xl p-4 mt-6 font-semibold"
            >
              ✓ Check In
            </button>
          ) : (
            <div className="w-full bg-green-500/10 text-green-400 rounded-2xl p-4 mt-6 text-center font-semibold">
              Attendance recorded ✓
            </div>
          )}

        </div>

        {/* Membership */}
        <div className="mt-4 bg-gray-900 rounded-3xl p-6">

          <div className="flex justify-between items-start">

            <div>

              <p className="text-gray-400 text-sm">
                MEMBERSHIP
              </p>

              <h2 className="text-2xl font-bold mt-2">
                {member.membership}
              </h2>

            </div>

            <div className="bg-green-500/10 text-green-400 rounded-full px-3 py-1 text-sm font-semibold">
              Active
            </div>

          </div>

          <div className="mt-5 h-px bg-gray-800" />

          <p className="text-gray-500 text-sm mt-4">
            Membership expires
          </p>

          <p className="font-semibold mt-1">
            {member.expiry}
          </p>

        </div>

        {/* Workout */}
        <div className="mt-4 bg-gray-900 rounded-3xl p-6">

          <div className="flex justify-between items-start">

            <div>

              <p className="text-gray-400 text-sm">
                TODAY'S WORKOUT
              </p>

              <h2 className="text-2xl font-bold mt-2">
                {member.workoutPlan ||
                  "No workout assigned"}
              </h2>

              <p className="text-gray-500 mt-2">
                Your assigned workout
              </p>

            </div>

            <div className="text-4xl">
              💪
            </div>

          </div>

          <a
            href="/workout"
            className="block text-center bg-white text-black rounded-2xl p-4 mt-6 font-semibold"
          >
            Start Workout
          </a>

        </div>

        {/* Payment */}
        <div className="mt-4 bg-gray-900 rounded-3xl p-6">

          <p className="text-gray-400 text-sm">
            LAST PAYMENT
          </p>

          <h2 className="text-2xl font-bold mt-2">
            Rs.{" "}
            {member.price.toLocaleString()}
          </h2>

          <p className="text-gray-500 mt-1">
            Paid on{" "}
            {member.paymentDate}
          </p>

          <a
            href={`/member/${member.id}`}
            className="block text-center bg-gray-800 rounded-2xl p-4 mt-5 font-semibold"
          >
            View Payment History →
          </a>

        </div>

        {/* Profile */}
        <a
          href={`/member/${member.id}`}
          className="block text-center bg-gray-900 text-white rounded-2xl p-4 mt-4 font-semibold"
        >
          View My Profile →
        </a>

        <p className="text-center text-gray-600 text-xs mt-8 pb-4">
          THE GYM TOWN
        </p>

      </div>
    </main>
  );
}