// src/components/LoadingSpinner.jsx
import React from "react";

export default function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center relative overflow-hidden">
      {/* Background gradient glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-indigo-600/10 to-transparent blur-3xl"></div>

      <div className="relative z-10 text-center">
        {/* Spinner wrapper */}
        <div className="relative mb-10">
          {/* Outer pulsing ring */}
          <div className="w-24 h-24 border-4 border-purple-700/40 rounded-full animate-pulse"></div>

          {/* Inner spinning ring */}
          <div className="w-24 h-24 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>

          {/* Center glowing dot */}
          <div className="w-3 h-3 bg-purple-400 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-ping shadow-lg shadow-purple-500/40"></div>
        </div>

        {/* Text section */}
        <div className="space-y-3">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent animate-pulse font-poppins">
            Loading your streaks...
          </h3>
          <p className="text-gray-400 text-sm font-light">
            Fetching the latest data from GitHub
          </p>

          {/* Progress dots */}
          <div className="flex justify-center space-x-2 mt-4">
            <div
              className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            ></div>
            <div
              className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            ></div>
            <div
              className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
