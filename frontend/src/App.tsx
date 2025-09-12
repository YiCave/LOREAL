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
import { 
  spamSamples, 
  qualityCommentSamples, 
  topVideosByComments 
} from './services/dataService';
import { 
  Box, 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Chip,
  Avatar,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Topic as TopicIcon,
  Comment as CommentIcon,
  Analytics as AnalyticsIcon,
  Security as SecurityIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
} from '@mui/icons-material';

const queryClient = new QueryClient();

const App: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedView, setSelectedView] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(true);

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
      id: 'quality3d', 
      label: '🎯 Quality Distribution', 
      icon: <SecurityIcon />, 
      description: '3D Visualization' 
    },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const renderContent = () => {
    switch (selectedView) {
      case 'dashboard':
        return <Dashboard />;
      case 'topics':
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="700" color="primary">
              🏆 Beauty Topics Leaderboard
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Explore the 26 topics discovered from {topVideosByComments.reduce((sum, v) => sum + v.commentCount, 0).toLocaleString()} comments 
              across {topVideosByComments.length.toLocaleString()} beauty videos.
            </Typography>
            <TopicLeaderboard maxTopics={26} />
          </Box>
        );
      case 'comments':
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="700" color="primary">
              💬 Comment Classification Analysis
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Our AI-powered system automatically identifies spam, quality, and uncertain comments using 
              advanced Gaussian Mixture Model clustering.
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 3 }}>
              <CommentViewer 
                comments={spamSamples} 
                title="🚫 Spam Comments" 
                type="spam"
                helpContent="Learn how we detect spam"
              />
              <CommentViewer 
                comments={qualityCommentSamples} 
                title="✅ Quality Comments" 
                type="quality"
                helpContent="See what makes quality comments"
              />
              <CommentViewer 
                comments={spamSamples.slice(0, 2)} 
                title="❓ Uncertain Comments" 
                type="uncertain"
                helpContent="Comments that need manual review"
              />
            </Box>
          </Box>
        );
      case 'coherence':
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="700" color="primary">
              📈 Topic Model Performance
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Coherence score optimization showing why we chose 26 topics as the optimal configuration 
              for our L'Oréal beauty content analysis.
            </Typography>
            <CoherenceChart />
          </Box>
        );
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
    <Box sx={{ height: '100%', backgroundColor: '#1E1E1E', display: 'flex', flexDirection: 'column' }}>
      {/* Logo Section */}
      <Box sx={{ p: 3, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            sx={{ 
              backgroundColor: 'primary.main', 
              width: 40, 
              height: 40, 
              mr: 2,
              fontWeight: 700 
            }}
          >
            L
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight="700" color="primary">
              L'Oréal AI
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Comment Analytics
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip 
            label="93.2% Accuracy" 
            size="small" 
            color="primary" 
            variant="outlined"
          />
          <Chip 
            label="26 Topics" 
            size="small" 
            sx={{ backgroundColor: 'rgba(67, 160, 71, 0.2)', color: '#43A047' }}
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
                setMobileOpen(false);
              }}
              sx={{
                borderRadius: 2,
                mx: 1,
                '&.Mui-selected': {
                  backgroundColor: 'rgba(255, 105, 0, 0.15)',
                  color: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 105, 0, 0.2)',
                  },
                },
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                },
              }}
            >
              <ListItemIcon sx={{ color: selectedView === item.id ? 'primary.main' : 'text.secondary' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                secondary={item.description}
                secondaryTypographyProps={{
                  fontSize: '0.75rem',
                  color: 'text.disabled'
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Theme Toggle */}
      <Box sx={{ p: 2, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <FormControlLabel
          control={
            <Switch
              checked={isDarkMode}
              onChange={(e) => setIsDarkMode(e.target.checked)}
              color="primary"
            />
          }
          label={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {isDarkMode ? <DarkModeIcon sx={{ mr: 1, fontSize: 20 }} /> : <LightModeIcon sx={{ mr: 1, fontSize: 20 }} />}
              <Typography variant="body2">
                {isDarkMode ? 'Dark Mode' : 'Light Mode'}
              </Typography>
            </Box>
          }
        />
      </Box>
    </Box>
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
          {/* App Bar */}
          <AppBar
            position="fixed"
            sx={{
              width: { sm: `calc(100% - ${drawerWidth}px)` },
              ml: { sm: `${drawerWidth}px` },
              backgroundColor: '#1E1E1E',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.3)',
            }}
          >
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2, display: { sm: 'none' } }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                {menuItems.find(item => item.id === selectedView)?.label || 'L\'Oréal AI Dashboard'}
              </Typography>
              <Chip 
                label="🔴 Live Analysis" 
                size="small" 
                sx={{ 
                  backgroundColor: 'rgba(244, 67, 54, 0.2)', 
                  color: '#F44336',
                  animation: 'pulse 2s infinite'
                }} 
              />
            </Toolbar>
          </AppBar>

          {/* Drawer */}
          <Box
            component="nav"
            sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
          >
            <Drawer
              variant="temporary"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              ModalProps={{
                keepMounted: true,
              }}
              sx={{
                display: { xs: 'block', sm: 'none' },
                '& .MuiDrawer-paper': { 
                  boxSizing: 'border-box', 
                  width: drawerWidth,
                  backgroundColor: '#1E1E1E',
                  borderRight: '1px solid rgba(255, 255, 255, 0.1)'
                },
              }}
            >
              {drawer}
            </Drawer>
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
            <Toolbar />
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
          `}
        </style>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
