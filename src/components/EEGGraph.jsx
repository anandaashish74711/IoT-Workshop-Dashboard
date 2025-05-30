import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const EEGGraph = ({ messages }) => {
  const data = messages.map((msg, index) => ({
    time: msg.timestamp || index,
    value: parseFloat(msg.content) || 0,
  }));

  const limitedData = data.slice(-30);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200 h-[45vh] flex flex-col">
      <h2 className="text-lg font-semibold mb-2">EEG Graph</h2>
      <div className="flex-1">
        {limitedData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-400">Waiting for EEG data...</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={limitedData}
              margin={{ top: 5, right: 5, left: 0, bottom: 20 }}  // removed left padding
            >
              {/* Grid */}
              <CartesianGrid stroke="#e0e0e0" strokeDasharray="3 3" />

              {/* X Axis */}
              <XAxis 
                dataKey="time"
                tick={{ fontSize: 10 }}
                stroke="#8884d8"
              />

              {/* Y Axis */}
              <YAxis 
                domain={['auto', 'auto']}
                width={30}   // reduce YAxis width
                tick={{ fontSize: 10 }}
                stroke="#8884d8"
              />

              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#4F46E5"
                strokeWidth={2}
                dot={false}
                isAnimationActive={true}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default EEGGraph;
