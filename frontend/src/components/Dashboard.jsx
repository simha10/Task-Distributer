import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddAgent from './AddAgent';
import UploadList from './UploadList';

const Dashboard = () => {
  const [agents, setAgents] = useState([]);
  const [lists, setLists] = useState([]);
  const [error, setError] = useState('');
  const [hasUploaded, setHasUploaded] = useState(false);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const agentsRes = await axios.get(`${import.meta.env.VITE_API_URL}/agents`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAgents(agentsRes.data);

      if (hasUploaded) {
        const listsRes = await axios.get(`${import.meta.env.VITE_API_URL}/lists`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLists(listsRes.data);
      } else {
        setLists([]);
      }
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError('Failed to fetch data');
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [hasUploaded]);

  const handleShowExistingList = (existingLists) => {
    setLists(existingLists);
  };

  // Delete agent handler
  const handleDeleteAgent = async (agentId) => {
    if (!window.confirm('Are you sure you want to delete this agent?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${import.meta.env.VITE_API_URL}/agents/${agentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAgents(agents.filter((agent) => agent._id !== agentId));
      // Optionally, remove lists associated with the deleted agent
      setLists(lists.filter((list) => list.agent._id !== agentId));
    } catch (err) {
      setError('Failed to delete agent');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-teal-50 to-purple-50 p-6">
      <h1 className="text-3xl font-bold text-teal-800 mb-8 animate-slide-in-left">Admin Dashboard</h1>
      {error && (
        <p className="text-center mb-6 px-4 py-2 rounded-lg bg-red-100 text-red-800 font-medium animate-bounce-in">
          {error}
        </p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <AddAgent />
        <UploadList
          onUploadSuccess={() => {
            setHasUploaded(true);
          }}
          onShowExistingList={handleShowExistingList}
        />
      </div>

      <div className="bg-white p-6 rounded-xl shadow-xl animate-fade-in">
        <h2 className="text-2xl font-semibold text-teal-800 mb-4">Agents</h2>
        {agents.length === 0 ? (
          <p className="text-gray-500">No agents added yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-teal-200">
              <thead className="bg-teal-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-teal-700 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-teal-700 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-teal-700 uppercase tracking-wider">Mobile</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-teal-100">
                {agents.map((agent) => (
                  <tr key={agent._id} className="hover:bg-teal-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-teal-800">{agent.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{agent.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{agent.mobile}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                        onClick={() => handleDeleteAgent(agent._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-8 bg-white p-6 rounded-xl shadow-xl animate-fade-in">
        <h2 className="text-2xl font-semibold text-teal-800 mb-4">Distributed Lists</h2>
        {lists.length === 0 ? (
          <p className="text-gray-500">Upload CSV to get distributed list</p>
        ) : (
          agents.map((agent) => {
            const agentLists = lists.filter(
              (list) => list.agent._id.toString() === agent._id.toString()
            );
            if (agentLists.length === 0) return null;
            return (
              <div key={agent._id} className="mb-8">
                <h3 className="text-xl font-medium text-teal-700 mb-2">{agent.name}'s List</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-purple-200">
                    <thead className="bg-purple-100">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">First Name</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">Phone</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">Notes</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-purple-100">
                      {agentLists.map((list, idx) => (
                        <tr key={list._id} className="hover:bg-purple-50 transition">
                          <td className="px-4 py-2 whitespace-nowrap font-medium text-teal-800">{list.firstName}</td>
                          <td className="px-4 py-2 whitespace-nowrap">{list.phone}</td>
                          <td className="px-4 py-2 whitespace-nowrap text-gray-600">{list.notes || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })
        )}
      </div>


    </div>
  );
};

export default Dashboard;