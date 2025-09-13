import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  TextField,
  Typography,
  Paper,
  IconButton,
  Fade,
  Chip,
  Avatar,
  Divider,
  Button,
  LinearProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Send as SendIcon,
  SmartToy as AIIcon,
  AutoAwesome as SparkleIcon,
  WifiOff as OfflineIcon,
} from '@mui/icons-material';
import aiService from '../../services/aiService';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  isLoading?: boolean;
}

const AIAssistant: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isBackendOnline, setIsBackendOnline] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check backend health on component mount
  useEffect(() => {
    const checkBackendHealth = async () => {
      try {
        const isOnline = await aiService.getHealthStatus();
        setIsBackendOnline(isOnline);
      } catch (error) {
        setIsBackendOnline(false);
      }
    };

    checkBackendHealth();
    // Check every 30 seconds
    const interval = setInterval(checkBackendHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentQuery = inputValue;
    setInputValue('');
    setIsLoading(true);
    setError(null);

    try {
      // Determine the best agent type for this query
      const agentType = aiService.determineAgentType(currentQuery);
      const context = aiService.getDashboardContext();

      let response;
      if (agentType === 'business') {
        response = await aiService.sendBusinessQuery(currentQuery, context);
      } else if (agentType === 'dashboard') {
        response = await aiService.sendDashboardQuery(currentQuery, context);
      } else {
        response = await aiService.sendMessage({
          query: currentQuery,
          agent_type: 'general',
          context
        });
      }

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response.response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI Service Error:', error);
      setError('Failed to get AI response. Please check if the backend is running.');
      
      const fallbackMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `I understand you're asking about "${currentQuery}". Based on our real data analysis of 3.3M+ comments and 500K+ videos, I can provide insights on engagement patterns, content optimization, and performance benchmarks. However, I'm currently unable to connect to the backend service. Please ensure the LOreAi backend is running on http://localhost:8000 to get real-time AI insights!`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };


  return (
    <Box sx={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background particles */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(circle at 20% 20%, rgba(0,229,255,0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(0,255,136,0.1) 0%, transparent 50%),
          radial-gradient(circle at 40% 60%, rgba(255,77,255,0.1) 0%, transparent 50%)
        `,
        animation: 'pulse 4s ease-in-out infinite alternate'
      }} />

      {/* Header */}
      <Box sx={{ 
        p: 2, 
        textAlign: 'center',
        background: 'transparent'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
          {/* Logo placeholder - replace with your actual logo */}
          <Box
            component="img"
            src="/logo.png" // Put your logo file in public/logo.png
            alt="LOreAi Logo"
            sx={{
              height: 50,
              width: 'auto',
              filter: 'drop-shadow(0 0 10px rgba(0,229,255,0.5))',
              // Fallback if logo not found
              display: 'block',
              '&:not([src])': {
                display: 'none'
              }
            }}
          />
          <Typography 
            variant="h3" 
            sx={{ 
              fontFamily: 'Orbitron, Arial, sans-serif',
              fontWeight: 900,
              fontSize: '2.5rem',
              mb: 0,
              background: 'linear-gradient(45deg, #00E5FF 0%, #00FF88 25%, #FF4DFF 50%, #FF3D5A 75%, #00E5FF 100%)',
              backgroundSize: '300% 300%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'gradientShift 3s ease-in-out infinite'
            }}
          >
            LOreAi Assistant
          </Typography>
        </Box>
        
        {/* Backend Status Indicator */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: 1
        }}>
          <Chip
            icon={isBackendOnline ? <AIIcon /> : <OfflineIcon />}
            label={isBackendOnline ? 'AI Backend Online' : 'AI Backend Offline'}
            sx={{
              background: isBackendOnline 
                ? 'linear-gradient(45deg, #00FF88, #00E5FF)'
                : 'linear-gradient(45deg, #FF3D5A, #FF6B6B)',
              color: 'white',
              fontWeight: 600,
              '& .MuiChip-icon': {
                color: 'white'
              }
            }}
          />
        </Box>
      </Box>

      {/* Messages area */}
      <Box sx={{ 
        flex: 1, 
        overflow: 'auto', 
        p: 3,
        pb: '200px', // More padding for the input area
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }}>
        {messages.length === 0 && (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            height: '100%',
            textAlign: 'center'
          }}>
            <AIIcon sx={{ 
              fontSize: 80, 
              color: '#00E5FF',
              mb: 3,
              filter: 'drop-shadow(0 0 20px rgba(0,229,255,0.5))'
            }} />
            <Typography variant="h4" sx={{ 
              color: '#00E5FF',
              fontFamily: 'Orbitron, Arial, sans-serif',
              fontWeight: 600,
              mb: 2
            }}>
              Ready to assist!
            </Typography>
            <Typography variant="body1" sx={{ 
              color: 'rgba(255,255,255,0.7)',
              maxWidth: '600px',
              lineHeight: 1.6
            }}>
              Ask me about your data insights, business strategies, or dashboard explanations. 
              I have access to comprehensive analysis of 3.3M+ comments and performance benchmarks.
            </Typography>
          </Box>
        )}

        {messages.map((message) => (
          <Fade in={true} key={message.id}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start',
              mb: 2
            }}>
              <Paper sx={{
                p: 2,
                maxWidth: '70%',
                background: message.type === 'user' 
                  ? 'linear-gradient(135deg, rgba(0,229,255,0.2) 0%, rgba(0,255,136,0.2) 100%)'
                  : 'linear-gradient(135deg, rgba(20,25,40,0.9) 0%, rgba(30,35,50,0.9) 100%)',
                border: message.type === 'user'
                  ? '1px solid rgba(0,229,255,0.4)'
                  : '1px solid rgba(255,77,255,0.4)',
                borderRadius: 3,
                backdropFilter: 'blur(10px)'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  {message.type === 'ai' && (
                    <Avatar sx={{ 
                      bgcolor: 'transparent',
                      border: '2px solid #FF4DFF'
                    }}>
                      <AIIcon sx={{ color: '#FF4DFF' }} />
                    </Avatar>
                  )}
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body1" sx={{ 
                      color: 'white',
                      lineHeight: 1.6,
                      whiteSpace: 'pre-wrap'
                    }}>
                      {message.content}
                    </Typography>
                    <Typography variant="caption" sx={{ 
                      color: 'rgba(255,255,255,0.5)',
                      display: 'block',
                      mt: 1
                    }}>
                      {message.timestamp.toLocaleTimeString()}
                    </Typography>
                  </Box>
                  {message.type === 'user' && (
                    <Avatar sx={{ 
                      bgcolor: 'transparent',
                      border: '2px solid #00E5FF'
                    }}>
                      <SparkleIcon sx={{ color: '#00E5FF' }} />
                    </Avatar>
                  )}
                </Box>
              </Paper>
            </Box>
          </Fade>
        ))}

        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
            <Paper sx={{
              p: 2,
              background: 'linear-gradient(135deg, rgba(20,25,40,0.9) 0%, rgba(30,35,50,0.9) 100%)',
              border: '1px solid rgba(255,77,255,0.4)',
              borderRadius: 3,
              backdropFilter: 'blur(10px)'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ 
                  bgcolor: 'transparent',
                  border: '2px solid #FF4DFF'
                }}>
                  <AIIcon sx={{ color: '#FF4DFF' }} />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ 
                    color: 'rgba(255,255,255,0.7)',
                    mb: 1
                  }}>
                    AI is thinking...
                  </Typography>
                  <LinearProgress sx={{
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(45deg, #00E5FF, #FF4DFF)',
                      borderRadius: 2
                    }
                  }} />
                </Box>
              </Box>
            </Paper>
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input area */}
      <Box sx={{ 
        p: 3, 
        background: 'transparent',
        position: 'absolute',
        bottom: '80px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '90%',
        maxWidth: '1000px',
        zIndex: 1000
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'flex-end', 
          gap: 3,
          maxWidth: '1000px',
          margin: '0 auto'
        }}>
          <TextField
            fullWidth
            multiline
            maxRows={6}
            minRows={3}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me about your data insights, business strategies, or dashboard explanations..."
            disabled={isLoading}
            sx={{
              '& .MuiOutlinedInput-root': {
                background: 'linear-gradient(135deg, rgba(20,25,40,0.9) 0%, rgba(30,35,50,0.9) 100%)',
                border: '2px solid rgba(0,229,255,0.5)',
                borderRadius: 4,
                color: 'white',
                fontSize: '1.1rem',
                padding: '8px 16px',
                minHeight: '80px',
                '&:hover': {
                  border: '2px solid rgba(0,229,255,0.7)',
                  boxShadow: '0 0 15px rgba(0,229,255,0.2)',
                },
                '&.Mui-focused': {
                  border: '2px solid rgba(0,229,255,0.9)',
                  boxShadow: '0 0 25px rgba(0,229,255,0.4)',
                },
                '& fieldset': {
                  border: 'none',
                },
                '& .MuiInputBase-input': {
                  color: 'white',
                  fontSize: '1.1rem',
                  lineHeight: 1.5,
                  '&::placeholder': {
                    color: 'rgba(255,255,255,0.7)',
                    opacity: 1,
                    fontSize: '1.1rem',
                  },
                },
              },
            }}
          />
          <IconButton
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            sx={{
              background: 'linear-gradient(45deg, #00E5FF, #00FF88)',
              color: 'white',
              width: 64,
              height: 64,
              marginBottom: '8px',
              '&:hover': {
                background: 'linear-gradient(45deg, #00FF88, #FF4DFF)',
                transform: 'scale(1.1)',
                boxShadow: '0 8px 25px rgba(0,229,255,0.5)',
              },
              '&:disabled': {
                background: 'rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.3)',
              },
              transition: 'all 0.3s ease'
            }}
          >
            <SendIcon sx={{ fontSize: 28 }} />
          </IconButton>
        </Box>
      </Box>

      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setError(null)} 
          severity="error"
          sx={{
            background: 'linear-gradient(135deg, rgba(255,61,90,0.9) 0%, rgba(255,107,107,0.9) 100%)',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.3)',
            backdropFilter: 'blur(10px)'
          }}
        >
          {error}
        </Alert>
      </Snackbar>

      {/* CSS Animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          @keyframes pulse {
            0% { opacity: 0.8; }
            50% { opacity: 1; }
            100% { opacity: 0.8; }
          }
        `
      }} />
    </Box>
  );
};

export default AIAssistant;
