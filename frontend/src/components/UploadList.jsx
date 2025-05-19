import React, { useState } from 'react';
import axios from 'axios';

const UploadList = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [showListButton, setShowListButton] = useState(false);
  const [existingList, setExistingList] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const validExtensions = ['.csv', '.xlsx', '.xls'];
      const fileExt = selectedFile.name.slice(selectedFile.name.lastIndexOf('.')).toLowerCase();
      if (!validExtensions.includes(fileExt)) {
        setMessage('Invalid file type. Only CSV, XLSX, XLS allowed');
        setFile(null);
        setShowListButton(false);
        setExistingList(null);
      } else {
        setFile(selectedFile);
        setMessage('');
        setShowListButton(false);
        setExistingList(null);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return setMessage('Please select a file');
    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/lists/upload`, formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
      });
      setMessage(res.data.message);
      setFile(null);
      setShowListButton(false);
      setExistingList(null);
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to upload file';
      setMessage(errorMsg);
      if (errorMsg === 'Already have these details list') {
        setShowListButton(true);
      } else {
        setShowListButton(false);
        setExistingList(null);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleShowList = async () => {
    if (!file) return;
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/lists/group/${file.name}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExistingList(res.data);
      setShowListButton(false);
    } catch (err) {
      setMessage(err.response?.data?.message || err.message || 'Failed to fetch list');
    }
  };

  return (
    <div className="relative min-h-[400px] bg-gradient-to-r from-teal-50 to-purple-50 p-6 rounded-xl shadow-xl overflow-hidden">
      <div className="relative z-10">
        <h2 className="text-2xl font-bold text-teal-800 mb-6 animate-slide-in-left">Upload CSV</h2>
        {message && (
          <p
            className={`text-center mb-6 px-4 py-2 rounded-lg font-medium animate-bounce-in ${
              message.includes('success') ? 'bg-teal-100 text-teal-800' : 'bg-red-100 text-red-800'
            }`}
          >
            {message}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="animate-slide-in-right">
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload File</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-400 focus:border-teal-500 transition-all duration-300 ease-in-out placeholder-gray-400 shadow-sm"
              accept=".csv,.xlsx,.xls"
            />
          </div>
          <button
            type="submit"
            className={`w-full py-3 px-4 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 hover:scale-105 hover:shadow-lg transition-all duration-300 ease-in-out ${
              isUploading || !file ? 'opacity-80 cursor-not-allowed' : ''
            }`}
            disabled={isUploading || !file}
          >
            {isUploading ? (
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
                Uploading...
              </span>
            ) : (
              'Upload'
            )}
          </button>
        </form>
        {showListButton && (
          <button
            onClick={handleShowList}
            className="mt-4 w-full py-3 px-4 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 hover:scale-105 hover:shadow-lg transition-all duration-300 ease-in-out animate-slide-in-right"
          >
            Show List
          </button>
        )}
        {existingList && (
          <div className="mt-6 animate-fade-in">
            <h3 className="text-xl font-semibold text-teal-800 mb-2">Existing List: {existingList?.listGroup?.name}</h3>
            <ul className="max-h-64 overflow-y-auto border border-purple-200 p-4 rounded-lg bg-white shadow-sm">
              {existingList.lists.map((item, index) => (
                <li
                  key={item._id}
                  className="py-2 px-3 border-b last:border-b-0 border-purple-100 hover:bg-purple-50 transition-all duration-200 ease-in-out animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {item.firstName} - {item.phone} - {item.notes} - Agent: {item.agent?.name} ({item.agent?.email})
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadList;