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

function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [checkingAuth, setCheckingAuth] = React.useState(true);

  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axiosInstance.get('/users/me');
        if (res.data && res.data._id) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch {
        setIsLoggedIn(false);
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/auth/logout');
    } catch {
      // clear local session either way
    } finally {
      setIsLoggedIn(false);
    }
  };

  if (checkingAuth) {
    return <div>Loading...</div>;
  }

  return (
    <PrivateEligibilityProvider>
      <Router>
        <NavBar isLoggedIn={isLoggedIn} onLogout={handleLogout} />

        <Routes>
          <Route path="/" element={<Navigate to="/scholarships" replace />} />
          <Route path="/scholarships" element={<ScholarshipsPage />} />
          <Route
            path="/scholarships/:id"
            element={<ScholarshipDetailPage isLoggedIn={isLoggedIn} />}
          />
          <Route
            path="/scholarships/:id/apply-private"
            element={<ApplyPrivatePage isLoggedIn={isLoggedIn} />}
          />
          <Route
            path="/private-profile"
            element={
              isLoggedIn ? (
                <PrivateProfilePage />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/private-matches"
            element={<PrivateMatchesPage isLoggedIn={isLoggedIn} />}
          />
          <Route
            path="/my-applications"
            element={<MyApplicationsPage isLoggedIn={isLoggedIn} />}
          />
          <Route
            path="/applications/:publicApplicationId"
            element={<ApplicationDetailPage isLoggedIn={isLoggedIn} />}
          />
          <Route
            path="/provider/applications"
            element={<ProviderApplicationsPage isLoggedIn={isLoggedIn} />}
          />
          <Route
            path="/provider/applications/:publicApplicationId"
            element={
              <ProviderApplicationDetailPage isLoggedIn={isLoggedIn} />
            }
          />
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
              isLoggedIn ? <UserDashboard /> : <Navigate to="/login" replace />
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
    </PrivateEligibilityProvider>
  );
}

export default App;
