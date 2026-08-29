import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import './index.css';
import './global.css';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#C9A227',
      contrastText: '#0F172A',
    },
    secondary: {
      main: '#94A3B8',
      contrastText: '#0F172A',
    },
    background: {
      default: '#0F172A',
      paper: '#1E293B',
    },
    text: {
      primary: '#F8FAFC',
      secondary: '#94A3B8',
    },
    divider: '#334155',
    error: {
      main: '#F87171',
    },
    success: {
      main: '#4ADE80',
    },
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: `'Inter', system-ui, sans-serif`,
    h1: { fontFamily: `'Merriweather', Georgia, serif` },
    h2: { fontFamily: `'Merriweather', Georgia, serif` },
    h3: { fontFamily: `'Merriweather', Georgia, serif` },
    h4: { fontFamily: `'Merriweather', Georgia, serif` },
    h5: { fontFamily: `'Merriweather', Georgia, serif` },
    h6: { fontFamily: `'Merriweather', Georgia, serif` },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid #334155',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#1E293B',
          border: '1px solid #334155',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: '#0F172A',
          '& fieldset': {
            borderColor: '#334155',
          },
          '&:hover fieldset': {
            borderColor: '#C9A227',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#C9A227',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          backgroundColor: '#C9A227',
          color: '#0F172A',
          '&:hover': {
            backgroundColor: '#E0B93A',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: 'none',
          boxShadow: '0 1px 0 #334155',
        },
      },
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
