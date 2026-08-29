import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import ScholarshipsPage from './pages/ScholarshipsPage';
import RecommendationsPage from './pages/RecommendationsPage';
import LoginForm from './components/LoginForm';
import RegistrationForm from './components/RegistrationForm';
import UserDashboard from './components/UserDashboard';
import EditProfilePage from './pages/EditProfilePage';
import axiosInstance from './utils/axiosInstance';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [checkingAuth, setCheckingAuth] = React.useState(true);

  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('Checking authentication...');
        const res = await axiosInstance.get('/users/me');
        if (res.data && res.data._id) {
          console.log('User authenticated:', res.data._id);
          setIsLoggedIn(true);
        } else {
          console.log('No user found');
          setIsLoggedIn(false);
        }
      } catch {
        console.log('Auth check failed');
        setIsLoggedIn(false);
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = () => {
    console.log('User logged in');
    setIsLoggedIn(true);
  };
  
  const handleLogout = async () => {
    try {
      console.log('Logging out...');
      await axiosInstance.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggedIn(false);
      console.log('Logged out');
    }
  };

  if (checkingAuth) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <NavBar isLoggedIn={isLoggedIn} onLogout={handleLogout} />

      <Routes>
        <Route path="/" element={<Navigate to="/scholarships" replace />} />

        <Route path="/scholarships" element={<ScholarshipsPage />} />

        <Route
          path="/recommendations"
          element={<RecommendationsPage isLoggedIn={isLoggedIn} />}
        />

        <Route
          path="/login"
          element={
            isLoggedIn ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <LoginForm onLoginSuccess={handleLogin} />
            )
          }
        />

        <Route
          path="/register"
          element={
            isLoggedIn ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <RegistrationForm onRegisterSuccess={handleLogin} />
            )
          }
        />

        <Route
          path="/dashboard"
          element={
            isLoggedIn ? (
              <UserDashboard />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/edit-profile"
          element={
            isLoggedIn ? (
              <EditProfilePage />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;