import React, { useState } from 'react';
import {
  Box,
  Typography,
  Chip,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  Fade,
  IconButton,
  Button,
} from '@mui/material';
import {
  EmojiEvents as TrophyIcon,
  KeyboardArrowRight as ArrowIcon,
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
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
  const [showAllTopics, setShowAllTopics] = useState(false);

  const sortedTopics = [...topicDistribution]
    .sort((a, b) => b.videos - a.videos);
  
  const displayedTopics = showAllTopics ? sortedTopics : sortedTopics.slice(0, 11);

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
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            background: 'linear-gradient(135deg, rgba(20,25,40,0.95) 0%, rgba(30,35,50,0.95) 100%)',
            border: '2px solid rgba(0,229,255,0.3)',
            borderRadius: 4,
            boxShadow: '0 0 40px rgba(0,229,255,0.2), 0 0 80px rgba(0,255,136,0.1)',
            backdropFilter: 'blur(20px)',
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          background: 'linear-gradient(90deg, rgba(0,229,255,0.1) 0%, rgba(0,255,136,0.1) 100%)',
          borderBottom: '1px solid rgba(0,229,255,0.2)',
          p: 3
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{
              width: 50,
              height: 50,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #00E5FF, #00FF88)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 2,
              boxShadow: '0 0 20px rgba(0,229,255,0.5)'
            }}>
              <TrophyIcon sx={{ color: '#1E1E1E', fontSize: 28 }} />
            </Box>
            <Typography variant="h4" sx={{
              background: 'linear-gradient(90deg, #00E5FF, #00FF88)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 700,
              fontFamily: 'Orbitron, Arial, sans-serif',
              textShadow: '0 0 20px rgba(0,229,255,0.5)'
            }}>
              {topic.name}
            </Typography>
          </Box>
          <IconButton 
            onClick={() => setDialogOpen(false)}
            sx={{ 
              color: '#00E5FF',
              '&:hover': {
                backgroundColor: 'rgba(0,229,255,0.1)',
                boxShadow: '0 0 15px rgba(0,229,255,0.3)'
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ p: 4 }}>
          <Box sx={{ py: 2 }}>
            {/* Topic Stats */}
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: 3, 
              mb: 4 
            }}>
              <Box sx={{ 
                background: 'linear-gradient(135deg, rgba(0,229,255,0.1) 0%, rgba(0,229,255,0.05) 100%)',
                border: '2px solid rgba(0,229,255,0.3)',
                borderRadius: 3,
                p: 3,
                boxShadow: '0 0 20px rgba(0,229,255,0.2)',
                backdropFilter: 'blur(10px)'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #00E5FF, #0099CC)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2,
                    boxShadow: '0 0 15px rgba(0,229,255,0.4)'
                  }}>
                    <ViewIcon sx={{ color: '#FFFFFF', fontSize: 20 }} />
                  </Box>
                  <Typography variant="h6" sx={{
                    background: 'linear-gradient(90deg, #00E5FF, #FFFFFF)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: 700,
                    fontFamily: 'Orbitron, Arial, sans-serif'
                  }}>
                      Videos
                    </Typography>
                  </Box>
                <Typography variant="h4" sx={{
                  color: '#00E5FF',
                  fontWeight: 900,
                  fontFamily: 'Orbitron, Arial, sans-serif',
                  textShadow: '0 0 20px rgba(0,229,255,0.5)'
                }}>
                    {topic.videos.toLocaleString()}
                  </Typography>
                <Typography variant="body1" sx={{
                  color: 'rgba(255,255,255,0.8)',
                  mt: 1,
                  fontWeight: 500
                }}>
                    {topic.percentage}% of total
                  </Typography>
              </Box>

              <Box sx={{ 
                background: 'linear-gradient(135deg, rgba(0,255,136,0.1) 0%, rgba(0,255,136,0.05) 100%)',
                border: '2px solid rgba(0,255,136,0.3)',
                borderRadius: 3,
                p: 3,
                boxShadow: '0 0 20px rgba(0,255,136,0.2)',
                backdropFilter: 'blur(10px)'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #00FF88, #00CC66)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2,
                    boxShadow: '0 0 15px rgba(0,255,136,0.4)'
                  }}>
                    <TrendingIcon sx={{ color: '#FFFFFF', fontSize: 20 }} />
                  </Box>
                  <Typography variant="h6" sx={{
                    background: 'linear-gradient(90deg, #00FF88, #FFFFFF)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: 700,
                    fontFamily: 'Orbitron, Arial, sans-serif'
                  }}>
                      Coherence Score
                    </Typography>
                  </Box>
                <Typography variant="h4" sx={{
                  color: '#00FF88',
                  fontWeight: 900,
                  fontFamily: 'Orbitron, Arial, sans-serif',
                  textShadow: '0 0 20px rgba(0,255,136,0.5)'
                }}>
                    {topic.coherence_score?.toFixed(3) || 'N/A'}
                  </Typography>
                <Typography variant="body1" sx={{
                  color: 'rgba(255,255,255,0.8)',
                  mt: 1,
                  fontWeight: 500
                }}>
                    Topic quality
                  </Typography>
              </Box>
            </Box>

            {/* Keywords Section */}
            <Typography variant="h4" sx={{
              background: 'linear-gradient(90deg, #00E5FF, #00FF88)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 700,
              fontFamily: 'Orbitron, Arial, sans-serif',
              mb: 3,
              textShadow: '0 0 20px rgba(0,229,255,0.5)'
            }}>
              Top Keywords
            </Typography>
            
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: 4, 
              mb: 4 
            }}>
              {/* Keyword Chips */}
              <Box sx={{
                background: 'linear-gradient(135deg, rgba(0,229,255,0.05) 0%, rgba(0,229,255,0.02) 100%)',
                border: '1px solid rgba(0,229,255,0.2)',
                borderRadius: 3,
                p: 3,
                backdropFilter: 'blur(10px)'
              }}>
                <Typography variant="h6" sx={{
                  color: '#00E5FF',
                  fontWeight: 600,
                  fontFamily: 'Orbitron, Arial, sans-serif',
                  mb: 2
                }}>
                  Key Terms
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                  {topic.keywords.map((keyword, index) => (
                    <Chip
                      key={keyword}
                      label={keyword}
                      size="medium"
                      sx={{
                        background: `linear-gradient(135deg, hsla(${20 + index * 40}, 70%, 50%, 0.2), hsla(${20 + index * 40}, 70%, 50%, 0.1))`,
                        color: `hsla(${20 + index * 40}, 70%, 80%, 1)`,
                        border: `2px solid hsla(${20 + index * 40}, 70%, 50%, 0.5)`,
                        fontSize: '1rem',
                        fontWeight: 600,
                        height: 40,
                        '&:hover': {
                          background: `linear-gradient(135deg, hsla(${20 + index * 40}, 70%, 50%, 0.3), hsla(${20 + index * 40}, 70%, 50%, 0.2))`,
                          boxShadow: `0 0 15px hsla(${20 + index * 40}, 70%, 50%, 0.4)`
                        }
                      }}
                    />
                  ))}
                </Box>
              </Box>

              {/* Keyword Probabilities */}
              <Box sx={{
                background: 'linear-gradient(135deg, rgba(0,255,136,0.05) 0%, rgba(0,255,136,0.02) 100%)',
                border: '1px solid rgba(0,255,136,0.2)',
                borderRadius: 3,
                p: 3,
                backdropFilter: 'blur(10px)'
              }}>
                <Typography variant="h6" sx={{
                  color: '#00FF88',
                  fontWeight: 600,
                  fontFamily: 'Orbitron, Arial, sans-serif',
                  mb: 2
                }}>
                  Keyword Probabilities
                </Typography>
                {topic.top_keywords.slice(0, 5).map((kw, index) => (
                  <Box key={kw.keyword} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="h6" sx={{
                        color: '#FFFFFF',
                        fontWeight: 600,
                        fontSize: '1.1rem'
                      }}>
                        {kw.keyword}
                      </Typography>
                      <Typography variant="h6" sx={{
                        color: '#00FF88',
                        fontWeight: 700,
                        fontFamily: 'Orbitron, Arial, sans-serif'
                      }}>
                        {(kw.probability * 100).toFixed(1)}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={kw.probability * 100}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        boxShadow: '0 0 10px rgba(0,255,136,0.2)',
                        '& .MuiLinearProgress-bar': {
                          background: `linear-gradient(90deg, hsla(${120 + index * 30}, 70%, 60%, 1), hsla(${120 + index * 30}, 70%, 80%, 1))`,
                          borderRadius: 4,
                          boxShadow: `0 0 15px hsla(${120 + index * 30}, 70%, 60%, 0.6)`
                        }
                      }}
                    />
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Performance Insights */}
            <Typography variant="h4" sx={{
              background: 'linear-gradient(90deg, #00E5FF, #00FF88)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 700,
              fontFamily: 'Orbitron, Arial, sans-serif',
              mb: 3,
              textShadow: '0 0 20px rgba(0,229,255,0.5)'
            }}>
              Topic Insights
            </Typography>
            
            <Box sx={{ 
              p: 4, 
              background: 'linear-gradient(135deg, rgba(0,229,255,0.05) 0%, rgba(0,255,136,0.05) 100%)', 
              borderRadius: 3,
              border: '2px solid rgba(0,229,255,0.2)',
              boxShadow: '0 0 30px rgba(0,229,255,0.1)',
              backdropFilter: 'blur(15px)'
            }}>
              <Typography variant="h6" sx={{
                color: '#FFFFFF',
                fontWeight: 600,
                fontFamily: 'Orbitron, Arial, sans-serif',
                mb: 2
              }}>
                This topic represents <span style={{ color: '#00E5FF', fontWeight: 700 }}>{topic.percentage}%</span> of all analyzed videos, 
                making it the <span style={{ color: '#00FF88', fontWeight: 700 }}>#{sortedTopics.findIndex(t => t.topic_id === topic.topic_id) + 1}</span> most 
                popular topic in the L'Oréal beauty community.
              </Typography>
              
              {topic.coherence_score && topic.coherence_score > 0.5 && (
                <Box sx={{
                  mt: 2,
                  p: 2,
                  background: 'linear-gradient(135deg, rgba(0,255,136,0.1), rgba(0,255,136,0.05))',
                  border: '1px solid rgba(0,255,136,0.3)',
                  borderRadius: 2
                }}>
                  <Typography variant="body1" sx={{
                    color: '#00FF88',
                    fontWeight: 600
                  }}>
                    High coherence score indicates this is a well-defined, distinct topic.
                </Typography>
                </Box>
              )}
              
              {topic.videos > 5000 && (
                <Box sx={{
                  mt: 2,
                  p: 2,
                  background: 'linear-gradient(135deg, rgba(255,165,0,0.1), rgba(255,165,0,0.05))',
                  border: '1px solid rgba(255,165,0,0.3)',
                  borderRadius: 2
                }}>
                  <Typography variant="body1" sx={{
                    color: '#FFA500',
                    fontWeight: 600
                  }}>
                    High-volume topic with significant audience engagement.
                </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Top 3 Podium - Individual Rounded Components */}
      <Box sx={{ 
        width: '100%',
        mb: 4,
        background: 'rgba(20,25,40,0.7)',
        borderRadius: 4,
        border: '1px solid rgba(0,229,255,0.2)',
        boxShadow: '0 0 20px 0 rgba(0,229,255,0.15)',
        backdropFilter: 'blur(8px)',
        p: 2
      }}>
        <Box sx={{ 
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          gap: 0,
          width: '100%',
          minHeight: '320px'
        }}>
          {/* 2nd Place - Electric Cyan */}
          <Box sx={{ 
            flex: '1',
            height: '240px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            background: 'linear-gradient(135deg, #00FFFF 0%, #00E5FF 25%, #0099CC 50%, #006699 75%, #003D66 100%)',
            borderRadius: '20px 20px 8px 8px',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative',
            boxShadow: '0 8px 24px rgba(0,255,255,0.4), 0 0 40px rgba(0,229,255,0.3), inset 0 2px 4px rgba(255,255,255,0.2)',
            border: '2px solid rgba(0,255,255,0.6)',
            marginRight: '-1px',
            '&:hover': {
              transform: 'translateY(-8px)',
              boxShadow: '0 16px 32px rgba(0,255,255,0.6), 0 0 60px rgba(0,229,255,0.5), inset 0 2px 4px rgba(255,255,255,0.3)',
              zIndex: 2
            },
            '&::before': {
              content: '""',
              position: 'absolute',
              top: -2,
              left: -2,
              right: -2,
              bottom: -2,
              background: 'linear-gradient(135deg, #00FFFF, #0099FF, #0066CC)',
              borderRadius: '22px 22px 10px 10px',
              zIndex: -1,
              opacity: 0.8
            }
          }}
          onClick={() => sortedTopics[1] && handleTopicClick(sortedTopics[1].topic_id)}
          >
            <Typography sx={{
              fontSize: { xs: '6rem', md: '8rem', lg: '10rem' },
              fontWeight: 900,
              color: '#FFFFFF',
              textShadow: '0 0 20px rgba(0,255,255,0.8), 0 0 40px rgba(0,229,255,0.6), 0 0 60px rgba(0,255,255,0.4)',
              fontFamily: 'Orbitron, Arial, sans-serif',
              lineHeight: 1,
              mt: 2,
              position: 'relative',
              zIndex: 1
            }}>
              2
            </Typography>
            <Box sx={{ mt: 'auto', pb: 2, textAlign: 'center' }}>
              <Typography sx={{ 
                color: '#FFFFFF', 
                fontWeight: 700,
                fontSize: { xs: '1rem', md: '1.2rem' },
                textShadow: '0 0 10px rgba(0,255,255,0.6), 0 2px 4px rgba(0,0,0,0.3)',
                position: 'relative',
                zIndex: 1
              }}>
                {sortedTopics[1]?.name || 'Topic 2'}
              </Typography>
            </Box>
          </Box>

          {/* 1st Place - Electric Pink/Purple */}
          <Box sx={{ 
            flex: '1.2',
            height: '280px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            background: 'linear-gradient(135deg, #FF00FF 0%, #FF1493 25%, #8A2BE2 50%, #4B0082 75%, #1A0033 100%)',
            borderRadius: '20px 20px 8px 8px',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative',
            boxShadow: '0 12px 32px rgba(255,0,255,0.5), 0 0 50px rgba(255,20,147,0.4), inset 0 2px 4px rgba(255,255,255,0.3)',
            border: '3px solid rgba(255,0,255,0.7)',
            marginRight: '-1px',
            '&:hover': {
              transform: 'translateY(-8px)',
              boxShadow: '0 20px 40px rgba(255,0,255,0.7), 0 0 80px rgba(255,20,147,0.6), inset 0 2px 4px rgba(255,255,255,0.4)',
              zIndex: 3
            },
            '&::before': {
              content: '""',
              position: 'absolute',
              top: -3,
              left: -3,
              right: -3,
              bottom: -3,
              background: 'linear-gradient(135deg, #FF00FF, #FF69B4, #9370DB, #8A2BE2)',
              borderRadius: '23px 23px 11px 11px',
              zIndex: -1,
              opacity: 0.9
            }
          }}
          onClick={() => sortedTopics[0] && handleTopicClick(sortedTopics[0].topic_id)}
          >
            <Typography sx={{
              fontSize: { xs: '7rem', md: '9rem', lg: '11rem' },
              fontWeight: 900,
              color: '#FFFFFF',
              textShadow: '0 0 25px rgba(255,0,255,0.9), 0 0 50px rgba(255,20,147,0.7), 0 0 75px rgba(138,43,226,0.5)',
              fontFamily: 'Orbitron, Arial, sans-serif',
              lineHeight: 1,
              mt: 2,
              position: 'relative',
              zIndex: 1
            }}>
              1
            </Typography>
            <Box sx={{ mt: 'auto', pb: 2, textAlign: 'center' }}>
              <Typography sx={{ 
                color: '#FFFFFF', 
                fontWeight: 700,
                fontSize: { xs: '1.1rem', md: '1.3rem' },
                textShadow: '0 0 15px rgba(255,0,255,0.8), 0 2px 4px rgba(0,0,0,0.4)',
                position: 'relative',
                zIndex: 1
              }}>
                {sortedTopics[0]?.name || 'Topic 1'}
              </Typography>
            </Box>
          </Box>

          {/* 3rd Place - Electric Green */}
          <Box sx={{ 
            flex: '1',
            height: '200px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            background: 'linear-gradient(135deg, #00FF00 0%, #32CD32 25%, #00CC66 50%, #008040 75%, #003300 100%)',
            borderRadius: '20px 20px 8px 8px',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative',
            boxShadow: '0 6px 20px rgba(0,255,0,0.4), 0 0 35px rgba(50,205,50,0.3), inset 0 2px 4px rgba(255,255,255,0.2)',
            border: '2px solid rgba(0,255,0,0.6)',
            '&:hover': {
              transform: 'translateY(-8px)',
              boxShadow: '0 12px 28px rgba(0,255,0,0.6), 0 0 50px rgba(50,205,50,0.5), inset 0 2px 4px rgba(255,255,255,0.3)',
              zIndex: 2
            },
            '&::before': {
              content: '""',
              position: 'absolute',
              top: -2,
              left: -2,
              right: -2,
              bottom: -2,
              background: 'linear-gradient(135deg, #00FF00, #32CD32, #00CC66, #008040)',
              borderRadius: '22px 22px 10px 10px',
              zIndex: -1,
              opacity: 0.8
            }
          }}
          onClick={() => sortedTopics[2] && handleTopicClick(sortedTopics[2].topic_id)}
          >
            <Typography sx={{
              fontSize: { xs: '5rem', md: '7rem', lg: '9rem' },
              fontWeight: 900,
              color: '#FFFFFF',
              textShadow: '0 0 20px rgba(0,255,0,0.8), 0 0 40px rgba(50,205,50,0.6), 0 0 60px rgba(0,255,0,0.4)',
              fontFamily: 'Orbitron, Arial, sans-serif',
              lineHeight: 1,
              mt: 2,
              position: 'relative',
              zIndex: 1
            }}>
              3
        </Typography>
            <Box sx={{ mt: 'auto', pb: 2, textAlign: 'center' }}>
              <Typography sx={{ 
                color: '#FFFFFF', 
                fontWeight: 700,
                fontSize: { xs: '0.9rem', md: '1.1rem' },
                textShadow: '0 0 10px rgba(0,255,0,0.6), 0 2px 4px rgba(0,0,0,0.3)',
                position: 'relative',
                zIndex: 1
              }}>
                {sortedTopics[2]?.name || 'Topic 3'}
        </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Rest of Topics */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
        gap: 2 
      }}>
        {displayedTopics.slice(3).map((topic, index) => {
          const rank = index + 4;
            const maxVideos = sortedTopics[0].videos;
            const progressValue = (topic.videos / maxVideos) * 100;

            return (
              <Fade in={true} timeout={300 + index * 100} key={topic.topic_id}>
              <Box
                  sx={{
                  p: 3,
                  background: 'rgba(20,25,40,0.7)',
                  borderRadius: 3,
                  border: '1px solid rgba(0,229,255,0.2)',
                  boxShadow: '0 0 20px rgba(0,229,255,0.1)',
                  backdropFilter: 'blur(8px)',
                    cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                    transform: 'translateY(-4px) scale(1.02)',
                    boxShadow: '0 8px 32px rgba(0,229,255,0.2)',
                    border: '1px solid rgba(0,229,255,0.4)',
                    }
                  }}
                  onClick={() => handleTopicClick(topic.topic_id)}
                >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #00E5FF, #00FF88)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2,
                      boxShadow: '0 0 16px rgba(0,229,255,0.4)',
                      border: '2px solid rgba(0,229,255,0.3)'
                    }}>
                      <Typography sx={{
                        color: 'white',
                          fontWeight: 700,
                        fontSize: '1.1rem',
                        fontFamily: 'Orbitron, Arial, sans-serif'
                      }}>
                        {rank}
                      </Typography>
                    </Box>
                    <Typography variant="h6" sx={{
                      color: 'white',
                      fontWeight: 600,
                      fontFamily: 'Orbitron, Arial, sans-serif'
                    }}>
                          {topic.name}
                        </Typography>
                  </Box>
                  <Typography variant="h5" sx={{
                    background: 'linear-gradient(90deg, #00E5FF, #00FF88)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: 700,
                    fontFamily: 'Orbitron, Arial, sans-serif'
                  }}>
                            {topic.videos.toLocaleString()}
                          </Typography>
                        </Box>

                        <LinearProgress
                          variant="determinate"
                          value={progressValue}
                          sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    mb: 2,
                            '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(90deg, #00E5FF, #00FF88)',
                      borderRadius: 4
                            }
                          }}
                        />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                    {topic.percentage}% of total videos
                  </Typography>
                  {topic.coherence_score && (
                    <Typography variant="body2" sx={{ color: '#00FF88', fontWeight: 600 }}>
                      📊 {topic.coherence_score.toFixed(3)}
                    </Typography>
                  )}
                </Box>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {topic.keywords.slice(0, 4).map(keyword => (
                            <Chip
                              key={keyword}
                              label={keyword}
                              size="small"
                              sx={{
                        background: 'rgba(0,229,255,0.1)',
                        color: '#00E5FF',
                        border: '1px solid rgba(0,229,255,0.3)',
                        fontSize: '0.75rem',
                        fontWeight: 500
                              }}
                            />
                          ))}
                        </Box>
                      </Box>
              </Fade>
            );
          })}
      </Box>

      {/* Load More Button */}
      {!showAllTopics && sortedTopics.length > 11 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button
            variant="contained"
            onClick={() => setShowAllTopics(true)}
            sx={{
              background: 'linear-gradient(135deg, #00E5FF, #00FF88)',
              color: 'white',
              px: 4,
              py: 2,
              borderRadius: 3,
              fontSize: '1.1rem',
              fontWeight: 700,
              fontFamily: 'Orbitron, Arial, sans-serif',
              textTransform: 'none',
              boxShadow: '0 0 20px rgba(0,229,255,0.4)',
              border: '1px solid rgba(0,229,255,0.3)',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'linear-gradient(135deg, #00FF88, #00E5FF)',
                boxShadow: '0 0 30px rgba(0,229,255,0.6)',
                transform: 'translateY(-2px)'
              }
            }}
            endIcon={<ExpandMoreIcon />}
          >
            Load More Topics ({sortedTopics.length - 11} remaining)
          </Button>
        </Box>
      )}

      <TopicDetailDialog />
    </Box>
  );
};

export default TopicLeaderboard;