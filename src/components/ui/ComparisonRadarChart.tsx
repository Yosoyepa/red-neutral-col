"use client"

import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';

type Averages = {
  download: number;
  upload: number;
  latency: number;
};

type ComparisonRadarChartProps = {
  userResults: {
    download: number;
    upload: number;
    latency: number;
  };
  cityAverages: Averages;
  ispAverages: Averages;
};

const ComparisonRadarChart: React.FC<ComparisonRadarChartProps> = ({ 
  userResults, 
  cityAverages, 
  ispAverages 
}) => {
  // Normalize latency (lower is better) for visualization
  const normalizeLatency = (latency: number) => {
    const maxLatency = 100; // Assuming 100ms as a reasonable max
    return Math.max(0, (maxLatency - latency) / maxLatency * 100);
  };

  const data = [
    {
      metric: 'Descarga',
      user: userResults.download,
      city: cityAverages.download,
      isp: ispAverages.download,
    },
    {
      metric: 'Subida',
      user: userResults.upload,
      city: cityAverages.upload,
      isp: ispAverages.upload,
    },
    {
      metric: 'Latencia',
      user: normalizeLatency(userResults.latency),
      city: normalizeLatency(cityAverages.latency),
      isp: normalizeLatency(ispAverages.latency),
    },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const metric = payload[0].payload.metric;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
          <p className="text-sm font-semibold mb-1">{metric}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-xs">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="font-medium">{entry.name}:</span>
              <span>
                {metric === 'Latencia' 
                  ? `${userResults.latency} ms` 
                  : `${entry.value.toFixed(1)} Mbps`
                }
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // Only render if we have comparison data
  const hasValidData = (cityAverages.download > 0 || ispAverages.download > 0);

  if (!hasValidData) {
    return null;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart data={data}>
        <PolarGrid stroke="#e5e7eb" />
        <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12 }} />
        <PolarRadiusAxis 
          angle={90} 
          domain={[0, 'auto']} 
          tick={{ fontSize: 10 }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Radar 
          name="Tu resultado" 
          dataKey="user" 
          stroke="#3b82f6" 
          fill="#3b82f6" 
          fillOpacity={0.6} 
        />
        {cityAverages.download > 0 && (
          <Radar 
            name="Promedio ciudad" 
            dataKey="city" 
            stroke="#10b981" 
            fill="#10b981" 
            fillOpacity={0.3} 
          />
        )}
        {ispAverages.download > 0 && (
          <Radar 
            name="Promedio ISP" 
            dataKey="isp" 
            stroke="#f59e0b" 
            fill="#f59e0b" 
            fillOpacity={0.3} 
          />
        )}
        <Legend 
          wrapperStyle={{ fontSize: '12px' }}
          iconType="circle"
        />
      </RadarChart>
    </ResponsiveContainer>
  );
};

export default ComparisonRadarChart;
