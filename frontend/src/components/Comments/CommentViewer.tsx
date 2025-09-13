import React, { useState } from 'react';
import {
  Box,
  Typography,
  Chip,
  LinearProgress,
  Fade,
} from '@mui/material';
import {
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
  const [selectedComment, setSelectedComment] = useState<number | null>(null);

  // Use comments directly, no filtering needed
  const displayComments = comments;

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
      case 'uncertain': return <PlayIcon />;
      default: return <PlayIcon />;
    }
  };



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
        background: 'linear-gradient(135deg, rgba(20,25,40,0.95) 0%, rgba(30,35,50,0.95) 100%)',
        borderBottom: `2px solid ${getTypeColor()}60`
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
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

        {/* Demonstration Notice */}
        <Box sx={{ 
          p: 2, 
          background: 'linear-gradient(135deg, rgba(255,105,0,0.1), rgba(255,61,90,0.1))',
          borderRadius: 2,
          border: '1px solid rgba(255,105,0,0.3)',
          mb: 2
        }}>
          <Typography variant="body2" sx={{ 
            color: '#FF6900',
            fontWeight: 600,
            fontFamily: 'Orbitron, Arial, sans-serif',
            textAlign: 'center'
          }}>
            📊 This section is for demonstration purposes. See full process on spam and quality detection in our machine learning code.
          </Typography>
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
        {displayComments.map((comment, index) => {
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
                  
                  {isSpam && comment.spam_features && (
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 1.5 }}>
                      {comment.spam_features.caps_ratio > 0.3 && (
                        <Chip
                          size="small"
                          label="HIGH CAPS"
                          sx={{
                            background: 'linear-gradient(135deg, #FF3D5A40, #FF3D5A20)',
                            color: '#FF3D5A',
                            fontSize: '0.6rem',
                            height: '20px',
                            fontWeight: 600,
                            border: '1px solid #FF3D5A60',
                            boxShadow: '0 0 8px #FF3D5A30',
                            borderRadius: '10px'
                          }}
                        />
                      )}
                      {comment.spam_features.repetition_ratio > 0.3 && (
                        <Chip
                          size="small"
                          label="REPETITIVE"
                          sx={{
                            background: 'linear-gradient(135deg, #FF3D5A40, #FF3D5A20)',
                            color: '#FF3D5A',
                            fontSize: '0.6rem',
                            height: '20px',
                            fontWeight: 600,
                            border: '1px solid #FF3D5A60',
                            boxShadow: '0 0 8px #FF3D5A30',
                            borderRadius: '10px'
                          }}
                        />
                      )}
                      {comment.spam_features.emoji_ratio > 0.2 && (
                        <Chip
                          size="small"
                          label="EMOJI SPAM"
                          sx={{
                            background: 'linear-gradient(135deg, #FF3D5A40, #FF3D5A20)',
                            color: '#FF3D5A',
                            fontSize: '0.6rem',
                            height: '20px',
                            fontWeight: 600,
                            border: '1px solid #FF3D5A60',
                            boxShadow: '0 0 8px #FF3D5A30',
                            borderRadius: '10px'
                          }}
                        />
                      )}
                    </Box>
                  )}
                </Box>
              </Fade>
            );
          })}
        </Box>

    </Box>
  );
};

export default CommentViewer;