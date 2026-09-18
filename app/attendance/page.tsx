"use client";

import { useEffect, useState } from "react";

type Member = {
  id: string;
  name: string;
  phone: string;
  expiry: string;
};

type AttendanceRecord = {
  id: string;
  memberId: string;
  date: string;
  time: string;
};

export default function Attendance() {
  const [members, setMembers] = useState<Member[]>([]);
  const [attendance, setAttendance] = useState<
    AttendanceRecord[]
  >([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const savedMembers =
      localStorage.getItem("gym-town-members");

    const savedAttendance =
      localStorage.getItem(
        "gym-town-attendance"
      );

    if (savedMembers) {
      setMembers(
        JSON.parse(savedMembers)
      );
    }

    if (savedAttendance) {
      setAttendance(
        JSON.parse(savedAttendance)
      );
    }
  }, []);

  function saveAttendance(
    updatedAttendance: AttendanceRecord[]
  ) {
    setAttendance(updatedAttendance);

    localStorage.setItem(
      "gym-town-attendance",
      JSON.stringify(
        updatedAttendance
      )
    );
  }

  function getToday() {
    return new Date()
      .toISOString()
      .split("T")[0];
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

  function hasCheckedInToday(
    memberId: string
  ) {
    const today = getToday();

    return attendance.some(
      (record) =>
        record.memberId === memberId &&
        record.date === today
    );
  }

  function checkIn(member: Member) {
    if (hasCheckedInToday(member.id)) {
      return;
    }

    const newRecord: AttendanceRecord = {
      id: `attendance-${Date.now()}`,
      memberId: member.id,
      date: getToday(),
      time: getCurrentTime(),
    };

    saveAttendance([
      ...attendance,
      newRecord,
    ]);
  }

  function removeCheckIn(
    memberId: string
  ) {
    const today = getToday();

    const updatedAttendance =
      attendance.filter(
        (record) =>
          !(
            record.memberId ===
              memberId &&
            record.date === today
          )
      );

    saveAttendance(
      updatedAttendance
    );
  }

  const today = getToday();

  const todayAttendance =
    attendance.filter(
      (record) =>
        record.date === today
    );

  const filteredMembers =
    members.filter((member) => {
      const searchValue =
        search
          .toLowerCase()
          .trim();

      return (
        !searchValue ||
        member.name
          .toLowerCase()
          .includes(
            searchValue
          ) ||
        member.phone
          .toLowerCase()
          .includes(
            searchValue
          )
      );
    });

  const recentAttendance =
    attendance
      .slice()
      .reverse()
      .slice(0, 10);

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-md mx-auto">

        {/* Header */}
        <div className="pt-4">

          <p className="text-gray-400 text-sm">
            THE GYM TOWN
          </p>

          <h1 className="text-3xl font-bold mt-2">
            Attendance
          </h1>

          <p className="text-gray-500 mt-1">
            Track member check-ins
          </p>

        </div>

        {/* Today's Stats */}
        <div className="mt-6 bg-gray-900 rounded-3xl p-6">

          <p className="text-gray-400 text-sm">
            TODAY
          </p>

          <div className="flex items-end justify-between mt-2">

            <div>

              <h2 className="text-4xl font-bold">
                {todayAttendance.length}
              </h2>

              <p className="text-gray-500 mt-1">
                Members checked in
              </p>

            </div>

            <div className="text-4xl">
              📅
            </div>

          </div>

        </div>

        {/* Search */}
        <div className="mt-4">

          <input
            type="text"
            placeholder="Search member..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            className="w-full bg-gray-900 rounded-2xl p-4 text-white outline-none placeholder:text-gray-600"
          />

        </div>

        {/* Members */}
        <div className="mt-4 space-y-3">

          {filteredMembers.length === 0 ? (
            <div className="bg-gray-900 rounded-3xl p-8 text-center">

              <p className="text-gray-500">
                No members found.
              </p>

            </div>
          ) : (
            filteredMembers.map(
              (member) => {
                const checkedIn =
                  hasCheckedInToday(
                    member.id
                  );

                const record =
                  todayAttendance.find(
                    (item) =>
                      item.memberId ===
                      member.id
                  );

                return (
                  <div
                    key={member.id}
                    className="bg-gray-900 rounded-3xl p-5"
                  >

                    <div className="flex justify-between items-center">

                      <div className="min-w-0">

                        <p className="font-bold text-lg truncate">
                          {member.name}
                        </p>

                        <p className="text-gray-500 text-sm mt-1">
                          {member.phone}
                        </p>

                      </div>

                      {checkedIn ? (
                        <span className="bg-green-500/10 text-green-400 rounded-full px-3 py-1 text-xs font-semibold">
                          Checked In
                        </span>
                      ) : (
                        <span className="bg-gray-800 text-gray-500 rounded-full px-3 py-1 text-xs">
                          Not In
                        </span>
                      )}

                    </div>

                    {checkedIn && record && (
                      <p className="text-gray-500 text-sm mt-4">
                        Checked in at{" "}
                        <span className="text-gray-300">
                          {record.time}
                        </span>
                      </p>
                    )}

                    <div className="mt-4">

                      {checkedIn ? (
                        <button
                          onClick={() =>
                            removeCheckIn(
                              member.id
                            )
                          }
                          className="w-full bg-gray-800 text-gray-400 rounded-xl p-3 text-sm font-semibold"
                        >
                          Undo Check-In
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            checkIn(member)
                          }
                          className="w-full bg-white text-black rounded-xl p-3 text-sm font-semibold"
                        >
                          ✓ Check In
                        </button>
                      )}

                    </div>

                  </div>
                );
              }
            )
          )}

        </div>

        {/* Recent Check-ins */}
        <div className="mt-6 bg-gray-900 rounded-3xl p-6">

          <p className="text-gray-400 text-sm">
            RECENT
          </p>

          <h2 className="text-xl font-bold mt-1">
            Recent Check-Ins
          </h2>

          <div className="mt-5 space-y-3">

            {recentAttendance.length ===
            0 ? (
              <p className="text-gray-500">
                No attendance recorded yet.
              </p>
            ) : (
              recentAttendance.map(
                (record) => {
                  const member =
                    members.find(
                      (item) =>
                        item.id ===
                        record.memberId
                    );

                  if (!member) {
                    return null;
                  }

                  return (
                    <div
                      key={record.id}
                      className="bg-gray-800 rounded-2xl p-4"
                    >

                      <div className="flex justify-between items-center">

                        <div>

                          <p className="font-semibold">
                            {member.name}
                          </p>

                          <p className="text-gray-500 text-sm mt-1">
                            {record.date}
                          </p>

                        </div>

                        <p className="text-gray-400 text-sm">
                          {record.time}
                        </p>

                      </div>

                    </div>
                  );
                }
              )
            )}

          </div>

        </div>

        <p className="text-center text-gray-600 text-xs mt-8 pb-4">
          THE GYM TOWN • ATTENDANCE
        </p>

      </div>
    </main>
  );
}