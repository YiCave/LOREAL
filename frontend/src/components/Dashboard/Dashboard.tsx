import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Divider
} from '@mui/material';
import {
  VideoLibrary as VideoIcon,
  Comment as CommentIcon,
  Security as SecurityIcon,
  TrendingUp as TrendingIcon,
  ThumbUp as LikeIcon,
  Warning as WarningIcon,
  Analytics as AnalyticsIcon,
  Topic as TopicIcon
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer,
  Area,
  AreaChart,
  ScatterChart,
  Scatter
} from 'recharts';

// Import real data from our analysis
import { 
  topicDistribution, 
  qualityMetrics, 
  engagementTrends, 
  spamSamples,
  topVideosByComments,
  getTopicName 
} from '../../services/dataService';

// Transform real data for charts
const topicChartData = topicDistribution.slice(0, 6).map(topic => ({
  name: topic.name,
  videos: topic.videos,
  percentage: topic.percentage
}));

const qualityChartData = [
  { name: 'Quality', value: qualityMetrics.quality_comments, color: '#00FF88' },
  { name: 'Spam', value: qualityMetrics.spam_comments, color: '#FF3D5A' },
  { name: 'Uncertain', value: qualityMetrics.uncertain_comments, color: '#FFD600' }
];

const COLORS = ['#FF6900', '#00C7BE', '#8E24AA', '#43A047', '#1E88E5', '#FB8C00'];

