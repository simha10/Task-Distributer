import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secret, setSecret] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      console.log('Sending registration request:', { email, secret: '****' });
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/register`,
        { email, password },
        { headers: { 'X-Admin-Secret': secret } }
      );
      console.log('Registration response:', response.data);
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    } catch (err) {
      console.error('Registration error:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });
      setError(err.response?.data?.message || 'Registration failed. Check console for details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-teal-50 to-purple-50">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-2xl animate-fade-in">
        <h2 className="text-3xl font-bold text-center text-teal-800 mb-6 animate-slide-in-left">
          <svg
            className="inline-block w-8 h-8 mr-2 text-teal-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
            />
          </svg>
          Admin Register
        </h2>
        {error && (
          <p className="text-center mb-6 px-4 py-2 rounded-lg bg-red-100 text-red-800 font-medium animate-bounce-in">
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="animate-slide-in-right" style={{ animationDelay: '0.1s' }}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <svg
                className="inline-block w-5 h-5 mr-2 text-teal-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                />
              </svg>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-400 focus:border-teal-500 transition-all duration-300 ease-in-out placeholder-gray-400 shadow-sm"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="animate-slide-in-right" style={{ animationDelay: '0.2s' }}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <svg
                className="inline-block w-5 h-5 mr-2 text-teal-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 11c0 1.104-.896 2-2 2s-2-.896-2-2 2-4 2-4 2 .896 2 2zM12 11c0 1.104-.896 2-2 2s-2-.896-2-2m4 0v6m-4-6v6m8-6c0 1.104-.896 2-2 2s-2-.896-2-2 2-4 2-4 2 .896 2 2z"
                />
              </svg>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-400 focus:border-teal-500 transition-all duration-300 ease-in-out placeholder-gray-400 shadow-sm"
              placeholder="Enter your password"
              required
            />
          </div>
          <div className="animate-slide-in-right" style={{ animationDelay: '0.3s' }}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <svg
                className="inline-block w-5 h-5 mr-2 text-teal-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2h6a2 2 0 002-2V7zm4 4v6a2 2 0 01-2 2h-2m-4-2v-4"
                />
              </svg>
              Admin Secret Key
            </label>
            <input
              type="password"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-400 focus:border-teal-500 transition-all duration-300 ease-in-out placeholder-gray-400 shadow-sm"
              placeholder="Enter admin secret key"
              required
            />
          </div>
          <button
            type="submit"
            className={`w-full py-3 px-4 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 hover:scale-105 hover:shadow-lg transition-all duration-300 ease-in-out flex items-center justify-center ${
              isSubmitting ? 'animate-pulse opacity-80 cursor-not-allowed' : ''
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
                  ></path>
                </svg>
                Registering...
              </span>
            ) : (
              <>
                <svg
                  className="w-5 h-5 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
                Register
              </>
            )}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already an admin?{' '}
          <Link
            to="/"
            className="text-teal-600 hover:text-teal-800 hover:underline transition-all duration-200 ease-in-out"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;