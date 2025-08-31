export default function RecentActivity({ activities = [] }) {
  return (
    <div className="space-y-3">
      {activities.length === 0 ? (
        <p className="text-gray-500">No recent activity</p>
      ) : (
        activities.map((act, i) => (
          <div key={i} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="font-medium">
              {act.type}: <span className="text-blue-600">{act.repo}</span>
            </p>
            <p className="text-sm text-gray-500">{act.createdAt}</p>
          </div>
        ))
      )}
    </div>
  );
}