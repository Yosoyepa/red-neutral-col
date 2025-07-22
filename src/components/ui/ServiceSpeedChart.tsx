"use client"

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';

type ServiceComparison = {
  videoStreamingSpeed: number;
  socialMediaSpeed: number;
  generalWebSpeed: number;
};

type ServiceSpeedChartProps = {
  serviceComparison: ServiceComparison;
};

const ServiceSpeedChart: React.FC<ServiceSpeedChartProps> = ({ serviceComparison }) => {
  const data = [
    {
      name: 'Video Streaming',
      speed: serviceComparison.videoStreamingSpeed,
      label: `${serviceComparison.videoStreamingSpeed.toFixed(1)} Mbps`
    },
    {
      name: 'Redes Sociales',
      speed: serviceComparison.socialMediaSpeed,
      label: `${serviceComparison.socialMediaSpeed.toFixed(1)} Mbps`
    },
    {
      name: 'Navegación Web',
      speed: serviceComparison.generalWebSpeed,
      label: `${serviceComparison.generalWebSpeed.toFixed(1)} Mbps`
    },
  ];

  const maxSpeed = Math.max(
    serviceComparison.videoStreamingSpeed,
    serviceComparison.socialMediaSpeed,
    serviceComparison.generalWebSpeed
  );

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 rounded shadow-sm">
          <p className="text-sm font-medium">{payload[0].payload.name}</p>
          <p className="text-sm text-gray-600">{payload[0].payload.label}</p>
          {payload[0].value < 0.8 * maxSpeed && (
            <p className="text-xs text-red-600 mt-1">Posible throttling detectado</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart 
        data={data} 
        layout="vertical" 
        margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
      >
        <XAxis type="number" domain={[0, maxSpeed * 1.1]} tick={{ fontSize: 12 }} />
        <YAxis 
          dataKey="name" 
          type="category" 
          tick={{ fontSize: 12 }}
          width={90}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="speed" radius={[0, 4, 4, 0]}>
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.speed < 0.8 * maxSpeed ? '#ef4444' : '#3b82f6'}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ServiceSpeedChart;
