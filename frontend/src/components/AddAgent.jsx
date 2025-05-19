import React, { useState } from 'react';
import axios from 'axios';

const AddAgent = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${import.meta.env.VITE_API_URL}/agents`,
        { name, email, mobile, password },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('Agent added successfully');
      setName('');
      setEmail('');
      setMobile('');
      setPassword('');
    } catch (err) {
      setMessage(
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : 'Failed to add agent'
      );
      console.error('Error adding agent:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-[400px] bg-gradient-to-r from-teal-50 to-purple-50 p-6 rounded-xl shadow-2xl overflow-hidden">
      <div className="relative z-10">
        <h2 className="text-2xl font-bold text-teal-800 mb-6 animate-slide-in-left">Add New Agent</h2>
        {message && (
          <p
            className={`text-center mb-6 px-4 py-2 rounded-lg font-medium animate-bounce-in ${
              message.includes('success')
                ? 'bg-teal-100 text-teal-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {message}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="animate-slide-in-right" style={{ animationDelay: '0.1s' }}>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-400 focus:border-teal-500 transition-all duration-300 ease-in-out placeholder-gray-400 shadow-sm"
              placeholder="Enter agent's name"
              required
            />
          </div>
          <div className="animate-slide-in-right" style={{ animationDelay: '0.2s' }}>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-400 focus:border-teal-500 transition-all duration-300 ease-in-out placeholder-gray-400 shadow-sm"
              placeholder="Enter agent's email"
              required
            />
          </div>
          <div className="animate-slide-in-right" style={{ animationDelay: '0.3s' }}>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
            <input
              type="text"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-400 focus:border-teal-500 transition-all duration-300 ease-in-out placeholder-gray-400 shadow-sm"
              placeholder="Enter mobile with country code"
              required
            />
          </div>
          <div className="animate-slide-in-right" style={{ animationDelay: '0.4s' }}>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-400 focus:border-teal-500 transition-all duration-300 ease-in-out placeholder-gray-400 shadow-sm"
              placeholder="Enter agent's password"
              required
            />
          </div>
          <button
            type="submit"
            className={`w-full py-3 px-4 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 hover:scale-105 hover:shadow-lg transition-all duration-300 ease-in-out ${
              isSubmitting ? 'animate-pulse opacity-80 cursor-not-allowed' : ''
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
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
                Adding...
              </span>
            ) : (
              'Add Agent'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddAgent;