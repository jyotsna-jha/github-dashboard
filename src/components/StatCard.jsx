import { motion } from "framer-motion";

export default function StatCard({ title, value, subtitle, icon, trend, onClick, isActive }) {
  // Calculate progress percentage for circular progress (assuming max 100 for demo)
  const progressPercentage = Math.min((parseInt(value) / 100) * 100, 100);
  const circumference = 2 * Math.PI * 45; // radius = 45
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;

  return (
    <motion.div 
      className={`group cursor-pointer p-6 border border-gray-700 rounded-xl bg-gray-900/50 backdrop-blur-sm transition-all duration-300 ${
        isActive ? 'border-[#2e86de] shadow-lg shadow-[#2e86de]/20' : 'hover:border-gray-600'
      }`}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -2 }}
    >
      {/* Header with icon and title */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`text-xl ${isActive ? 'text-[#2e86de]' : 'text-gray-400 group-hover:text-[#2e86de]'} transition-colors duration-300`}>
            {icon}
          </div>
          <div>
            <h3 className={`font-semibold ${isActive ? 'text-[#2e86de]' : 'text-white group-hover:text-[#2e86de]'} transition-colors duration-300`}>
              {title}
            </h3>
            {subtitle && (
              <p className="text-sm text-gray-400">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex items-center justify-between">
        
        {/* Large value */}
        <motion.div 
          className={`text-4xl font-bold ${isActive ? 'text-[#2e86de]' : 'text-white group-hover:text-[#2e86de]'} transition-colors duration-300`}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {value}
        </motion.div>

        {/* Circular progress indicator */}
        <div className="relative w-20 h-20">
          <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="6"
              fill="transparent"
              className="text-gray-700"
            />
            {/* Progress circle */}
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="6"
              fill="transparent"
              strokeLinecap="round"
              className={isActive ? 'text-[#2e86de]' : 'text-orange-500 group-hover:text-[#2e86de]'}
              style={{
                strokeDasharray: circumference,
              }}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: strokeDashoffset }}
              transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
            />
          </svg>
          
          {/* Center content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.span 
              className={`text-lg font-bold ${isActive ? 'text-[#2e86de]' : 'text-white group-hover:text-[#2e86de]'} transition-colors duration-300`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 1.2 }}
            >
              {Math.round(progressPercentage)}%
            </motion.span>
          </div>
        </div>
      </div>

      {/* Bottom section with trend */}
      {trend > 0 && (
        <motion.div 
          className="mt-4 pt-4 border-t border-gray-700"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.8 }}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Growth</span>
            <div className={`flex items-center space-x-1 text-sm font-medium ${
              isActive ? 'text-[#2e86de]' : 'text-green-400 group-hover:text-[#2e86de]'
            } transition-colors duration-300`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
              </svg>
              <span>+{trend}%</span>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}