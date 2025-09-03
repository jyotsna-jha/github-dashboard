export default function QuickStats({ data }) {
  const stats = [
    { label: "Repos", value: data?.totalRepos || 0, icon: "📁" },
    { label: "Followers", value: data?.followers || 0, icon: "👥" },
    { label: "Following", value: data?.following || 0, icon: "❤️" },
    { label: "Commits", value: data?.totalCommits || 0, icon: "⚡" }
  ];

  return (
    <div className="flex flex-wrap justify-end gap-4 mb-20">
      {stats.map((stat, index) => (
        <div 
          key={stat.label}
          className="group inline-flex items-center space-x-3 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-full px-5 py-3 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer"
        >
          <span className="text-lg group-hover:animate-bounce">
            {stat.icon}
          </span>
          <div className="text-center">
            <div className="text-lg font-bold text-[#2e86de] group-hover:text-[#1e6fb8] transition-colors duration-300">
              {stat.value.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 -mt-1">
              {stat.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
