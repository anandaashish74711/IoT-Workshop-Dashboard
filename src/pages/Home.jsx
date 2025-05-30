import React, { useState } from 'react';
import ConnectionManager from '../components/ConnectionManager';
import SubscriptionManager from '../components/SubscriptionManager';
import MessageViewer from '../components/MessageViewer';
import GroupParticipantManager from '../components/GroupParticipantManager';
import useMqttClient from '../hooks/useMqttClient';
import { connectClient, disconnectClient, subscribeToTopic, unsubscribeFromTopic } from '../mqtt/mqttServices';

const Home = () => {
  const { isConnected, setIsConnected, messages, setMessages } = useMqttClient();
  const [client, setClient] = useState(null);
  const [topics, setTopics] = useState([]);
  const [queuedSubscriptions, setQueuedSubscriptions] = useState([]);
  const [subscribedTopics, setSubscribedTopics] = useState([]);

  const handleOnConnect = () => {
    setIsConnected(true);
    console.log('Connected to MQTT Broker');

    // Subscribe to queued topics on connect
    queuedSubscriptions.forEach(topic => {
      subscribeToTopic(topic);
      console.log(`Subscribed to ${topic}`);
    });

    setSubscribedTopics(prev => [...prev, ...queuedSubscriptions]);
    setQueuedSubscriptions([]);
  };

  const handleOnMessage = (topic, message) => {
    setMessages(prevMessages => ({
      ...prevMessages,
      [topic]: [
        ...(prevMessages[topic] || []),
        { content: message.toString(), timestamp: new Date().toISOString() }
      ]
    }));
  };

  const handleConnect = () => {
    const mqttClient = connectClient(handleOnConnect, handleOnMessage);
    if (mqttClient) {
      setClient(mqttClient);
    }
  };

  const handleDisconnect = () => {
    console.log('Disconnect button clicked');
    
    try {
      // Unsubscribe from all topics before disconnecting
      subscribedTopics.forEach(topic => {
        unsubscribeFromTopic(topic);
        console.log(`Unsubscribed from ${topic}`);
      });

      // Disconnect the client
      disconnectClient(() => {
        console.log('Disconnected from MQTT Broker');
        // Reset all state after successful disconnect
        setIsConnected(false);
        setSubscribedTopics([]);
        setTopics([]);
        setMessages({});
        setQueuedSubscriptions([]);
        setClient(null);
      });
    } catch (error) {
      console.error('Error during disconnect:', error);
      // Force reset state even if disconnect fails
      setIsConnected(false);
      setSubscribedTopics([]);
      setTopics([]);
      setMessages({});
      setQueuedSubscriptions([]);
      setClient(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold">IoT Workshop Dashboard</h1>
                <p className="text-indigo-200 text-sm">MQTT Communication & Device Management</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-indigo-200">Broker Status</p>
                <p className="font-semibold">{isConnected ? '🟢 Connected' : '🔴 Disconnected'}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className={`py-2 px-4 text-center text-sm font-medium ${isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
        {isConnected ? 'Connected to MQTT Broker' : 'Disconnected'}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex gap-4 items-center">
        <ConnectionManager
          isConnected={isConnected}
          onConnect={handleConnect}
          onDisconnect={handleDisconnect}
        />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {isConnected ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-4 border">
                <h3 className="text-sm font-medium text-gray-500">Active Subscriptions</h3>
                <p className="mt-1 text-3xl font-semibold text-indigo-600">{subscribedTopics.length}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-4 border">
                <h3 className="text-sm font-medium text-gray-500">Total Messages</h3>
                <p className="mt-1 text-3xl font-semibold text-indigo-600">
                  {Object.values(messages).reduce((acc, curr) => acc + curr.length, 0)}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-4 border">
                <h3 className="text-sm font-medium text-gray-500">Available Topics</h3>
                <p className="mt-1 text-3xl font-semibold text-indigo-600">{topics.length}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-md p-6 border">
                  <h2 className="text-lg font-semibold mb-4">Topic Management</h2>
                  <GroupParticipantManager setTopics={setTopics} />
                </div>
                <div className="bg-white rounded-lg shadow-md p-6 border">
                  <h2 className="text-lg font-semibold mb-4">Subscription Manager</h2>
                  <SubscriptionManager
                    topics={topics}
                    subscribedTopics={subscribedTopics}
                    setSubscribedTopics={setSubscribedTopics}
                    queuedSubscriptions={queuedSubscriptions}
                    setQueuedSubscriptions={setQueuedSubscriptions}
                    isConnected={isConnected}
                    client={client}
                  />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 border lg:col-span-2">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Message Viewer</h2>
                  <div className="text-sm text-gray-500">
                    {Object.values(messages).reduce((acc, curr) => acc + curr.length, 0)} messages
                  </div>
                </div>
                <MessageViewer messages={messages} />
              </div>
            </div>
          </div>
        ) : (
          <div className="min-h-[600px] flex items-center justify-center">
            <div className="text-center max-w-2xl mx-auto">
              {/* IoT Workshop Header */}
              <div className="mb-8">
                <div className="flex justify-center mb-4">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 rounded-full shadow-lg">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                    </svg>
                  </div>
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">IoT Workshop</h1>
                <h2 className="text-2xl font-semibold text-indigo-600 mb-4">MQTT Communication Hub</h2>
                <p className="text-lg text-gray-600 mb-8">
                  Connect to the MQTT broker to start monitoring and managing IoT device communications
                </p>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                  <div className="flex justify-center mb-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-time Monitoring</h3>
                  <p className="text-gray-600">Monitor sensor data and device status in real-time through MQTT topics</p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                  <div className="flex justify-center mb-4">
                    <div className="bg-green-100 p-3 rounded-full">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Topic Management</h3>
                  <p className="text-gray-600">Subscribe to multiple topics and organize your IoT device communications</p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                  <div className="flex justify-center mb-4">
                    <div className="bg-purple-100 p-3 rounded-full">
                      <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Message Analytics</h3>
                  <p className="text-gray-600">View and analyze messages from connected IoT devices and sensors</p>
                </div>
              </div>

              {/* Connection Status */}
              <div className="bg-white rounded-lg shadow-md p-8 border border-gray-200 mb-8">
                <div className="flex items-center justify-center mb-6">
                  <div className="bg-red-100 p-4 rounded-full mr-4">
                    <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Not Connected to MQTT Broker</h3>
                    <p className="text-gray-600 mt-1">Click the connect button above to establish connection</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-2">Connection Details:</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><span className="font-medium">Broker:</span> ws://10.2.216.208:9001</p>
                    <p><span className="font-medium">Protocol:</span> WebSocket MQTT</p>
                    <p><span className="font-medium">Status:</span> <span className="text-red-600 font-medium">Disconnected</span></p>
                  </div>
                </div>
              </div>

              {/* Workshop Info */}
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
                <h3 className="text-xl font-semibold mb-2">Welcome to the IoT Workshop</h3>
                <p className="text-indigo-100 mb-4">
                  Learn how to build and monitor IoT systems using MQTT protocol for device communication
                </p>
                <div className="flex flex-wrap justify-center gap-4 text-sm">
                  <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">Real-time Data</span>
                  <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">Device Management</span>
                  <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">Sensor Monitoring</span>
                  <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">MQTT Protocol</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-gray-100 border-t py-4 mt-8">
        <div className="max-w-7xl mx-auto text-center text-sm text-gray-500">
          MQTT Client Dashboard © {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
};

export default Home;