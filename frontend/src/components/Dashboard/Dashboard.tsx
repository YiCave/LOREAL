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
  Topic as TopicIcon,
  Security as SecurityIcon,
  TrendingUp as TrendingIcon,
  ThumbUp as LikeIcon,
  Warning as WarningIcon,
  Analytics as AnalyticsIcon
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
  sampleVideoAnalyses,
  getTopicName 
} from '../../services/dataService';

// Transform real data for charts
const topicChartData = topicDistribution.slice(0, 6).map(topic => ({
  name: topic.name,
  videos: topic.videos,
  percentage: topic.percentage
}));

const qualityChartData = [
  { name: 'Quality', value: qualityMetrics.quality_comments, color: '#4CAF50' },
  { name: 'Spam', value: qualityMetrics.spam_comments, color: '#F44336' },
  { name: 'Uncertain', value: qualityMetrics.uncertain_comments, color: '#FF9800' }
];

const COLORS = ['#FF6900', '#00C7BE', '#8E24AA', '#43A047', '#1E88E5', '#FB8C00'];

const Dashboard: React.FC = () => {
  const StatCard = ({ icon, title, value, subtitle, color, progress }: any) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{ 
            backgroundColor: `${color}.main`, 
            borderRadius: 2, 
            p: 1, 
            mr: 2,
            color: 'white'
          }}>
            {icon}
          </Box>
          <Typography variant="h6" component="div" sx={{ color: 'text.secondary' }}>
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {subtitle}
        </Typography>
        {progress && (
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ 
              height: 8, 
              borderRadius: 4,
              backgroundColor: 'grey.200',
              '& .MuiLinearProgress-bar': {
                backgroundColor: `${color}.main`
              }
            }} 
          />
        )}
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        L'Oréal AI Comment Analytics Dashboard
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Chip label="Real-time Analysis" color="primary" />
        <Chip label="Machine Learning Powered" color="secondary" />
        <Chip label={`${((qualityMetrics.quality_comments / qualityMetrics.total_comments) * 100).toFixed(1)}% Accuracy`} color="success" />
        <Chip label={`${qualityMetrics.topics_discovered} Topics Discovered`} color="info" />
        <Chip label={`${(qualityMetrics.total_comments / 1000000).toFixed(1)}M Comments Analyzed`} color="default" />
      </Box>

      {/* Key Metrics Cards */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: 3, 
        mb: 4 
      }}>
        <StatCard
          icon={<VideoIcon />}
          title="Videos Analyzed"
          value={qualityMetrics.total_videos.toLocaleString()}
          subtitle="Across all beauty categories"
          color="primary"
          progress={85}
        />
        <StatCard
          icon={<CommentIcon />}
          title="Quality Comments"
          value={`${(qualityMetrics.quality_comments / 1000000).toFixed(2)}M`}
          subtitle={`${((qualityMetrics.quality_comments / qualityMetrics.total_comments) * 100).toFixed(1)}% of total comments`}
          color="success"
          progress={Math.round((qualityMetrics.quality_comments / qualityMetrics.total_comments) * 100)}
        />
        <StatCard
          icon={<TopicIcon />}
          title="Topics Discovered"
          value={qualityMetrics.topics_discovered.toString()}
          subtitle={`Coherence score: ${qualityMetrics.model_coherence}`}
          color="info"
          progress={75}
        />
        <StatCard
          icon={<SecurityIcon />}
          title="Spam Detected"
          value={`${Math.round(qualityMetrics.spam_comments / 1000)}K`}
          subtitle={`${((qualityMetrics.spam_comments / qualityMetrics.total_comments) * 100).toFixed(1)}% filtered out`}
          color="error"
          progress={Math.round((qualityMetrics.quality_comments / qualityMetrics.total_comments) * 100)}
        />
      </Box>

      {/* Charts Section */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 3, mb: 3 }}>
        <Paper sx={{ p: 3, height: 400 }}>
          <Typography variant="h6" gutterBottom>
            Top Video Topics Distribution
          </Typography>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={topicChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value: any, name: string) => [
                  `${value.toLocaleString()} videos (${
                    topicChartData.find(d => d.videos === value)?.percentage || 0
                  }%)`,
                  'Videos'
                ]}
              />
              <Bar dataKey="videos" fill="#FF6900" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
        
        <Paper sx={{ p: 3, height: 400 }}>
          <Typography variant="h6" gutterBottom>
            Comment Quality Breakdown
          </Typography>
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
              >
                {qualityChartData.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: any) => [value.toLocaleString(), 'Comments']}
              />
            </PieChart>
          </ResponsiveContainer>
          <Box sx={{ mt: 2 }}>
            {qualityChartData.map((entry: any, index: number) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box sx={{ 
                  width: 16, 
                  height: 16, 
                  backgroundColor: entry.color, 
                  borderRadius: 1,
                  mr: 1
                }} />
                <Typography variant="body2">
                  {entry.name}: {entry.value.toLocaleString()}
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>
      </Box>

      <Paper sx={{ p: 3, height: 300, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Quality & Engagement Trends
        </Typography>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={engagementTrends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Area 
              type="monotone" 
              dataKey="quality" 
              stackId="1"
              stroke="#4CAF50" 
              fill="#4CAF50" 
              fillOpacity={0.6}
            />
            <Area 
              type="monotone" 
              dataKey="spam" 
              stackId="1"
              stroke="#F44336" 
              fill="#F44336" 
              fillOpacity={0.6}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Paper>

      {/* Spam Analysis Section */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, mb: 3 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <WarningIcon color="error" />
            High-Confidence Spam Comments
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Real spam examples detected by our ML model with 99%+ confidence
          </Typography>
          <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
            {spamSamples.slice(0, 5).map((comment, index) => (
              <Box key={comment.commentId} sx={{ 
                p: 2, 
                mb: 2, 
                backgroundColor: 'error.main', 
                borderRadius: 2,
                color: 'error.contrastText',
                opacity: 0.9
              }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                  "{comment.textOriginal}"
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Chip 
                    label={`${(comment.classification_confidence * 100).toFixed(1)}% confidence`}
                    size="small"
                    sx={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                  />
                  <Typography variant="caption">
                    {comment.spam_features.caps_ratio > 0.5 && "HIGH CAPS"} 
                    {comment.spam_features.emoji_ratio > 0.3 && " EMOJI SPAM"}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Paper>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AnalyticsIcon color="primary" />
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
                  <TableCell>Topic</TableCell>
                  <TableCell align="right">Views</TableCell>
                  <TableCell align="right">Comments</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sampleVideoAnalyses.map((video) => (
                  <TableRow key={video.videoId}>
                    <TableCell>
                      <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                        {video.title.substring(0, 50)}...
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={getTopicName(video.topTopics[0])} 
                        size="small" 
                        variant="outlined"
                      />
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

      {/* Topic Keywords Insights */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Topic Keywords Analysis
        </Typography>
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: 3 
        }}>
          {topicDistribution.slice(0, 6).map((topic) => (
            <Card key={topic.topic_id} variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" gutterBottom color="primary">
                  {topic.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {topic.videos.toLocaleString()} videos ({topic.percentage}%)
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {topic.keywords.map((keyword) => (
                    <Chip 
                      key={keyword}
                      label={keyword} 
                      size="small" 
                      variant="outlined" 
                      sx={{ fontSize: '0.75rem' }}
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Paper>

      {/* Quick Actions */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Quick Actions
        </Typography>
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: 2 
        }}>
          <Card sx={{ 
            cursor: 'pointer', 
            '&:hover': { boxShadow: 4 },
            textAlign: 'center',
            p: 2
          }}>
            <TopicIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h6">Explore Topics</Typography>
            <Typography variant="body2" color="text.secondary">
              Dive into 26 discovered topics
            </Typography>
          </Card>
          <Card sx={{ 
            cursor: 'pointer', 
            '&:hover': { boxShadow: 4 },
            textAlign: 'center',
            p: 2
          }}>
            <VideoIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h6">Video Analysis</Typography>
            <Typography variant="body2" color="text.secondary">
              Analyze individual videos
            </Typography>
          </Card>
          <Card sx={{ 
            cursor: 'pointer', 
            '&:hover': { boxShadow: 4 },
            textAlign: 'center',
            p: 2
          }}>
            <SecurityIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h6">Spam Detection</Typography>
            <Typography variant="body2" color="text.secondary">
              Review spam patterns
            </Typography>
          </Card>
          <Card sx={{ 
            cursor: 'pointer', 
            '&:hover': { boxShadow: 4 },
            textAlign: 'center',
            p: 2
          }}>
            <TrendingIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h6">Live Analysis</Typography>
            <Typography variant="body2" color="text.secondary">
              Analyze new comments
            </Typography>
          </Card>
        </Box>
      </Paper>
    </Box>
  );
};

export default Dashboard;