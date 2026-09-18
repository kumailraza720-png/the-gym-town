"use client";

import { useEffect, useState } from "react";

type Member = {
  id: string;
  name: string;
  workoutPlan?: string;
  customWorkoutId?: string;
};

type CustomWorkout = {
  id: string;
  name: string;
  exercises: string[];
};

type Exercise = {
  name: string;
  sets: number;
  reps: number;
  weight: number;
};

type WorkoutProgress = {
  [exerciseIndex: number]: boolean[];
};

const standardWorkouts: Record<
  string,
  string[]
> = {
  "Chest & Triceps": [
    "Bench Press",
    "Incline Dumbbell Press",
    "Cable Fly",
    "Tricep Pushdown",
    "Overhead Tricep Extension",
  ],

  "Back & Biceps": [
    "Lat Pulldown",
    "Seated Cable Row",
    "Barbell Row",
    "Barbell Curl",
    "Hammer Curl",
  ],

  Shoulders: [
    "Shoulder Press",
    "Lateral Raises",
    "Front Raises",
    "Rear Delt Fly",
    "Shrugs",
  ],

  Legs: [
    "Squats",
    "Leg Press",
    "Leg Extension",
    "Leg Curl",
    "Calf Raises",
  ],

  "Full Body": [
    "Squats",
    "Bench Press",
    "Lat Pulldown",
    "Shoulder Press",
    "Barbell Curl",
  ],
};

