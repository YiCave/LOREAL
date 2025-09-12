import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Tooltip,
  Chip,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  ComposedChart,
  Scatter,
} from 'recharts';
import { coherenceScores } from '../../services/dataService';

const CoherenceChart: React.FC = () => {
  const optimalK = 26;
  const optimalScore = coherenceScores.find(d => d.k === optimalK)?.coherence_score || 0;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const isOptimal = label === optimalK;
      
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
            K = {label} Topics
          </Typography>
          <Typography variant="body2" color="#FF6900" fontWeight="600">
            Coherence: {data.value.toFixed(4)}
          </Typography>
          {isOptimal && (
            <Typography variant="body2" color="#43A047" fontWeight="600">
              🎯 Optimal Configuration
            </Typography>
          )}
          <Typography variant="caption" color="#A0A0A0">
            {isOptimal ? 'Best balance of topic quality and quantity' : 
             data.value > 0.5 ? 'Good topic coherence' : 'Lower topic coherence'}
          </Typography>
        </Box>
      );
    }
    return null;
  };

  const CustomDot = (props: any) => {
    const { cx, cy, payload } = props;
    const isOptimal = payload.k === optimalK;
    
    return (
      <g>
        {isOptimal && (
          <circle
            cx={cx}
            cy={cy}
            r={12}
            fill="none"
            stroke="#43A047"
            strokeWidth={3}
            opacity={0.6}
          >
            <animate
              attributeName="r"
              values="8;16;8"
              dur="2s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="1;0.3;1"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
        )}
        <circle
          cx={cx}
          cy={cy}
          r={isOptimal ? 8 : 4}
          fill={isOptimal ? '#43A047' : '#FF6900'}
          stroke={isOptimal ? '#66BB6A' : '#FF8533'}
          strokeWidth={2}
        />
        {isOptimal && (
          <text
            x={cx}
            y={cy - 20}
            textAnchor="middle"
            fill="#43A047"
            fontSize="12"
            fontWeight="600"
          >
            Optimal K
          </text>
        )}
      </g>
    );
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography variant="h6" fontWeight="600" color="#E0E0E0">
              📈 Topic Coherence Optimization
            </Typography>
            <Typography variant="body2" color="#A0A0A0">
              Model performance across different topic counts
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip
              label={`Optimal K = ${optimalK}`}
              size="small"
              sx={{
                backgroundColor: 'rgba(67, 160, 71, 0.2)',
                color: '#43A047',
                border: '1px solid rgba(67, 160, 71, 0.5)',
                fontWeight: 600
              }}
            />
            <Chip
              label={`Score: ${optimalScore.toFixed(4)}`}
              size="small"
              sx={{
                backgroundColor: 'rgba(255, 105, 0, 0.2)',
                color: '#FF6900',
                border: '1px solid rgba(255, 105, 0, 0.5)',
                fontWeight: 600
              }}
            />
          </Box>
        </Box>

        <Box sx={{ height: 300, mt: 2 }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={coherenceScores} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
              <defs>
                <linearGradient id="coherenceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF6900" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#FF6900" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
              <XAxis 
                dataKey="k" 
                stroke="#A0A0A0"
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: 'rgba(255, 255, 255, 0.2)' }}
              />
              <YAxis 
                stroke="#A0A0A0"
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: 'rgba(255, 255, 255, 0.2)' }}
                domain={['dataMin - 0.01', 'dataMax + 0.01']}
                tickFormatter={(value) => value.toFixed(3)}
              />
              
              <RechartsTooltip content={<CustomTooltip />} />
              
              {/* Reference line for optimal score */}
              <ReferenceLine 
                y={optimalScore} 
                stroke="#43A047" 
                strokeDasharray="4 4"
                strokeOpacity={0.7}
                label={{ value: "Optimal", position: "left", fill: "#43A047" }}
              />
              
              {/* Reference line for optimal K */}
              <ReferenceLine 
                x={optimalK} 
                stroke="#43A047" 
                strokeDasharray="4 4"
                strokeOpacity={0.7}
              />
              
              {/* Area under the curve */}
              <Area
                type="monotone"
                dataKey="coherence_score"
                fill="url(#coherenceGradient)"
                strokeWidth={0}
              />
              
              {/* Main line */}
              <Line
                type="monotone"
                dataKey="coherence_score"
                stroke="#FF6900"
                strokeWidth={3}
                dot={<CustomDot />}
                activeDot={{ r: 6, stroke: '#FF6900', strokeWidth: 2, fill: '#FF8533' }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </Box>

        <Box sx={{ mt: 3, p: 2, backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: 2 }}>
          <Typography variant="body2" color="#B0B0B0" paragraph>
            <strong>Coherence Score</strong> measures how semantically similar the words in each topic are. 
            Higher scores indicate better-defined, more interpretable topics.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            <Box>
              <Typography variant="caption" color="#43A047" fontWeight="600">
                Optimal Range
              </Typography>
              <Typography variant="body2" color="#A0A0A0">
                0.50 - 0.70
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="#FF6900" fontWeight="600">
                Our Score
              </Typography>
              <Typography variant="body2" color="#A0A0A0">
                {optimalScore.toFixed(4)}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="#FF9800" fontWeight="600">
                Topics Found
              </Typography>
              <Typography variant="body2" color="#A0A0A0">
                {optimalK} topics
              </Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CoherenceChart;