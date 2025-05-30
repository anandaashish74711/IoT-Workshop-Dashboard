import React, { useState } from 'react';
import { publishMessage } from '../mqtt/mqttServices';

const Publisher = ({ subscribedTopics }) => {
  const [selectedTopic, setSelectedTopic] = useState('');
  const [message, setMessage] = useState('');

  const handlePublish = () => {
    if (selectedTopic && message) {
      publishMessage(selectedTopic, message);
      console.log(`Published "${message}" to "${selectedTopic}"`);
      setMessage('');
    }
  };

  return (
    <div>
      <h3>Publish Message</h3>
      <select value={selectedTopic} onChange={(e) => setSelectedTopic(e.target.value)}>
        <option value="">Select Topic</option>
        {subscribedTopics.map(topic => (
          <option key={topic} value={topic}>{topic}</option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={handlePublish} disabled={!selectedTopic || !message}>
        Publish
      </button>
    </div>
  );
};

export default Publisher;
