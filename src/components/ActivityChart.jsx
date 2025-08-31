import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

// Enhanced tooltip with your blue theme
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const value = payload[0].value;
    const getCommitEmoji = (commits) => {
      if (commits >= 10) return "🔥";
      if (commits >= 5) return "💪";
      if (commits >= 1) return "⭐";
      return "💤";
    };

    return (
      <div className="bg-[#2e86de]/95 backdrop-blur-sm text-white px-4 py-3 rounded-lg shadow-2xl">
        <div className="flex items-center space-x-2 mb-1">
          <span className="text-lg">{getCommitEmoji(value)}</span>
          <p className="font-semibold text-white">{label}</p>
        </div>
        <p className="text-blue-100 text-sm">
          {value} {value === 1 ? 'commit' : 'commits'}
        </p>
      </div>
    );
  }
  return null;
};

export default function ActivityChart({ data }) {
  // Your blue theme colors
  const getBarColor = (commits) => {
    if (commits === 0) return '#e5e7eb';
    if (commits >= 10) return '#2e86de';
    if (commits >= 5) return '#3498db';
    if (commits >= 3) return '#74b9ff';
    return '#a4c8f0';
  };

  const totalCommits = data?.reduce((sum, day) => sum + day.commits, 0) || 0;
  const avgCommits = totalCommits > 0 ? (totalCommits / 7).toFixed(1) : 0;

  return (
    <div className="relative">
      {/* Floating stats */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-[#2e86de]/10 px-3 py-1 rounded-full">
            <div className="w-2 h-2 bg-[#2e86de] rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-[#2e86de]">Live Data</span>
          </div>
        </div>
        
        {totalCommits > 0 && (
          <div className="text-right">
            <div className="text-2xl font-bold text-[#2e86de]">{totalCommits}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">total commits</div>
          </div>
        )}
      </div>

      {/* Clean chart container */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50/50 to-blue-50/30 dark:from-gray-900/50 dark:to-gray-800/50 p-1">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
              <XAxis 
                dataKey="name" 
                stroke="currentColor"
                className="text-gray-500 dark:text-gray-400"
                tick={{ fontSize: 12, fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                stroke="currentColor"
                className="text-gray-500 dark:text-gray-400"
                tick={{ fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="commits" 
                radius={[8, 8, 0, 0]}
              >
                {data?.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={getBarColor(entry.commits)}
                    className="hover:opacity-80 transition-all duration-300 cursor-pointer hover:drop-shadow-lg"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Interactive day indicators */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-600 dark:text-gray-400">Daily:</span>
          <div className="flex space-x-2">
            {data?.map((day, index) => (
              <div 
                key={index}
                className="group relative"
                title={`${day.name}: ${day.commits} commits`}
              >
                <div className={`w-4 h-4 rounded-full transition-all duration-300 cursor-pointer ${
                  day.commits > 0 
                    ? 'bg-[#2e86de] hover:bg-[#1e6fb8] hover:scale-125 shadow-md' 
                    : 'bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500'
                }`}>
                  {day.commits > 0 && (
                    <div className="absolute inset-0 bg-[#2e86de] rounded-full animate-ping opacity-50 group-hover:opacity-75"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {avgCommits > 0 && (
          <div className="flex items-center space-x-2 text-[#2e86de]">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span className="text-sm font-semibold">{avgCommits}/day avg</span>
          </div>
        )}
      </div>
    </div>
  );
}