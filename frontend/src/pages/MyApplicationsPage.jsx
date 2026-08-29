import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Container,
  FormControlLabel,
  FormGroup,
  Typography,
} from '@mui/material';
import axiosInstance from '../utils/axiosInstance';

const MyApplicationsPage = ({ isLoggedIn }) => {
  const navigate = useNavigate();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState({});
  const [message, setMessage] = useState(null);

  const load = async () => {
    try {
      const res = await axiosInstance.get('/private-applications/me');
      setApps(res.data || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login', { replace: true });
      return;
    }
    load();
  }, [isLoggedIn, navigate]);

  const toggleField = (appId, field) => {
    setSelected((prev) => {
      const cur = new Set(prev[appId] || []);
      if (cur.has(field)) cur.delete(field);
      else cur.add(field);
      return { ...prev, [appId]: [...cur] };
    });
  };

  const disclose = async (publicApplicationId) => {
    try {
      const fields = selected[publicApplicationId] || [];
      await axiosInstance.post(
        `/private-applications/${publicApplicationId}/disclose`,
        { fields }
      );
      setMessage('Disclosure submitted.');
      await load();
    } catch (err) {
      setError(err.response?.data?.error || 'Disclosure failed');
    }
  };

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
        My Private Applications
      </Typography>
      {message && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {apps.length === 0 ? (
        <Typography>No private applications yet.</Typography>
      ) : (
        apps.map((app) => (
          <Box
            key={app.publicApplicationId}
            sx={{ border: '1px solid', borderColor: 'divider', p: 2, mb: 2 }}
          >
            <Typography variant="h6">{app.publicApplicationId}</Typography>
            <Typography>Pseudonym: {app.pseudonym}</Typography>
            <Typography>{app.scholarshipTitle}</Typography>
            <Typography>
              Eligibility:{' '}
              {app.eligibilityVerified ? 'Verified' : 'Not verified'}
            </Typography>
            <Typography>
              Midnight: {app.midnight?.proofStatus || '—'}
            </Typography>
            <Typography>
              Identity disclosure: {app.identityDisclosure?.status}
            </Typography>

            {app.identityDisclosure?.status === 'REQUESTED' && (
              <Box sx={{ mt: 2 }}>
                <Alert severity="info" sx={{ mb: 1 }}>
                  The provider would like to continue your application. Choose
                  what you want to share:
                </Alert>
                <FormGroup>
                  {['name', 'email', 'address', 'phone'].map((f) => (
                    <FormControlLabel
                      key={f}
                      control={
                        <Checkbox
                          checked={(selected[app.publicApplicationId] || []).includes(
                            f
                          )}
                          onChange={() =>
                            toggleField(app.publicApplicationId, f)
                          }
                        />
                      }
                      label={f.charAt(0).toUpperCase() + f.slice(1)}
                    />
                  ))}
                </FormGroup>
                <Button
                  variant="contained"
                  sx={{ mt: 1 }}
                  onClick={() => disclose(app.publicApplicationId)}
                >
                  Submit disclosure
                </Button>
              </Box>
            )}

            <Button
              component={RouterLink}
              to={`/applications/${app.publicApplicationId}`}
              sx={{ mt: 1 }}
            >
              Details
            </Button>
          </Box>
        ))
      )}
    </Container>
  );
};

export default MyApplicationsPage;
