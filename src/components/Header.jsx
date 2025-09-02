// src/components/Header.jsx

import React from "react";

export default function Header({ todayCommits = 0 }) {
  // Get current hour in 24-hour format (UTC-safe)
  const currentHour = new Date().getHours();

  // Determine mood emoji based on activity
  let moodEmoji = "😴"; // default: inactive
  let moodLabel = "Sleeping";

  if (todayCommits > 5) {
    moodEmoji = "🚀";
    moodLabel = "On Fire!";
  } else if (currentHour >= 22 || currentHour <= 5) {
    // Night owl: 10 PM to 5 AM
    moodEmoji = "🌙";
    moodLabel = "Night Coder";
  } else if (todayCommits > 0) {
    moodEmoji = "💡";
    moodLabel = "In Flow";
  }

  return (
    <div className="relative mt-4 mb-8 px-4">
      {/* Main heading container */}
      <div className="relative inline-block">
        <div className="absolute -inset-2 bg-blue-500/10 blur-lg rounded-lg scale-95"></div>
        <h1 className="relative text-xl md:text-2xl font-medium font-poppins py-2 tracking-wide text-white flex items-center gap-2">
          Jyotsna's{" "}
          <span className="font-semibold text-blue-400">Dev Dashboard</span>
          <span
            className="text-lg md:text-xl animate-bounce"
            role="img"
            aria-label={moodLabel}
            style={{ animationDelay: "0.5s" }}
          >
            {moodEmoji}
          </span>
        </h1>
      </div>

      {/* Subtitle */}
      <p className="mt-1 text-sm font-poppins text-gray-400 max-w-md mx-auto leading-relaxed">
        Tracking my{" "}
        <span className="font-medium text-blue-400">GitHub</span> activity in real time
      </p>

      {/* Decorative elements */}
      <div className="absolute top-0 right-6 w-3 h-3 rounded-full bg-blue-500/40 animate-pulse"></div>
      <div className="absolute bottom-2 left-8 w-2 h-2 rounded-full bg-purple-500/30"></div>

      {/* Subtle grid background effect */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-gray-900/50 to-gray-900/20 backdrop-blur-xs rounded-lg"></div>
    </div>
  );
}