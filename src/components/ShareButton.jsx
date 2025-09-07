import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function ShareButton({ statsData, className = "" }) {
  const [isCopied, setIsCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const shareOptions = [
    {
      name: "Copy Link",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      color: "hover:bg-blue-500 hover:text-white",
      action: async () => {
        try {
          await navigator.clipboard.writeText(window.location.href);
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
          console.error('Failed to copy: ', err);
        }
      }
    },
    {
      name: "Twitter",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.027 10.027 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63a9.936 9.936 0 002.46-2.548l-.047-.02z"/>
        </svg>
      ),
      color: "hover:bg-sky-500 hover:text-white",
      action: () => {
        const text = `Check out my DevFlow Analytics stats! 🚀 Weekly commits: ${statsData?.totalCommits || 0}, Current streak: ${statsData?.streak || 0} days`;
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`, '_blank');
      }
    },
    {
      name: "Export JSON",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      ),
      color: "hover:bg-green-500 hover:text-white",
      action: () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(statsData, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "devflow-stats.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
      }
    },
    {
      name: "LinkedIn",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
      color: "hover:bg-blue-600 hover:text-white",
      action: () => {
        const text = `Check out my coding analytics dashboard! Building consistent habits with ${statsData?.totalCommits || 0} commits this week.`;
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank');
      }
    }
  ];

  return (
    <>
      {/* FAB Main Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.3 }}
      >
        <motion.button
          className={`relative w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 dark:from-blue-600 dark:to-cyan-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group ${
            isOpen ? 'bg-gray-600' : ''
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          style={{
            background: isOpen 
              ? 'linear-gradient(135deg, #374151 0%, #4B5563 100%)'
              : undefined
          }}
        >
          {/* Ripple effect */}
          <div className="absolute inset-0 rounded-full bg-white/20 scale-0 group-hover:scale-100 transition-transform duration-300"></div>
          
          {/* Share icon with rotation animation */}
          <motion.div
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.3 }}
            className="relative z-10"
          >
            {isCopied ? (
              <motion.svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </motion.svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
            )}
          </motion.div>

          {/* Success pulse animation */}
          {isCopied && (
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-white"
              initial={{ scale: 1, opacity: 1 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{ duration: 0.6 }}
            />
          )}
        </motion.button>

        {/* Tooltip */}
        {!isOpen && (
          <motion.div
            className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 dark:bg-gray-800 text-white dark:text-gray-200 text-sm rounded-lg shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 0, y: 0 }}
            whileHover={{ opacity: 1 }}
          >
            {isCopied ? "Link Copied!" : "Share Stats"}
            <div className="absolute top-full right-3 w-2 h-2 bg-gray-900 dark:bg-gray-800 rotate-45 transform -translate-y-1"></div>
          </motion.div>
        )}
      </motion.div>

      {/* Share Options Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-6 right-6 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              style={{ zIndex: -1 }}
            />

            {/* Options */}
            <div className="relative">
              {shareOptions.map((option, index) => {
                // Calculate positions in a vertical stack going upward
                const yOffset = -((index + 1) * 60) - 10; // Stack vertically with 60px spacing
                const xOffset = 0; // Keep them aligned vertically
                
                return (
                  <motion.button
                    key={option.name}
                    className={`absolute bottom-0 right-0 w-12 h-12 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 transition-all duration-200 ${option.color} group`}
                    initial={{ 
                      scale: 0, 
                      opacity: 0,
                      x: 0,
                      y: 0
                    }}
                    animate={{ 
                      scale: 1, 
                      opacity: 1,
                      x: xOffset,
                      y: yOffset
                    }}
                    exit={{ 
                      scale: 0, 
                      opacity: 0,
                      x: 0,
                      y: 0
                    }}
                    transition={{ 
                      delay: index * 0.1,
                      type: "spring",
                      stiffness: 260,
                      damping: 20
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      option.action();
                      setIsOpen(false);
                    }}
                  >
                    {option.icon}

                    {/* Option label tooltip */}
                    <motion.div
                      className="absolute right-full mr-3 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 0, scale: 0.8 }}
                      whileHover={{ opacity: 1, scale: 1 }}
                    >
                      {option.name}
                      <div className="absolute left-full top-1/2 transform -translate-y-1/2 w-2 h-2 bg-gray-900 dark:bg-gray-700 rotate-45 -translate-x-1"></div>
                    </motion.div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}