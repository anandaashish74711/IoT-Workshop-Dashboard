import React from 'react';
import { Power, PlugZap } from 'lucide-react';

const ConnectionManager = ({ isConnected, onConnect, onDisconnect }) => {
  return (
    <div className="flex gap-4">
      <button
        onClick={onConnect}
        disabled={isConnected}
        className={`flex items-center gap-2 ${isConnected ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} text-white font-semibold py-2 px-4 rounded-lg shadow transition`}
      >
        <PlugZap className="w-4 h-4" />
        Connect
      </button>

      <button
        onClick={onDisconnect}
        disabled={!isConnected}
        className={`flex items-center gap-2 ${!isConnected ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'} text-white font-semibold py-2 px-4 rounded-lg shadow transition`}
      >
        <Power className="w-4 h-4" />
        Disconnect
      </button>
    </div>
  );
};
export const disconnectClient = (client, onCloseCallback) => {
  if (client) {
    client.end(true, {}, () => {
      console.log('MQTT client disconnected');
      onCloseCallback();
    });
  } else {
    console.log('No MQTT client to disconnect');
    onCloseCallback();
  }
};

export default ConnectionManager;
