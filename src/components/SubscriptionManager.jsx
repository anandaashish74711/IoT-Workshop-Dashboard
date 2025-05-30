import React, { useState } from 'react';
import { subscribeToTopic, unsubscribeFromTopic } from '../mqtt/mqttServices';

const SubscriptionManager = ({ topics, subscribedTopics, setSubscribedTopics }) => {
  const [selectedTopics, setSelectedTopics] = useState([]);

  // Extract just the topic name (last part after last slash) for display
  const getDisplayName = (fullTopic) => {
    const parts = fullTopic.split('/');
    return parts[parts.length - 1];
  };

  const handleSubscribe = () => {
    const newTopics = selectedTopics.filter(topic => !subscribedTopics.includes(topic));

    newTopics.forEach(topic => {
      subscribeToTopic(topic);
      console.log(`Subscribed to ${topic}`);
    });

    setSubscribedTopics([...subscribedTopics, ...newTopics]);
    setSelectedTopics([]);
  };

  const handleUnsubscribe = (topic) => {
    unsubscribeFromTopic(topic);
    console.log(`Unsubscribed from ${topic}`);
    setSubscribedTopics(subscribedTopics.filter(t => t !== topic));
  };

  const availableTopics = topics.filter(t => !subscribedTopics.includes(t));

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Topic Subscription Manager</h2>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Available Topics
        </label>
        <select
          multiple
          value={selectedTopics}
          onChange={(e) => setSelectedTopics(
            Array.from(e.target.selectedOptions, option => option.value)
          )}
          className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          style={{ minHeight: '150px' }}
        >
          {availableTopics.map(topic => (
            <option key={topic} value={topic} className="p-2 hover:bg-indigo-50">
              {getDisplayName(topic)}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-gray-500">
          Hold Ctrl/Cmd to select multiple topics
        </p>
      </div>

      <button
        onClick={handleSubscribe}
        disabled={selectedTopics.length === 0}
        className={`w-full py-2 px-4 mb-6 rounded-md shadow-sm text-sm font-medium text-white ${
          selectedTopics.length === 0 
            ? 'bg-gray-300 cursor-not-allowed' 
            : 'bg-indigo-600 hover:bg-indigo-700'
        }`}
      >
        Subscribe to Selected Topics
      </button>

      {subscribedTopics.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Subscribed Topics</h3>
          <ul className="divide-y divide-gray-200 border border-gray-200 rounded-md">
            {subscribedTopics.map(topic => (
              <li key={topic} className="flex justify-between items-center p-3 hover:bg-gray-50">
                <span className="text-sm font-medium text-gray-800">
                  {getDisplayName(topic)}
                </span>
                <button
                  onClick={() => handleUnsubscribe(topic)}
                  className="px-3 py-1 text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                >
                  Unsubscribe
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SubscriptionManager;