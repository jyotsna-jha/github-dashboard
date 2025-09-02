import { motion } from "framer-motion";
import React from 'react';

export default function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon, 
  trend, 
  onClick, 
  isActive,
  progress // Optional: explicit progress (0-100), fallback to value if number
}) {
  const isClickable = !!onClick;

  // Parse value for progress
  const numericValue = typeof value === 'number' ? value : parseFloat(value);
  const hasNumericValue = !isNaN(numericValue);

  // Determine progress percentage
  const progressPercentage = !isNaN(progress) 
    ? Math.min(Math.max(progress, 0), 100)
    : hasNumericValue 
      ? Math.min(Math.max(numericValue, 0), 100)
      : null;

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - ((progressPercentage || 0) / 100) * circumference;

  // Determine trend icon and color
  const trendPositive = typeof trend === 'number' && trend > 0;
  const trendNegative = typeof trend === 'number' && trend < 0;

  const containerProps = isClickable
    ? {
        role: 'button',
        tabIndex: 0,
        onClick,
        onKeyDown: (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onClick?.();
            e.preventDefault();
          }
        },
      }
    : {};

  return (
    <motion.div 
      className={`group cursor-pointer p-6 border rounded-xl bg-gray-900/50 backdrop-blur-sm transition-all duration-300 ${
        isActive 
          ? 'border-[#2e86de] shadow-lg shadow-[#2e86de]/20' 
          : 'hover:border-gray-600'
      } ${
        isClickable ? 'cursor-pointer hover:shadow-md' : 'cursor-default'
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={isClickable ? { y: -2 } : {}}
      {...containerProps}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`text-xl transition-colors duration-300 ${
            isActive 
              ? 'text-[#2e86de]' 
              : 'text-gray-400 group-hover:text-[#2e86de]'
          }`}>
            {icon}
          </div>
          <div>
            <h3 className={`font-semibold transition-colors duration-300 ${
              isActive 
                ? 'text-[#2e86de]' 
                : 'text-white group-hover:text-[#2e86de]'
            }`}>
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

      {/* Main Content */}
      <div className="flex items-center justify-between">
        {/* Value */}
        <motion.div 
          className={`text-4xl font-bold transition-colors duration-300 ${
            isActive 
              ? 'text-[#2e86de]' 
              : 'text-white group-hover:text-[#2e86de]'
          }`}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {value}
        </motion.div>

        {/* Optional Circular Progress */}
        {progressPercentage !== null && (
          <div className="relative w-20 h-20">
            <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="6"
                fill="transparent"
                className="text-gray-700"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="6"
                fill="transparent"
                strokeLinecap="round"
                className={isActive ? 'text-[#2e86de]' : 'text-orange-500 group-hover:text-[#2e86de]'}
                style={{ strokeDasharray: circumference }}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.span 
                className={`text-lg font-bold transition-colors duration-300 ${
                  isActive ? 'text-[#2e86de]' : 'text-white group-hover:text-[#2e86de]'
                }`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 1.2 }}
              >
                {Math.round(progressPercentage)}%
              </motion.span>
            </div>
          </div>
        )}
      </div>

      {/* Trend Section */}
      {typeof trend === 'number' && (
        <motion.div 
          className="mt-4 pt-4 border-t border-gray-700"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.8 }}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Trend</span>
            <div className={`flex items-center space-x-1 text-sm font-medium transition-colors duration-300 ${
              isActive 
                ? 'text-[#2e86de]' 
                : trendPositive 
                  ? 'text-green-400' 
                  : trendNegative 
                    ? 'text-red-400' 
                    : 'text-gray-400'
            } group-hover:text-[#2e86de]`}>
              {trendPositive && (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
                </svg>
              )}
              {trendNegative && (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 7l-9.2 9.2M7 7v10h10" />
                </svg>
              )}
              <span>{trend > 0 ? '+' : ''}{trend}%</span>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}