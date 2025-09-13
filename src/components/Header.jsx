// src/components/Header.jsx
import React, { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setData, setError, setLoading } from "../store/userSlice";

export default function Header({ todayCommits = 0, onRefresh, darkMode, onToggleDarkMode, userData }) {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeNav, setActiveNav] = useState("stats"); // initially Status
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();

  const currentHour = new Date().getHours();

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

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: "smooth" });
    setActiveNav(id); // set active on click
  };

  const avatarUrl = userData?.avatar_url || "https://avatars.githubusercontent.com/u/1?v=4";

  const handleLogout = () => {
    try {
      localStorage.removeItem('github_token');
      dispatch(setData(null));
      dispatch(setError(null));
      dispatch(setLoading(false));
      setShowProfileDropdown(false);
      window.location.href = '/';
      console.log('✅ Successfully logged out');
    } catch (error) {
      console.error('❌ Error during logout:', error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };
    if (showProfileDropdown) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showProfileDropdown]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 ${
      isScrolled ? 'bg-gray-900/95 backdrop-blur-xl shadow-2xl' : 'bg-gray-900/90 backdrop-blur-md'
    }`}>
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 opacity-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-40 h-40 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-0 right-1/4 w-32 h-32 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute -top-10 left-1/2 w-20 h-20 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 w-full px-4 sm:px-6 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 w-full">

          {/* Logo with Mood Indicator */}
          <div className="flex items-center justify-between lg:justify-start flex-shrink-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight font-poppins">
                  <span className="relative">
                    Git
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
                  </span>
                  <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-indigo-600 bg-clip-text text-transparent">
                    Streak
                  </span>
                </h1>
              </div>

              {/* Mood Indicator */}
              <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-gray-800/50 backdrop-blur-sm border border-gray-700/50">
                <span className="text-lg animate-bounce">{moodEmoji}</span>
                <span className="text-xs font-medium text-gray-300 font-poppins">{moodLabel}</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex justify-center flex-grow">
            <div className="flex items-center space-x-2">
              {[
                { id: "stats", label: "Status", icon: "📊" },
                { id: "goal-tracker", label: "Goals", icon: "🎯" },
                { id: "weekly-activity", label: "Activity", icon: "📈" },
                { id: "recent-activity", label: "Recent", icon: "⚡" },
              ].map((item) => (
                <a
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`group relative px-4 py-2.5 text-sm transition-all duration-300 cursor-pointer font-poppins rounded-xl ${
                    activeNav === item.id
                      ? "text-purple-500"
                      : "text-gray-300 hover:text-purple-500"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-xs opacity-70 group-hover:opacity-100 transition-opacity">
                      {item.icon}
                    </span>
                    <span className="hidden sm:inline transition-all duration-300">
                      {item.label}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </nav>

          {/* Right Controls */}
          <div className="flex items-center justify-center lg:justify-end space-x-3 flex-shrink-0">
            {/* Today's Commits Counter */}
            <div className="hidden sm:flex items-center space-x-2 px-3 py-2 rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50">
              <span className="text-green-400 text-sm font-bold font-poppins">{todayCommits}</span>
              <span className="text-xs text-gray-400 font-poppins">commits</span>
            </div>

            {/* Dark Mode */}
            <button
              onClick={onToggleDarkMode}
              className="group relative p-3 text-gray-400 hover:text-white transition-all duration-300 hover:scale-105 focus:outline-none rounded-xl bg-gray-800/50 hover:bg-gray-700/70 backdrop-blur-sm border border-gray-700/50 hover:border-gray-600/70 hover:shadow-lg"
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? (
                <svg className="w-5 h-5 transition-all duration-500 group-hover:rotate-180 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 transition-all duration-500 group-hover:rotate-12 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {/* Refresh */}
            <button
              onClick={onRefresh}
              className="group relative p-3 text-gray-400 hover:text-white transition-all duration-300 hover:scale-105 focus:outline-none rounded-xl bg-gray-800/50 hover:bg-gray-700/70 backdrop-blur-sm border border-gray-700/50 hover:border-gray-600/70 hover:shadow-lg"
              aria-label="Refresh data"
            >
              <svg
                className="w-5 h-5 transition-all duration-700 group-hover:rotate-180 group-hover:scale-110"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>

            {/* Profile Dropdown */}
            <div className="relative ml-2" ref={dropdownRef}>
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="group relative rounded-full overflow-hidden transition-all duration-300 hover:scale-105 focus:outline-none border-2 border-gray-700/50 hover:border-purple-500/50 bg-gray-800/50 backdrop-blur-sm hover:shadow-lg hover:shadow-purple-500/25"
                aria-label="Profile menu"
              >
                <img
                  src={avatarUrl}
                  alt="Profile"
                  className="w-12 h-12 object-cover transition-all duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
              </button>

              {showProfileDropdown && (
                <div className="absolute right-0 top-full mt-3 w-72 bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/50 py-2 z-50 animate-in slide-in-from-top-4 duration-300">
                  {/* Profile Header */}
                  <div className="px-6 py-4 border-b border-gray-700/50">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <img src={avatarUrl} alt="Profile" className="w-12 h-12 rounded-full object-cover border-2 border-gray-700/50" />
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600/10 to-indigo-600/10"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-semibold text-white truncate font-poppins">{userData?.name || userData?.login || "GitHub User"}</p>
                        <p className="text-sm text-gray-400 truncate">@{userData?.login || "username"}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          <span className="text-xs text-green-400 font-poppins">Online</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <a
                      href={`https://github.com/${userData?.login}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center px-6 py-3 text-sm text-gray-300 hover:text-white hover:bg-gray-700/70 transition-all duration-200 font-poppins border-l-2 border-transparent hover:border-purple-600"
                    >
                      <svg className="w-5 h-5 mr-3 transition-transform group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      View GitHub Profile
                      <svg className="w-4 h-4 ml-auto transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>

                    <button
                      onClick={handleLogout}
                      className="group flex items-center w-full px-6 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-all duration-200 font-poppins border-l-2 border-transparent hover:border-red-500"
                    >
                      <svg className="w-5 h-5 mr-3 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign Out
                      <svg className="w-4 h-4 ml-auto transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </header>
  );
}
