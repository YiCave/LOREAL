import { createTheme } from '@mui/material/styles';

// L'Oréal brand colors with dark theme variations
export const brandColors = {
  primary: '#FF6900', // L'Oréal Orange
  secondary: '#00C7BE', // Teal accent
  tertiary: '#8E24AA', // Purple accent
  success: '#43A047',
  warning: '#FB8C00',
  error: '#F44336',
  info: '#1E88E5'
};

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#121212', // Main background
      paper: '#1E1E1E', // Card backgrounds
    },
    primary: {
      main: brandColors.primary,
      light: '#FF8533',
      dark: '#E55A00',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: brandColors.secondary,
      light: '#33D1CA',
      dark: '#00A69B',
      contrastText: '#FFFFFF',
    },
    text: {
      primary: '#E0E0E0', // Soft white for body text
      secondary: '#A0A0A0', // Muted text
      disabled: '#666666',
    },
    divider: 'rgba(255, 255, 255, 0.12)',
    action: {
      hover: 'rgba(255, 255, 255, 0.08)',
      selected: 'rgba(255, 105, 0, 0.12)',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
      color: '#E0E0E0',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
      color: '#E0E0E0',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.3,
      color: '#E0E0E0',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
      color: '#E0E0E0',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
      color: '#E0E0E0',
    },
    h6: {
      fontSize: '1.1rem',
      fontWeight: 600,
      lineHeight: 1.5,
      color: '#E0E0E0',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      color: '#B0B0B0',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      color: '#A0A0A0',
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.4,
      color: '#808080',
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(0, 0, 0, 0.2)',
    '0px 4px 8px rgba(0, 0, 0, 0.25)',
    '0px 6px 12px rgba(0, 0, 0, 0.3)',
    '0px 8px 16px rgba(0, 0, 0, 0.35)',
    '0px 10px 20px rgba(0, 0, 0, 0.4)',
    // Continue the pattern...
    ...Array(20).fill('0px 12px 24px rgba(0, 0, 0, 0.45)')
  ] as any,
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#1E1E1E',
          backgroundImage: 'none',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.3)',
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: '#252525',
            boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.4)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#1E1E1E',
          backgroundImage: 'none',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
          padding: '10px 24px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 4px 12px rgba(255, 105, 0, 0.3)',
            transform: 'translateY(-1px)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 105, 0, 0.1)',
          color: '#FF6900',
          border: '1px solid rgba(255, 105, 0, 0.3)',
          fontWeight: 500,
          '&:hover': {
            backgroundColor: 'rgba(255, 105, 0, 0.15)',
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#2A2A2A',
          color: '#E0E0E0',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          fontSize: '0.875rem',
          maxWidth: 300,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        },
        head: {
          backgroundColor: '#2A2A2A',
          fontWeight: 600,
        },
      },
    },
  },
});

export default darkTheme;