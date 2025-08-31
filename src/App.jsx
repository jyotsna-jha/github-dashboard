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

export default function App() {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.user);

  // New state for interactivity
  const [activeStatCard, setActiveStatCard] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [showAllActivity, setShowAllActivity] = useState(false);

  const loadData = async () => {
    dispatch(setLoading());

    try {
      // Use your existing API with enhanced data fetching
      const githubData = await fetchAllGitHubData();
      const { events, user, repos } = githubData;

      // Calculate all the dynamic statistics
      const activityStats = calculateActivityStats(events);
      const repoStats = calculateRepoStats(repos);
      const contributionData = getContributionData(events);

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
      };

      dispatch(setData(formattedData));
    } catch (err) {
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

          {/* Additional Insights Row */}
          {/* {data?.mostActiveRepo && (
  <div className="group relative inline-flex items-center space-x-2 mb-6 cursor-pointer">
    <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-[#2e86de] transition-colors duration-300">
      <span className="text-sm">🏆 Most active:</span>
      <span className="font-semibold text-[#2e86de] underline decoration-dotted underline-offset-4 decoration-[#2e86de]/50">
        {data.mostActiveRepo.name}
      </span>
      <span className="text-xs text-gray-500">({data.mostActiveRepo.commits} commits)</span>
    </div>

    <div className="absolute top-full left-0 mt-2 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 pointer-events-none z-20">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 min-w-[280px]">
        <div className="absolute -top-2 left-6 w-4 h-4 bg-white dark:bg-gray-800 border-l border-t border-gray-200 dark:border-gray-700 transform rotate-45"></div>
        
        <div className="relative">
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-2 h-2 bg-[#2e86de] rounded-full"></div>
            <h4 className="font-bold text-gray-900 dark:text-white">Repository Insights</h4>
          </div>
          
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-gray-500 dark:text-gray-400">Repository</p>
              <p className="font-semibold text-[#2e86de]">{data.mostActiveRepo.name}</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Daily Avg</p>
              <p className="font-semibold text-gray-900 dark:text-white">{data.avgCommitsPerDay}</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">This Week</p>
              <p className="font-semibold text-gray-900 dark:text-white">{data.mostActiveRepo.commits} commits</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Active Repos</p>
              <p className="font-semibold text-gray-900 dark:text-white">{data.uniqueReposThisWeek}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)} */}

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
