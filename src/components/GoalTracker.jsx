// src/components/GoalTracker.jsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setWeeklyGoal } from "../store/userSlice";

export default function GoalTracker() {
  const dispatch = useDispatch();
  const { weeklyGoal } = useSelector((state) => state.user);
  const totalCommits = useSelector((state) => state.user.data?.totalCommits || 0);

  const [goalInput, setGoalInput] = useState(weeklyGoal);

  const progress = Math.min((totalCommits / weeklyGoal) * 100, 100);

  const handleSetGoal = () => {
    if (goalInput > 0) {
      dispatch(setWeeklyGoal(goalInput));
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-8">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">🎯 Weekly Goal</h2>

      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <input
          type="number"
          value={goalInput}
          onChange={(e) => setGoalInput(Number(e.target.value))}
          placeholder="Enter goal"
          className="flex-1 p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <button
          onClick={handleSetGoal}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Set Goal
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-2">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
          <span>{totalCommits} / {weeklyGoal} commits</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mt-1">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${
              progress < 50 ? "bg-yellow-500" : progress < 100 ? "bg-blue-500" : "bg-green-500"
            }`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Feedback */}
      {progress === 100 ? (
        <p className="text-green-600 font-medium">🎉 Goal achieved! Keep going!</p>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">
          {weeklyGoal - totalCommits} more to go!
        </p>
      )}
    </div>
  );
}