export default function Workout() {
  const [members, setMembers] =
    useState<Member[]>([]);

  const [customWorkouts, setCustomWorkouts] =
    useState<CustomWorkout[]>([]);

  const [selectedMemberId, setSelectedMemberId] =
    useState("");

  const [exercises, setExercises] =
    useState<Exercise[]>([]);

  const [progress, setProgress] =
    useState<WorkoutProgress>({});

  const [workoutName, setWorkoutName] =
    useState("");

  useEffect(() => {
    const savedMembers =
      localStorage.getItem("gym-town-members");

    const savedWorkouts =
      localStorage.getItem(
        "gym-town-custom-workouts"
      );

    const currentMemberId =
      localStorage.getItem(
        "gym-town-current-member"
      );

    if (savedMembers) {
      const loadedMembers: Member[] =
        JSON.parse(savedMembers);

      setMembers(loadedMembers);

      if (currentMemberId) {
        setSelectedMemberId(
          currentMemberId
        );
      }
    }

    if (savedWorkouts) {
      setCustomWorkouts(
        JSON.parse(savedWorkouts)
      );
    }
  }, []);

  useEffect(() => {
    if (
      !selectedMemberId ||
      members.length === 0
    ) {
      return;
    }

    const member = members.find(
      (item) =>
        item.id === selectedMemberId
    );

    if (!member || !member.workoutPlan) {
      setExercises([]);
      setWorkoutName("");
      setProgress({});
      return;
    }

    setWorkoutName(
      member.workoutPlan
    );

    let exerciseNames: string[] = [];

    if (member.customWorkoutId) {
      const customWorkout =
        customWorkouts.find(
          (item) =>
            item.id ===
            member.customWorkoutId
        );

      if (customWorkout) {
        exerciseNames =
          customWorkout.exercises;
      }
    }

    if (
      exerciseNames.length === 0 &&
      standardWorkouts[
        member.workoutPlan
      ]
    ) {
      exerciseNames =
        standardWorkouts[
          member.workoutPlan
        ];
    }

    const newExercises =
      exerciseNames.map(
        (name) => ({
          name,
          sets: 3,
          reps: 10,
          weight: 0,
        })
      );

    setExercises(newExercises);

    const savedProgress =
      localStorage.getItem(
        `gym-town-workout-${member.id}`
      );

    if (savedProgress) {
      setProgress(
        JSON.parse(savedProgress)
      );
    } else {
      const initialProgress: WorkoutProgress =
        {};

      newExercises.forEach(
        (_, index) => {
          initialProgress[index] =
            Array(3).fill(false);
        }
      );

      setProgress(
        initialProgress
      );
    }
  }, [
    selectedMemberId,
    members,
    customWorkouts,
  ]);

  function updateExercise(
    index: number,
    field: "sets" | "reps" | "weight",
    value: number
  ) {
    const updated =
      exercises.map(
        (exercise, exerciseIndex) => {
          if (
            exerciseIndex !== index
          ) {
            return exercise;
          }

          return {
            ...exercise,
            [field]: value,
          };
        }
      );

    setExercises(updated);
  }

  function toggleSet(
    exerciseIndex: number,
    setIndex: number
  ) {
    const updatedProgress = {
      ...progress,
    };

    const exerciseProgress =
      [
        ...(updatedProgress[
          exerciseIndex
        ] || []),
      ];

    exerciseProgress[setIndex] =
      !exerciseProgress[setIndex];

    updatedProgress[exerciseIndex] =
      exerciseProgress;

    setProgress(
      updatedProgress
    );

    if (selectedMemberId) {
      localStorage.setItem(
        `gym-town-workout-${selectedMemberId}`,
        JSON.stringify(
          updatedProgress
        )
      );
    }
  }

  function resetWorkout() {
    if (!selectedMemberId) {
      return;
    }

    const resetProgress: WorkoutProgress =
      {};

    exercises.forEach(
      (exercise, index) => {
        resetProgress[index] =
          Array(
            exercise.sets
          ).fill(false);
      }
    );

    setProgress(
      resetProgress
    );

    localStorage.setItem(
      `gym-town-workout-${selectedMemberId}`,
      JSON.stringify(
        resetProgress
      )
    );
  }

  const totalSets =
    exercises.reduce(
      (total, exercise) =>
        total + exercise.sets,
      0
    );

  const completedSets =
    Object.values(progress)
      .flat()
      .filter(Boolean).length;

  const workoutComplete =
    totalSets > 0 &&
    completedSets >= totalSets;

  const progressPercentage =
    totalSets > 0
      ? Math.round(
          (completedSets /
            totalSets) *
            100
        )
      : 0;

  const selectedMember =
    members.find(
      (member) =>
        member.id ===
        selectedMemberId
    );

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-md mx-auto">

        {/* Header */}
        <div className="pt-4">

          <p className="text-gray-400 text-sm">
            THE GYM TOWN
          </p>

          <h1 className="text-3xl font-bold mt-2">
            Workout
          </h1>

          <p className="text-gray-500 mt-2">
            Track your training session
          </p>

        </div>

        {/* Member Selector */}
        {members.length > 1 && (
          <div className="mt-6">

            <label className="text-gray-400 text-sm">
              Member
            </label>

            <select
              value={selectedMemberId}
              onChange={(e) =>
                setSelectedMemberId(
                  e.target.value
                )
              }
              className="w-full bg-gray-900 rounded-2xl p-4 mt-2 outline-none"
            >
              <option value="">
                Select member
              </option>

              {members.map(
                (member) => (
                  <option
                    key={member.id}
                    value={member.id}
                  >
                    {member.name}
                  </option>
                )
              )}

            </select>

          </div>
        )}

        {/* No Workout */}
        {!selectedMember ||
        !selectedMember.workoutPlan ? (
          <div className="mt-6 bg-gray-900 rounded-3xl p-8 text-center">

            <div className="text-5xl">
              🏋️
            </div>

            <h2 className="text-xl font-bold mt-4">
              No Workout Assigned
            </h2>

            <p className="text-gray-500 mt-2">
              Ask your gym trainer to assign
              you a workout.
            </p>

          </div>
        ) : (
          <>
            {/* Workout Header */}
            <div className="mt-6 bg-gray-900 rounded-3xl p-6">

              <div className="flex justify-between items-start">

                <div>

                  <p className="text-gray-400 text-sm">
                    TODAY'S WORKOUT
                  </p>

                  <h2 className="text-2xl font-bold mt-2">
                    {workoutName}
                  </h2>

                  <p className="text-gray-500 mt-1">
                    {selectedMember.name}
                  </p>

                </div>

                <div className="text-4xl">
                  💪
                </div>

              </div>

              {/* Progress */}
              <div className="mt-6">

                <div className="flex justify-between text-sm">

                  <span className="text-gray-500">
                    Progress
                  </span>

                  <span className="font-semibold">
                    {progressPercentage}%
                  </span>

                </div>

                <div className="h-2 bg-gray-800 rounded-full mt-2 overflow-hidden">

                  <div
                    className="h-full bg-white rounded-full transition-all"
                    style={{
                      width: `${progressPercentage}%`,
                    }}
                  />

                </div>

                <p className="text-gray-600 text-xs mt-2">
                  {completedSets} of{" "}
                  {totalSets} sets completed
                </p>

              </div>

            </div>

            {/* Completion */}
            {workoutComplete && (
              <div className="mt-4 bg-green-500/10 border border-green-500/20 rounded-3xl p-6 text-center">

                <div className="text-4xl">
                  🎉
                </div>

                <h2 className="text-xl font-bold text-green-400 mt-3">
                  Workout Complete!
                </h2>

                <p className="text-gray-500 mt-2">
                  Great work. Keep it up!
                </p>

              </div>
            )}

            {/* Exercises */}
            <div className="mt-4 space-y-4">

              {exercises.map(
                (exercise, exerciseIndex) => {
                  const exerciseProgress =
                    progress[
                      exerciseIndex
                    ] || [];

                  return (
                    <div
                      key={`${exercise.name}-${exerciseIndex}`}
                      className="bg-gray-900 rounded-3xl p-5"
                    >

                      {/* Exercise Name */}
                      <h2 className="text-xl font-bold">
                        {exerciseIndex +
                          1}
                        . {exercise.name}
                      </h2>

                      {/* Settings */}
                      <div className="grid grid-cols-3 gap-2 mt-4">

                        <div>

                          <label className="text-gray-600 text-xs">
                            SETS
                          </label>

                          <input
                            type="number"
                            min="1"
                            max="10"
                            value={
                              exercise.sets
                            }
                            onChange={(e) =>
                              updateExercise(
                                exerciseIndex,
                                "sets",
                                Number(
                                  e.target
                                    .value
                                )
                              )
                            }
                            className="w-full bg-gray-800 rounded-xl p-3 mt-1 text-center outline-none"
                          />

                        </div>

                        <div>

                          <label className="text-gray-600 text-xs">
                            REPS
                          </label>

                          <input
                            type="number"
                            min="1"
                            max="100"
                            value={
                              exercise.reps
                            }
                            onChange={(e) =>
                              updateExercise(
                                exerciseIndex,
                                "reps",
                                Number(
                                  e.target
                                    .value
                                )
                              )
                            }
                            className="w-full bg-gray-800 rounded-xl p-3 mt-1 text-center outline-none"
                          />

                        </div>

                        <div>

                          <label className="text-gray-600 text-xs">
                            KG
                          </label>

                          <input
                            type="number"
                            min="0"
                            value={
                              exercise.weight
                            }
                            onChange={(e) =>
                              updateExercise(
                                exerciseIndex,
                                "weight",
                                Number(
                                  e.target
                                    .value
                                )
                              )
                            }
                            className="w-full bg-gray-800 rounded-xl p-3 mt-1 text-center outline-none"
                          />

                        </div>

                      </div>

                      {/* Sets */}
                      <div className="mt-5">

                        <p className="text-gray-500 text-xs mb-2">
                          SETS
                        </p>

                        <div className="grid grid-cols-3 gap-2">

                          {Array.from({
                            length:
                              exercise.sets,
                          }).map(
                            (_, setIndex) => {
                              const complete =
                                exerciseProgress[
                                  setIndex
                                ] ||
                                false;

                              return (
                                <button
                                  key={
                                    setIndex
                                  }
                                  onClick={() =>
                                    toggleSet(
                                      exerciseIndex,
                                      setIndex
                                    )
                                  }
                                  className={`rounded-xl p-3 text-sm font-semibold ${
                                    complete
                                      ? "bg-white text-black"
                                      : "bg-gray-800 text-gray-400"
                                  }`}
                                >
                                  {complete
                                    ? "✓ "
                                    : ""}
                                  Set{" "}
                                  {setIndex +
                                    1}
                                </button>
                              );
                            }
                          )}

                        </div>

                      </div>

                    </div>
                  );
                }
              )}

            </div>

            {/* Reset */}
            <button
              onClick={resetWorkout}
              className="w-full bg-gray-900 rounded-2xl p-4 mt-5 text-gray-400 font-semibold"
            >
              Reset Workout
            </button>

          </>
        )}

        <p className="text-center text-gray-600 text-xs mt-8 pb-4">
          THE GYM TOWN • WORKOUT
        </p>

      </div>
    </main>
  );
}