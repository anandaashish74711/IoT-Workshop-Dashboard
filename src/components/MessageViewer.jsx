import React from 'react';
import TopicMessageViewer from './Topicmessageviewer';
import EEGGraph from './EEGGraph';

const MessageViewer = ({ messages }) => {
  const topics = Object.keys(messages);

  // Dynamically find the EEG topic (regardless of group/participant)
  const eegTopic = topics.find(topic => topic.endsWith('/EEG'));

  // All other topics
  const nonEEGTopics = topics.filter(topic => topic !== eegTopic);

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* If no topics subscribed */}
      {topics.length === 0 ? (
        <div className="col-span-2 text-center py-8 text-gray-500">No topics subscribed yet</div>
      ) : (
        <>
          {/* Render other topics */}
          {nonEEGTopics.map((topic) => (
            <TopicMessageViewer key={topic} topic={topic} messages={messages[topic]} />
          ))}

          {/* Render EEG Graph if available */}
          {eegTopic && (
            <EEGGraph messages={messages[eegTopic]} />
          )}
        </>
      )}

      {/* Fill empty slots */}
      {Array.from({ length: Math.max(0, 4 - topics.length) }).map((_, idx) => (
        <div
          key={`empty-${idx}`}
          className="bg-white rounded-lg shadow-md p-6 border border-gray-200 h-[45vh] flex items-center justify-center text-gray-400"
        >
          Empty
        </div>
      ))}
    </div>
  );
};


export default MessageViewer;
