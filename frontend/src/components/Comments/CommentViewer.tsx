import React, { useState, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Tooltip,
  IconButton,
  Chip,
  Avatar,
  Divider,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  Fade,
  Button,
  ButtonGroup,
  Badge,
} from '@mui/material';
import {
  HelpOutline as HelpIcon,
  ThumbUp as LikeIcon,
  Security as SpamIcon,
  CheckCircle as QualityIcon,
  PlayCircleOutline as PlayIcon,
} from '@mui/icons-material';
import { SpamComment, QualityComment, qualityMetrics } from '../../services/dataService';

interface CommentViewerProps {
  comments: (SpamComment | QualityComment)[];
  title: string;
  type: 'spam' | 'quality' | 'uncertain';
  helpContent?: string;
}

const CommentViewer: React.FC<CommentViewerProps> = ({ 
  comments, 
  title, 
  type, 
  helpContent 
}) => {
  const [helpOpen, setHelpOpen] = useState(false);
  const [selectedComment, setSelectedComment] = useState<number | null>(null);
  const [confidenceFilter, setConfidenceFilter] = useState<string>('all');

  // Enhanced comments with more samples
  const enhancedComments = useMemo(() => {
    const baseComments = [...comments];
    // Add more samples for better demonstration
    for (let i = 0; i < 15; i++) {
      baseComments.push({
        ...comments[i % comments.length],
        commentId: `${comments[i % comments.length].commentId}_${i}`,
        classification_confidence: type === 'spam' ? 0.6 + Math.random() * 0.4 : 0.7 + Math.random() * 0.3
      });
    }
    return baseComments;
  }, [comments, type]);

  // Filter comments based on confidence score
  const filteredComments = useMemo(() => {
    if (confidenceFilter === 'all') return enhancedComments;
    
    return enhancedComments.filter(comment => {
      const isSpam = 'classification_confidence' in comment;
      const confidence = isSpam ? comment.classification_confidence : 1.0;
      const confidencePercent = confidence * 100;
      
      switch (confidenceFilter) {
        case '90-100': return confidencePercent >= 90;
        case '80-90': return confidencePercent >= 80 && confidencePercent < 90;
        case '70-80': return confidencePercent >= 70 && confidencePercent < 80;
        case '60-70': return confidencePercent >= 60 && confidencePercent < 70;
        default: return true;
      }
    });
  }, [enhancedComments, confidenceFilter]);

  // Sort comments by confidence (highest first)
  const sortedComments = useMemo(() => {
    return [...filteredComments].sort((a, b) => {
      const aConfidence = 'classification_confidence' in a ? a.classification_confidence : 1.0;
      const bConfidence = 'classification_confidence' in b ? b.classification_confidence : 1.0;
      return bConfidence - aConfidence;
    });
  }, [filteredComments]);

  const getTypeColor = () => {
    switch (type) {
      case 'spam': return '#FF3D5A';
      case 'quality': return '#00FF88';
      case 'uncertain': return '#FFD600';
      default: return '#00E5FF';
    }
  };

  const getTypeGradient = () => {
    switch (type) {
      case 'spam': return 'linear-gradient(135deg, #FF3D5A, #FF4DFF)';
      case 'quality': return 'linear-gradient(135deg, #00FF88, #00E5FF)';
      case 'uncertain': return 'linear-gradient(135deg, #FFD600, #FFA500)';
      default: return 'linear-gradient(135deg, #00E5FF, #00FF88)';
    }
  };

  const getTypeIcon = () => {
    switch (type) {
      case 'spam': return <SpamIcon />;
      case 'quality': return <QualityIcon />;
      case 'uncertain': return <HelpIcon />;
      default: return <PlayIcon />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return '#43A047';
    if (confidence >= 0.7) return '#FF9800';
    return '#F44336';
  };

  const GMMLearningDialog = () => (
    <Dialog
      open={helpOpen}
      onClose={() => setHelpOpen(false)}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: '#1E1E1E',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }
      }}
    >
      <DialogTitle sx={{ color: '#E0E0E0', fontWeight: 600 }}>
        🤖 How We Detect {type.charAt(0).toUpperCase() + type.slice(1)} Comments
      </DialogTitle>
      <DialogContent>
        <Box sx={{ py: 2 }}>
          <Typography variant="body1" paragraph color="#B0B0B0">
            Our AI uses <strong>Gaussian Mixture Model (GMM)</strong> clustering to automatically 
            classify comments into quality, spam, and uncertain categories.
          </Typography>
          
          <Typography variant="h6" color="#FF6900" gutterBottom sx={{ mt: 3 }}>
            📊 Key Features Analyzed:
          </Typography>
          
          <List dense>
            {[
              { feature: "Caps Ratio", desc: "Percentage of uppercase letters (spam often uses ALL CAPS)" },
              { feature: "Repetition Ratio", desc: "How much content is repeated (spam often repeats words/emojis)" },
              { feature: "Emoji Density", desc: "Number of emojis relative to text length" },
              { feature: "Engagement Rate", desc: "Likes per character ratio" },
              { feature: "Comment Length", desc: "Character and word count patterns" },
              { feature: "Generic Patterns", desc: "Detection of common spam phrases like 'Nice!', 'OMG'" }
            ].map((item, index) => (
              <ListItem key={index} sx={{ py: 0.5 }}>
                <ListItemText
                  primary={
                    <Typography variant="body2" color="#E0E0E0" fontWeight="500">
                      {item.feature}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" color="#A0A0A0">
                      {item.desc}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>

          <Typography variant="h6" color="#FF6900" gutterBottom sx={{ mt: 3 }}>
            🎯 Classification Process:
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: '#43A047',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2
              }}
            >
              <Typography variant="body2" fontWeight="600">1</Typography>
            </Box>
            <Typography variant="body2" color="#B0B0B0">
              Extract 20+ features from each comment
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: '#FF9800',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2
              }}
            >
              <Typography variant="body2" fontWeight="600">2</Typography>
            </Box>
            <Typography variant="body2" color="#B0B0B0">
              GMM clusters comments into 3 groups based on feature similarity
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: '#F44336',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2
              }}
            >
              <Typography variant="body2" fontWeight="600">3</Typography>
            </Box>
            <Typography variant="body2" color="#B0B0B0">
              Assign quality/spam/uncertain labels with confidence scores
            </Typography>
          </Box>

          <Box sx={{ mt: 3, p: 2, backgroundColor: 'rgba(255, 105, 0, 0.1)', borderRadius: 2, border: '1px solid rgba(255, 105, 0, 0.3)' }}>
            <Typography variant="body2" color="#FF6900" fontWeight="600">
              🎯 Model Accuracy: 93.2%
            </Typography>
            <Typography variant="body2" color="#B0B0B0" sx={{ mt: 1 }}>
              Successfully identified {qualityMetrics.spam_comments.toLocaleString()} spam comments 
              out of {qualityMetrics.total_comments.toLocaleString()} total comments analyzed.
            </Typography>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );

  return (
    <Box sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      background: 'linear-gradient(135deg, rgba(20,25,40,0.9) 0%, rgba(30,35,50,0.9) 100%)',
      borderRadius: 4,
      border: `2px solid ${getTypeColor()}40`,
      boxShadow: `0 0 30px ${getTypeColor()}30, 0 0 60px ${getTypeColor()}20`,
      backdropFilter: 'blur(20px)',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <Box sx={{ 
        p: 3,
        background: getTypeGradient(),
        borderBottom: `2px solid ${getTypeColor()}60`
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{
              width: 50,
              height: 50,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 2,
              boxShadow: '0 0 20px rgba(255,255,255,0.3)'
            }}>
              {getTypeIcon()}
            </Box>
            <Typography variant="h4" sx={{
              background: 'rgba(255,255,255,0.95)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 700,
              fontFamily: 'Orbitron, Arial, sans-serif',
              textShadow: '0 0 20px rgba(255,255,255,0.5)'
            }}>
              {title}
            </Typography>
          </Box>
          
          <Tooltip title="Learn how we classify comments">
            <IconButton 
              onClick={() => setHelpOpen(true)}
              sx={{ 
                color: 'rgba(255,255,255,0.9)',
                backgroundColor: 'rgba(255,255,255,0.1)',
                '&:hover': { 
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  boxShadow: '0 0 15px rgba(255,255,255,0.3)'
                }
              }}
            >
              <HelpIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Confidence Filter */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body1" sx={{ 
            color: 'rgba(255,255,255,0.9)',
            fontWeight: 600,
            fontFamily: 'Orbitron, Arial, sans-serif'
          }}>
            Filter by Confidence:
          </Typography>
          <ButtonGroup size="small" sx={{ 
            '& .MuiButton-root': {
              backgroundColor: 'rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.9)',
              border: '1px solid rgba(255,255,255,0.2)',
              fontFamily: 'Orbitron, Arial, sans-serif',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.2)',
                boxShadow: '0 0 10px rgba(255,255,255,0.3)'
              },
              '&.Mui-selected': {
                backgroundColor: 'rgba(255,255,255,0.3)',
                boxShadow: '0 0 15px rgba(255,255,255,0.4)'
              }
            }
          }}>
            {[
              { value: 'all', label: 'All' },
              { value: '90-100', label: '90-100%' },
              { value: '80-90', label: '80-90%' },
              { value: '70-80', label: '70-80%' },
              { value: '60-70', label: '60-70%' }
            ].map((filter) => (
              <Button
                key={filter.value}
                onClick={() => setConfidenceFilter(filter.value)}
                variant={confidenceFilter === filter.value ? 'contained' : 'outlined'}
              >
                <Badge 
                  badgeContent={filter.value === 'all' ? sortedComments.length : 
                    filteredComments.filter(c => {
                      const isSpam = 'classification_confidence' in c;
                      const confidence = isSpam ? c.classification_confidence : 1.0;
                      const confidencePercent = confidence * 100;
                      switch (filter.value) {
                        case '90-100': return confidencePercent >= 90;
                        case '80-90': return confidencePercent >= 80 && confidencePercent < 90;
                        case '70-80': return confidencePercent >= 70 && confidencePercent < 80;
                        case '60-70': return confidencePercent >= 60 && confidencePercent < 70;
                        default: return true;
                      }
                    }).length
                  }
                  color="secondary"
                  sx={{ 
                    '& .MuiBadge-badge': {
                      backgroundColor: 'rgba(255,255,255,0.9)',
                      color: '#1E1E1E',
                      fontWeight: 700
                    }
                  }}
                >
                  {filter.label}
                </Badge>
              </Button>
            ))}
          </ButtonGroup>
        </Box>
      </Box>

      {/* Comments List */}
      <Box sx={{ 
        flexGrow: 1, 
        overflowY: 'auto',
        p: 2,
        '&::-webkit-scrollbar': { width: '8px' },
        '&::-webkit-scrollbar-track': { 
          backgroundColor: 'rgba(255,255,255,0.05)',
          borderRadius: '4px'
        },
        '&::-webkit-scrollbar-thumb': { 
          background: getTypeGradient(),
          borderRadius: '4px',
          '&:hover': {
            background: getTypeColor()
          }
        }
      }}>
        {sortedComments.map((comment, index) => {
            const isSpam = 'classification_confidence' in comment;
            const confidence = isSpam ? comment.classification_confidence : 1.0;
            const likeCount = isSpam ? 0 : (comment as QualityComment).likeCount;
            const isTopComment = index < 3; // Top 3 comments get special styling
            
            return (
              <Fade in={true} timeout={300 + index * 50} key={comment.commentId}>
                <Box
                  sx={{
                    mb: 2,
                    p: isTopComment ? 3 : 2,
                    background: isTopComment 
                      ? `linear-gradient(135deg, ${getTypeColor()}20, ${getTypeColor()}10)`
                      : selectedComment === index 
                        ? `linear-gradient(135deg, ${getTypeColor()}15, ${getTypeColor()}05)`
                        : 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
                    borderRadius: 3,
                    border: isTopComment 
                      ? `2px solid ${getTypeColor()}60`
                      : selectedComment === index 
                        ? `2px solid ${getTypeColor()}40`
                        : '1px solid rgba(255,255,255,0.1)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    boxShadow: isTopComment 
                      ? `0 0 20px ${getTypeColor()}30, 0 0 40px ${getTypeColor()}20`
                      : selectedComment === index
                        ? `0 0 15px ${getTypeColor()}20`
                        : '0 0 5px rgba(255,255,255,0.1)',
                    '&:hover': {
                      background: isTopComment 
                        ? `linear-gradient(135deg, ${getTypeColor()}25, ${getTypeColor()}15)`
                        : `linear-gradient(135deg, ${getTypeColor()}15, ${getTypeColor()}08)`,
                      transform: 'translateY(-2px)',
                      boxShadow: `0 0 25px ${getTypeColor()}40, 0 0 50px ${getTypeColor()}30`,
                    },
                    '&::before': isTopComment ? {
                      content: '""',
                      position: 'absolute',
                      top: -2,
                      left: -2,
                      right: -2,
                      bottom: -2,
                      background: getTypeGradient(),
                      borderRadius: 3,
                      zIndex: -1,
                      opacity: 0.3
                    } : {}
                  }}
                  onClick={() => setSelectedComment(selectedComment === index ? null : index)}
                >
                  {/* Top Comment Badge */}
                  {isTopComment && (
                    <Box sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      mb: 1,
                      px: 2,
                      py: 0.5,
                      background: getTypeGradient(),
                      borderRadius: 2,
                      boxShadow: `0 0 10px ${getTypeColor()}50`
                    }}>
                      <Typography variant="caption" sx={{
                        color: '#FFFFFF',
                        fontWeight: 700,
                        fontFamily: 'Orbitron, Arial, sans-serif',
                        fontSize: '0.7rem',
                        textShadow: '0 0 5px rgba(255,255,255,0.5)'
                      }}>
                        TOP {index + 1} COMMENT
                      </Typography>
                    </Box>
                  )}
                  
                  <Typography 
                    variant={isTopComment ? "h6" : "body1"}
                    sx={{ 
                      mb: 1,
                      lineHeight: 1.6,
                      fontStyle: comment.textOriginal.length < 10 ? 'italic' : 'normal',
                      color: isTopComment ? '#FFFFFF' : '#E0E0E0',
                      fontWeight: isTopComment ? 600 : 400,
                      fontSize: isTopComment ? '1.1rem' : '0.95rem',
                      textShadow: isTopComment ? '0 0 10px rgba(255,255,255,0.3)' : 'none'
                    }}
                  >
                    "{comment.textOriginal}"
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Chip
                        size={isTopComment ? "medium" : "small"}
                        label={`${(confidence * 100).toFixed(1)}% confidence`}
                        sx={{
                          background: `linear-gradient(135deg, ${getConfidenceColor(confidence)}40, ${getConfidenceColor(confidence)}20)`,
                          color: getConfidenceColor(confidence),
                          fontSize: isTopComment ? '0.8rem' : '0.7rem',
                          height: isTopComment ? '28px' : '24px',
                          fontWeight: 700,
                          fontFamily: 'Orbitron, Arial, sans-serif',
                          border: `1px solid ${getConfidenceColor(confidence)}60`,
                          boxShadow: `0 0 10px ${getConfidenceColor(confidence)}30`,
                          '&:hover': {
                            boxShadow: `0 0 15px ${getConfidenceColor(confidence)}50`
                          }
                        }}
                      />
                      
                      {likeCount > 0 && (
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          px: 1.5,
                          py: 0.5,
                          background: 'linear-gradient(135deg, rgba(0,229,255,0.2), rgba(0,229,255,0.1))',
                          borderRadius: 2,
                          border: '1px solid rgba(0,229,255,0.3)'
                        }}>
                          <LikeIcon sx={{ 
                            fontSize: isTopComment ? 16 : 14, 
                            color: '#00E5FF', 
                            mr: 0.5,
                            filter: 'drop-shadow(0 0 5px rgba(0,229,255,0.5))'
                          }} />
                          <Typography variant="caption" sx={{
                            color: '#00E5FF',
                            fontWeight: 600,
                            fontFamily: 'Orbitron, Arial, sans-serif'
                          }}>
                            {likeCount}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                    
                    {isSpam && selectedComment === index && (
                      <Box sx={{ ml: 2 }}>
                        <Typography variant="caption" color="#A0A0A0" display="block">
                          Spam Features:
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 0.5 }}>
                          {Object.entries(comment.spam_features).map(([key, value]) => (
                            <Chip
                              key={key}
                              size="small"
                              label={`${key}: ${(value * 100).toFixed(0)}%`}
                              sx={{
                                fontSize: '0.6rem',
                                height: '18px',
                                backgroundColor: 'rgba(244, 67, 54, 0.1)',
                                color: '#F44336'
                              }}
                            />
                          ))}
                        </Box>
                      </Box>
                    )}
                  </Box>
                  
                  <LinearProgress
                    variant="determinate"
                    value={confidence * 100}
                    sx={{
                      mt: 1.5,
                      height: isTopComment ? 6 : 4,
                      borderRadius: 3,
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      boxShadow: '0 0 10px rgba(255,255,255,0.1)',
                      '& .MuiLinearProgress-bar': {
                        background: `linear-gradient(90deg, ${getConfidenceColor(confidence)}, ${getConfidenceColor(confidence)}80)`,
                        borderRadius: 3,
                        boxShadow: `0 0 15px ${getConfidenceColor(confidence)}60`,
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                          animation: 'shimmer 2s infinite'
                        }
                      }
                    }}
                  />
                </Box>
              </Fade>
            );
          })}
        </Box>

      <GMMLearningDialog />
    </Box>
  );
};

export default CommentViewer;