const Dashboard: React.FC = () => {
  const StatCard = ({ title, value, subtitle, color, progress }: any) => (
    <Card sx={{ 
      height: '100%',
      background: 'rgba(20,25,40,0.7)',
      boxShadow: `0 0 32px 0 ${color === 'primary' ? '#00E5FF55' : color === 'success' ? '#00FF8855' : color === 'info' ? '#00E5FF55' : '#FF4DFF55'}`,
      border: `1px solid ${color === 'primary' ? 'rgba(0,229,255,0.3)' : color === 'success' ? 'rgba(0,255,136,0.3)' : color === 'info' ? 'rgba(0,229,255,0.3)' : 'rgba(255,77,255,0.3)'}`,
      backdropFilter: 'blur(8px)',
      borderRadius: 4,
    }}>
      <CardContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" component="div" sx={{ color: 'text.secondary', mb: 1, fontSize: '1.1rem' }}>
            {title}
          </Typography>
          <Typography variant="h3" component="div" sx={{ 
            fontWeight: 'bold', 
            fontSize: '3rem', 
            background: `linear-gradient(90deg, ${color === 'primary' ? '#00E5FF, #FF4DFF' : color === 'success' ? '#00FF88, #00E5FF' : color === 'info' ? '#00E5FF, #FF4DFF' : '#FF4DFF, #FF3D5A'})`, 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent', 
            fontFamily: 'Orbitron, Inter, Roboto, Arial, sans-serif',
            lineHeight: 1.2
          }}>
          {value}
        </Typography>
          </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, ml: 1 }}>
          {subtitle}
        </Typography>
        {progress && (
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ 
              height: 8, 
              borderRadius: 4,
              backgroundColor: 'rgba(255,255,255,0.1)',
              '& .MuiLinearProgress-bar': {
                background: `linear-gradient(90deg, ${color === 'primary' ? '#00E5FF, #FF4DFF' : color === 'success' ? '#00FF88, #00E5FF' : color === 'info' ? '#00E5FF, #FF4DFF' : '#FF4DFF, #FF3D5A'})`,
                borderRadius: 4
              }
            }} 
          />
        )}
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ width: '100%', p: 4 }}>

      {/* Key Metrics Cards */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: 3, 
        mb: 4 
      }}>
        <StatCard
          title="Videos Analyzed"
          value={qualityMetrics.total_videos.toLocaleString()}
          subtitle="Across all beauty categories"
          color="primary"
          progress={85}
        />
        <StatCard
          title="Quality Comments"
          value={`${(qualityMetrics.quality_comments / 1000000).toFixed(2)}M`}
          subtitle={`${((qualityMetrics.quality_comments / qualityMetrics.total_comments) * 100).toFixed(1)}% of total comments`}
          color="success"
          progress={Math.round((qualityMetrics.quality_comments / qualityMetrics.total_comments) * 100)}
        />
        <StatCard
          title="Topics Discovered"
          value={qualityMetrics.topics_discovered.toString()}
          subtitle={`Coherence score: ${qualityMetrics.model_coherence}`}
          color="info"
          progress={75}
        />
        <StatCard
          title="Spam Detected"
          value={`${Math.round(qualityMetrics.spam_comments / 1000)}K`}
          subtitle={`${((qualityMetrics.spam_comments / qualityMetrics.total_comments) * 100).toFixed(1)}% filtered out`}
          color="error"
          progress={Math.round((qualityMetrics.quality_comments / qualityMetrics.total_comments) * 100)}
        />
        </Box>

      {/* Charts Section */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 3, mb: 3 }}>
          <Paper sx={{
            p: 3, mb: 3, borderRadius: 4,
            background: 'rgba(20,25,40,0.7)',
            boxShadow: '0 0 32px 0 #00E5FF55',
            border: '1px solid rgba(0,229,255,0.3)',
            backdropFilter: 'blur(8px)',
          }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                fontFamily: 'Orbitron, Inter, Roboto, Arial, sans-serif',
                fontWeight: 600,
                fontSize: '1.3rem',
                background: 'linear-gradient(90deg, #00E5FF, #FF4DFF)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2,
              }}>
              Top Video Topics Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={topicChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#E0E0E0" />
                <YAxis stroke="#9BA0B0" />
                <Tooltip contentStyle={{ background: '#181C2F', color: '#00E5FF', borderRadius: 12, boxShadow: '0 0 12px #00E5FF88' }} />
                <Bar
                  dataKey="videos"
                  radius={[12, 12, 12, 12]}
                  fill="url(#neonBarGradient)"
                  stroke="#00E5FF"
                  strokeWidth={2}
                  isAnimationActive={true}
                />
                <defs>
                  <linearGradient id="neonBarGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00E5FF" />
                    <stop offset="100%" stopColor="#FF4DFF" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        
          <Paper sx={{
            p: 3, mb: 3, borderRadius: 4,
            background: 'rgba(20,25,40,0.7)',
          boxShadow: '0 0 32px 0 #00E5FF55',
          border: '1px solid rgba(0,229,255,0.3)',
            backdropFilter: 'blur(8px)',
          }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                fontFamily: 'Orbitron, Inter, Roboto, Arial, sans-serif',
                fontWeight: 600,
                fontSize: '1.3rem',
              background: 'linear-gradient(90deg, #00E5FF, #00FF88)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2,
              }}>
              Comment Quality Breakdown
            </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Box sx={{ flex: '0 0 60%' }}>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={qualityChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="#222"
                  strokeWidth={3}
                  isAnimationActive={true}
                >
                  <Cell fill="url(#qualityGreen)" />
                  <Cell fill="url(#spamRed)" />
                  <Cell fill="url(#uncertainYellow)" />
                </Pie>
                <Tooltip 
                    formatter={(value: any, name: string) => [`${value.toLocaleString()} (${((value / qualityMetrics.total_comments) * 100).toFixed(1)}%)`, name]}
                    contentStyle={{ background: '#181C2F', color: '#FF3D5A', borderRadius: 12, boxShadow: '0 0 12px #FF3D5A88' }}
                />
                <defs>
                  <radialGradient id="qualityGreen" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#00FF88" />
                    <stop offset="100%" stopColor="#00E5FF" />
                  </radialGradient>
                  <radialGradient id="spamRed" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#FF3D5A" />
                    <stop offset="100%" stopColor="#FF4DFF" />
                  </radialGradient>
                  <radialGradient id="uncertainYellow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#FFD600" />
                      <stop offset="100%" stopColor="#FFA726" />
                  </radialGradient>
                </defs>
              </PieChart>
            </ResponsiveContainer>
            </Box>
            <Box sx={{ flex: '0 0 40%', display: 'flex', flexDirection: 'column', gap: 2, pr: 2 }}>
              {qualityChartData.map((item, index) => (
                <Box key={item.name} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      background: item.color,
                      boxShadow: `0 0 12px ${item.color}88`,
                    }}
                  />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body1" sx={{ color: 'white', fontWeight: 600 }}>
                      {item.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {item.value.toLocaleString()} comments ({((item.value / qualityMetrics.total_comments) * 100).toFixed(1)}%)
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
          </Paper>
      </Box>

      <Paper sx={{ 
        p: 3, 
        height: 400, 
        mb: 3, 
        background: 'rgba(20,25,40,0.7)',
        boxShadow: '0 0 32px 0 #00FF8855',
        border: '1px solid rgba(0,255,136,0.3)',
        backdropFilter: 'blur(8px)',
        borderRadius: 4,
      }}>
        <Typography 
          variant="h6" 
          gutterBottom
          sx={{
            fontFamily: 'Orbitron, Inter, Roboto, Arial, sans-serif',
            fontWeight: 600,
            fontSize: '1.3rem',
            background: 'linear-gradient(90deg, #00FF88, #00E5FF)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2,
          }}
        >
          Quality & Engagement Trends
        </Typography>
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={engagementTrends}>
            <defs>
              <linearGradient id="qualityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00FF88" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#00E5FF" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="spamGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF4DFF" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#FF3D5A" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="month" 
              stroke="#E0E0E0"
              fontSize={12}
              tick={{ fill: '#9BA0B0' }}
            />
            <YAxis 
              stroke="#9BA0B0"
              fontSize={12}
              tick={{ fill: '#9BA0B0' }}
            />
            <Tooltip 
              contentStyle={{ 
                background: '#181C2F', 
                color: '#00FF88', 
                borderRadius: 12, 
                boxShadow: '0 0 12px #00FF8888',
                border: '1px solid rgba(0,255,136,0.3)'
              }} 
            />
            <Area 
              type="monotone" 
              dataKey="quality" 
              stackId="1"
              stroke="#00FF88" 
              strokeWidth={3}
              fill="url(#qualityGradient)"
              fillOpacity={1}
            />
            <Area 
              type="monotone" 
              dataKey="spam" 
              stackId="1"
              stroke="#FF4DFF" 
              strokeWidth={3}
              fill="url(#spamGradient)"
              fillOpacity={1}
            />
          </AreaChart>
        </ResponsiveContainer>
        </Paper>

      {/* Spam Analysis Section */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, mb: 3 }}>
        <Paper sx={{ 
          p: 3,
          background: 'rgba(20,25,40,0.7)',
          boxShadow: '0 0 32px 0 #FF3D5A55',
          border: '1px solid rgba(255,61,90,0.3)',
          backdropFilter: 'blur(8px)',
          borderRadius: 4,
        }}>
          <Typography 
            variant="h6" 
            gutterBottom 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              fontFamily: 'Orbitron, Inter, Roboto, Arial, sans-serif',
              fontWeight: 600,
              fontSize: '1.2rem',
              background: 'linear-gradient(90deg, #FF3D5A, #FF4DFF)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            <WarningIcon sx={{ color: '#FF3D5A' }} />
            High-Confidence Spam Comments
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Real spam examples detected by our ML model with 99%+ confidence
          </Typography>
          <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
              {spamSamples.map((comment, idx) => {
                const accent = 'linear-gradient(90deg, #FF3D5A, #FF4DFF)';
                const glow = '#FF3D5A';
                const spamReasons = [];
                if (comment.spam_features) {
                  if (comment.spam_features.caps_ratio > 0.5) spamReasons.push('HIGH CAPS');
                  if (comment.spam_features.emoji_ratio > 0.3) spamReasons.push('EMOJI SPAM');
                  if (comment.textOriginal && comment.textOriginal.length < 5) spamReasons.push('SHORT SPAM');
                  if (comment.spam_features.repetition_ratio > 0.3) spamReasons.push('REPETITIVE');
                }
                // Fallback reason if no specific features detected
                if (spamReasons.length === 0) {
                  spamReasons.push('SPAM DETECTED');
                }
                return (
                  <Box key={idx} sx={{
                    background: 'rgba(20,25,40,0.85)',
                    borderRadius: 3,
                    p: 2,
                    mb: 2,
                    boxShadow: `0 4px 24px ${glow}88`,
                    fontWeight: 500,
                    position: 'relative',
                    border: `1px solid ${glow}99`,
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    backdropFilter: 'blur(4px)',
                    '&:hover': {
                      transform: 'translateY(-4px) scale(1.03)',
                      boxShadow: `0 8px 32px ${glow}`,
                    },
                  }}>
                    <Box sx={{
                      fontSize: '1.1rem',
                      mb: 1,
                      background: accent,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontFamily: 'Orbitron, Inter, Roboto, Arial, sans-serif',
                    }}>{comment.textOriginal}</Box>
                    <Box sx={{ fontSize: '0.85rem', color: glow, fontWeight: 600 }}>{(comment.classification_confidence * 100).toFixed(1)}% confidence</Box>
                    <Box sx={{ 
                      position: 'absolute', 
                      right: 16, 
                      top: 16,
                      display: 'flex',
                      flexDirection: 'row',
                      gap: 0.5,
                      flexWrap: 'wrap',
                      alignItems: 'flex-start',
                      justifyContent: 'flex-end'
                    }}>
                      {spamReasons.map((reason, reasonIdx) => (
                        <Box key={reasonIdx} sx={{ 
                          fontSize: '0.7rem', 
                          fontWeight: 600,
                          color: '#FF3D5A',
                          backgroundColor: 'rgba(255,61,90,0.1)',
                          border: '1px solid #FF3D5A',
                          borderRadius: '50px',
                          px: 1,
                          py: 0.2,
                          textTransform: 'uppercase',
                          letterSpacing: '0.3px',
                          whiteSpace: 'nowrap',
                          flexShrink: 0
                        }}>
                          {reason}
                        </Box>
                      ))}
                    </Box>
                  </Box>
                );
              })}
          </Box>
        </Paper>
      <Paper sx={{ 
        p: 3,
        background: 'rgba(20,25,40,0.7)',
        boxShadow: '0 0 32px 0 #00E5FF55',
        border: '1px solid rgba(0,229,255,0.3)',
        backdropFilter: 'blur(8px)',
        borderRadius: 4,
      }}>
          <Typography 
            variant="h6" 
            gutterBottom 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              fontFamily: 'Orbitron, Inter, Roboto, Arial, sans-serif',
              fontWeight: 600,
              fontSize: '1.2rem',
              background: 'linear-gradient(90deg, #00E5FF, #FF4DFF)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            <AnalyticsIcon sx={{ color: '#00E5FF' }} />
            Top Video Performance
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Highest engagement videos from our analysis
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Video</TableCell>
                  <TableCell align="right">Views</TableCell>
                  <TableCell align="right">Comments</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {topVideosByComments.slice(0, 5).map((video) => (
                  <TableRow key={video.videoId}>
                    <TableCell>
                      <Typography variant="body2" noWrap sx={{ maxWidth: 300 }}>
                        {video.title.substring(0, 60)}...
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      {(video.viewCount / 1000000).toFixed(1)}M
                    </TableCell>
                    <TableCell align="right">
                      {video.commentCount.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>

                </Box>
  );
};

export default Dashboard;
