import React from 'react';

const Unauthorized = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
    <div className="max-w-md text-center">
      <h1 className="text-2xl md:text-3xl font-bold text-red-600 mb-4">
        Access Denied
      </h1>
      <p className="text-gray-700 mb-6">
        You are not authorized to access this page.
      </p>
      <a
        href="/"
        className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Return to Home
      </a>
    </div>
  </div>
);

export default Unauthorized;
