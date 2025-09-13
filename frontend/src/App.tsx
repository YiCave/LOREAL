import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import darkTheme from './theme/darkTheme';
import Dashboard from './components/Dashboard/Dashboard';
import TopicLeaderboard from './components/Topics/TopicLeaderboard';
import CommentViewer from './components/Comments/CommentViewer';
import PieChart3D from './components/Charts/PieChart3D';
import CoherenceChart from './components/Charts/CoherenceChart';
import AIAssistant from './components/AIAssistant/AIAssistant';
import { 
  spamSamples, 
  qualityCommentSamples, 
  topVideosByComments 
} from './services/dataService';
import { 
  Box, 
  Typography, 
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Chip,
  Avatar,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Topic as TopicIcon,
  Comment as CommentIcon,
  Analytics as AnalyticsIcon,
  SmartToy as AIIcon,
} from '@mui/icons-material';

const queryClient = new QueryClient();

const App: React.FC = () => {
  const [selectedView, setSelectedView] = useState('dashboard');

  const drawerWidth = 280;

  const menuItems = [
    { 
      id: 'dashboard', 
      label: '🏠 Dashboard', 
      icon: <DashboardIcon />, 
      description: 'Overview & Analytics' 
    },
    { 
      id: 'topics', 
      label: '🏆 Topic Leaderboard', 
      icon: <TopicIcon />, 
      description: '26 Topics Ranked' 
    },
    { 
      id: 'comments', 
      label: '💬 Comment Analysis', 
      icon: <CommentIcon />, 
      description: 'Quality vs Spam' 
    },
    { 
      id: 'coherence', 
      label: '📊 Model Performance', 
      icon: <AnalyticsIcon />, 
      description: 'Coherence Scores' 
    },
    { 
      id: 'ai-assistant', 
      label: '🤖 AI Assistant', 
      icon: <AIIcon />, 
      description: 'Business Insights & Help' 
    },
  ];


  const renderContent = () => {
    switch (selectedView) {
      case 'dashboard':
        return (
          <Box sx={{ p: 3 }}>
            <Typography 
              variant="h2" 
              gutterBottom 
              sx={{ 
                fontFamily: 'Orbitron, Inter, Roboto, Arial, sans-serif',
                fontWeight: 900,
                fontSize: '4rem',
                mb: 4
              }}
            >
              <span style={{ color: 'white' }}>Comprehensive </span>
              <span style={{
                background: 'linear-gradient(45deg, #00E5FF 0%, #00FF88 25%, #FF4DFF 50%, #FF3D5A 75%, #00E5FF 100%)',
                backgroundSize: '300% 300%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animation: 'gradientShift 3s ease-in-out infinite'
              }}>Dashboard</span>
            </Typography>
            <Dashboard />
          </Box>
        );
      case 'topics':
        return (
          <Box sx={{ p: 3 }}>
            <Typography 
              variant="h2" 
              gutterBottom 
              sx={{ 
                fontFamily: 'Orbitron, Inter, Roboto, Arial, sans-serif',
                fontWeight: 900,
                fontSize: '4rem',
                mb: 4
              }}
            >
              <span style={{ color: 'white' }}>Topic </span>
              <span style={{
                background: 'linear-gradient(45deg, #00E5FF 0%, #00FF88 25%, #FF4DFF 50%, #FF3D5A 75%, #00E5FF 100%)',
                backgroundSize: '300% 300%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animation: 'gradientShift 3s ease-in-out infinite'
              }}>Leaderboard</span>
            </Typography>
            <Typography variant="body1" sx={{ 
              color: 'rgba(255,255,255,0.8)',
              mb: 3,
              fontSize: '1.1rem',
              lineHeight: 1.6,
              background: 'rgba(0,229,255,0.05)',
              p: 2,
              borderRadius: 3,
              border: '1px solid rgba(0,229,255,0.2)',
              backdropFilter: 'blur(10px)'
            }}>
              Explore the 26 topics discovered from {topVideosByComments.reduce((sum, v) => sum + v.commentCount, 0).toLocaleString()} comments 
              across {topVideosByComments.length.toLocaleString()} beauty videos.
            </Typography>
            <TopicLeaderboard maxTopics={26} />
          </Box>
        );
      case 'comments':
        return (
          <Box sx={{ p: 3 }}>
            <Typography 
              variant="h2" 
              gutterBottom 
              sx={{ 
                fontFamily: 'Orbitron, Inter, Roboto, Arial, sans-serif',
                fontWeight: 900,
                fontSize: '4rem',
                mb: 4
              }}
            >
              <span style={{ color: 'white' }}>Comment </span>
              <span style={{
                background: 'linear-gradient(45deg, #00E5FF 0%, #00FF88 25%, #FF4DFF 50%, #FF3D5A 75%, #00E5FF 100%)',
                backgroundSize: '300% 300%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animation: 'gradientShift 3s ease-in-out infinite'
              }}>Analysis</span>
            </Typography>
            <Typography variant="body1" sx={{ 
              color: 'rgba(255,255,255,0.8)',
              mb: 3,
              fontSize: '1.1rem',
              lineHeight: 1.6,
              background: 'rgba(0,229,255,0.05)',
              p: 2,
              borderRadius: 3,
              border: '1px solid rgba(0,229,255,0.2)',
              backdropFilter: 'blur(10px)'
            }}>
              Our AI-powered system automatically identifies spam and quality comments using 
              advanced Gaussian Mixture Model clustering with confidence-based filtering.
            </Typography>

            {/* GMM Steps Component */}
            <Box sx={{ 
              mb: 4, 
              p: 3, 
              background: 'linear-gradient(135deg, rgba(0,229,255,0.1), rgba(0,255,136,0.1))',
              borderRadius: 3,
              border: '1px solid rgba(0,229,255,0.3)'
            }}>
              <Typography variant="h6" sx={{ 
                color: '#00E5FF',
                fontWeight: 600,
                fontFamily: 'Orbitron, Arial, sans-serif',
                mb: 2
              }}>
                🤖 GMM Classification Process
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ 
                    width: 30, 
                    height: 30, 
                    borderRadius: '50%', 
                    background: 'linear-gradient(135deg, #00E5FF, #00FF88)',
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    mr: 2,
                    boxShadow: '0 0 10px rgba(0,229,255,0.5)'
                  }}>
                    <Typography variant="body2" fontWeight="600" sx={{ color: '#1E1E1E' }}>1</Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                    Extract 20+ features from each comment
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ 
                    width: 30, 
                    height: 30, 
                    borderRadius: '50%', 
                    background: 'linear-gradient(135deg, #00FF88, #FF4DFF)',
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    mr: 2,
                    boxShadow: '0 0 10px rgba(0,255,136,0.5)'
                  }}>
                    <Typography variant="body2" fontWeight="600" sx={{ color: '#1E1E1E' }}>2</Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                    GMM clusters comments into 2 groups (spam vs quality)
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ 
                    width: 30, 
                    height: 30, 
                    borderRadius: '50%', 
                    background: 'linear-gradient(135deg, #FF4DFF, #FF3D5A)',
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    mr: 2,
                    boxShadow: '0 0 10px rgba(255,77,255,0.5)'
                  }}>
                    <Typography variant="body2" fontWeight="600" sx={{ color: '#1E1E1E' }}>3</Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                    Assign quality/spam labels with confidence scores
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(600px, 1fr))', gap: 3 }}>
              <CommentViewer 
                comments={spamSamples} 
                title="Spam Comments" 
                type="spam"
                helpContent="Learn how we detect spam"
              />
              <CommentViewer 
                comments={qualityCommentSamples} 
                title="Quality Comments" 
                type="quality"
                helpContent="See what makes quality comments"
              />
            </Box>
          </Box>
        );
      case 'coherence':
        return (
          <Box sx={{ p: 3 }}>
            <Typography 
              variant="h2" 
              gutterBottom 
              sx={{ 
                fontFamily: 'Orbitron, Inter, Roboto, Arial, sans-serif',
                fontWeight: 900,
                fontSize: '4rem',
                mb: 4
              }}
            >
              <span style={{ color: 'white' }}>Model </span>
              <span style={{
                background: 'linear-gradient(45deg, #00E5FF 0%, #00FF88 25%, #FF4DFF 50%, #FF3D5A 75%, #00E5FF 100%)',
                backgroundSize: '300% 300%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animation: 'gradientShift 3s ease-in-out infinite'
              }}>Performance</span>
            </Typography>
            <Typography variant="body1" sx={{ 
              color: 'rgba(255,255,255,0.8)',
              mb: 3,
              fontSize: '1.1rem',
              lineHeight: 1.6,
              background: 'rgba(0,229,255,0.05)',
              p: 2,
              borderRadius: 3,
              border: '1px solid rgba(0,229,255,0.2)',
              backdropFilter: 'blur(10px)'
            }}>
              Coherence score optimization showing why we chose 26 topics as the optimal configuration 
              for our LOreAi beauty content analysis.
            </Typography>
            <CoherenceChart />
          </Box>
        );
      case 'ai-assistant':
        return <AIAssistant />;
      case 'quality3d':
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="700" color="primary">
              🎯 Comment Quality Distribution
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Interactive 3D visualization of comment quality classification results from our 
              machine learning analysis.
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Box sx={{ width: '100%', maxWidth: 600 }}>
                <PieChart3D />
              </Box>
            </Box>
          </Box>
        );
      default:
        return <Dashboard />;
    }
  };

  const drawer = (
    <Box sx={{ 
      height: '100%', 
      background: 'linear-gradient(180deg, #0a0f1f 0%, #1a1f2e 50%, #091324 100%)',
      display: 'flex', 
      flexDirection: 'column',
      boxShadow: '0 0 40px rgba(0,229,255,0.1)',
      borderRight: '1px solid rgba(0,229,255,0.2)'
    }}>
      {/* Logo Section */}
      <Box sx={{ 
        p: 3, 
        borderBottom: '1px solid rgba(0,229,255,0.2)',
        background: 'rgba(0,229,255,0.05)',
        backdropFilter: 'blur(10px)'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            component="img"
            src="/logo.png"
            alt="LOreAi Logo"
            sx={{ 
              width: 48,
              height: 48,
              mr: 2,
              borderRadius: '50%',
              boxShadow: '0 0 20px rgba(0,229,255,0.4)',
              border: '2px solid rgba(0,229,255,0.3)',
              objectFit: 'cover'
            }}
          />
          <Box>
            <Typography variant="h6" fontWeight="700" sx={{
              background: 'linear-gradient(90deg, #00E5FF, #00FF88)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: '1.1rem'
            }}>
              LOreAi
            </Typography>
            <Typography variant="caption" sx={{ 
              color: 'rgba(0,229,255,0.7)',
              fontSize: '0.75rem',
              fontWeight: 500
            }}>
              Comment Analytics
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip 
            label="93.2% Accuracy" 
            size="small" 
            sx={{ 
              background: 'rgba(0,229,255,0.1)',
              color: '#00E5FF',
              border: '1px solid rgba(0,229,255,0.3)',
              fontWeight: 600,
              fontSize: '0.7rem'
            }}
          />
          <Chip 
            label="26 Topics" 
            size="small" 
            sx={{ 
              background: 'rgba(0,255,136,0.1)',
              color: '#00FF88',
              border: '1px solid rgba(0,255,136,0.3)',
              fontWeight: 600,
              fontSize: '0.7rem'
            }}
          />
        </Box>
      </Box>

      {/* Navigation */}
      <List sx={{ flexGrow: 1, px: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.id} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              selected={selectedView === item.id}
              onClick={() => {
                setSelectedView(item.id);
              }}
              sx={{
                borderRadius: 3,
                mx: 1,
                py: 1.5,
                px: 2,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                overflow: 'hidden',
                '&.Mui-selected': {
                  background: 'linear-gradient(135deg, rgba(0,229,255,0.15) 0%, rgba(0,255,136,0.1) 100%)',
                  border: '1px solid rgba(0,229,255,0.3)',
                  boxShadow: '0 0 20px rgba(0,229,255,0.2)',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(135deg, rgba(0,229,255,0.1) 0%, rgba(0,255,136,0.05) 100%)',
                    zIndex: -1,
                  },
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 30px rgba(0,229,255,0.3)',
                    border: '1px solid rgba(0,229,255,0.5)',
                  },
                },
                '&:hover': {
                  background: 'rgba(0,229,255,0.08)',
                  border: '1px solid rgba(0,229,255,0.2)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 20px rgba(0,229,255,0.15)',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(135deg, rgba(0,229,255,0.05) 0%, rgba(0,255,136,0.02) 100%)',
                    zIndex: -1,
                  },
                },
              }}
            >
              <ListItemIcon sx={{ 
                color: selectedView === item.id ? '#00E5FF' : 'rgba(0,229,255,0.6)',
                minWidth: 40,
                '& svg': {
                  fontSize: '1.3rem',
                  filter: selectedView === item.id ? 'drop-shadow(0 0 8px rgba(0,229,255,0.6))' : 'none',
                  transition: 'all 0.3s ease'
                }
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                secondary={item.description}
                primaryTypographyProps={{
                  fontSize: '0.9rem',
                  fontWeight: selectedView === item.id ? 600 : 500,
                  color: selectedView === item.id ? '#00E5FF' : 'rgba(255,255,255,0.8)'
                }}
                secondaryTypographyProps={{
                  fontSize: '0.7rem',
                  color: selectedView === item.id ? 'rgba(0,229,255,0.7)' : 'rgba(255,255,255,0.5)',
                  fontWeight: 400
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

    </Box>
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Box sx={{
          display: 'flex',
          minHeight: '100vh',
          background: 'linear-gradient(180deg, #0a0f1f 0%, #091324 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}>

          {/* Drawer */}
          <Box
            component="nav"
            sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
          >
            <Drawer
              variant="permanent"
              sx={{
                display: { xs: 'none', sm: 'block' },
                '& .MuiDrawer-paper': { 
                  boxSizing: 'border-box', 
                  width: drawerWidth,
                  backgroundColor: '#1E1E1E',
                  borderRight: '1px solid rgba(255, 255, 255, 0.1)'
                },
              }}
              open
            >
              {drawer}
            </Drawer>
          </Box>

          {/* Main Content */}
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              width: { sm: `calc(100% - ${drawerWidth}px)` },
              minHeight: '100vh',
              backgroundColor: '#121212',
            }}
          >
            {renderContent()}
          </Box>
        </Box>

        {/* Global Styles for Animations */}
        <style>
          {`
            @keyframes pulse {
              0% { opacity: 1; }
              50% { opacity: 0.7; }
              100% { opacity: 1; }
            }
      @keyframes gradientShift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      
      @keyframes shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
            }
          `}
        </style>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
