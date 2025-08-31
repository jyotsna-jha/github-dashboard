import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setData, setError } from "./store/userSlice";
import { fetchGitHubActivity } from "./api/githubApi";
import { formatWeeklyCommits, getCurrentStreak, getRecentActivity } from "./utils/formatData";

// Components
import Header from "./components/Header";
import StatCard from "./components/StatCard";
import ActivityChart from "./components/ActivityChart";
import RecentActivity from "./components/RecentActivity";
import LoadingSpinner from "./components/LoadingSpinner";

export default function App() {
  const dispatch = useDispatch();
  const { data, loading } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(setLoading());
    fetchGitHubActivity()
      .then((events) => {
        const formattedData = {
          weekly: formatWeeklyCommits(events),
          streak: getCurrentStreak(events),
          recent: getRecentActivity(events),
        };
        dispatch(setData(formattedData));
      })
      .catch((err) => {
        dispatch(setError(err.message));
      });
  }, [dispatch]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Header />

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Weekly Commits"
            value={data?.weekly.reduce((a, b) => a + b.commits, 0)}
            icon="📦"
          />
          <StatCard
            title="Current Streak"
            value={`${data?.streak} days`}
            subtitle={data?.streak >= 7 ? "🔥 Keep going!" : ""}
            icon="🔥"
          />
          <StatCard
            title="Recent Activity"
            value={data?.recent.length}
            icon="💬"
          />
        </div>

        {/* Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Weekly Activity
          </h2>
          <ActivityChart data={data?.weekly} />
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Recent Activity
          </h2>
          <RecentActivity activities={data?.recent} />
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Powered by GitHub API • Update every refresh
        </p>
      </div>
    </div>
  );
}