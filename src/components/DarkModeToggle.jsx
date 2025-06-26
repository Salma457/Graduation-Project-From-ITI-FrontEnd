import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useDarkMode } from '../contexts/DarkModeContext';
import { useTranslation } from '../contexts/TranslationContext';

const DarkModeToggle = ({ className = "" }) => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { t } = useTranslation();

  return (
    <button
      onClick={toggleDarkMode}
      className={`
        relative inline-flex items-center justify-center w-12 h-12 
        bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 
        rounded-full shadow-lg hover:shadow-xl 
        transition-all duration-300 ease-in-out
        hover:scale-110 active:scale-95
        focus:outline-none focus:ring-4 focus:ring-red-200 dark:focus:ring-red-800
        group ${className}
      `}
      title={isDarkMode ? t('darkMode.switchToLight') : t('darkMode.switchToDark')}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {/* Sun Icon */}
      <Sun 
        className={`
          absolute w-6 h-6 text-yellow-500 transition-all duration-500 ease-in-out
          ${isDarkMode 
            ? 'opacity-0 rotate-90 scale-0' 
            : 'opacity-100 rotate-0 scale-100'
          }
        `}
      />
      
      {/* Moon Icon */}
      <Moon 
        className={`
          absolute w-6 h-6 text-blue-600 dark:text-blue-400 transition-all duration-500 ease-in-out
          ${isDarkMode 
            ? 'opacity-100 rotate-0 scale-100' 
            : 'opacity-0 -rotate-90 scale-0'
          }
        `}
      />
      
      {/* Animated background glow */}
      <div className={`
        absolute inset-0 rounded-full transition-all duration-300
        ${isDarkMode 
          ? 'bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-blue-900/30 dark:to-indigo-900/30' 
          : 'bg-gradient-to-br from-yellow-100 to-orange-200'
        }
        opacity-0 group-hover:opacity-100 -z-10
      `} />
    </button>
  );
};

export default DarkModeToggle;