export default function ContributionHeatmap() {
  const weeks = 12;
  const days = 7;
  
  // Generate contribution data for the last 12 weeks
  const contributions = [];
  for (let week = 0; week < weeks; week++) {
    const weekData = [];
    for (let day = 0; day < days; day++) {
      weekData.push(Math.floor(Math.random() * 10));
    }
    contributions.push(weekData);
  }

  const getIntensity = (value) => {
    if (value === 0) return 'bg-gray-100 dark:bg-gray-800';
    if (value <= 2) return 'bg-green-200 dark:bg-green-900';
    if (value <= 5) return 'bg-green-300 dark:bg-green-700';
    if (value <= 8) return 'bg-green-400 dark:bg-green-600';
    return 'bg-green-500 dark:bg-green-500';
  };

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Contribution Activity</h3>
        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span>Last 12 weeks</span>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        {/* Month labels */}
        <div className="flex mb-2 ml-8">
          {monthLabels.slice(0, 3).map((month) => (
            <div key={month} className="flex-1 text-xs text-gray-500 dark:text-gray-400 text-center">
              {month}
            </div>
          ))}
        </div>
        
        <div className="flex">
          {/* Day labels */}
          <div className="flex flex-col mr-2">
            {dayLabels.map((day, index) => (
              <div 
                key={day} 
                className={`text-xs text-gray-500 dark:text-gray-400 h-3 mb-1 ${index % 2 === 0 ? '' : 'opacity-0'}`}
                style={{ lineHeight: '12px' }}
              >
                {index % 2 === 0 ? day : ''}
              </div>
            ))}
          </div>
          
          {/* Contribution grid */}
          <div className="grid grid-cols-12 gap-1">
            {contributions.map((week, weekIndex) =>
              week.map((day, dayIndex) => (
                <div
                  key={`${weekIndex}-${dayIndex}`}
                  className={`w-3 h-3 rounded-sm ${getIntensity(day)} hover:ring-2 hover:ring-blue-400 transition-all duration-200 cursor-pointer group relative`}
                  title={`${day} contributions`}
                >
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                    {day} contributions
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex items-center justify-between mt-6">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Less
        </div>
        <div className="flex space-x-1">
          <div className="w-3 h-3 bg-gray-100 dark:bg-gray-800 rounded-sm" />
          <div className="w-3 h-3 bg-green-200 dark:bg-green-900 rounded-sm" />
          <div className="w-3 h-3 bg-green-300 dark:bg-green-700 rounded-sm" />
          <div className="w-3 h-3 bg-green-400 dark:bg-green-600 rounded-sm" />
          <div className="w-3 h-3 bg-green-500 dark:bg-green-500 rounded-sm" />
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          More
        </div>
      </div>
      
      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {contributions.flat().reduce((sum, val) => sum + val, 0)}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Total contributions</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {contributions.flat().filter(val => val > 0).length}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Active days</p>
        </div>
      </div>
    </div>
  );
}