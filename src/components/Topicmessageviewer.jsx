import React from 'react';

const TopicMessageViewer = ({ topic, messages }) => {
  // Get latest 10 messages
  const latestMessages = messages.slice(-10);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 h-[45vh] flex flex-col">
      <h2 className="text-lg font-semibold mb-4">{topic}</h2>
      <div className="flex-1 overflow-y-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Message</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {latestMessages.map((message, index) => (
              <tr key={index}>
                <td className="px-4 py-2 text-sm text-gray-700">{message.content || message}</td>
                <td className="px-4 py-2 text-sm text-gray-500">{message.timestamp || new Date().toLocaleTimeString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {latestMessages.length === 0 && (
          <div className="text-center text-sm text-gray-500 py-4">No messages yet</div>
        )}
      </div>
    </div>
  );
};

export default TopicMessageViewer;
