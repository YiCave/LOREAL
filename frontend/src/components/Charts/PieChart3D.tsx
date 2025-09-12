import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Box, Typography } from '@mui/material';
import { qualityMetrics } from '../../services/dataService';

const data = [
  { name: 'Quality Comments', value: qualityMetrics.quality_comments, color: '#43A047', percentage: 92.9 },
  { name: 'Spam Comments', value: qualityMetrics.spam_comments, color: '#F44336', percentage: 7.1 },
  { name: 'Uncertain', value: qualityMetrics.uncertain_comments, color: '#FF9800', percentage: 0.1 }
];

const PieChart3D: React.FC = () => {
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize="12"
        fontWeight="600"
        style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}
      >
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    );
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <Box
          sx={{
            backgroundColor: '#2A2A2A',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 2,
            p: 2,
            boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.4)',
          }}
        >
          <Typography variant="subtitle2" color="white" fontWeight="600">
            {data.payload.name}
          </Typography>
          <Typography variant="body2" color="#B0B0B0">
            {data.payload.value.toLocaleString()} comments
          </Typography>
          <Typography variant="body2" sx={{ color: data.payload.color }}>
            {data.payload.percentage}% of total
          </Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <Box sx={{ width: '100%', height: 400, position: 'relative' }}>
      {/* 3D Shadow Effect */}
      <Box
        sx={{
          position: 'absolute',
          top: 8,
          left: 8,
          right: 0,
          bottom: 0,
          opacity: 0.3,
          filter: 'blur(8px)',
          zIndex: 0,
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={120}
              innerRadius={40}
              fill="#000"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`shadow-cell-${index}`} fill="rgba(0,0,0,0.5)" />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </Box>

      {/* Main Pie Chart */}
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <defs>
              <linearGradient id="qualityGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#66BB6A" />
                <stop offset="100%" stopColor="#2E7D32" />
              </linearGradient>
              <linearGradient id="spamGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#EF5350" />
                <stop offset="100%" stopColor="#C62828" />
              </linearGradient>
              <linearGradient id="uncertainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFA726" />
                <stop offset="100%" stopColor="#E65100" />
              </linearGradient>
            </defs>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomLabel}
              outerRadius={120}
              innerRadius={40}
              fill="#8884d8"
              dataKey="value"
              startAngle={90}
              endAngle={450}
              paddingAngle={2}
              animationBegin={0}
              animationDuration={1500}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={index === 0 ? 'url(#qualityGradient)' : 
                        index === 1 ? 'url(#spamGradient)' : 
                        'url(#uncertainGradient)'}
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </Box>

      {/* Center Label */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          zIndex: 2,
        }}
      >
        <Typography variant="h6" color="primary" fontWeight="700">
          {qualityMetrics.total_comments.toLocaleString()}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Total Comments
        </Typography>
      </Box>
    </Box>
  );
};

export default PieChart3D;