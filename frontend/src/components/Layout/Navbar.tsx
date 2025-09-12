import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Chip,
  Avatar
} from '@mui/material';
import {
  Menu as MenuIcon,
  Analytics as AnalyticsIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';

interface NavbarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        background: 'linear-gradient(45deg, #FF6900 30%, #FF8533 90%)',
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          edge="start"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        
        <AnalyticsIcon sx={{ mr: 1 }} />
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 0, mr: 3 }}>
          L'Oréal AI Comment Analytics
        </Typography>
        
        <Chip 
          label="AI Powered" 
          size="small" 
          sx={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            mr: 2
          }} 
        />

        <Box sx={{ flexGrow: 1 }} />
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Chip 
            label="34.9K Videos Analyzed" 
            variant="outlined" 
            size="small"
            sx={{ 
              borderColor: 'white',
              color: 'white'
            }}
          />
          <Chip 
            label="3.09M Quality Comments" 
            variant="outlined" 
            size="small"
            sx={{ 
              borderColor: 'white',
              color: 'white'
            }}
          />
          <Chip 
            label="26 Topics Discovered" 
            variant="outlined" 
            size="small"
            sx={{ 
              borderColor: 'white',
              color: 'white'
            }}
          />
          
          <IconButton color="inherit">
            <NotificationsIcon />
          </IconButton>
          
          <Avatar sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)' }}>
            LO
          </Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;