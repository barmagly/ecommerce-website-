import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import rtlPlugin from 'stylis-plugin-rtl';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';
import { darkModeColors } from './theme/darkModeColors';

// Components
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Categories from './pages/Categories';
import Orders from './pages/Orders';
import Users from './pages/Users';
import Profile from './pages/Profile';

// Context
import { AuthProvider } from './context/AuthContext';
import { UserProvider } from './context/UserContext';
import { DarkModeProvider, useDarkMode } from './context/DarkModeContext';

// Create RTL cache
const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

function AppContent() {
  const { darkMode, toggleDarkMode } = useDarkMode();

  // Create theme with RTL support and dynamic dark mode
  const theme = React.useMemo(
    () =>
      createTheme({
        direction: 'rtl',
        typography: {
          fontFamily: 'Cairo, sans-serif',
        },
        palette: {
          mode: darkMode ? 'dark' : 'light',
          background: {
            default: darkMode ? darkModeColors.background.default : '#f8f9fa',
            paper: darkMode ? darkModeColors.background.paper : '#ffffff',
          },
          text: {
            primary: darkMode ? darkModeColors.text.primary : '#000000',
            secondary: darkMode ? darkModeColors.text.secondary : 'rgba(0, 0, 0, 0.6)',
          },
          primary: {
            main: darkMode ? '#1e88e5' : '#1976d2',
          },
          secondary: {
            main: darkMode ? '#ff1744' : '#dc004e',
          },
          divider: darkMode ? darkModeColors.divider : 'rgba(0, 0, 0, 0.12)',
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                backgroundColor: darkMode ? darkModeColors.background.default : '#f8f9fa',
                color: darkMode ? darkModeColors.text.primary : '#000000',
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundColor: darkMode ? darkModeColors.background.paper : '#ffffff',
                backgroundImage: 'none',
              },
            },
          },
          MuiAppBar: {
            styleOverrides: {
              root: {
                backgroundColor: darkMode ? darkModeColors.background.header : '#ffffff',
                color: darkMode ? darkModeColors.text.primary : '#000000',
              },
            },
          },
          MuiDrawer: {
            styleOverrides: {
              paper: {
                backgroundColor: darkMode ? darkModeColors.background.sidebar : '#ffffff',
                backgroundImage: 'none',
              },
            },
          },
          MuiTextField: {
            defaultProps: {
              dir: 'rtl',
            },
            styleOverrides: {
              root: {
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: darkMode ? darkModeColors.border.light : 'rgba(0, 0, 0, 0.23)',
                  },
                  '&:hover fieldset': {
                    borderColor: darkMode ? darkModeColors.border.medium : 'rgba(0, 0, 0, 0.23)',
                  },
                },
              },
            },
          },
          MuiInputLabel: {
            defaultProps: {
              dir: 'rtl',
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                backgroundColor: darkMode ? darkModeColors.background.card : '#ffffff',
                backgroundImage: 'none',
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                '&:hover': {
                  backgroundColor: darkMode ? darkModeColors.action.hover : undefined,
                },
              },
            },
          },
        },
      }),
    [darkMode]
  );

  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <UserProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={
                <PrivateRoute>
                  <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
                </PrivateRoute>
              }>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard darkMode={darkMode} />} />
                <Route path="products" element={<Products darkMode={darkMode} />} />
                <Route path="categories" element={<Categories darkMode={darkMode} />} />
                <Route path="orders" element={<Orders darkMode={darkMode} />} />
                <Route path="users" element={<Users darkMode={darkMode} />} />
                <Route path="profile" element={<Profile darkMode={darkMode} />} />
              </Route>
            </Routes>
            <ToastContainer
              position="top-left"
              rtl={true}
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme={darkMode ? 'dark' : 'light'}
            />
          </UserProvider>
        </AuthProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}

function App() {
  return (
    <DarkModeProvider>
      <AppContent />
    </DarkModeProvider>
  );
}

export default App; 