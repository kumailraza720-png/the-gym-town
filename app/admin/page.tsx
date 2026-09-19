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
  customWorkoutId?: string;
  pin?: string;
  paymentHistory?: Payment[];
};

type AttendanceRecord = {
  id: string;
  memberId: string;
  date: string;
  time: string;
};

type CustomWorkout = {
  id: string;
  name: string;
  exercises: {
    name: string;
    sets: number;
    reps: number;
  }[];
};

export default function Admin() {
  const [members, setMembers] = useState<Member[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [demoLoaded, setDemoLoaded] = useState(false);

  useEffect(() => {
    const admin = localStorage.getItem("gym-town-admin");

    if (admin !== "true") {
      window.location.href = "/admin-login";
      return;
    }

    setIsAdmin(true);

    const savedMembers = localStorage.getItem("gym-town-members");
    const savedAttendance = localStorage.getItem("gym-town-attendance");

    if (savedMembers) {
      setMembers(JSON.parse(savedMembers));
    }

    if (savedAttendance) {
      setAttendance(JSON.parse(savedAttendance));
    }
  }, []);

  function getToday() {
    const now = new Date();

    return (
      now.getFullYear() +
      "-" +
      String(now.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(now.getDate()).padStart(2, "0")
    );
  }

  function getDateOffset(days: number) {
    const date = new Date();
    date.setDate(date.getDate() + days);

    return (
      date.getFullYear() +
      "-" +
      String(date.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(date.getDate()).padStart(2, "0")
    );
  }

  function getTimeOffset(hours: number) {
    const date = new Date();
    date.setHours(date.getHours() - hours);

    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function getStatus(expiry: string) {
    const expiryDate = new Date(expiry);
    const today = new Date();

    today.setHours(0, 0, 0, 0);
    expiryDate.setHours(0, 0, 0, 0);

    const days = Math.ceil(
      (expiryDate.getTime() - today.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    if (days < 0) {
      return "Expired";
    }

    if (days <= 7) {
      return "Expiring Soon";
    }

    return "Active";
  }

  function getDaysRemaining(expiry: string) {
    const expiryDate = new Date(expiry);
    const today = new Date();

    today.setHours(0, 0, 0, 0);
    expiryDate.setHours(0, 0, 0, 0);

    return Math.ceil(
      (expiryDate.getTime() - today.getTime()) /
        (1000 * 60 * 60 * 24)
    );
  }

  function loadDemoData() {
    const today = getToday();

    const demoMembers: Member[] = [
      {
        id: "demo-001",
        name: "Ahmed Khan",
        phone: "03001234567",
        membership: "Monthly",
        price: 3000,
        paymentDate: today,
        expiry: getDateOffset(26),
        workoutPlan: "Chest & Triceps",
        pin: "1234",
        paymentHistory: [
          {
            id: "payment-demo-001",
            amount: 3000,
            date: today,
            membership: "Monthly",
          },
          {
            id: "payment-demo-002",
            amount: 3000,
            date: getDateOffset(-31),
            membership: "Monthly",
          },
        ],
      },
      {
        id: "demo-002",
        name: "Hamza Ali",
        phone: "03012345678",
        membership: "Monthly",
        price: 3000,
        paymentDate: getDateOffset(-5),
        expiry: getDateOffset(25),
        workoutPlan: "Back & Biceps",
        pin: "1234",
        paymentHistory: [
          {
            id: "payment-demo-003",
            amount: 3000,
            date: getDateOffset(-5),
            membership: "Monthly",
          },
        ],
      },
      {
        id: "demo-003",
        name: "Usman Raza",
        phone: "03123456789",
        membership: "Monthly",
        price: 3000,
        paymentDate: getDateOffset(-24),
        expiry: getDateOffset(6),
        workoutPlan: "Shoulders",
        pin: "1234",
        paymentHistory: [
          {
            id: "payment-demo-004",
            amount: 3000,
            date: getDateOffset(-24),
            membership: "Monthly",
          },
        ],
      },
      {
        id: "demo-004",
        name: "Bilal Ahmed",
        phone: "03211234567",
        membership: "Monthly",
        price: 3000,
        paymentDate: getDateOffset(-40),
        expiry: getDateOffset(-10),
        workoutPlan: "Legs",
        pin: "1234",
        paymentHistory: [
          {
            id: "payment-demo-005",
            amount: 3000,
            date: getDateOffset(-40),
            membership: "Monthly",
          },
        ],
      },
      {
        id: "demo-005",
        name: "Saad Hussain",
        phone: "03331234567",
        membership: "Monthly",
        price: 3000,
        paymentDate: getDateOffset(-12),
        expiry: getDateOffset(18),
        workoutPlan: "Full Body",
        pin: "1234",
        paymentHistory: [
          {
            id: "payment-demo-006",
            amount: 3000,
            date: getDateOffset(-12),
            membership: "Monthly",
          },
        ],
      },
      {
        id: "demo-006",
        name: "Zain Malik",
        phone: "03451234567",
        membership: "Monthly",
        price: 3000,
        paymentDate: getDateOffset(-3),
        expiry: getDateOffset(27),
        workoutPlan: "Chest & Triceps",
        pin: "1234",
        paymentHistory: [
          {
            id: "payment-demo-007",
            amount: 3000,
            date: getDateOffset(-3),
            membership: "Monthly",
          },
        ],
      },
    ];

    const demoAttendance: AttendanceRecord[] = [
      {
        id: "attendance-demo-001",
        memberId: "demo-001",
        date: today,
        time: getTimeOffset(2),
      },
      {
        id: "attendance-demo-002",
        memberId: "demo-002",
        date: today,
        time: getTimeOffset(3),
      },
      {
        id: "attendance-demo-003",
        memberId: "demo-003",
        date: today,
        time: getTimeOffset(5),
      },
      {
        id: "attendance-demo-004",
        memberId: "demo-005",
        date: getDateOffset(-1),
        time: "06:15 PM",
      },
      {
        id: "attendance-demo-005",
        memberId: "demo-001",
        date: getDateOffset(-1),
        time: "07:10 PM",
      },
      {
        id: "attendance-demo-006",
        memberId: "demo-002",
        date: getDateOffset(-2),
        time: "06:45 PM",
      },
      {
        id: "attendance-demo-007",
        memberId: "demo-003",
        date: getDateOffset(-2),
        time: "07:20 PM",
      },
      {
        id: "attendance-demo-008",
        memberId: "demo-005",
        date: getDateOffset(-3),
        time: "05:55 PM",
      },
      {
        id: "attendance-demo-009",
        memberId: "demo-001",
        date: getDateOffset(-4),
        time: "06:30 PM",
      },
      {
        id: "attendance-demo-010",
        memberId: "demo-002",
        date: getDateOffset(-5),
        time: "07:05 PM",
      },
      {
        id: "attendance-demo-011",
        memberId: "demo-001",
        date: getDateOffset(-6),
        time: "06:20 PM",
      },
      {
        id: "attendance-demo-012",
        memberId: "demo-005",
        date: getDateOffset(-7),
        time: "07:15 PM",
      },
    ];

    const customWorkouts: CustomWorkout[] = [
      {
        id: "demo-custom-001",
        name: "Ahmed's Strength Plan",
        exercises: [
          {
            name: "Bench Press",
            sets: 4,
            reps: 8,
          },
          {
            name: "Incline Dumbbell Press",
            sets: 3,
            reps: 10,
          },
          {
            name: "Cable Fly",
            sets: 3,
            reps: 12,
          },
          {
            name: "Tricep Pushdown",
            sets: 3,
            reps: 12,
          },
        ],
      },
    ];

    demoMembers[0].customWorkoutId = "demo-custom-001";

    localStorage.setItem(
      "gym-town-members",
      JSON.stringify(demoMembers)
    );

    localStorage.setItem(
      "gym-town-attendance",
      JSON.stringify(demoAttendance)
    );

    localStorage.setItem(
      "gym-town-custom-workouts",
      JSON.stringify(customWorkouts)
    );

    setMembers(demoMembers);
    setAttendance(demoAttendance);
    setDemoLoaded(true);
  }

  function clearDemoData() {
    const savedMembers = localStorage.getItem("gym-town-members");

    if (!savedMembers) {
      return;
    }

    const currentMembers: Member[] =
      JSON.parse(savedMembers);

    const nonDemoMembers = currentMembers.filter(
      (member) => !member.id.startsWith("demo-")
    );

    const savedAttendance =
      localStorage.getItem("gym-town-attendance");

    const currentAttendance: AttendanceRecord[] =
      savedAttendance
        ? JSON.parse(savedAttendance)
        : [];

    const nonDemoAttendance =
      currentAttendance.filter(
        (record) =>
          !record.id.startsWith("attendance-demo-")
      );

    localStorage.setItem(
      "gym-town-members",
      JSON.stringify(nonDemoMembers)
    );

    localStorage.setItem(
      "gym-town-attendance",
      JSON.stringify(nonDemoAttendance)
    );

    const savedWorkouts = localStorage.getItem(
      "gym-town-custom-workouts"
    );

    if (savedWorkouts) {
      const workouts: CustomWorkout[] =
        JSON.parse(savedWorkouts);

      const nonDemoWorkouts =
        workouts.filter(
          (workout) =>
            !workout.id.startsWith("demo-")
        );

      localStorage.setItem(
        "gym-town-custom-workouts",
        JSON.stringify(nonDemoWorkouts)
      );
    }

    setMembers(nonDemoMembers);
    setAttendance(nonDemoAttendance);
    setDemoLoaded(false);
  }

  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-gray-950 text-white p-6">
        <div className="max-w-md mx-auto text-center pt-20">
          <p className="text-gray-500">
            Checking admin access...
          </p>
        </div>
      </main>
    );
  }

  const today = getToday();

  const todayAttendance =
    attendance.filter(
      (record) => record.date === today
    );

  const currentMonth = today.slice(0, 7);

  const monthAttendance =
    attendance.filter(
      (record) =>
        record.date.startsWith(currentMonth)
    );

  const activeMembers =
    members.filter(
      (member) =>
        getStatus(member.expiry) === "Active"
    );

  const expiringMembers =
    members.filter(
      (member) =>
        getStatus(member.expiry) ===
        "Expiring Soon"
    );

  const expiredMembers =
    members.filter(
      (member) =>
        getStatus(member.expiry) === "Expired"
    );

  const renewalMembers = members
    .filter(
      (member) =>
        getStatus(member.expiry) !== "Active"
    )
    .sort(
      (a, b) =>
        new Date(a.expiry).getTime() -
        new Date(b.expiry).getTime()
    );

  const allPayments = members.flatMap(
    (member) =>
      (member.paymentHistory || []).map(
        (payment) => ({
          ...payment,
          memberName: member.name,
          memberId: member.id,
        })
      )
  );

  const recentPayments = allPayments
    .sort(
      (a, b) =>
        new Date(b.date).getTime() -
        new Date(a.date).getTime()
    )
    .slice(0, 5);

  const revenueThisMonth = allPayments
    .filter(
      (payment) =>
        payment.date.startsWith(currentMonth)
    )
    .reduce(
      (total, payment) =>
        total + payment.amount,
      0
    );

  const attendanceByMember = members
    .map((member) => ({
      ...member,
      checkIns:
        monthAttendance.filter(
          (record) =>
            record.memberId === member.id
        ).length,
    }))
    .filter(
      (member) => member.checkIns > 0
    )
    .sort(
      (a, b) =>
        b.checkIns - a.checkIns
    )
    .slice(0, 5);

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-md mx-auto">

        {/* Header */}
        <div className="pt-4">

          <p className="text-gray-400 text-sm">
            THE GYM TOWN
          </p>

          <h1 className="text-3xl font-bold mt-2">
            Dashboard
          </h1>

          <p className="text-gray-500 mt-1">
            Gym management overview
          </p>

        </div>

        {/* Demo Data */}
        <div className="mt-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 border border-gray-800">

          <p className="text-gray-400 text-sm">
            DEMO MODE
          </p>

          <h2 className="text-xl font-bold mt-1">
            Populate Dashboard
          </h2>

          <p className="text-gray-500 text-sm mt-2 leading-relaxed">
            Add realistic members, payments, workouts and attendance for your demo.
          </p>

          <button
            onClick={loadDemoData}
            className="w-full bg-white text-black rounded-2xl p-4 mt-4 font-semibold"
          >
            {demoLoaded
              ? "Demo Data Loaded ✓"
              : "Load Demo Data"}
          </button>

          {demoLoaded && (
            <button
              onClick={clearDemoData}
              className="w-full bg-gray-800 text-gray-300 rounded-2xl p-4 mt-3 font-semibold"
            >
              Remove Demo Data
            </button>
          )}

        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-2 gap-3 mt-6">

          <div className="bg-gray-900 rounded-3xl p-5">

            <p className="text-gray-500 text-sm">
              MEMBERS
            </p>

            <p className="text-3xl font-bold mt-2">
              {members.length}
            </p>

            <p className="text-green-400 text-xs mt-2">
              {activeMembers.length} active
            </p>

          </div>

          <div className="bg-gray-900 rounded-3xl p-5">

            <p className="text-gray-500 text-sm">
              REVENUE
            </p>

            <p className="text-2xl font-bold mt-2">
              Rs.{" "}
              {revenueThisMonth.toLocaleString()}
            </p>

            <p className="text-gray-600 text-xs mt-2">
              This month
            </p>

          </div>

          <div className="bg-gray-900 rounded-3xl p-5">

            <p className="text-gray-500 text-sm">
              EXPIRING
            </p>

            <p className="text-3xl font-bold mt-2">
              {expiringMembers.length}
            </p>

            <p className="text-yellow-400 text-xs mt-2">
              Next 7 days
            </p>

          </div>

          <div className="bg-gray-900 rounded-3xl p-5">

            <p className="text-gray-500 text-sm">
              EXPIRED
            </p>

            <p className="text-3xl font-bold mt-2">
              {expiredMembers.length}
            </p>

            <p className="text-red-400 text-xs mt-2">
              Needs renewal
            </p>

          </div>

        </div>

        {/* Attendance */}
        <div className="mt-4 bg-gray-900 rounded-3xl p-6">

          <div className="flex justify-between items-start">

            <div>

              <p className="text-gray-400 text-sm">
                ATTENDANCE
              </p>

              <h2 className="text-2xl font-bold mt-2">
                {todayAttendance.length}
              </h2>

              <p className="text-gray-500 mt-1">
                Check-ins today
              </p>

            </div>

            <div className="text-4xl">
              📅
            </div>

          </div>

          <div className="grid grid-cols-2 gap-3 mt-5">

            <div className="bg-gray-800 rounded-2xl p-4">

              <p className="text-gray-500 text-xs">
                TODAY
              </p>

              <p className="text-xl font-bold mt-1">
                {todayAttendance.length}
              </p>

            </div>

            <div className="bg-gray-800 rounded-2xl p-4">

              <p className="text-gray-500 text-xs">
                THIS MONTH
              </p>

              <p className="text-xl font-bold mt-1">
                {monthAttendance.length}
              </p>

            </div>

          </div>

          <a
            href="/attendance"
            className="block text-center bg-gray-800 rounded-2xl p-4 mt-4 font-semibold"
          >
            Manage Attendance →
          </a>

        </div>

        {/* Monthly Attendance */}
        <div className="mt-4 bg-gray-900 rounded-3xl p-6">

          <p className="text-gray-400 text-sm">
            THIS MONTH
          </p>

          <h2 className="text-xl font-bold mt-1">
            Attendance Activity
          </h2>

          <div className="mt-5">

            {attendanceByMember.length === 0 ? (
              <p className="text-gray-500">
                No attendance recorded this month.
              </p>
            ) : (
              <div className="space-y-3">

                {attendanceByMember.map(
                  (member) => (
                    <div
                      key={member.id}
                      className="bg-gray-800 rounded-2xl p-4"
                    >

                      <div className="flex justify-between items-center">

                        <p className="font-semibold truncate">
                          {member.name}
                        </p>

                        <span className="text-gray-400 text-sm">
                          {member.checkIns} check-ins
                        </span>

                      </div>

                      <div className="h-2 bg-gray-700 rounded-full mt-3 overflow-hidden">

                        <div
                          className="h-full bg-white rounded-full"
                          style={{
                            width: `${Math.min(
                              member.checkIns * 10,
                              100
                            )}%`,
                          }}
                        />

                      </div>

                    </div>
                  )
                )}

              </div>
            )}

          </div>

        </div>

        {/* Quick Actions */}
        <div className="mt-4 bg-gray-900 rounded-3xl p-6">

          <p className="text-gray-400 text-sm">
            QUICK ACTIONS
          </p>

          <div className="grid grid-cols-2 gap-3 mt-4">

            <a
              href="/members"
              className="bg-gray-800 rounded-2xl p-4 font-semibold text-center"
            >
              + Add Member
            </a>

            <a
              href="/members"
              className="bg-gray-800 rounded-2xl p-4 font-semibold text-center"
            >
              👥 Members
            </a>

            <a
              href="/attendance"
              className="bg-gray-800 rounded-2xl p-4 font-semibold text-center"
            >
              📅 Attendance
            </a>

            <a
              href="/members"
              className="bg-gray-800 rounded-2xl p-4 font-semibold text-center"
            >
              💳 Payments
            </a>

          </div>

        </div>

        {/* Renewals */}
        <div className="mt-4 bg-gray-900 rounded-3xl p-6">

          <div className="flex justify-between items-center">

            <div>

              <p className="text-gray-400 text-sm">
                MEMBERSHIP
              </p>

              <h2 className="text-xl font-bold mt-1">
                Renewals
              </h2>

            </div>

            <span className="bg-gray-800 rounded-full px-3 py-1 text-xs text-gray-400">
              {renewalMembers.length}
            </span>

          </div>

          <div className="mt-5 space-y-3">

            {renewalMembers.length === 0 ? (
              <p className="text-gray-500">
                No memberships need attention.
              </p>
            ) : (
              renewalMembers
                .slice(0, 5)
                .map((member) => {
                  const days =
                    getDaysRemaining(
                      member.expiry
                    );

                  return (
                    <div
                      key={member.id}
                      className="bg-gray-800 rounded-2xl p-4"
                    >

                      <div className="flex justify-between items-center">

                        <div className="min-w-0">

                          <p className="font-semibold truncate">
                            {member.name}
                          </p>

                          <p className="text-gray-500 text-sm mt-1">
                            Expires {member.expiry}
                          </p>

                        </div>

                        <div className="text-right shrink-0 ml-3">

                          <p
                            className={
                              days < 0
                                ? "text-red-400 text-sm font-semibold"
                                : "text-yellow-400 text-sm font-semibold"
                            }
                          >
                            {days < 0
                              ? `${Math.abs(days)} days ago`
                              : `${days} days left`}
                          </p>

                        </div>

                      </div>

                    </div>
                  );
                })
            )}

          </div>

        </div>

        {/* Recent Payments */}
        <div className="mt-4 bg-gray-900 rounded-3xl p-6">

          <p className="text-gray-400 text-sm">
            PAYMENTS
          </p>

          <h2 className="text-xl font-bold mt-1">
            Recent Payments
          </h2>

          <div className="mt-5 space-y-3">

            {recentPayments.length === 0 ? (
              <p className="text-gray-500">
                No payments recorded.
              </p>
            ) : (
              recentPayments.map(
                (payment) => (
                  <div
                    key={payment.id}
                    className="bg-gray-800 rounded-2xl p-4"
                  >

                    <div className="flex justify-between items-start">

                      <div>

                        <p className="font-semibold">
                          {payment.memberName}
                        </p>

                        <p className="text-gray-500 text-sm mt-1">
                          {payment.membership}
                        </p>

                        <p className="text-gray-600 text-xs mt-1">
                          {payment.date}
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

        {/* Recent Members */}
        <div className="mt-4 bg-gray-900 rounded-3xl p-6">

          <div className="flex justify-between items-center">

            <div>

              <p className="text-gray-400 text-sm">
                MEMBERS
              </p>

              <h2 className="text-xl font-bold mt-1">
                Recent Members
              </h2>

            </div>

            <a
              href="/members"
              className="text-gray-400 text-sm"
            >
              View All →
            </a>

          </div>

          <div className="mt-5 space-y-3">

            {members.length === 0 ? (
              <p className="text-gray-500">
                No members yet.
              </p>
            ) : (
              members
                .slice()
                .reverse()
                .slice(0, 5)
                .map(
                  (member) => (
                    <a
                      key={member.id}
                      href={`/member/${member.id}`}
                      className="block bg-gray-800 rounded-2xl p-4"
                    >

                      <div className="flex justify-between items-center">

                        <div className="min-w-0">

                          <p className="font-semibold truncate">
                            {member.name}
                          </p>

                          <p className="text-gray-500 text-sm mt-1">
                            {member.membership}
                          </p>

                        </div>

                        <span
                          className={`text-xs font-semibold ${
                            getStatus(member.expiry) ===
                            "Active"
                              ? "text-green-400"
                              : getStatus(
                                  member.expiry
                                ) === "Expiring Soon"
                              ? "text-yellow-400"
                              : "text-red-400"
                          }`}
                        >
                          {getStatus(member.expiry)}
                        </span>

                      </div>

                    </a>
                  )
                )
            )}

          </div>

        </div>

        <p className="text-center text-gray-600 text-xs mt-8 pb-4">
          THE GYM TOWN • ADMIN
        </p>

      </div>
    </main>
  );
}