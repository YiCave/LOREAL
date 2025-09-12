import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  Fade,
  IconButton,
  Badge,
  Tooltip,
} from '@mui/material';
import {
  EmojiEvents as TrophyIcon,
  KeyboardArrowRight as ArrowIcon,
  Close as CloseIcon,
  TrendingUp as TrendingIcon,
  Visibility as ViewIcon,
  Comment as CommentIcon,
} from '@mui/icons-material';
import { topicDistribution, getTopicCoherence } from '../../services/dataService';

interface TopicLeaderboardProps {
  maxTopics?: number;
}

const TopicLeaderboard: React.FC<TopicLeaderboardProps> = ({ maxTopics = 10 }) => {
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const sortedTopics = [...topicDistribution]
    .sort((a, b) => b.videos - a.videos)
    .slice(0, maxTopics);

  const handleTopicClick = (topicId: number) => {
    setSelectedTopic(topicId);
    setDialogOpen(true);
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return rank.toString();
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return '#FFD700';
    if (rank === 2) return '#C0C0C0';
    if (rank === 3) return '#CD7F32';
    return '#666666';
  };

  const TopicDetailDialog = () => {
    const topic = topicDistribution.find(t => t.topic_id === selectedTopic);
    if (!topic) return null;

    return (
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: '#1E1E1E',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 3,
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          color: '#E0E0E0',
          pb: 1
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TrophyIcon sx={{ color: '#FF6900', mr: 1 }} />
            <Typography variant="h5" fontWeight="700">
              {topic.name}
            </Typography>
          </Box>
          <IconButton 
            onClick={() => setDialogOpen(false)}
            sx={{ color: '#A0A0A0' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent>
          <Box sx={{ py: 2 }}>
            {/* Topic Stats */}
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
              gap: 2, 
              mb: 4 
            }}>
              <Card sx={{ backgroundColor: 'rgba(255, 105, 0, 0.1)', border: '1px solid rgba(255, 105, 0, 0.3)' }}>
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <ViewIcon sx={{ color: '#FF6900', fontSize: 20, mr: 1 }} />
                    <Typography variant="body2" color="#FF6900" fontWeight="600">
                      Videos
                    </Typography>
                  </Box>
                  <Typography variant="h5" color="#E0E0E0" fontWeight="700">
                    {topic.videos.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="#A0A0A0">
                    {topic.percentage}% of total
                  </Typography>
                </CardContent>
              </Card>

              <Card sx={{ backgroundColor: 'rgba(67, 160, 71, 0.1)', border: '1px solid rgba(67, 160, 71, 0.3)' }}>
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <TrendingIcon sx={{ color: '#43A047', fontSize: 20, mr: 1 }} />
                    <Typography variant="body2" color="#43A047" fontWeight="600">
                      Coherence Score
                    </Typography>
                  </Box>
                  <Typography variant="h5" color="#E0E0E0" fontWeight="700">
                    {topic.coherence_score?.toFixed(3) || 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="#A0A0A0">
                    Topic quality
                  </Typography>
                </CardContent>
              </Card>
            </Box>

            {/* Keywords Section */}
            <Typography variant="h6" color="#FF6900" gutterBottom sx={{ mb: 2 }}>
              🔑 Top Keywords
            </Typography>
            
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: 3, 
              mb: 4 
            }}>
              {/* Keyword Chips */}
              <Box>
                <Typography variant="subtitle2" color="#B0B0B0" gutterBottom>
                  Key Terms
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {topic.keywords.map((keyword, index) => (
                    <Chip
                      key={keyword}
                      label={keyword}
                      size="small"
                      sx={{
                        backgroundColor: `hsla(${20 + index * 40}, 70%, 50%, 0.2)`,
                        color: `hsla(${20 + index * 40}, 70%, 70%, 1)`,
                        border: `1px solid hsla(${20 + index * 40}, 70%, 50%, 0.5)`,
                        fontSize: '0.8rem'
                      }}
                    />
                  ))}
                </Box>
              </Box>

              {/* Keyword Probabilities */}
              <Box>
                <Typography variant="subtitle2" color="#B0B0B0" gutterBottom>
                  Keyword Probabilities
                </Typography>
                {topic.top_keywords.slice(0, 5).map((kw, index) => (
                  <Box key={kw.keyword} sx={{ mb: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2" color="#E0E0E0">
                        {kw.keyword}
                      </Typography>
                      <Typography variant="body2" color="#A0A0A0">
                        {(kw.probability * 100).toFixed(1)}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={kw.probability * 100}
                      sx={{
                        height: 4,
                        borderRadius: 2,
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: `hsla(${20 + index * 30}, 70%, 60%, 1)`,
                          borderRadius: 2
                        }
                      }}
                    />
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Performance Insights */}
            <Typography variant="h6" color="#FF6900" gutterBottom sx={{ mb: 2 }}>
              📊 Topic Insights
            </Typography>
            
            <Box sx={{ 
              p: 3, 
              backgroundColor: 'rgba(255, 255, 255, 0.03)', 
              borderRadius: 2,
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <Typography variant="body1" color="#B0B0B0" paragraph>
                This topic represents <strong>{topic.percentage}%</strong> of all analyzed videos, 
                making it the <strong>#{sortedTopics.findIndex(t => t.topic_id === topic.topic_id) + 1}</strong> most 
                popular topic in the L'Oréal beauty community.
              </Typography>
              
              {topic.coherence_score && topic.coherence_score > 0.5 && (
                <Typography variant="body2" color="#43A047">
                  ✅ High coherence score indicates this is a well-defined, distinct topic.
                </Typography>
              )}
              
              {topic.videos > 5000 && (
                <Typography variant="body2" color="#FF9800" sx={{ mt: 1 }}>
                  🔥 High-volume topic with significant audience engagement.
                </Typography>
              )}
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom fontWeight="600" color="#E0E0E0">
          🏆 Topic Leaderboard
        </Typography>
        <Typography variant="body2" color="#A0A0A0" sx={{ mb: 3 }}>
          Top beauty topics by video count
        </Typography>

        <List sx={{ p: 0 }}>
          {sortedTopics.map((topic, index) => {
            const rank = index + 1;
            const maxVideos = sortedTopics[0].videos;
            const progressValue = (topic.videos / maxVideos) * 100;

            return (
              <Fade in={true} timeout={300 + index * 100} key={topic.topic_id}>
                <ListItem
                  sx={{
                    p: 2,
                    mb: 1,
                    borderRadius: 2,
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 105, 0, 0.08)',
                      transform: 'translateX(4px)',
                      boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.3)',
                    }
                  }}
                  onClick={() => handleTopicClick(topic.topic_id)}
                >
                  <ListItemAvatar>
                    <Badge
                      badgeContent={topic.coherence_score && topic.coherence_score > 0.5 ? '⭐' : null}
                      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    >
                      <Avatar
                        sx={{
                          backgroundColor: getRankColor(rank),
                          color: rank <= 3 ? '#000' : '#fff',
                          fontWeight: 700,
                          fontSize: rank <= 3 ? '1.2rem' : '0.9rem'
                        }}
                      >
                        {getRankIcon(rank)}
                      </Avatar>
                    </Badge>
                  </ListItemAvatar>
                  
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="subtitle1" fontWeight="600" color="#E0E0E0">
                          {topic.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="h6" fontWeight="700" color="#FF6900" sx={{ mr: 1 }}>
                            {topic.videos.toLocaleString()}
                          </Typography>
                          <ArrowIcon sx={{ color: '#A0A0A0' }} />
                        </Box>
                      </Box>
                    }
                    secondary={
                      <Box sx={{ mt: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="body2" color="#A0A0A0">
                            {topic.percentage}% of all videos
                          </Typography>
                          {topic.coherence_score && (
                            <Tooltip title="Topic Coherence Score">
                              <Typography variant="body2" color="#43A047">
                                📊 {topic.coherence_score.toFixed(3)}
                              </Typography>
                            </Tooltip>
                          )}
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={progressValue}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: rank === 1 ? '#FFD700' : rank === 2 ? '#C0C0C0' : rank === 3 ? '#CD7F32' : '#FF6900',
                              borderRadius: 3
                            }
                          }}
                        />
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                          {topic.keywords.slice(0, 3).map(keyword => (
                            <Chip
                              key={keyword}
                              label={keyword}
                              size="small"
                              sx={{
                                fontSize: '0.7rem',
                                height: '20px',
                                backgroundColor: 'rgba(255, 105, 0, 0.1)',
                                color: '#FF6900',
                                border: '1px solid rgba(255, 105, 0, 0.3)'
                              }}
                            />
                          ))}
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
              </Fade>
            );
          })}
        </List>
      </CardContent>

      <TopicDetailDialog />
    </Card>
  );
};

export default TopicLeaderboard;