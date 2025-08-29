import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative w-12 h-12 rounded-full bg-gradient-to-r from-violet-500 to-amber-500 p-0.5 transition-all duration-300 hover:scale-110 hover:shadow-lg group focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <div className="relative w-full h-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center transition-all duration-300">
        {/* Sun Icon */}
        <svg
          className={`w-5 h-5 text-amber-500 transition-all duration-300 ${
            isDark ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'
          }`}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
        </svg>

        {/* Moon Icon */}
        <svg
          className={`absolute w-5 h-5 text-violet-500 transition-all duration-300 ${
            isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'
          }`}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" />
        </svg>

        {/* Animated background ring */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-500 to-amber-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
      </div>

      {/* Glow effect */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-500 to-amber-500 opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-300" />
      
      {/* Click feedback */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-500 to-amber-500 opacity-0 active:opacity-40 transition-opacity duration-150" />
    </button>
  );
};

export default ThemeToggle;
