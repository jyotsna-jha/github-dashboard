import React, { useState } from 'react';

const ActivityIcon = ({ type, className = "w-4 h-4" }) => {
  const iconProps = className;
  
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
    case 'PullRequestEvent':
      return (
        <svg className={iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      );
    case 'Fork':
    case 'ForkEvent':
      return (
        <svg className={iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case 'Star':
    case 'WatchEvent':
      return (
        <svg className={iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      );
    case 'CreateEvent':
      return (
        <svg className={iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      );
    case 'DeleteEvent':
      return (
        <svg className={iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
    case 'PushEvent':
      return 'bg-gradient-to-br from-green-100 to-green-200 text-green-700 dark:from-green-900/50 dark:to-green-800/50 dark:text-green-300';
    case 'Issues':
    case 'IssuesEvent':
      return 'bg-gradient-to-br from-yellow-100 to-yellow-200 text-yellow-700 dark:from-yellow-900/50 dark:to-yellow-800/50 dark:text-yellow-300';
    case 'PullRequest':
    case 'PullRequestEvent':
      return 'bg-gradient-to-br from-purple-100 to-purple-200 text-purple-700 dark:from-purple-900/50 dark:to-purple-800/50 dark:text-purple-300';
    case 'Fork':
    case 'ForkEvent':
      return 'bg-gradient-to-br from-orange-100 to-orange-200 text-orange-700 dark:from-orange-900/50 dark:to-orange-800/50 dark:text-orange-300';
    case 'Star':
    case 'WatchEvent':
      return 'bg-gradient-to-br from-amber-100 to-amber-200 text-amber-700 dark:from-amber-900/50 dark:to-amber-800/50 dark:text-amber-300';
    case 'CreateEvent':
      return 'bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-700 dark:from-emerald-900/50 dark:to-emerald-800/50 dark:text-emerald-300';
    case 'DeleteEvent':
      return 'bg-gradient-to-br from-red-100 to-red-200 text-red-700 dark:from-red-900/50 dark:to-red-800/50 dark:text-red-300';
    default:
      return 'bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700 dark:from-blue-900/50 dark:to-blue-800/50 dark:text-blue-300';
  }
};

const getActivityDescription = (activity) => {
  switch (activity.type) {
    case 'Push':
    case 'PushEvent':
      return `Pushed ${activity.commits || activity.size || '1'} ${(activity.commits || activity.size || 1) === 1 ? 'commit' : 'commits'}`;
    case 'Issues':
    case 'IssuesEvent':
      return activity.action ? `${activity.action} issue` : 'Issue event';
    case 'PullRequest':
    case 'PullRequestEvent':
      return activity.action ? `${activity.action} pull request` : 'Pull request event';
    case 'Fork':
    case 'ForkEvent':
      return 'Forked repository';
    case 'Star':
    case 'WatchEvent':
      return 'Starred repository';
    case 'CreateEvent':
      return `Created ${activity.ref_type || 'repository'}`;
    case 'DeleteEvent':
      return `Deleted ${activity.ref_type || 'branch'}`;
    default:
      return `${activity.type} event`;
  }
};

const FilterButton = ({ filter, currentFilter, onClick, count }) => (
  <button
    onClick={() => onClick(filter)}
    className={`px-4 py-2 rounded-lg text-sm transition-all duration-200 relative font-poppins ${
      currentFilter === filter
        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
    }`}
  >
    {filter === 'All' ? 'All' : filter}
    {count > 0 && (
      <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
        currentFilter === filter
          ? 'bg-white/20 text-white'
          : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
      }`}>
        {count}
      </span>
    )}
  </button>
);

const ActivityCard = ({ activity, index, onExpand, isExpanded }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`group flex items-center space-x-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-gray-900/20 hover:-translate-y-0.5 animate-fade-in ${
        isExpanded ? 'ring-2 ring-blue-500/50' : ''
      }`}
      style={{ animationDelay: `${index * 100}ms` }}
      onClick={() => onExpand()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`p-3 rounded-xl shadow-sm transition-all duration-300 ${getActivityColor(activity.type)} ${
        isHovered ? 'scale-110 shadow-md' : ''
      }`}>
        <ActivityIcon type={activity.type} className="w-5 h-5" />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          <p className="font-semibold text-gray-900 dark:text-white truncate font-poppins">
            {activity.repo}
          </p>
          {activity.isPrivate && (
            <span className="px-2 py-0.5 text-xs bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400 rounded-full font-montserrat">
              Private
            </span>
          )}
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 font-montserrat">
          {getActivityDescription(activity)}
        </p>
        {isExpanded && activity.description && (
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2 animate-fade-in font-montserrat">
            {activity.description}
          </p>
        )}
      </div>
      
      <div className="flex flex-col items-end space-y-1">
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 font-montserrat">
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {activity.createdAt}
        </div>
        {activity.author && (
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 font-montserrat">
            <div className="w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mr-1"></div>
            {activity.author}
          </div>
        )}
      </div>
      
      <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`}>
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
};

export default function RecentActivity({ activities = [], showAll, onToggleShow, totalCount }) {
  const [filter, setFilter] = useState('All');
  const [expandedItem, setExpandedItem] = useState(null);
  const filteredActivities = filter === 'All' 
    ? activities 
    : activities.filter(activity => {
        const activityType = activity.type?.replace('Event', '') || activity.type;
        const filterType = filter === 'PullRequest' ? 'PullRequestEvent' : 
                          filter === 'Issues' ? 'IssuesEvent' :
                          filter === 'Push' ? 'PushEvent' :
                          filter === 'Star' ? 'WatchEvent' :
                          filter === 'Fork' ? 'ForkEvent' : filter;
        return activity.type === filterType || activityType === filter;
      });
  
  const displayedActivities = showAll ? filteredActivities : filteredActivities.slice(0, 5);
  
  const getFilterCounts = () => {
    const counts = {};
    activities.forEach(activity => {
      const activityType = activity.type?.replace('Event', '') || activity.type;
      // Map GitHub event types to our filter names
      const mappedType = activity.type === 'PushEvent' ? 'Push' :
                        activity.type === 'IssuesEvent' ? 'Issues' :
                        activity.type === 'PullRequestEvent' ? 'PullRequest' :
                        activity.type === 'WatchEvent' ? 'Star' :
                        activity.type === 'ForkEvent' ? 'Fork' :
                        activityType;
      counts[mappedType] = (counts[mappedType] || 0) + 1;
    });
    return counts;
  };

  const filterCounts = getFilterCounts();
  const filters = ['All', 'Push', 'PullRequest', 'Issues', 'Star', 'Fork'];

  if (activities.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4 animate-bounce">🌙</div>
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2 font-poppins">
          No recent activity
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-4 font-montserrat">
          Your repositories are taking a rest
        </p>
        <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 font-poppins">
          Create your first repository
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with stats */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 dark:text-gray-400 mt-1 font-montserrat">
            {filteredActivities.length} {filteredActivities.length === 1 ? 'activity' : 'activities'} found
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => onToggleShow(!showAll)}
            className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 font-poppins"
          >
            {showAll ? 'Show Less' : 'Show All'}
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* Filter buttons */}
      <div className="flex flex-wrap gap-2">
        {filters.map(filterType => (
          <FilterButton
            key={filterType}
            filter={filterType}
            currentFilter={filter}
            onClick={setFilter}
            count={filterType === 'All' ? activities.length : (filterCounts[filterType] || 0)}
          />
        ))}
      </div>

      {/* Activity list */}
      <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
        {displayedActivities.map((activity, index) => (
          <ActivityCard
            key={index}
            activity={activity}
            index={index}
            onExpand={() => setExpandedItem(expandedItem === index ? null : index)}
            isExpanded={expandedItem === index}
          />
        ))}
      </div>
      
      {/* Load more button */}
      {!showAll && filteredActivities.length > 5 && (
        <div className="text-center">
          <button
            onClick={() => onToggleShow(true)}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 font-poppins"
          >
            View {filteredActivities.length - 5} more activities
            <svg className="w-4 h-4 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% {
            transform: translateY(0);
          }
          40%, 43% {
            transform: translateY(-15px);
          }
          70% {
            transform: translateY(-7px);
          }
          90% {
            transform: translateY(-3px);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }
        
        .animate-bounce {
          animation: bounce 2s infinite;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
          border-radius: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, rgb(209, 213, 219), rgb(156, 163, 175));
          border-radius: 4px;
          border: 2px solid transparent;
          background-clip: padding-box;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, rgb(156, 163, 175), rgb(107, 114, 128));
        }
        
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, rgb(75, 85, 99), rgb(55, 65, 81));
        }
        
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, rgb(107, 114, 128), rgb(75, 85, 99));
        }
      `}</style>
    </div>
  );
}