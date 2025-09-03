// src/components/GoalTracker.jsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setWeeklyGoal } from "../store/userSlice";

export default function GoalTracker() {
  const dispatch = useDispatch();
  const { weeklyGoal } = useSelector((state) => state.user);
  const totalCommits = useSelector((state) => state.user.data?.totalCommits || 0);
  const streak = useSelector((state) => state.user.data?.streak || 0);
  const avgCommitsPerDay = useSelector((state) => state.user.data?.avgCommitsPerDay || 0);

  const [isEditing, setIsEditing] = useState(false);
  const [goalInput, setGoalInput] = useState(weeklyGoal);

  const progress = Math.min((totalCommits / weeklyGoal) * 100, 100);
  const daysRemaining = 7 - new Date().getDay();
  const dailyTarget = weeklyGoal > 0 ? Math.ceil((weeklyGoal - totalCommits) / Math.max(daysRemaining, 1)) : 0;

  const handleSetGoal = () => {
    if (goalInput > 0) {
      dispatch(setWeeklyGoal(goalInput));
      setIsEditing(false);
    }
  };

  const getProgressColor = () => {
    if (progress === 100) return "from-emerald-400 to-green-500";
    if (progress >= 75) return "from-cyan-400 to-blue-500";
    if (progress >= 50) return "from-blue-400 to-indigo-500";
    if (progress >= 25) return "from-indigo-400 to-purple-500";
    return "from-slate-400 to-gray-500";
  };

  const getStatusEmoji = () => {
    if (progress === 100) return "🏆";
    if (progress >= 75) return "🔥";
    if (progress >= 50) return "💪";
    if (progress >= 25) return "📈";
    return "🎯";
  };

  const getMessage = () => {
    if (progress === 100) return "Goal crushed! Amazing work!";
    if (progress >= 75) return "Almost there! Keep pushing!";
    if (progress >= 50) return "Great progress! You got this!";
    return "Let's code and make progress!";
  };

  return (
    <div className="w-full px-4 md:px-6 py-6">
      
      {/* Header Section - Responsive Left & Right Layout */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 border-b border-gray-700/50 pb-4">
        <div className="flex items-center gap-3 mb-4 md:mb-0">
          <span className="text-2xl md:text-3xl animate-pulse">{getStatusEmoji()}</span>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-white font-poppins">Weekly Coding Goal</h1>
            <p className="text-sm text-gray-400 font-montserrat mt-1">
              {daysRemaining} days left • {getMessage()}
            </p>
          </div>
        </div>
        
        <div className="text-left md:text-right">
          <div className="text-gray-400 text-xs font-montserrat mb-1">Current Target</div>
          <div className="text-lg md:text-xl font-bold text-white font-montserrat mb-2">{weeklyGoal} commits</div>
         <button
  onClick={() => setIsEditing(!isEditing)}
  className={`${
    isEditing 
      ? 'bg-gray-600 hover:bg-gray-700' 
      : 'bg-blue-500 hover:bg-blue-600'
  } text-white px-4 py-2 rounded-lg transition-colors duration-200 font-poppins text-xs md:text-sm`}
>
  {isEditing ? 'Cancel ✕' : 'Update Goal ✏️'}
</button>
        </div>
      </div>

      {/* Goal Setting Row - Animated Slide */}
      {isEditing && (
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 py-4 border-b border-blue-500/30 bg-blue-900/10 rounded-lg px-4 animate-slideDown">
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-bold text-white font-poppins mb-2">🎯 Set New Goal</h3>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={goalInput}
                onChange={(e) => setGoalInput(Number(e.target.value))}
                placeholder="Enter..."
                className="w-24 px-3 py-2 bg-gray-800/50 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-montserrat text-sm hover:bg-gray-700/50"
                min="1"
                max="100"
                autoFocus
              />
              <span className="text-gray-400 font-montserrat text-sm">commits/week</span>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
            <div className="flex gap-2">
              {[7, 14, 21, 30].map((preset) => (
                <button
                  key={preset}
                  onClick={() => setGoalInput(preset)}
                  className={`px-3 py-1 rounded-lg text-xs transition-all duration-200 font-montserrat transform hover:scale-105 ${
                    goalInput === preset 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 hover:text-white'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
            <button
              onClick={handleSetGoal}
              disabled={!goalInput || goalInput <= 0}
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 font-poppins disabled:opacity-50 disabled:cursor-not-allowed text-sm shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Set Goal 🚀
            </button>
          </div>
        </div>
      )}

      {/* Main Progress Section - Responsive */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
        <div className="flex-1 lg:max-w-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm md:text-base font-medium text-gray-300 font-poppins">Progress</span>
            <span className="text-xl md:text-2xl font-bold text-blue-300 font-poppins animate-pulse">{Math.round(progress)}%</span>
          </div>
          
          <div className="w-full bg-gray-700/30 rounded-full h-4 md:h-5 mb-3 overflow-hidden shadow-inner">
            <div
              className={`h-full bg-gradient-to-r ${getProgressColor()} transition-all duration-1000 ease-out shadow-lg animate-pulse`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between text-xs md:text-sm text-gray-400 font-montserrat">
            <span>{totalCommits} commits done</span>
            <span>{weeklyGoal - totalCommits > 0 ? `${weeklyGoal - totalCommits} more needed` : 'Goal achieved!'}</span>
          </div>
        </div>
        
        <div className="lg:ml-8 text-left lg:text-right">
          {goalInput > 0 && isEditing && (
            <div className="mb-3 text-gray-400 font-montserrat text-xs">
              ≈ {Math.ceil(goalInput / 7)} commits/day
            </div>
          )}
          {progress === 100 && (
            <div className="bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-300 px-3 py-2 rounded-lg font-poppins font-bold text-sm animate-bounce">
              🎉 ACHIEVED! 🎉
            </div>
          )}
        </div>
      </div>

      {/* Stats Row - Responsive Horizontal Layout */}
      <div className="flex flex-col md:flex-row md:items-center justify-between py-4 border-t border-gray-700/50 gap-4">
        <div className="flex items-center justify-between md:justify-start md:gap-6 lg:gap-8">
          <div className="text-center group cursor-pointer">
            <div className="text-xl md:text-2xl font-bold text-blue-400 font-poppins group-hover:text-blue-300 transition-colors">{totalCommits}</div>
            <div className="text-xs text-gray-400 font-montserrat mt-1">This Week</div>
          </div>
          <div className="w-px h-8 bg-gray-700/50 hidden md:block"></div>
          <div className="text-center group cursor-pointer">
            <div className="text-xl md:text-2xl font-bold text-green-400 font-poppins group-hover:text-green-300 transition-colors">{streak}</div>
            <div className="text-xs text-gray-400 font-montserrat mt-1">Streak</div>
          </div>
          <div className="w-px h-8 bg-gray-700/50 hidden md:block"></div>
          <div className="text-center group cursor-pointer">
            <div className="text-xl md:text-2xl font-bold text-yellow-400 font-poppins group-hover:text-yellow-300 transition-colors">{avgCommitsPerDay}</div>
            <div className="text-xs text-gray-400 font-montserrat mt-1">Avg/Day</div>
          </div>
        </div>
        
        <div className="text-center md:text-right">
          <div className="text-gray-400 text-xs font-montserrat mb-1">Daily Target</div>
          <div className="text-xl md:text-2xl font-bold text-purple-400 font-poppins">{dailyTarget}</div>
          <div className="text-xs text-gray-500 font-montserrat mt-1">needed/day</div>
        </div>
      </div>

      {/* Bottom Message - Dynamic */}
      <div className="text-center py-3">
        <p className="text-sm md:text-base text-gray-300 font-montserrat">
          {progress < 100 && (
            <span className="animate-pulse">
              Keep going! You need <span className="font-bold text-blue-400">{weeklyGoal - totalCommits}</span> more commits 💪
            </span>
          )}
          {progress === 100 && (
            <span className="animate-pulse">
              Incredible work this week! Ready for next week's challenge? 🌟
            </span>
          )}
        </p>
      </div>

      {/* Week Progress Dots */}
      <div className="flex justify-center gap-2 mt-4">
        {Array.from({length: 7}, (_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i < (7 - daysRemaining) 
                ? 'bg-blue-500 shadow-lg animate-pulse' 
                : 'bg-gray-600/50'
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
}