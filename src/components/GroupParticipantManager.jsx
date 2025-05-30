import React, { useState } from 'react';
// Importing static groups data from JSON file
import groupsData from '../data/groups.json';

// Component to manage group selection and participant name, and load MQTT topics
const GroupParticipantManager = ({ setTopics }) => {
  // Local state for selected group
  const [selectedGroup, setSelectedGroup] = useState('');
  // Local state for participant's name
  const [participantName, setParticipantName] = useState('');
  // Local state to manage loading indicator while topics are being loaded
  const [isLoading, setIsLoading] = useState(false);

  // Function to generate topics based on selected group and participant name
  const handleLoadTopics = () => {
    // Validate that both group and name are provided
    if (!selectedGroup || !participantName) {
      alert('Please select a group and enter your name');
      return;
    }

    setIsLoading(true); // Show loading indicator

    // Simulate API delay for loading topics
    setTimeout(() => {
      // Find selected group details from groupsData
      const group = groupsData.find(g => g.group === selectedGroup);
      if (group) {
        // Create topics in format: group/participant/topic
        const topics = group.topics.map(t => `${selectedGroup}/${participantName}/${t}`);
        // Pass generated topics to parent via setTopics callback
        setTopics(topics);
      } else {
        alert('Group not found');
      }
      setIsLoading(false); // Hide loading indicator
    }, 500);
  };

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg shadow-md border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-800">Topic Group Selection</h2>

      <div className="space-y-3">
        {/* Group Selection Dropdown */}
        <div>
          <label htmlFor="group-select" className="block text-sm font-medium text-gray-700 mb-1">
            Select Group
          </label>
          <select
            id="group-select"
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">-- Select a group --</option>
            {/* Map through groups data and create options */}
            {groupsData.map((group) => (
              <option key={group.group} value={group.group}>
                {group.group}
              </option>
            ))}
          </select>
        </div>

        {/* Participant Name Input */}
        <div>
          <label htmlFor="participant-name" className="block text-sm font-medium text-gray-700 mb-1">
            Your Name
          </label>
          <input
            id="participant-name"
            type="text"
            placeholder="Enter your name"
            value={participantName}
            onChange={(e) => setParticipantName(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        {/* Load Topics Button */}
        <button
          onClick={handleLoadTopics}
          disabled={isLoading || !selectedGroup || !participantName}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isLoading || !selectedGroup || !participantName ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'}`}
        >
          {/* Button content changes based on loading state */}
          {isLoading ? (
            <>
              {/* Loading Spinner Icon */}
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading...
            </>
          ) : (
            'Load Topics'
          )}
        </button>
      </div>

      {/* Topic Preview Section */}
      {selectedGroup && participantName && (
        <div className="mt-4 p-3 bg-gray-50 rounded-md border border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Preview Topics</h3>
          <div className="space-y-1">
            {/* List topics preview for selected group */}
            {groupsData.find(g => g.group === selectedGroup)?.topics.map((topic, index) => (
              <div key={index} className="text-sm text-gray-600">
                <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                  {`${selectedGroup}/${participantName}/${topic}`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupParticipantManager;
