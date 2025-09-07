import React, { useEffect, useState, useContext } from "react";
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

export default function App() {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.user);
  
  // Use theme from context instead of local state
  const { darkMode } = useContext(ThemeContext);

  // New state for interactivity
  const [activeStatCard, setActiveStatCard] = useState(null);
  const [showAllActivity, setShowAllActivity] = useState(false);

  // Add state to store raw events for debugging
  const [rawEvents, setRawEvents] = useState([]);
  // Add state to store user data separately
  const [userData, setUserData] = useState(null);

  const loadData = async () => {
    dispatch(setLoading());

    try {
      console.log("🔄 Loading GitHub data at:", new Date().toLocaleString());

      // Use your existing API with enhanced data fetching
      const githubData = await fetchAllGitHubData();
      const { events, user, repos } = githubData;

      // Store raw events for debugging
      setRawEvents(events || []);
      // Store user data for Header
      setUserData(user || null);

      // Enhanced logging
      console.log("📡 Raw Events Count:", events?.length);
      console.log("📡 First 5 Events:", events?.slice(0, 5));
      console.log("👤 User Data:", user);
      console.log("📁 Repos Count:", repos?.length);

      // Check today's date
      const today = new Date().toDateString();
      console.log("📅 Today's date:", today);

      // Filter events from today
      const todayEvents =
        events?.filter((event) => {
          const eventDate = new Date(event.created_at);
          return eventDate.toDateString() === today;
        }) || [];

      console.log(`📅 Today's Events (${today}):`, todayEvents);

      // Filter only PushEvents from today (actual commits)
      const todayPushEvents = todayEvents.filter(
        (event) => event.type === "PushEvent"
      );

      // Sum up the number of commits using payload.size
      const todayCommits = todayPushEvents.reduce(
        (sum, event) => sum + (event.payload?.size || 1),
        0
      );

      console.log("📦 Today's commits count:", todayCommits);

      // Calculate all the dynamic statistics
      const activityStats = calculateActivityStats(events);
      const repoStats = calculateRepoStats(repos);
      const contributionData = getContributionData(events);

      console.log("📈 Activity Stats:", activityStats);
      console.log("🏆 Repo Stats:", repoStats);

      // Final formatted data
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
        todayCommits,
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

    // Set up interval for real-time updates (every 5 minutes)
    const intervalId = setInterval(loadData, 5 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [dispatch]);

  const handleRefresh = () => {
    console.log("🔄 Manual refresh triggered");
    loadData();
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center transition-colors duration-300">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="text-6xl mb-4">😞</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen transition-colors duration-300 bg-gray-100 dark:bg-gray-900">
      {/* Add padding-top to account for fixed header */}
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-8 pt-32">
        {/* Enhanced Header with controls */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Header 
              todayCommits={data?.todayCommits || 0} 
              onRefresh={handleRefresh}
              userData={userData}
            />
          </div>
        </div>

        {/* Quick Stats with Real Data */}
        <QuickStats data={data} />

        {/* Enhanced Stats Cards with flowing layout */}
        <div className="relative mb-24" id="stats">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/5 via-transparent to-blue-900/5 rounded-3xl blur-3xl"></div>

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
        
        <div id="goal-tracker">
          <GoalTracker />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chart Section */}
          <div className="lg:col-span-2" id="weekly-activity">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8 transition-colors duration-300">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Weekly Activity
                </h2>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
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
          <div className="lg:col-span-1" id="recent-activity">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 sticky top-8 transition-colors duration-300">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Recent Activity
                </h2>
                {data?.recent && data.recent.length > 5 && (
                  <button
                    onClick={() => setShowAllActivity(!showAllActivity)}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 text-sm font-medium transition-colors duration-200"
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
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 mt-6 transition-colors duration-300">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Profile Info
                </h3>
                <div className="space-y-3">
                  {data.bio && (
                    <div className="flex items-start space-x-2">
                      <span className="text-gray-500 dark:text-gray-400">💭</span>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {data.bio}
                      </p>
                    </div>
                  )}
                  {data.location && (
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-500 dark:text-gray-400">📍</span>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {data.location}
                      </p>
                    </div>
                  )}
                  {data.company && (
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-500 dark:text-gray-400">🏢</span>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {data.company}
                      </p>
                    </div>
                  )}
                  {data.joinedDate && (
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-500 dark:text-gray-400">📅</span>
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
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Stars
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {data?.totalForks || 0}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Forks
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {data?.languagesUsed || 0}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Languages
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {data?.originalRepos || 0}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Original Repos
              </p>
            </div>
          </div>

          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Powered by GitHub API • Updated in real-time • Built with ❤️
          </p>
          {data?.lastUpdate && (
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              Last updated: {new Date(data.lastUpdate).toLocaleString()}
            </p>
          )}
        </div>
      </div>

      {/* Floating Action Button - Share Button */}
      <ShareButton statsData={data} />

      {/* Add scroll-margin-top to all sections for proper offset */}
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

        /* Add scroll offset for fixed header */
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