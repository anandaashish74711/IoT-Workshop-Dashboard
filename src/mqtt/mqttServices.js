// Importing the MQTT library (using MQTT over WebSocket)
import mqtt from 'mqtt';

// Declare the MQTT client globally within this module
let client = null;

/**
 * Function to connect to the MQTT broker
 * @param {Function} onConnect - Callback for successful connection
 * @param {Function} onMessage - Callback for incoming messages
 * @param {Function} onError - Callback for connection errors (optional)
 */
export const connectClient = (onConnect, onMessage, onError) => {
  try {
    // Disconnect existing client if any
    if (client && client.connected) {
      client.end(true);
    }

    // Initialize the client connection
    client = mqtt.connect('ws://10.2.216.208:9001', {
      clean: true,
      clientId: `mqtt_client_${Math.random().toString(16).slice(2)}`,
      reconnectPeriod: 0,
      keepalive: 60,
      connectTimeout: 30 * 1000
    });

    // Bind event handlers
    client.on('connect', () => {
      console.log('MQTT Client connected successfully');
      if (onConnect) onConnect();
    });

    client.on('message', (topic, message) => {
      console.log(`Received message on topic ${topic}: ${message.toString()}`);
      if (onMessage) onMessage(topic, message);
    });

    client.on('error', (error) => {
      console.error('MQTT Connection error:', error);
      if (onError) onError(error);
    });

    client.on('close', () => {
      console.log('MQTT Connection closed');
    });

    client.on('disconnect', () => {
      console.log('MQTT Client disconnected');
    });

    client.on('offline', () => {
      console.log('MQTT Client is offline');
    });

    return client;
  } catch (error) {
    console.error('Error creating MQTT client:', error);
    if (onError) onError(error);
    return null;
  }
};

/**
 * Disconnect the client from the broker
 * @param {Function} onDisconnect - Callback for when the client disconnects
 */
export const disconnectClient = (onCloseCallback) => {
  if (client) {
    try {
      if (client.connected) {
        console.log('Disconnecting MQTT client...');
        client.end(true, () => {
          console.log('Client disconnected cleanly.');
          client = null;
          if (onCloseCallback) onCloseCallback();
        });
        
        // Fallback timeout in case the callback doesn't fire
        setTimeout(() => {
          if (client) {
            client = null;
            console.log('Force reset client reference');
          }
        }, 2000);
      } else {
        console.log('Client was already disconnected.');
        client = null;
        if (onCloseCallback) onCloseCallback();
      }
    } catch (error) {
      console.error('Error disconnecting client:', error);
      client = null;
      if (onCloseCallback) onCloseCallback();
    }
  } else {
    console.log('No client instance to disconnect.');
    if (onCloseCallback) onCloseCallback();
  }
};

/**
 * Subscribe to a specific topic on the broker
 * @param {string} topic - The MQTT topic to subscribe to
 */
export const subscribeToTopic = (topic) => {
  if (client && client.connected) {
    client.subscribe(topic, { qos: 0 }, (err) => {
      if (err) {
        console.error(`Failed to subscribe to topic ${topic}:`, err);
      } else {
        console.log(`Subscribed to topic: ${topic}`);
      }
    });
    return true;
  } else {
    console.warn('Client not connected. Cannot subscribe.');
    return false;
  }
};

/**
 * Unsubscribe from a specific topic
 * @param {string} topic - The MQTT topic to unsubscribe from
 */
export const unsubscribeFromTopic = (topic) => {
  if (client && client.connected) {
    client.unsubscribe(topic, (err) => {
      if (err) {
        console.error(`Failed to unsubscribe from topic ${topic}:`, err);
      } else {
        console.log(`Unsubscribed from topic: ${topic}`);
      }
    });
    return true;
  } else {
    console.warn('Client not connected. Cannot unsubscribe.');
    return false;
  }
};

/**
 * Publish a message to a topic with a timestamp appended
 * @param {string} topic - The topic to publish to
 * @param {string} message - The message payload
 */
export const publishMessage = (topic, message) => {
  if (client && client.connected) {
    const messageWithTimestamp = `${message} | ${new Date().toISOString()}`;
    client.publish(topic, messageWithTimestamp, { qos: 0, retain: false }, (err) => {
      if (err) {
        console.error(`Failed to publish message to ${topic}:`, err);
      } else {
        console.log(`Message published to ${topic}`);
      }
    });
    return true;
  } else {
    console.warn('Client not connected. Cannot publish message.');
    return false;
  }
};

/**
 * Get the current client status
 * @returns {Object} - Object containing connection status and client reference
 */
export const getClientStatus = () => {
  return {
    connected: client ? client.connected : false,
    client: client
  };
};