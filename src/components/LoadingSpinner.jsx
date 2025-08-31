export default function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <div className="text-center">
        <div className="relative mb-8">
          {/* Outer ring */}
          <div className="w-20 h-20 border-4 border-blue-200 dark:border-gray-600 rounded-full animate-pulse"></div>
          {/* Inner spinning ring */}
          <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          {/* Center dot */}
          <div className="w-2 h-2 bg-blue-500 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-ping"></div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white animate-pulse">
            Loading your GitHub activity...
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Fetching the latest data from GitHub
          </p>
          
          {/* Progress indicators */}
          <div className="flex justify-center space-x-1 mt-4">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}