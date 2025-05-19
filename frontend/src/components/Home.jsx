import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-[url('https://4kwallpapers.com/images/walls/thumbs_3t/5658.jpg')] bg-cover bg-center">
      {/* Subtle overlay for depth */}
      <div className="absolute inset-0 bg-white/10"></div>
      <div className="relative z-10 text-center max-w-2xl px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-300 mb-6 animate-slide-up">
          <svg
            className="inline-block w-8 h-8 md:w-10 md:h-10 mr-2 text-gray-200"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
            />
          </svg>
          Welcome to the Project Dashboard
        </h1>
        <p
          className="text-lg md:text-xl text-gray-100 mb-8 animate-fade-in"
          style={{ animationDelay: '0.3s' }}
        >
          An application for authentication, user management, and secure dashboard access. Log in as an admin to manage agents and distribute lists efficiently.
        </p>
        <button
          className="flex items-center justify-center mx-auto px-8 py-3 bg-blue-700 text-white rounded-lg font-semibold hover:bg-teal-800 hover:scale-105 hover:shadow-xl transition-all duration-300 ease-in-out animate-pulse-slow"
          onClick={() => navigate('/login')}
        >
          <svg
            className="w-6 h-6 mr-2"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
            />
          </svg>
          Go to Admin Login
        </button>
      </div>
    </div>
  );
};

export default Home;