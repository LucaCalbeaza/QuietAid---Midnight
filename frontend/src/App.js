import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import ScholarshipsPage from './pages/ScholarshipsPage';
import RecommendationsPage from './pages/RecommendationsPage';
import PrivateProfilePage from './pages/PrivateProfilePage';
import PrivateMatchesPage from './pages/PrivateMatchesPage';
import ScholarshipDetailPage from './pages/ScholarshipDetailPage';
import ApplyPrivatePage from './pages/ApplyPrivatePage';
import MyApplicationsPage from './pages/MyApplicationsPage';
import ApplicationDetailPage from './pages/ApplicationDetailPage';
import ProviderApplicationsPage from './pages/ProviderApplicationsPage';
import ProviderApplicationDetailPage from './pages/ProviderApplicationDetailPage';
import LoginForm from './components/LoginForm';
import RegistrationForm from './components/RegistrationForm';
import UserDashboard from './components/UserDashboard';
import EditProfilePage from './pages/EditProfilePage';
import { PrivateEligibilityProvider } from './context/PrivateEligibilityContext';
import axiosInstance from './utils/axiosInstance';
import './App.css';

function homeForRole(role) {
  if (role === 'provider') return '/provider/applications';
  if (role === 'student') return '/private-profile';
  return '/scholarships';
}

function RequireRole({ role, allowed, children, fallback = '/login' }) {
  if (!role) return <Navigate to="/login" replace />;
  if (!allowed.includes(role)) {
    return <Navigate to={homeForRole(role)} replace />;
  }
  return children;
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [role, setRole] = React.useState(null);
  const [checkingAuth, setCheckingAuth] = React.useState(true);

  const refreshSession = React.useCallback(async () => {
    try {
      const res = await axiosInstance.get('/users/me');
      if (res.data && res.data._id) {
        setIsLoggedIn(true);
        setRole(res.data.role || 'student');
        return res.data;
      }
      setIsLoggedIn(false);
      setRole(null);
      return null;
    } catch {
      setIsLoggedIn(false);
      setRole(null);
      return null;
    }
  }, []);

  React.useEffect(() => {
    const checkAuth = async () => {
      await refreshSession();
      setCheckingAuth(false);
    };
    checkAuth();
  }, [refreshSession]);

  const handleLogin = async () => {
    await refreshSession();
  };

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/auth/logout');
    } catch {
      // clear local session either way
    } finally {
      setIsLoggedIn(false);
      setRole(null);
    }
  };

  if (checkingAuth) {
    return <div>Loading...</div>;
  }

  return (
    <PrivateEligibilityProvider>
      <Router>
        <NavBar
          isLoggedIn={isLoggedIn}
          role={role}
          onLogout={handleLogout}
        />

        <Routes>
          <Route
            path="/"
            element={
              <Navigate
                to={isLoggedIn ? homeForRole(role) : '/scholarships'}
                replace
              />
            }
          />
          <Route path="/scholarships" element={<ScholarshipsPage />} />
          <Route
            path="/scholarships/:id"
            element={
              <ScholarshipDetailPage isLoggedIn={isLoggedIn} role={role} />
            }
          />
          <Route
            path="/scholarships/:id/apply-private"
            element={
              <RequireRole role={role} allowed={['student']}>
                <ApplyPrivatePage isLoggedIn={isLoggedIn} />
              </RequireRole>
            }
          />
          <Route
            path="/private-profile"
            element={
              <RequireRole role={role} allowed={['student']}>
                <PrivateProfilePage />
              </RequireRole>
            }
          />
          <Route
            path="/private-matches"
            element={
              <RequireRole role={role} allowed={['student']}>
                <PrivateMatchesPage isLoggedIn={isLoggedIn} />
              </RequireRole>
            }
          />
          <Route
            path="/my-applications"
            element={
              <RequireRole role={role} allowed={['student']}>
                <MyApplicationsPage isLoggedIn={isLoggedIn} />
              </RequireRole>
            }
          />
          <Route
            path="/applications/:publicApplicationId"
            element={
              <RequireRole role={role} allowed={['student']}>
                <ApplicationDetailPage isLoggedIn={isLoggedIn} />
              </RequireRole>
            }
          />
          <Route
            path="/provider/applications"
            element={
              <RequireRole role={role} allowed={['provider']}>
                <ProviderApplicationsPage isLoggedIn={isLoggedIn} />
              </RequireRole>
            }
          />
          <Route
            path="/provider/applications/:publicApplicationId"
            element={
              <RequireRole role={role} allowed={['provider']}>
                <ProviderApplicationDetailPage isLoggedIn={isLoggedIn} />
              </RequireRole>
            }
          />
          <Route
            path="/recommendations"
            element={
              <RequireRole role={role} allowed={['student']}>
                <RecommendationsPage isLoggedIn={isLoggedIn} />
              </RequireRole>
            }
          />
          <Route
            path="/login"
            element={
              isLoggedIn ? (
                <Navigate to={homeForRole(role)} replace />
              ) : (
                <LoginForm onLoginSuccess={handleLogin} />
              )
            }
          />
          <Route
            path="/register"
            element={
              isLoggedIn ? (
                <Navigate to={homeForRole(role)} replace />
              ) : (
                <RegistrationForm onRegisterSuccess={handleLogin} />
              )
            }
          />
          <Route
            path="/dashboard"
            element={
              <RequireRole role={role} allowed={['student']}>
                <UserDashboard />
              </RequireRole>
            }
          />
          <Route
            path="/edit-profile"
            element={
              <RequireRole role={role} allowed={['student']}>
                <EditProfilePage />
              </RequireRole>
            }
          />
          <Route path="*" element={<div>404 - Page Not Found</div>} />
        </Routes>
      </Router>
    </PrivateEligibilityProvider>
  );
}

export default App;
