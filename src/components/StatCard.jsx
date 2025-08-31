export default function StatCard({ title, value, subtitle, icon, trend, onClick, isActive }) {
  return (
    <div 
      className={`group relative p-6 rounded-3xl transition-all duration-500 cursor-pointer overflow-hidden ${
        isActive 
          ? 'bg-gradient-to-br from-[#2e86de]/10 via-[#2e86de]/5 to-transparent scale-105' 
          : 'bg-gradient-to-br from-white/60 via-white/40 to-transparent dark:from-gray-800/60 dark:via-gray-800/40 hover:from-[#2e86de]/5 hover:via-[#2e86de]/3'
      } backdrop-blur-sm hover:scale-102 transform`}
      onClick={onClick}
    >
      {/* Animated background glow */}
      <div className={`absolute inset-0 bg-gradient-to-r from-[#2e86de]/0 via-[#2e86de]/10 to-[#2e86de]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ${isActive ? 'opacity-50' : ''}`}></div>
      
      {/* Floating icon */}
      <div className="absolute top-4 right-4 text-4xl opacity-20 group-hover:opacity-40 group-hover:scale-110 transition-all duration-300 group-hover:rotate-12">
        {icon}
      </div>
      
      {/* Active indicator */}
      {isActive && (
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#2e86de] to-[#1e6fb8]"></div>
      )}
      
      <div className="relative z-10">
        <div className="flex items-center space-x-2 mb-2">
          <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${isActive ? 'bg-[#2e86de] animate-pulse' : 'bg-gray-400 group-hover:bg-[#2e86de]'}`}></div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-[#2e86de] transition-colors duration-300">
            {title}
          </p>
        </div>
        
        <p className={`text-3xl font-bold mb-2 transition-all duration-300 ${
          isActive 
            ? 'text-[#2e86de] scale-105' 
            : 'text-gray-900 dark:text-white group-hover:text-[#2e86de]'
        }`}>
          {value}
        </p>
        
        {subtitle && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
            {subtitle}
          </p>
        )}
        
        {trend > 0 && (
          <div className="flex items-center space-x-1 group-hover:scale-105 transition-transform duration-300">
            <svg className="w-4 h-4 text-[#2e86de] animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span className="text-sm text-[#2e86de] font-semibold">+{trend}%</span>
          </div>
        )}
      </div>
    </div>
  );
}