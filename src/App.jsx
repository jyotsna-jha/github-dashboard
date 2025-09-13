import React, { useEffect, useState, useContext, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setData, setError } from "./store/userSlice";
import { fetchAllGitHubData } from "./api/githubApi";
import ShareButton from "./components/ShareButton";
import GoalTracker from "./components/GoalTracker";
import { ThemeContext } from "./context/ThemeContext";

import {
  formatWeeklyCommits,
  getCurrentStreak,
  getRecentActivity,
  calculateActivityStats,
  calculateRepoStats,
  getContributionData,
} from "./utils/formatData";

// Components
import Header from "./components/Header";
import StatCard from "./components/StatCard";
import ActivityChart from "./components/ActivityChart";
import RecentActivity from "./components/RecentActivity";
import LoadingSpinner from "./components/LoadingSpinner";
import ContributionHeatmap from "./components/ContributionHeatmap";
import QuickStats from "./components/QuickStats";
import LoginButton from "./components/LoginButton";
import LiquidEther from "./components/LiquidEther";

export default function App() {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.user);
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);

  const [activeStatCard, setActiveStatCard] = useState(null);
  const [showAllActivity, setShowAllActivity] = useState(false);
  const [rawEvents, setRawEvents] = useState([]);
  const [userData, setUserData] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [hasInitialLoad, setHasInitialLoad] = useState(false);

  // ✅ Parse URL params
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");
  const isCallback = window.location.pathname === "/callback";

  // ✅ Auth state - Check token on every render
  const [token, setToken] = useState(() =>
    localStorage.getItem("github_token")
  );
  const isLoggedIn = !!token;

  // Listen for localStorage changes (for logout)
  useEffect(() => {
    const handleStorageChange = () => {
      const newToken = localStorage.getItem("github_token");
      setToken(newToken);

      // If token was removed (logout), clear all data
      if (!newToken) {
        setUserData(null);
        setRawEvents([]);
        setHasInitialLoad(false);
        dispatch(setData(null));
        dispatch(setError(null));
        dispatch(setLoading(false));
      }
    };

    // Listen for storage events from other tabs
    window.addEventListener("storage", handleStorageChange);

    // Also check periodically in case of programmatic changes
    const intervalId = setInterval(handleStorageChange, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(intervalId);
    };
  }, [dispatch]);

  // Replace your exchangeCodeForToken function with this:
  const exchangeCodeForToken = async () => {
    if (isLoadingData) return;

    setIsLoadingData(true);
    dispatch(setLoading(true));

    try {
      console.log("📨 Requesting token from backend...");

      // Dynamic API URL - works for both local dev and production
      const isLocal =
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1";
      const apiUrl = isLocal
        ? `http://localhost:3001/api/callback?code=${code}` // Local Express server
        : `/api/callback?code=${code}`; // Vercel serverless function

      console.log("🌐 Using API URL:", apiUrl);

      const response = await fetch(apiUrl);

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP ${response.status}`);
      }

      const { token: accessToken } = await response.json();

      if (accessToken) {
        localStorage.setItem("github_token", accessToken);
        setToken(accessToken); // Update local state
        window.history.replaceState({}, "", "/");
        console.log("✅ Token received, loading user data...");
        await loadData(accessToken);
      } else {
        dispatch(setError("No access token received"));
      }
    } catch (err) {
      console.error("🔐 Token exchange failed:", err);
      dispatch(setError("Login failed: " + err.message));
    } finally {
      setIsLoadingData(false);
      dispatch(setLoading(false));
    }
  };

  // ✅ Load user data using token
  const loadData = async (tokenToUse) => {
    if (isLoadingData) {
      console.log("⚠️ Already loading data, skipping...");
      return;
    }

    console.log("🚀 Starting loadData...");
    setIsLoadingData(true);
    dispatch(setLoading(true));

    try {
      console.log("📡 Fetching GitHub data with token...");
      const fetchedData = await fetchAllGitHubData(tokenToUse);
      const { events, user, repos } = fetchedData;

      console.log("📦 Raw data received:", {
        eventsCount: events?.length,
        userLogin: user?.login,
        reposCount: repos?.length,
      });

      setUserData(user);
      setRawEvents(events || []);

      const today = new Date().toDateString();
      const todayEvents = events.filter((event) => {
        const eventDate = new Date(event.created_at);
        return eventDate.toDateString() === today;
      });

      const todayPushEvents = todayEvents.filter(
        (event) => event.type === "PushEvent"
      );
      const todayCommits = todayPushEvents.reduce(
        (sum, e) => sum + (e.payload?.size || 1),
        0
      );

      const activityStats = calculateActivityStats(events);
      const repoStats = calculateRepoStats(repos);
      const contributionData = getContributionData(events);

      const formattedData = {
        weekly: formatWeeklyCommits(events),
        streak: getCurrentStreak(events),
        recent: getRecentActivity(events),
        followers: user.followers || 0,
        following: user.following || 0,
        totalRepos: user.public_repos || repoStats.totalRepos,
        totalStars: repoStats.totalStars,
        totalForks: repoStats.totalForks,
        languagesUsed: repoStats.languagesUsed,
        totalCommits: activityStats.totalCommitsThisWeek,
        totalCommitsMonth: activityStats.totalCommitsThisMonth,
        uniqueReposThisWeek: activityStats.uniqueReposThisWeek,
        totalEventsThisWeek: activityStats.totalEventsThisWeek,
        username: user.login || "User",
        name: user.name || "GitHub User",
        avatarUrl: user.avatar_url || "",
        bio: user.bio || "",
        location: user.location || "",
        company: user.company || "",
        blogUrl: user.blog || "",
        twitterUsername: user.twitter_username || "",
        avgCommitsPerDay: activityStats.avgCommitsPerDay,
        mostActiveRepo: activityStats.mostActiveRepo,
        contributionData: contributionData,
        forkedRepos: repoStats.forkedRepos,
        originalRepos: repoStats.originalRepos,
        privateRepos: repoStats.privateRepos,
        joinedDate: user.created_at
          ? new Date(user.created_at).getFullYear()
          : null,
        lastUpdate: user.updated_at || null,
        totalRawEvents: events.length,
        todayEventsCount: todayEvents.length,
        todayCommits,
        lastEventDate: events[0]?.created_at || null,
      };

      console.log("🎯 About to dispatch formatted data:", {
        username: formattedData.username,
        totalCommits: formattedData.totalCommits,
        streak: formattedData.streak,
      });

      dispatch(setData(formattedData));
      setHasInitialLoad(true);
      console.log("✅ Data dispatched successfully!");
    } catch (err) {
      console.error("❌ Failed to load data:", err);
      dispatch(setError(err.message));
    } finally {
      setIsLoadingData(false);
      dispatch(setLoading(false));
    }
  };

  // ✅ Initial load effect - FIXED dependencies
  useEffect(() => {
    if (isCallback && code && !isLoadingData) {
      console.log("🔄 Handling OAuth callback...");
      exchangeCodeForToken();
    } else if (isLoggedIn && !hasInitialLoad && !isLoadingData && token) {
      console.log("🔓 Logged in, loading data...");
      loadData(token);
    }
  }, [code, isCallback, isLoggedIn, token, hasInitialLoad, isLoadingData]);

  // ✅ Separate effect for auto-refresh to prevent infinite loops
  useEffect(() => {
    if (isLoggedIn && hasInitialLoad && !isCallback && token) {
      console.log("⏰ Setting up auto-refresh...");
      const intervalId = setInterval(() => {
        if (!isLoadingData) {
          console.log("🔄 Auto-refreshing data...");
          loadData(token);
        }
      }, 5 * 60 * 1000); // Auto-refresh every 5 minutes

      return () => {
        console.log("🛑 Clearing auto-refresh interval");
        clearInterval(intervalId);
      };
    }
  }, [isLoggedIn, hasInitialLoad, isCallback, token, isLoadingData]);

  // ✅ Show loading during login
if (isCallback && code) {
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
            Logging you in...
          </h3>
          <p className="text-gray-400 text-sm font-light">
            Please wait while we authenticate your account
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


  // ✅ Show Login Screen with LiquidEther Background if not logged in
  if (!isLoggedIn) {
    return (
      <div className="relative min-h-screen bg-gray-900 overflow-hidden">
        {/* LiquidEther Background */}
        <div className="absolute inset-0">
          <LiquidEther
            colors={["#6366f1", "#8b5cf6", "#a855f7"]}
            autoSpeed={0.3}
            autoIntensity={1.8}
            mouseForce={25}
            cursorSize={120}
            resolution={0.6}
            dt={0.016}
            autoDemo={true}
            autoResumeDelay={2000}
            autoRampDuration={1.0}
            style={{ width: "100%", height: "100%" }}
          />
        </div>

        {/* Overlay gradient for better readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/30 via-gray-800/20 to-gray-900/40 pointer-events-none" />

        {/* Login Content */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
         
          <div className="w-full max-w-md p-8 bg-transparent backdrop-blur-md rounded-2xl shadow-2xl border border-gray-700/30 mt-16">
            {/* Header */}
            {/* <div className="text-center mb-8">
            <div className="mb-4">
              <h1 className="text-3xl font-bold text-white mb-2">
                 DevFlow Analytics
              </h1>
              
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Track your GitHub activity, coding streaks, and productivity insights.
            </p>
          </div> */}

            {/* Login Button */}
            <LoginButton />
          </div>
        </div>
      </div>
    );
  }

  // 🐛 Debug logs
  console.log("🔍 Redux state:", { data, loading, error });
  console.log("🔍 Render conditions:", {
    isLoggedIn,
    loading: loading || isLoadingData,
    error,
    hasData: !!data,
  });

  // ✅ Show Dashboard if logged in
  if (loading || isLoadingData) {
    console.log("🔄 Showing loading spinner");
    return <LoadingSpinner />;
  }

  if (error) {
    console.log("❌ Showing error:", error);
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 p-6 bg-red-100 dark:bg-red-900 rounded-lg">
          <strong>Error:</strong> {error}
          <button
            onClick={() => {
              dispatch(setError(null));
              if (token) loadData(token);
            }}
            className="ml-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // ✅ Check if we have data
  if (!data) {
    console.log("⚠️ No data available, showing loading...");
    return <LoadingSpinner />;
  }

  console.log("🎨 Rendering dashboard with data:", data);

  return (
    <div className="min-h-screen transition-colors duration-300 bg-gray-100 dark:bg-gray-900">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-8 pt-32">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Header
              todayCommits={data?.todayCommits || 0}
              onRefresh={() => {
                if (!isLoadingData && token) {
                  loadData(token);
                }
              }}
              darkMode={darkMode}
              onToggleDarkMode={toggleDarkMode}
              userData={userData}
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="-mt-9">
          <QuickStats data={data} />
        </div>

        {/* Stats Cards */}
        <div className="relative mb-24" id="stats">
          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
            <StatCard
              title="Weekly Commits"
              value={data?.totalCommits || 0}
              subtitle={
                data?.totalCommits > 10
                  ? "🚀 Great progress!"
                  : "💪 Keep coding!"
              }
              icon="📦"
              onClick={() =>
                setActiveStatCard(
                  activeStatCard === "commits" ? null : "commits"
                )
              }
              isActive={activeStatCard === "commits"}
            />
            <StatCard
              title="Current Streak"
              value={`${data?.streak || 0} days`}
              subtitle={
                data?.streak >= 7
                  ? "🔥 On fire!"
                  : data?.streak > 0
                  ? "💪 Keep going!"
                  : "🌱 Start today!"
              }
              icon="🔥"
              onClick={() =>
                setActiveStatCard(activeStatCard === "streak" ? null : "streak")
              }
              isActive={activeStatCard === "streak"}
            />
            <StatCard
              title="Recent Activity"
              value={data?.totalEventsThisWeek || 0}
              subtitle={
                data?.totalEventsThisWeek > 15
                  ? "📈 Very active"
                  : data?.totalEventsThisWeek > 5
                  ? "📊 Active"
                  : "🌙 Quiet week"
              }
              icon="💬"
              onClick={() =>
                setActiveStatCard(
                  activeStatCard === "activity" ? null : "activity"
                )
              }
              isActive={activeStatCard === "activity"}
            />
          </div>
        </div>

        <div id="goal-tracker">
          <GoalTracker />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2" id="weekly-activity">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Weekly Activity
                </h2>
              </div>
              <ActivityChart data={data?.weekly} />
            </div>
            <ContributionHeatmap contributionData={data?.contributionData} />
          </div>

          <div className="lg:col-span-1" id="recent-activity">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 sticky top-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Recent Activity
                </h2>
                {data?.recent && data.recent.length > 5 && (
                  <button
                    onClick={() => setShowAllActivity(!showAllActivity)}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 text-sm font-medium"
                  >
                    {showAllActivity ? "Show Less" : "Show All"}
                  </button>
                )}
              </div>
              <RecentActivity
                activities={
                  showAllActivity ? data?.recent : data?.recent?.slice(0, 5)
                }
                showAll={showAllActivity}
                onToggleShow={setShowAllActivity}
                totalCount={data?.recent?.length}
              />
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Powered by GitHub API • Built with ❤️
          </p>
        </div>
      </div>

      <ShareButton statsData={data} />

      <style jsx>{`
        #stats,
        #goal-tracker,
        #weekly-activity,
        #recent-activity {
          scroll-margin-top: 120px;
        }
      `}</style>
    </div>
  );
}
