import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Divider,
  Chip
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Topic as TopicIcon,
  VideoLibrary as VideoIcon,
  Security as SecurityIcon,
  Analytics as AnalyticsIcon,
  TrendingUp as TrendingIcon
} from '@mui/icons-material';

interface SidebarProps {
  open: boolean;
  currentView: string;
  setCurrentView: (view: string) => void;
}

const drawerWidth = 240;

const menuItems = [
  {
    id: 'dashboard',
    label: 'Executive Dashboard',
    icon: <DashboardIcon />,
    badge: null
  },
  {
    id: 'topics',
    label: 'Topic Intelligence',
    icon: <TopicIcon />,
    badge: '26'
  },
  {
    id: 'videos',
    label: 'Video Explorer',
    icon: <VideoIcon />,
    badge: '34.9K'
  },
  {
    id: 'spam',
    label: 'Spam Detection',
    icon: <SecurityIcon />,
    badge: '93%'
  },
  {
    id: 'analysis',
    label: 'Analysis Tools',
    icon: <AnalyticsIcon />,
    badge: null
  }
];

const Sidebar: React.FC<SidebarProps> = ({ open, currentView, setCurrentView }) => {
  return (
    <Drawer
      variant="permanent"
      open={open}
      sx={{
        width: open ? drawerWidth : 60,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? drawerWidth : 60,
          boxSizing: 'border-box',
          transition: 'width 0.3s',
          overflowX: 'hidden',
          mt: 8, // Account for navbar
        },
      }}
    >
      <Box sx={{ overflow: 'auto', pt: 2 }}>
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.id} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                onClick={() => setCurrentView(item.id)}
                selected={currentView === item.id}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(255, 105, 0, 0.1)',
                    borderRight: '3px solid #FF6900',
                    '& .MuiListItemIcon-root': {
                      color: '#FF6900'
                    },
                    '& .MuiListItemText-primary': {
                      color: '#FF6900',
                      fontWeight: 600
                    }
                  }
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.label} 
                  sx={{ 
                    opacity: open ? 1 : 0,
                    '& .MuiListItemText-primary': {
                      fontSize: '0.9rem'
                    }
                  }} 
                />
                {item.badge && open && (
                  <Chip
                    label={item.badge}
                    size="small"
                    sx={{
                      backgroundColor: currentView === item.id ? '#FF6900' : '#E0E0E0',
                      color: currentView === item.id ? 'white' : 'black',
                      fontSize: '0.75rem',
                      height: '20px'
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        
        <Divider sx={{ my: 2 }} />
        
        {open && (
          <Box sx={{ px: 2, pb: 2 }}>
            <Box sx={{ 
              backgroundColor: '#F5F5F5', 
              borderRadius: 2, 
              p: 2,
              textAlign: 'center'
            }}>
              <TrendingIcon color="primary" sx={{ mb: 1 }} />
              <Box sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
                Model Accuracy
              </Box>
              <Box sx={{ 
                fontSize: '1.2rem', 
                fontWeight: 'bold', 
                color: 'primary.main' 
              }}>
                93.2%
              </Box>
              <Box sx={{ fontSize: '0.7rem', color: 'text.secondary', mt: 0.5 }}>
                Spam Detection
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Drawer>
  );
};

export default Sidebar;