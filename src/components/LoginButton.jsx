// src/components/LoginButton.jsx
import React, { useState } from "react";

export default function LoginButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [switchLoading, setSwitchLoading] = useState(false);
  const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_REDIRECT_URI;
  const timestamp = Date.now();

  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&scope=public_repo&state=${timestamp}`;
  const switchAccountUrl = `https://github.com/logout?return_to=${encodeURIComponent(
    githubAuthUrl
  )}`;

  const handleLogin = () => {
    setIsLoading(true);
    localStorage.removeItem("github_token");
    setTimeout(() => {
      window.location.href = githubAuthUrl;
    }, 500);
  };

  const handleSwitchAccount = (e) => {
    e.preventDefault();
    setSwitchLoading(true);
    localStorage.removeItem("github_token");
    setTimeout(() => {
      window.location.href = switchAccountUrl;
    }, 500);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Logo Section */}
      <div className="text-center mb-8">
        <div className="mb-5 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 rounded-full blur-xl transform scale-150"></div>
          <div className="relative p-3 rounded-2xl">
            <svg
              className="w-12 h-12 text-white mx-auto"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                fillRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
       <h1 className="text-2xl font-bold mb-2 font-poppins">
  <span className="text-white">Git</span>
  <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Streak</span>
</h1>

        <p className="text-gray-400 text-sm font-light mb-6 leading-relaxed">
          Connect your GitHub account to track your coding streaks!
        </p>
      </div>
      {/* Main Login Section */}
      <div className="space-y-5">
        {/* Primary Login Button */}
        <button
          onClick={handleLogin}
          disabled={isLoading || switchLoading}
          className="group relative w-full overflow-hidden bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:from-gray-600 disabled:to-gray-700 text-white px-6 py-3 rounded-lg font-poppins text-sm font-medium transition-all duration-500 shadow-md hover:shadow-purple-500/30 transform hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:transform-none"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          <div className="relative flex items-center justify-center gap-2">
            {isLoading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4 text-white transition-transform group-hover:scale-110"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Continue with GitHub</span>
              </>
            )}
          </div>
        </button>

        {/* Divider */}
        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-gray-900 px-3 py-0.5 text-gray-400 text-xs uppercase tracking-widest font-medium rounded-full border border-gray-700/50">
              or
            </span>
          </div>
        </div>

        {/* Switch Account Button */}
        <button
          onClick={handleSwitchAccount}
          disabled={isLoading || switchLoading}
          className="group w-full bg-gray-800/50 hover:bg-gray-700/70 backdrop-blur-sm border border-gray-700/50 hover:border-gray-600/70 text-gray-300 hover:text-white px-6 py-3 rounded-lg font-poppins text-sm font-medium transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:transform-none"
        >
          <div className="flex items-center justify-center gap-2">
            {switchLoading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Switching...</span>
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4 text-gray-400 group-hover:text-white transition-all"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                  />
                </svg>
                <span>Use a different account</span>
              </>
            )}
          </div>
        </button>
      </div>
      {/* Footer */}
      <div className="mt-8 text-center">
        <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/30 rounded-md p-3 space-y-2">
          <div className="flex items-center justify-center gap-5 text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2.25c-.414 0-.82.086-1.2.252l-7.5 3.333A2.25 2.25 0 002.25 8.25v5.25c0 5.385 3.514 10.374 9.58 12.137a2.25 2.25 0 001.44 0c6.066-1.763 9.58-6.752 9.58-12.137V8.25a2.25 2.25 0 00-1.05-1.915l-7.5-3.333c-.38-.166-.786-.252-1.2-.252zm3.53 8.28a.75.75 0 10-1.06-1.06L11 12.94l-1.47-1.47a.75.75 0 00-1.06 1.06l2 2a.75.75 0 001.06 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-poppins">Secure OAuth</span>
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-poppins">Public repos only</span>
            </div>
          </div>
          <div className="text-xs text-gray-500 font-montserrat">
            No personal data stored • Privacy first
          </div>
        </div>
      </div>
    </div>
  );
}
