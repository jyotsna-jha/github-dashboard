import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setData, setError } from "./store/userSlice";
import { fetchAllGitHubData } from "./api/githubApi";
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

// Debug Component
const DebugInfo = ({ data, rawEvents }) => {
  const [showDebug, setShowDebug] = useState(false);
  
  if (!showDebug) {
    return (
      <button
        onClick={() => setShowDebug(true)}
        className="fixed bottom-4 left-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm z-50 shadow-lg transition-colors"
      >
        🐛 Debug Data
      </button>
    );
  }

  const todayStr = new Date().toDateString();
  const todayEvents = rawEvents?.filter(event => {
    const eventDate = new Date(event.created_at);
    return eventDate.toDateString() === todayStr;
  }) || [];

  const todayPushEvents = todayEvents.filter(event => event.type === 'PushEvent');

  return (
    <div className="fixed bottom-4 left-4 bg-black/95 text-white p-4 rounded-lg text-xs max-w-lg max-h-96 overflow-auto z-50 shadow-2xl border border-gray-600">
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-bold text-yellow-400">🐛 GitHub Data Debug</h4>
        <button 
          onClick={() => setShowDebug(false)}
          className="text-red-400 hover:text-red-300 text-lg"
        >
          ✕
        </button>
      </div>
      
      <div className="space-y-3">
        <div className="border-b border-gray-600 pb-2">
          <div className="font-semibold text-blue-400">📅 Today ({todayStr}):</div>
          <div className="ml-2 text-green-400">
            {todayEvents.length} total events, {todayPushEvents.length} push events
          </div>
          {todayPushEvents.map((event, i) => (
            <div key={i} className="ml-4 text-xs text-gray-300">
              • {event.repo?.name}: {event.payload?.size || 1} commits at {new Date(event.created_at).toLocaleTimeString()}
            </div>
          ))}
        </div>
        
        <div className="border-b border-gray-600 pb-2">
          <div className="font-semibold text-blue-400">📊 Processed Data:</div>
          <div className="ml-2">Total Events: {rawEvents?.length || 0}</div>
          <div className="ml-2">Weekly Commits: {data?.totalCommits || 0}</div>
          <div className="ml-2">Current Streak: {data?.streak || 0} days</div>
          <div className="ml-2">This Week Events: {data?.totalEventsThisWeek || 0}</div>
        </div>
        
        <div className="border-b border-gray-600 pb-2">
          <div className="font-semibold text-blue-400">⏰ Latest Events:</div>
          {rawEvents?.slice(0, 3).map((event, i) => (
            <div key={i} className="ml-2 text-xs text-gray-300">
              • {event.type} → {event.repo?.name} 
              <br />
              <span className="text-gray-400 ml-2">
                {new Date(event.created_at).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
        
        <div>
          <div className="font-semibold text-blue-400">📈 Weekly Chart:</div>
          <div className="grid grid-cols-7 gap-1 mt-1">
            {data?.weekly?.map((day, i) => (
              <div key={i} className="text-center">
                <div className="text-xs text-gray-400">{day.name}</div>
                <div className={`text-xs font-bold ${day.commits > 0 ? 'text-green-400' : 'text-gray-500'}`}>
                  {day.commits}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t border-gray-600">
          <div className="text-xs text-gray-400">
            Last API call: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.user);

  // New state for interactivity
  const [activeStatCard, setActiveStatCard] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [showAllActivity, setShowAllActivity] = useState(false);
  
  // Add state to store raw events for debugging
  const [rawEvents, setRawEvents] = useState([]);

  const loadData = async () => {
    dispatch(setLoading());

    try {
      console.log("🔄 Loading GitHub data at:", new Date().toLocaleString());
      
      // Use your existing API with enhanced data fetching
      const githubData = await fetchAllGitHubData();
      const { events, user, repos } = githubData;

      // Store raw events for debugging
      setRawEvents(events || []);

      // Enhanced logging
      console.log("📡 Raw Events Count:", events?.length);
      console.log("📡 First 5 Events:", events?.slice(0, 5));
      console.log("👤 User Data:", user);
      console.log("📁 Repos Count:", repos?.length);
      
      // Check today's events specifically
      const today = new Date().toDateString();
      const todayEvents = events?.filter(event => {
        const eventDate = new Date(event.created_at);
        return eventDate.toDateString() === today;
      }) || [];
      
      console.log(`📅 Today's Events (${today}):`, todayEvents);
      
      // Check recent push events specifically
      const recentPushEvents = events?.filter(event => {
        const eventDate = new Date(event.created_at);
        const hoursSinceEvent = (new Date() - eventDate) / (1000 * 60 * 60);
        return event.type === 'PushEvent' && hoursSinceEvent < 24;
      }) || [];
      
      console.log("📦 Recent Push Events (last 24h):", recentPushEvents);

      // Calculate all the dynamic statistics
      const activityStats = calculateActivityStats(events);
      const repoStats = calculateRepoStats(repos);
      const contributionData = getContributionData(events);

      console.log("📈 Activity Stats:", activityStats);
      console.log("🏆 Repo Stats:", repoStats);

      const formattedData = {
        // Your existing formatted data
        weekly: formatWeeklyCommits(events),
        streak: getCurrentStreak(events),
        recent: getRecentActivity(events),

        // Real dynamic user data from GitHub API
        followers: user?.followers || 0,
        following: user?.following || 0,
        totalRepos: user?.public_repos || repoStats.totalRepos,
        totalStars: repoStats.totalStars,
        totalForks: repoStats.totalForks,
        languagesUsed: repoStats.languagesUsed,

        // Real dynamic activity data
        totalCommits: activityStats.totalCommitsThisWeek,
        totalCommitsMonth: activityStats.totalCommitsThisMonth,
        uniqueReposThisWeek: activityStats.uniqueReposThisWeek,
        totalEventsThisWeek: activityStats.totalEventsThisWeek,

        // Real profile data
        username: user?.login || "jyotsna-jha",
        name: user?.name || "Jyotsna Jha",
        avatarUrl: user?.avatar_url || "",
        bio: user?.bio || "",
        location: user?.location || "",
        company: user?.company || "",
        blogUrl: user?.blog || "",
        twitterUsername: user?.twitter_username || "",

        // Additional calculated metrics
        avgCommitsPerDay: activityStats.avgCommitsPerDay,
        mostActiveRepo: activityStats.mostActiveRepo,
        contributionData: contributionData,

        // Repository insights
        forkedRepos: repoStats.forkedRepos,
        originalRepos: repoStats.originalRepos,
        privateRepos: repoStats.privateRepos,

        // Account creation and activity
        joinedDate: user?.created_at
          ? new Date(user.created_at).getFullYear()
          : null,
        lastUpdate: user?.updated_at || null,
        
        // Debug info
        totalRawEvents: events?.length || 0,
        todayEventsCount: todayEvents.length,
        lastEventDate: events?.[0]?.created_at || null,
      };

      console.log("✅ Final Formatted Data:", formattedData);
      dispatch(setData(formattedData));
    } catch (err) {
      console.error("❌ Error in loadData:", err);
      dispatch(setError(err.message));
    }
  };

  useEffect(() => {
    loadData();
  }, [dispatch]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const handleRefresh = () => {
    console.log("🔄 Manual refresh triggered");
    loadData();
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
          <div className="text-6xl mb-4">😞</div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        darkMode ? "dark" : ""
      }`}
    >
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-8">
          {/* Enhanced Header with controls */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Header />
              {/*  {data?.avatarUrl && (
                <img 
                  src={data.avatarUrl} 
                  alt="Profile" 
                  className="w-16 h-16 rounded-full border-4 border-white dark:border-gray-700 shadow-lg"
                />
              )} */}
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-3 rounded-xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200 dark:border-gray-700"
              >
                {darkMode ? "☀️" : "🌙"}
              </button>
              <button
                onClick={handleRefresh}
                className="group relative p-3 rounded-full border border-[#2e86de]/30 hover:border-[#2e86de] bg-transparent hover:bg-[#2e86de]/5 transition-all duration-300 overflow-hidden"
              >
                <svg
                  className="w-5 h-5 text-[#2e86de] group-hover:rotate-180 transition-transform duration-500"
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
                <div className="absolute inset-0 rounded-full bg-[#2e86de]/20 scale-0 group-hover:scale-100 transition-transform duration-300"></div>
              </button>
            </div>
          </div>

          {/* Quick Stats with Real Data */}
          <QuickStats data={data} />

          {/* Enhanced Stats Cards with flowing layout */}
          <div className="relative mb-24">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#2e86de]/5 via-transparent to-[#2e86de]/5 rounded-3xl blur-3xl"></div>

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
                trend={
                  data?.totalCommits > 0
                    ? Math.round(
                        (data.totalCommits / data.totalCommitsMonth) * 100
                      )
                    : 0
                }
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
                trend={data?.streak >= 7 ? 25 : data?.streak > 0 ? 8 : 0}
                onClick={() =>
                  setActiveStatCard(
                    activeStatCard === "streak" ? null : "streak"
                  )
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
                trend={
                  data?.totalEventsThisWeek > 0
                    ? Math.round((data.totalEventsThisWeek / 20) * 100)
                    : 0
                }
                onClick={() =>
                  setActiveStatCard(
                    activeStatCard === "activity" ? null : "activity"
                  )
                }
                isActive={activeStatCard === "activity"}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Chart Section */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                    Weekly Activity
                  </h2>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span>Last 7 days</span>
                    </div>
                    {data?.totalCommits > 0 && (
                      <div className="text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full">
                        {data.totalCommits} total commits
                      </div>
                    )}
                  </div>
                </div>
                <ActivityChart data={data?.weekly} />
              </div>

              {/* Contribution Heatmap with Real Data */}
              <ContributionHeatmap contributionData={data?.contributionData} />
            </div>

            {/* Activity Feed */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 sticky top-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                    Recent Activity
                  </h2>
                  {data?.recent && data.recent.length > 5 && (
                    <button
                      onClick={() => setShowAllActivity(!showAllActivity)}
                      className="text-blue-500 hover:text-blue-600 text-sm font-medium transition-colors duration-200"
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

              {/* Additional Profile Info */}
              {(data?.bio || data?.location || data?.company) && (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 mt-6">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                    Profile Info
                  </h3>
                  <div className="space-y-3">
                    {data.bio && (
                      <div className="flex items-start space-x-2">
                        <span className="text-gray-400">💭</span>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {data.bio}
                        </p>
                      </div>
                    )}
                    {data.location && (
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-400">📍</span>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {data.location}
                        </p>
                      </div>
                    )}
                    {data.company && (
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-400">🏢</span>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {data.company}
                        </p>
                      </div>
                    )}
                    {data.joinedDate && (
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-400">📅</span>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Joined GitHub in {data.joinedDate}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer with real stats */}
          <div className="mt-12 text-center">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {data?.totalStars || 0}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Total Stars
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {data?.totalForks || 0}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Total Forks
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {data?.languagesUsed || 0}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Languages
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {data?.originalRepos || 0}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Original Repos
                </p>
              </div>
            </div>

            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Powered by GitHub API • Updated in real-time • Built with ❤️
            </p>
            {data?.lastUpdate && (
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Last updated: {new Date(data.lastUpdate).toLocaleString()}
              </p>
            )}
          </div>
        </div>

        {/* Debug Component - Remove after debugging */}
        <DebugInfo data={data} rawEvents={rawEvents} />

        <style jsx>{`
          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-fade-in {
            animation: fade-in 0.5s ease-out forwards;
            opacity: 0;
          }
        `}</style>
      </div>
    </div>
  );
}