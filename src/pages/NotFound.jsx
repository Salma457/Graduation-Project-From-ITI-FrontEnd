import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 p-8">
    <div className="flex flex-col items-center">
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-6 animate-bounce">
        <circle cx="60" cy="60" r="58" stroke="#e35d5b" strokeWidth="4" fill="#fff" />
        <text x="50%" y="54%" textAnchor="middle" fill="#e35d5b" fontSize="48" fontWeight="bold" dy=".3em">404</text>
      </svg>
      <h1 className="text-4xl font-extrabold text-red-600 mb-2">Page Not Found</h1>
      <p className="text-lg text-gray-700 mb-8 text-center max-w-md">
        Oops! The page you are looking for does not exist or has been moved.<br />
        Please check the URL or return to the homepage.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-red-600 text-white rounded-lg font-bold text-lg shadow-lg hover:bg-red-700 transition-colors duration-200"
      >
        Go Home
      </Link>
    </div>
  </div>
);

export default NotFound;
