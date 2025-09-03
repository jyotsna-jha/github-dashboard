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

  // Beautiful animation variants
  const containerVariants = {
    hidden: { 
      opacity: 0, 
      y: 60,
      scale: 0.9,
      rotateX: -15
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
        staggerChildren: 0.15
      }
    },
    hover: {
      y: -8,
      scale: 1.02,
      rotateY: 2,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    tap: {
      scale: 0.98,
      y: -2
    }
  };

  const childVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      x: -10
    },
    visible: { 
      opacity: 1, 
      y: 0,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const valueVariants = {
    hidden: { 
      scale: 0.5, 
      opacity: 0,
      rotateY: -90
    },
    visible: { 
      scale: 1, 
      opacity: 1,
      rotateY: 0,
      transition: {
        duration: 0.8,
        delay: 0.3,
        ease: "backOut"
      }
    },
    hover: {
      scale: 1.1,
      rotateY: 5,
      transition: {
        duration: 0.3
      }
    }
  };

  const iconVariants = {
    hidden: { 
      scale: 0, 
      rotate: -180,
      opacity: 0
    },
    visible: { 
      scale: 1, 
      rotate: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        delay: 0.2,
        ease: "backOut"
      }
    },
    hover: {
      rotate: 360,
      scale: 1.2,
      transition: {
        duration: 0.8,
        ease: "easeInOut"
      }
    }
  };

  const progressVariants = {
    hidden: { 
      scale: 0,
      opacity: 0,
      rotate: -90
    },
    visible: { 
      scale: 1,
      opacity: 1,
      rotate: 0,
      transition: {
        duration: 0.8,
        delay: 0.5,
        ease: "backOut"
      }
    },
    hover: {
      rotate: 10,
      scale: 1.05,
      transition: {
        duration: 0.4
      }
    }
  };

  const trendVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.8
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: 0.8,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.1,
      y: -2,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <motion.div 
      className={`group cursor-pointer p-6 border rounded-xl bg-gray-900/50 backdrop-blur-sm transition-all duration-300 ${
        isActive 
          ? 'border-[#2e86de] shadow-lg shadow-[#2e86de]/20' 
          : 'hover:border-gray-600'
      } ${
        isClickable ? 'cursor-pointer hover:shadow-md' : 'cursor-default'
      }`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      whileHover={isClickable ? "hover" : {}}
      whileTap={isClickable ? "tap" : {}}
      {...containerProps}
    >
      {/* Header */}
      <motion.div 
        className="flex items-center justify-between mb-4"
        variants={childVariants}
      >
        <div className="flex items-center space-x-3">
          <motion.div 
            className={`text-xl transition-colors duration-300 ${
              isActive 
                ? 'text-[#2e86de]' 
                : 'text-gray-400 group-hover:text-[#2e86de]'
            }`}
            variants={iconVariants}
            whileHover="hover"
          >
            {icon}
          </motion.div>
          <motion.div variants={childVariants}>
            <motion.h3 
              className={`font-semibold transition-colors duration-300 ${
                isActive 
                  ? 'text-[#2e86de]' 
                  : 'text-white group-hover:text-[#2e86de]'
              }`}
              whileHover={{
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
            >
              {title}
            </motion.h3>
            {subtitle && (
              <motion.p 
                className="text-sm text-gray-400"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
              >
                {subtitle}
              </motion.p>
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div 
        className="flex items-center justify-between"
        variants={childVariants}
      >
        {/* Value */}
        <motion.div 
          className={`text-4xl font-bold transition-colors duration-300 ${
            isActive 
              ? 'text-[#2e86de]' 
              : 'text-white group-hover:text-[#2e86de]'
          }`}
          variants={valueVariants}
          whileHover="hover"
        >
          {value}
        </motion.div>

        {/* Optional Circular Progress */}
        {progressPercentage !== null && (
          <motion.div 
            className="relative w-20 h-20"
            variants={progressVariants}
            whileHover="hover"
          >
            <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="6"
                fill="transparent"
                className="text-gray-700"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
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
                transition={{ 
                  duration: 2, 
                  delay: 0.8, 
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.span 
                className={`text-lg font-bold transition-colors duration-300 ${
                  isActive ? 'text-[#2e86de]' : 'text-white group-hover:text-[#2e86de]'
                }`}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  duration: 0.5, 
                  delay: 1.5,
                  ease: "backOut"
                }}
                whileHover={{
                  scale: 1.2,
                  transition: { duration: 0.2 }
                }}
              >
                {Math.round(progressPercentage)}%
              </motion.span>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Trend Section */}
      {typeof trend === 'number' && (
        <motion.div 
          className="mt-4 pt-4 border-t border-gray-700"
          variants={trendVariants}
          whileHover="hover"
        >
          <div className="flex items-center justify-between">
            <motion.span 
              className="text-sm text-gray-400"
              whileHover={{
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
            >
              Trend
            </motion.span>
            <motion.div 
              className={`flex items-center space-x-1 text-sm font-medium transition-colors duration-300 ${
                isActive 
                  ? 'text-[#2e86de]' 
                  : trendPositive 
                    ? 'text-green-400' 
                    : trendNegative 
                      ? 'text-red-400' 
                      : 'text-gray-400'
              } group-hover:text-[#2e86de]`}
              whileHover={{
                scale: 1.1,
                x: 5,
                transition: { duration: 0.2 }
              }}
            >
              {trendPositive && (
                <motion.svg 
                  className="w-4 h-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1 }}
                  whileHover={{
                    rotate: 10,
                    scale: 1.2,
                    transition: { duration: 0.2 }
                  }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
                </motion.svg>
              )}
              {trendNegative && (
                <motion.svg 
                  className="w-4 h-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1 }}
                  whileHover={{
                    rotate: -10,
                    scale: 1.2,
                    transition: { duration: 0.2 }
                  }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 7l-9.2 9.2M7 7v10h10" />
                </motion.svg>
              )}
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 1.1 }}
              >
                {trend > 0 ? '+' : ''}{trend}%
              </motion.span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}