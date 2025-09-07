// src/components/Header.jsx
import React from "react";
import ShareButton from "./ShareButton";

export default function Header({ todayCommits = 0, onRefresh, darkMode, onToggleDarkMode, userData }) {
  // Get current hour in 24-hour format
  const currentHour = new Date().getHours();

  // Determine mood emoji based on activity
  let moodEmoji = "😴";
  let moodLabel = "Sleeping";

  if (todayCommits > 5) {
    moodEmoji = "🚀";
    moodLabel = "On Fire!";
  } else if (currentHour >= 22 || currentHour <= 5) {
    moodEmoji = "🌙";
    moodLabel = "Night Coder";
  } else if (todayCommits > 0) {
    moodEmoji = "💡";
    moodLabel = "In Flow";
  }

  // Smooth scroll to section
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Get avatar URL from userData or fallback to default
  const avatarUrl = userData?.avatar_url || "https://avatars.githubusercontent.com/u/1?v=4";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-gray-900/90 backdrop-blur-sm mb-0">
      {/* Subtle animated background elements */}
      <div className="absolute inset-0 opacity-5 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-blue-500 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute top-0 right-1/4 w-24 h-24 bg-cyan-400 rounded-full blur-2xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="relative z-10 w-full px-4 sm:px-6 py-4">
        {/* Main header content */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 w-full">
          
          {/* Left section - Title and mood */}
          <div className="flex items-center justify-between lg:justify-start flex-shrink-0">
            <div className="flex items-center group">
              <div className="relative">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                  DevFlow{' '}
                  <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent animate-pulse">
                    Analytics
                  </span>
                </h1>
              </div>
              
              {/* Mood indicator with enhanced styling - Commented out for now */}
              {/* <div className="ml-5 flex flex-col items-center flex-shrink-0">
                <span
                  className="text-2xl sm:text-3xl transform transition-transform duration-300 cursor-default filter drop-shadow-lg"
                  role="img"
                  aria-label={moodLabel}
                  title={moodLabel}
                >
                  {moodEmoji}
                </span>
                <span className="text-xs text-blue-400 font-semibold mt-1 tracking-wider whitespace-nowrap">
                  {moodLabel}
                </span>
              </div> */}
            </div>
          </div>

          {/* Center navigation - Clean link design */}
          <nav className="flex justify-center flex-grow">
            <div className="flex items-center space-x-8 p-2 rounded-2xl bg-transparent backdrop-blur-sm">
              {[
                { id: "stats", label: "Status Cards" },
                { id: "goal-tracker", label: "Weekly Goals" },
                { id: "weekly-activity", label: "Weekly Activity" },
                { id: "recent-activity", label: "Recent Activity" },
              ].map((item) => (
                <a
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="group relative px-2 py-2 text-sm text-gray-100 hover:text-blue-400 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-0 font-poppins"
                >
                  <span className="hidden sm:inline">{item.label}</span>
                </a>
              ))}
            </div>
          </nav>

          {/* Right section - Action buttons with notification and profile */}
          <div className="flex items-center justify-center lg:justify-end space-x-4 flex-shrink-0">
            {/* Dark mode toggle with clean styling */}
            <button
              onClick={onToggleDarkMode}
              className="group relative p-3 text-gray-400 hover:text-blue-300 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-0"
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {/* Refresh button with icon only */}
            <button
              onClick={onRefresh}
              className="group relative p-3 text-gray-400 hover:text-blue-300 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-0"
              aria-label="Refresh data"
            >
              <svg
                className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>

            {/* Notification bell icon */}
            <button
              className="group relative p-3 text-gray-400 hover:text-blue-300 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-0"
              aria-label="Notifications"
            >
              <svg
                className="w-5 h-5 transition-transform duration-300 group-hover:animate-pulse"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              {/* Notification dot */}
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            </button>

            {/* Profile image */}
            <div className="relative ml-2">
              <button
                className="group relative rounded-full overflow-hidden transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-0"
                aria-label="Profile menu"
              >
                <img
                  src={avatarUrl}
                  alt="Profile"
                  className="w-10 h-10 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                {/* Online status indicator */}
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-gray-900"></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}