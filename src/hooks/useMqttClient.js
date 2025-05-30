import { useState } from 'react';


const useMqttClient = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState({});
  // State variable to track connection status

  return { isConnected, setIsConnected, messages, setMessages };
  // State variable to store messages received from the broker
};

export default useMqttClient;
