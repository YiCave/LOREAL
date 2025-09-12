import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid,
  Card,
  CardContent,
  Chip,
  Button
} from '@mui/material';
import { 
  Topic as TopicIcon,
  Visibility as ViewIcon,
  TrendingUp as TrendingIcon 
} from '@mui/icons-material';

// Sample topic data based on your actual results
const sampleTopics = [
  { id: 0, name: 'Portuguese/International', videos: 845, keywords: ['no', 'de', 'que', 'se', 'para'], engagement: 4.2 },
  { id: 1, name: 'Glitter & Effects', videos: 2438, keywords: ['glitter', 'effects', 'sparkle', 'shine'], engagement: 4.6 },
  { id: 6, name: 'Hair Care & Styling', videos: 2000, keywords: ['hair', 'style', 'care', 'treatment'], engagement: 4.4 },
  { id: 12, name: 'Makeup Tutorials', videos: 2400, keywords: ['makeup', 'tutorial', 'beauty', 'look'], engagement: 4.7 },
  { id: 15, name: 'Skincare Routines', videos: 4700, keywords: ['skincare', 'routine', 'clean', 'glow'], engagement: 4.3 },
  { id: 19, name: 'Product Reviews', videos: 6000, keywords: ['review', 'product', 'test', 'opinion'], engagement: 4.1 },
  { id: 20, name: 'Hair Transformation', videos: 8100, keywords: ['transformation', 'hair', 'change', 'new'], engagement: 4.8 }
];

const TopicCenter: React.FC = () => {
  const TopicCard = ({ topic }: { topic: any }) => (
    <Card sx={{ height: '100%', '&:hover': { boxShadow: 4 }, cursor: 'pointer' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <TopicIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6" component="div">
            Topic {topic.id}
          </Typography>
          <Chip 
            label={`${topic.videos.toLocaleString()} videos`} 
            size="small" 
            sx={{ ml: 'auto' }}
          />
        </Box>
        
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
          {topic.name}
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          {topic.keywords.map((keyword: string, index: number) => (
            <Chip 
              key={index}
              label={keyword} 
              size="small" 
              variant="outlined"
              sx={{ mr: 0.5, mb: 0.5 }}
            />
          ))}
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TrendingIcon color="success" sx={{ mr: 0.5, fontSize: 16 }} />
            <Typography variant="body2" color="text.secondary">
              {topic.engagement}/5 engagement
            </Typography>
          </Box>
          <Button size="small" variant="outlined">
            View Details
          </Button>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        Topic Intelligence Center
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
        <Chip label="26 Topics Discovered" color="primary" />
        <Chip label="Coherence Score: 0.531" color="success" />
        <Chip label="34,949 Videos Analyzed" color="info" />
      </Box>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Topic Overview
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Our advanced LDA topic modeling has discovered 26 distinct conversation themes across your YouTube content.
          Each topic represents a cluster of related discussions with associated keywords and engagement metrics.
        </Typography>
      </Paper>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>
        {sampleTopics.map((topic) => (
          <TopicCard key={topic.id} topic={topic} />
        ))}
        
        {/* Show remaining topics indicator */}
        <Card sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: 'grey.50',
          border: '2px dashed',
          borderColor: 'grey.300',
          minHeight: 200
        }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <ViewIcon sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              +19 More Topics
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Click to view all 26 discovered topics
            </Typography>
            <Button variant="outlined" sx={{ mt: 2 }}>
              View All
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default TopicCenter;