import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Typography,
} from '@mui/material';
import axiosInstance from '../utils/axiosInstance';

const ProviderApplicationsPage = ({ isLoggedIn }) => {
  const navigate = useNavigate();
  const [apps, setApps] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login', { replace: true });
      return;
    }
    const load = async () => {
      try {
        const res = await axiosInstance.get('/provider/applications');
        setApps(res.data || []);
      } catch (err) {
        setError(
          err.response?.data?.error ||
            'Unable to load provider applications (are you logged in as provider?)'
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [isLoggedIn, navigate]);

  if (loading) {
    return (
      <Container sx={{ textAlign: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container sx={{ my: 4 }}>
      <Typography variant="h4" gutterBottom>
        Provider Applications
      </Typography>
      <Alert severity="info" sx={{ mb: 2 }}>
        You see eligibility verification and Midnight proof status. Sensitive
        eligibility attributes and identity stay hidden until the student
        discloses contact fields.
      </Alert>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {apps.length === 0 ? (
        <Typography>No verified private applications yet.</Typography>
      ) : (
        <div className="card-grid">
          {apps.map((app) => (
            <Box
              key={app.publicApplicationId}
              className="app-list-card"
            >
              <Typography variant="h6">
                Application: {app.publicApplicationId}
              </Typography>
              <Typography>Applicant: {app.pseudonym}</Typography>
              <Typography>Scholarship: {app.scholarshipTitle}</Typography>
              <Typography>
                Eligibility:{' '}
                {app.eligibilityVerified ? 'VERIFIED' : 'NOT VERIFIED'}
              </Typography>
              <Typography>
                Midnight proof: {app.midnight?.proofStatus || 'UNKNOWN'}
              </Typography>
              <Typography>
                Identity: {app.identity?.status || 'HIDDEN'}
              </Typography>
              <Button
                component={RouterLink}
                to={`/provider/applications/${app.publicApplicationId}`}
                sx={{ mt: 1 }}
              >
                Open
              </Button>
            </Box>
          ))}
        </div>
      )}
    </Container>
  );
};

export default ProviderApplicationsPage;
