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
  pin?: string;
  membership: string;
  price: number;
  paymentDate: string;
  expiry: string;
  profilePicture?: string;
  workoutPlan?: string;
  customWorkoutId?: string;
  paymentHistory?: Payment[];
};

type CustomWorkout = {
  id: string;
  name: string;
  exercises: string[];
};

const standardWorkouts = [
  "Chest & Triceps",
  "Back & Biceps",
  "Shoulders",
  "Legs",
  "Full Body",
];

export default function Members() {
  const [members, setMembers] = useState<Member[]>([]);
  const [customWorkouts, setCustomWorkouts] =
    useState<CustomWorkout[]>([]);

  const [showForm, setShowForm] =
    useState(false);

  const [editingMember, setEditingMember] =
    useState<Member | null>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [membership, setMembership] =
    useState("Monthly");
  const [price, setPrice] = useState("");
  const [paymentDate, setPaymentDate] =
    useState("");
  const [expiry, setExpiry] = useState("");
  const [workoutPlan, setWorkoutPlan] =
    useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("All");

  const [showWorkoutForm, setShowWorkoutForm] =
    useState(false);

  const [workoutMember, setWorkoutMember] =
    useState<Member | null>(null);

  const [customWorkoutName, setCustomWorkoutName] =
    useState("");

  const [customExercises, setCustomExercises] =
    useState("");

  useEffect(() => {
    const savedMembers =
      localStorage.getItem("gym-town-members");

    const savedWorkouts =
      localStorage.getItem(
        "gym-town-custom-workouts"
      );

    if (savedMembers) {
      const loadedMembers: Member[] =
        JSON.parse(savedMembers);

      setMembers(
        loadedMembers.map((member) => ({
          ...member,
          pin: member.pin || "1234",
        }))
      );
    }

    if (savedWorkouts) {
      setCustomWorkouts(
        JSON.parse(savedWorkouts)
      );
    }
  }, []);

  function saveMembers(
    updatedMembers: Member[]
  ) {
    setMembers(updatedMembers);

    localStorage.setItem(
      "gym-town-members",
      JSON.stringify(updatedMembers)
    );
  }

  function saveCustomWorkouts(
    updatedWorkouts: CustomWorkout[]
  ) {
    setCustomWorkouts(updatedWorkouts);

    localStorage.setItem(
      "gym-town-custom-workouts",
      JSON.stringify(updatedWorkouts)
    );
  }

  function resetForm() {
    setName("");
    setPhone("");
    setPin("");
    setMembership("Monthly");
    setPrice("");
    setPaymentDate("");
    setExpiry("");
    setWorkoutPlan("");
    setEditingMember(null);
  }

  function addMember() {
    if (
      !name.trim() ||
      !phone.trim() ||
      !pin.trim() ||
      !price.trim() ||
      !paymentDate ||
      !expiry
    ) {
      return;
    }

    if (
      !/^\d{4}$/.test(pin)
    ) {
      return;
    }

    const newPayment: Payment = {
      id: `payment-${Date.now()}`,
      amount: Number(price),
      date: paymentDate,
      membership,
    };

    const newMember: Member = {
      id: `member-${Date.now()}`,
      name: name.trim(),
      phone: phone.trim(),
      pin: pin.trim(),
      membership,
      price: Number(price),
      paymentDate,
      expiry,
      workoutPlan:
        workoutPlan || undefined,
      paymentHistory: [newPayment],
    };

    saveMembers([
      ...members,
      newMember,
    ]);

    resetForm();
    setShowForm(false);
  }

  function startEdit(member: Member) {
    setEditingMember(member);

    setName(member.name);
    setPhone(member.phone);
    setPin(member.pin || "1234");
    setMembership(member.membership);
    setPrice(String(member.price));
    setPaymentDate(member.paymentDate);
    setExpiry(member.expiry);
    setWorkoutPlan(
      member.workoutPlan || ""
    );

    setShowForm(true);
  }

  function updateMember() {
    if (
      !editingMember ||
      !name.trim() ||
      !phone.trim() ||
      !pin.trim() ||
      !price.trim() ||
      !paymentDate ||
      !expiry
    ) {
      return;
    }

    if (
      !/^\d{4}$/.test(pin)
    ) {
      return;
    }

    const updatedMembers =
      members.map((member) => {
        if (
          member.id !==
          editingMember.id
        ) {
          return member;
        }

        return {
          ...member,
          name: name.trim(),
          phone: phone.trim(),
          pin: pin.trim(),
          membership,
          price: Number(price),
          paymentDate,
          expiry,
          workoutPlan:
            workoutPlan || undefined,
        };
      });

    saveMembers(updatedMembers);

    resetForm();
    setShowForm(false);
  }

  function deleteMember(
    member: Member
  ) {
    const confirmed =
      window.confirm(
        `Delete ${member.name}?`
      );

    if (!confirmed) {
      return;
    }

    const updatedMembers =
      members.filter(
        (item) =>
          item.id !== member.id
      );

    saveMembers(updatedMembers);
  }

  function renewMember(
    member: Member
  ) {
    const today = new Date();

    const newExpiry =
      new Date(today);

    newExpiry.setMonth(
      newExpiry.getMonth() + 1
    );

    const formattedExpiry =
      newExpiry
        .toISOString()
        .split("T")[0];

    const newPaymentDate =
      new Date()
        .toISOString()
        .split("T")[0];

    const newPayment: Payment = {
      id: `payment-${Date.now()}`,
      amount: member.price,
      date: newPaymentDate,
      membership:
        member.membership,
    };

    const updatedMembers =
      members.map((item) => {
        if (
          item.id !== member.id
        ) {
          return item;
        }

        return {
          ...item,
          pin: item.pin || "1234",
          paymentDate:
            newPaymentDate,
          expiry:
            formattedExpiry,
          paymentHistory: [
            ...(item.paymentHistory ||
              []),
            newPayment,
          ],
        };
      });

    saveMembers(updatedMembers);
  }

  function getDaysRemaining(
    expiryDate: string
  ) {
    const today = new Date();
    const expiry = new Date(
      expiryDate
    );

    today.setHours(0, 0, 0, 0);
    expiry.setHours(0, 0, 0, 0);

    const difference =
      expiry.getTime() -
      today.getTime();

    return Math.ceil(
      difference /
        (1000 * 60 * 60 * 24)
    );
  }

  function getStatus(
    expiryDate: string
  ) {
    const days =
      getDaysRemaining(expiryDate);

    if (days < 0) {
      return "Expired";
    }

    if (days <= 7) {
      return "Expiring Soon";
    }

    return "Active";
  }

  function openWorkoutForm(
    member: Member
  ) {
    setWorkoutMember(member);
    setCustomWorkoutName("");
    setCustomExercises("");
    setShowWorkoutForm(true);
  }

  function createCustomWorkout() {
    if (
      !workoutMember ||
      !customWorkoutName.trim() ||
      !customExercises.trim()
    ) {
      return;
    }

    const workout: CustomWorkout = {
      id: `workout-${Date.now()}`,
      name:
        customWorkoutName.trim(),
      exercises:
        customExercises
          .split("\n")
          .map((item) =>
            item.trim()
          )
          .filter(Boolean),
    };

    const updatedWorkouts = [
      ...customWorkouts,
      workout,
    ];

    saveCustomWorkouts(
      updatedWorkouts
    );

    const updatedMembers =
      members.map((member) => {
        if (
          member.id !==
          workoutMember.id
        ) {
          return member;
        }

        return {
          ...member,
          workoutPlan:
            workout.name,
          customWorkoutId:
            workout.id,
        };
      });

    saveMembers(updatedMembers);

    setShowWorkoutForm(false);
    setWorkoutMember(null);
  }

  function assignWorkout(
    member: Member,
    workout: string
  ) {
    const updatedMembers =
      members.map((item) => {
        if (
          item.id !== member.id
        ) {
          return item;
        }

        return {
          ...item,
          workoutPlan: workout,
          customWorkoutId:
            undefined,
        };
      });

    saveMembers(updatedMembers);
  }

  const filteredMembers =
    members.filter((member) => {
      const searchValue =
        search
          .toLowerCase()
          .trim();

      const matchesSearch =
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
          );

      const matchesStatus =
        statusFilter === "All" ||
        getStatus(
          member.expiry
        ) === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-md mx-auto">

        {/* Header */}
        <div className="pt-4">

          <p className="text-gray-400 text-sm">
            THE GYM TOWN
          </p>

          <div className="flex justify-between items-end mt-2">

            <div>

              <h1 className="text-3xl font-bold">
                Members
              </h1>

              <p className="text-gray-500 mt-1">
                Manage your gym members
              </p>

            </div>

            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="bg-white text-black rounded-xl px-4 py-3 font-semibold"
            >
              + Add
            </button>

          </div>

        </div>

        {/* Search */}
        <div className="mt-6">

          <input
            type="text"
            placeholder="Search name or phone..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full bg-gray-900 rounded-2xl p-4 text-white outline-none placeholder:text-gray-600"
          />

        </div>

        {/* Filters */}
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">

          {[
            "All",
            "Active",
            "Expiring Soon",
            "Expired",
          ].map((filter) => (
            <button
              key={filter}
              onClick={() =>
                setStatusFilter(filter)
              }
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold ${
                statusFilter === filter
                  ? "bg-white text-black"
                  : "bg-gray-900 text-gray-400"
              }`}
            >
              {filter}
            </button>
          ))}

        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="mt-6 bg-gray-900 rounded-3xl p-6">

            <div className="flex justify-between items-center">

              <div>

                <p className="text-gray-400 text-sm">
                  {editingMember
                    ? "EDIT MEMBER"
                    : "NEW MEMBER"}
                </p>

                <h2 className="text-2xl font-bold mt-1">
                  {editingMember
                    ? "Edit Member"
                    : "Add Member"}
                </h2>

              </div>

              <button
                onClick={() => {
                  resetForm();
                  setShowForm(false);
                }}
                className="text-gray-500 text-xl"
              >
                ✕
              </button>

            </div>

            <div className="mt-6 space-y-4">

              <input
                type="text"
                placeholder="Full name"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                className="w-full bg-gray-800 rounded-xl p-4 outline-none"
              />

              <input
                type="tel"
                placeholder="Phone number"
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value)
                }
                className="w-full bg-gray-800 rounded-xl p-4 outline-none"
              />

              <div>

                <label className="text-gray-400 text-sm">
                  Login PIN
                </label>

                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  placeholder="4-digit PIN"
                  value={pin}
                  onChange={(e) =>
                    setPin(
                      e.target.value.replace(
                        /\D/g,
                        ""
                      )
                    )
                  }
                  className="w-full bg-gray-800 rounded-xl p-4 mt-2 outline-none"
                />

                <p className="text-gray-600 text-xs mt-2">
                  Member will use this PIN to log in.
                </p>

              </div>

              <select
                value={membership}
                onChange={(e) =>
                  setMembership(
                    e.target.value
                  )
                }
                className="w-full bg-gray-800 rounded-xl p-4 outline-none"
              >
                <option value="Monthly">
                  Monthly
                </option>

                <option value="Quarterly">
                  Quarterly
                </option>

                <option value="Half Yearly">
                  Half Yearly
                </option>

                <option value="Yearly">
                  Yearly
                </option>
              </select>

              <input
                type="number"
                placeholder="Membership price"
                value={price}
                onChange={(e) =>
                  setPrice(e.target.value)
                }
                className="w-full bg-gray-800 rounded-xl p-4 outline-none"
              />

              <div>

                <label className="text-gray-500 text-sm">
                  Payment Date
                </label>

                <input
                  type="date"
                  value={paymentDate}
                  onChange={(e) =>
                    setPaymentDate(
                      e.target.value
                    )
                  }
                  className="w-full bg-gray-800 rounded-xl p-4 mt-2 outline-none"
                />

              </div>

              <div>

                <label className="text-gray-500 text-sm">
                  Expiry Date
                </label>

                <input
                  type="date"
                  value={expiry}
                  onChange={(e) =>
                    setExpiry(
                      e.target.value
                    )
                  }
                  className="w-full bg-gray-800 rounded-xl p-4 mt-2 outline-none"
                />

              </div>

              <select
                value={workoutPlan}
                onChange={(e) =>
                  setWorkoutPlan(
                    e.target.value
                  )
                }
                className="w-full bg-gray-800 rounded-xl p-4 outline-none"
              >
                <option value="">
                  No workout assigned
                </option>

                {standardWorkouts.map(
                  (workout) => (
                    <option
                      key={workout}
                      value={workout}
                    >
                      {workout}
                    </option>
                  )
                )}

                {customWorkouts.map(
                  (workout) => (
                    <option
                      key={workout.id}
                      value={workout.name}
                    >
                      {workout.name}
                    </option>
                  )
                )}

              </select>

              <button
                onClick={
                  editingMember
                    ? updateMember
                    : addMember
                }
                className="w-full bg-white text-black rounded-2xl p-4 font-semibold"
              >
                {editingMember
                  ? "Save Changes"
                  : "Add Member"}
              </button>

            </div>

          </div>
        )}

        {/* Custom Workout Form */}
        {showWorkoutForm &&
          workoutMember && (
            <div className="mt-6 bg-gray-900 rounded-3xl p-6">

              <div className="flex justify-between items-center">

                <div>

                  <p className="text-gray-400 text-sm">
                    CUSTOM WORKOUT
                  </p>

                  <h2 className="text-xl font-bold mt-1">
                    {workoutMember.name}
                  </h2>

                </div>

                <button
                  onClick={() => {
                    setShowWorkoutForm(
                      false
                    );
                    setWorkoutMember(
                      null
                    );
                  }}
                  className="text-gray-500 text-xl"
                >
                  ✕
                </button>

              </div>

              <div className="mt-5 space-y-4">

                <input
                  type="text"
                  placeholder="Workout name"
                  value={
                    customWorkoutName
                  }
                  onChange={(e) =>
                    setCustomWorkoutName(
                      e.target.value
                    )
                  }
                  className="w-full bg-gray-800 rounded-xl p-4 outline-none"
                />

                <textarea
                  placeholder={
                    "Enter one exercise per line\nBench Press\nIncline Dumbbell Press\nCable Fly"
                  }
                  value={
                    customExercises
                  }
                  onChange={(e) =>
                    setCustomExercises(
                      e.target.value
                    )
                  }
                  rows={6}
                  className="w-full bg-gray-800 rounded-xl p-4 outline-none resize-none"
                />

                <button
                  onClick={
                    createCustomWorkout
                  }
                  className="w-full bg-white text-black rounded-2xl p-4 font-semibold"
                >
                  Create & Assign Workout
                </button>

              </div>

            </div>
          )}

        {/* Members */}
        <div className="mt-6 space-y-4">

          {filteredMembers.length === 0 ? (
            <div className="bg-gray-900 rounded-3xl p-8 text-center">

              <p className="text-gray-500">
                No members found.
              </p>

            </div>
          ) : (
            filteredMembers.map(
              (member) => {
                const status =
                  getStatus(
                    member.expiry
                  );

                const days =
                  getDaysRemaining(
                    member.expiry
                  );

                return (
                  <div
                    key={member.id}
                    className="bg-gray-900 rounded-3xl p-5"
                  >

                    {/* Member Header */}
                    <div className="flex justify-between items-start">

                      <div className="min-w-0">

                        <a
                          href={`/member/${member.id}`}
                          className="text-xl font-bold hover:underline"
                        >
                          {member.name}
                        </a>

                        <p className="text-gray-500 mt-1">
                          {member.phone}
                        </p>

                      </div>

                      <span
                        className={`text-xs rounded-full px-3 py-1 whitespace-nowrap ${
                          status ===
                          "Active"
                            ? "bg-green-500/10 text-green-400"
                            : status ===
                              "Expiring Soon"
                            ? "bg-yellow-500/10 text-yellow-400"
                            : "bg-red-500/10 text-red-400"
                        }`}
                      >
                        {status}
                      </span>

                    </div>

                    {/* Details */}
                    <div className="mt-5 grid grid-cols-2 gap-3">

                      <div className="bg-gray-800 rounded-2xl p-4">

                        <p className="text-gray-500 text-xs">
                          MEMBERSHIP
                        </p>

                        <p className="font-semibold mt-1">
                          {member.membership}
                        </p>

                      </div>

                      <div className="bg-gray-800 rounded-2xl p-4">

                        <p className="text-gray-500 text-xs">
                          PRICE
                        </p>

                        <p className="font-semibold mt-1">
                          Rs.{" "}
                          {member.price.toLocaleString()}
                        </p>

                      </div>

                    </div>

                    {/* Expiry */}
                    <div className="mt-3 bg-gray-800 rounded-2xl p-4">

                      <div className="flex justify-between">

                        <div>

                          <p className="text-gray-500 text-xs">
                            EXPIRES
                          </p>

                          <p className="font-semibold mt-1">
                            {member.expiry}
                          </p>

                        </div>

                        <div className="text-right">

                          <p className="text-gray-500 text-xs">
                            STATUS
                          </p>

                          <p className="font-semibold mt-1">
                            {days >= 0
                              ? `${days} days left`
                              : `${Math.abs(
                                  days
                                )} days ago`}
                          </p>

                        </div>

                      </div>

                    </div>

                    {/* Workout */}
                    <div className="mt-3 bg-gray-800 rounded-2xl p-4">

                      <p className="text-gray-500 text-xs">
                        WORKOUT
                      </p>

                      <p className="font-semibold mt-1">
                        {member.workoutPlan ||
                          "No workout assigned"}
                      </p>

                    </div>

                    {/* Actions */}
                    <div className="mt-4 grid grid-cols-2 gap-2">

                      <button
                        onClick={() =>
                          startEdit(member)
                        }
                        className="bg-gray-800 rounded-xl p-3 text-sm font-semibold"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          renewMember(member)
                        }
                        className="bg-white text-black rounded-xl p-3 text-sm font-semibold"
                      >
                        Renew
                      </button>

                      <button
                        onClick={() =>
                          openWorkoutForm(
                            member
                          )
                        }
                        className="bg-gray-800 rounded-xl p-3 text-sm font-semibold"
                      >
                        Custom Workout
                      </button>

                      <a
                        href={`/member/${member.id}`}
                        className="bg-gray-800 rounded-xl p-3 text-sm font-semibold text-center"
                      >
                        Profile
                      </a>

                    </div>

                    {/* Standard Workout Buttons */}
                    <div className="mt-4">

                      <p className="text-gray-500 text-xs mb-2">
                        ASSIGN STANDARD WORKOUT
                      </p>

                      <div className="flex gap-2 overflow-x-auto pb-1">

                        {standardWorkouts.map(
                          (workout) => (
                            <button
                              key={workout}
                              onClick={() =>
                                assignWorkout(
                                  member,
                                  workout
                                )
                              }
                              className={`whitespace-nowrap rounded-full px-3 py-2 text-xs ${
                                member.workoutPlan ===
                                workout
                                  ? "bg-white text-black"
                                  : "bg-gray-800 text-gray-400"
                              }`}
                            >
                              {workout}
                            </button>
                          )
                        )}

                      </div>

                    </div>

                    {/* Delete */}
                    <button
                      onClick={() =>
                        deleteMember(member)
                      }
                      className="w-full mt-4 text-red-400 text-sm font-semibold p-2"
                    >
                      Delete Member
                    </button>

                  </div>
                );
              }
            )
          )}

        </div>

        <p className="text-center text-gray-600 text-xs mt-8 pb-4">
          THE GYM TOWN • MEMBERS
        </p>

      </div>
    </main>
  );
}