import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Typography,
} from '@mui/material';
import axiosInstance from '../utils/axiosInstance';

const ProviderApplicationDetailPage = ({ isLoggedIn }) => {
  const { publicApplicationId } = useParams();
  const navigate = useNavigate();
  const [app, setApp] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  const load = async () => {
    try {
      const res = await axiosInstance.get(
        `/provider/applications/${publicApplicationId}`
      );
      setApp(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load application');
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, publicApplicationId, navigate]);

  const requestContact = async () => {
    try {
      const res = await axiosInstance.post(
        `/provider/applications/${publicApplicationId}/request-disclosure`,
        { fields: ['name', 'email', 'address'] }
      );
      setApp(res.data);
      setMessage('Contact / identity disclosure requested.');
    } catch (err) {
      setError(err.response?.data?.error || 'Request failed');
    }
  };

  if (loading) {
    return (
      <Container sx={{ textAlign: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!app) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error || 'Not found'}</Alert>
      </Container>
    );
  }

  const identity = app.identity || {};

  return (
    <Container maxWidth="sm" sx={{ my: 4 }}>
      <Typography variant="h4" gutterBottom>
        Application {app.publicApplicationId}
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

      <Typography>Applicant: {app.pseudonym}</Typography>
      <Typography>Scholarship: {app.scholarshipTitle}</Typography>
      <Typography>
        Eligibility: {app.eligibilityVerified ? 'VERIFIED' : 'NOT VERIFIED'}
      </Typography>
      <Typography>
        Midnight proof: {app.midnight?.proofStatus || 'UNKNOWN'}
      </Typography>
      <Typography sx={{ mt: 2 }}>
        Identity: {identity.status || 'HIDDEN'}
      </Typography>
      {identity.name && <Typography>Name: {identity.name}</Typography>}
      {identity.email && <Typography>Email: {identity.email}</Typography>}
      {identity.address && <Typography>Address: {identity.address}</Typography>}

      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle1">Sensitive information</Typography>
        <Typography>
          Household income: {app.sensitiveInformation?.householdIncome}
        </Typography>
        <Typography>GPA: {app.sensitiveInformation?.gpa}</Typography>
        <Typography>
          Disability/accessibility: {app.sensitiveInformation?.disability}
        </Typography>
        <Typography>
          Housing circumstances: {app.sensitiveInformation?.housing}
        </Typography>
        <Typography>
          Address: {app.sensitiveInformation?.addressLabel}
        </Typography>
      </Box>

      <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
        <Button variant="contained" onClick={requestContact}>
          Request Contact
        </Button>
        <Button component={RouterLink} to="/provider/applications">
          Back
        </Button>
      </Box>
    </Container>
  );
};

export default ProviderApplicationDetailPage;
