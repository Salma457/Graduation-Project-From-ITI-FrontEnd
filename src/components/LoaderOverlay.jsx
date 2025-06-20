import React from 'react';

const LoaderOverlay = ({ text = 'Loading...' }) => (
  <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
    <div className="bg-white/90 p-6 rounded-lg shadow-lg flex flex-col items-center pointer-events-auto">
      <svg className="animate-spin h-8 w-8 text-red-600 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
      </svg>
      <span className="text-red-600 font-semibold">{text}</span>
    </div>
  </div>
);

export default LoaderOverlay;
