import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Button,
  CircularProgress,
  Container,
  Typography,
} from '@mui/material';
import axiosInstance from '../utils/axiosInstance';

const ApplicationDetailPage = ({ isLoggedIn }) => {
  const { publicApplicationId } = useParams();
  const navigate = useNavigate();
  const [app, setApp] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login', { replace: true });
      return;
    }
    const load = async () => {
      try {
        const res = await axiosInstance.get(
          `/private-applications/${publicApplicationId}`
        );
        setApp(res.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load');
      }
    };
    load();
  }, [isLoggedIn, publicApplicationId, navigate]);

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!app) {
    return (
      <Container sx={{ textAlign: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ my: 4 }}>
      <Typography variant="h4" gutterBottom>
        Private application
      </Typography>
      <Typography>Application: {app.publicApplicationId}</Typography>
      <Typography>Applicant: {app.pseudonym}</Typography>
      <Typography>Scholarship: {app.scholarshipTitle}</Typography>
      <Typography>
        Eligibility: {app.eligibilityVerified ? 'Verified' : 'Not verified'}
      </Typography>
      <Typography>
        Midnight: {app.midnight?.proofStatus || '—'} (
        {app.midnight?.executionId || app.midnight?.transactionId || 'n/a'})
      </Typography>
      <Typography>
        Identity: {app.identityDisclosure?.status || 'HIDDEN'}
      </Typography>
      <Button component={RouterLink} to="/my-applications" sx={{ mt: 2 }}>
        My applications
      </Button>
    </Container>
  );
};

export default ApplicationDetailPage;
