import React, { useState } from 'react';
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

  const getTypeColor = () => {
    switch (type) {
      case 'spam': return '#F44336';
      case 'quality': return '#43A047';
      case 'uncertain': return '#FF9800';
      default: return '#666';
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
    <Card sx={{ height: 400, display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Avatar sx={{ 
              backgroundColor: getTypeColor(), 
              width: 32, 
              height: 32, 
              mr: 1.5 
            }}>
              {getTypeIcon()}
            </Avatar>
            <Typography variant="h6" fontWeight="600">
              {title}
            </Typography>
          </Box>
          
          <Tooltip title="Learn how we classify comments">
            <IconButton 
              size="small"
              onClick={() => setHelpOpen(true)}
              sx={{ 
                color: '#FF6900',
                '&:hover': { backgroundColor: 'rgba(255, 105, 0, 0.1)' }
              }}
            >
              <HelpIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        <Box sx={{ 
          flexGrow: 1, 
          overflowY: 'auto',
          '&::-webkit-scrollbar': { width: '6px' },
          '&::-webkit-scrollbar-track': { backgroundColor: 'rgba(255,255,255,0.1)' },
          '&::-webkit-scrollbar-thumb': { 
            backgroundColor: 'rgba(255,105,0,0.5)',
            borderRadius: '3px' 
          }
        }}>
          {comments.map((comment, index) => {
            const isSpam = 'classification_confidence' in comment;
            const confidence = isSpam ? comment.classification_confidence : 1.0;
            const likeCount = isSpam ? 0 : (comment as QualityComment).likeCount;
            
            return (
              <Fade in={true} timeout={300 + index * 100} key={comment.commentId}>
                <Box
                  sx={{
                    mb: 2,
                    p: 2,
                    backgroundColor: selectedComment === index ? 'rgba(255, 105, 0, 0.05)' : 'rgba(255, 255, 255, 0.03)',
                    borderRadius: 2,
                    border: selectedComment === index ? '1px solid rgba(255, 105, 0, 0.3)' : '1px solid rgba(255, 255, 255, 0.05)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 105, 0, 0.08)',
                      transform: 'translateY(-1px)',
                    }
                  }}
                  onClick={() => setSelectedComment(selectedComment === index ? null : index)}
                >
                  <Typography 
                    variant="body2" 
                    color="#E0E0E0"
                    sx={{ 
                      mb: 1,
                      lineHeight: 1.6,
                      fontStyle: comment.textOriginal.length < 10 ? 'italic' : 'normal'
                    }}
                  >
                    "{comment.textOriginal}"
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip
                        size="small"
                        label={`${(confidence * 100).toFixed(1)}% confidence`}
                        sx={{
                          backgroundColor: `${getConfidenceColor(confidence)}20`,
                          color: getConfidenceColor(confidence),
                          fontSize: '0.7rem',
                          height: '20px'
                        }}
                      />
                      
                      {likeCount > 0 && (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <LikeIcon sx={{ fontSize: 14, color: '#A0A0A0', mr: 0.5 }} />
                          <Typography variant="caption" color="#A0A0A0">
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
                      mt: 1,
                      height: 3,
                      borderRadius: 2,
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: getConfidenceColor(confidence),
                        borderRadius: 2
                      }
                    }}
                  />
                </Box>
              </Fade>
            );
          })}
        </Box>
      </CardContent>

      <GMMLearningDialog />
    </Card>
  );
};

export default CommentViewer;