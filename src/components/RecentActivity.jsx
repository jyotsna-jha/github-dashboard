const ActivityIcon = ({ type }) => {
  const iconProps = "w-4 h-4";
  
  switch (type) {
    case 'Push':
      return (
        <svg className={iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      );
    case 'Issues':
      return (
        <svg className={iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      );
    case 'PullRequest':
      return (
        <svg className={iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      );
    default:
      return (
        <svg className={iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      );
  }
};

const getActivityColor = (type) => {
  switch (type) {
    case 'Push':
      return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
    case 'Issues':
      return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
    case 'PullRequest':
      return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300';
    default:
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
  }
};

export default function RecentActivity({ activities = [], showAll, onToggleShow, totalCount }) {
  if (activities.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-2">🌙</div>
        <p className="text-gray-500 dark:text-gray-400">No recent activity</p>
        <p className="text-sm text-gray-400 dark:text-gray-500">Check back later for updates!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
        {activities.map((activity, index) => (
          <div 
            key={index}
            className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200 animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
              <ActivityIcon type={activity.type} />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900 dark:text-white">
                {activity.repo}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {activity.type} event
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {activity.createdAt}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      {!showAll && totalCount > 5 && (
        <button
          onClick={() => onToggleShow(true)}
          className="w-full mt-4 py-3 text-blue-500 hover:text-blue-600 font-medium transition-colors duration-200 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
        >
          View {totalCount - 5} more activities
        </button>
      )}

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
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgb(209, 213, 219);
          border-radius: 3px;
        }
        
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgb(75, 85, 99);
        }
      `}</style>
    </div>
  );
}