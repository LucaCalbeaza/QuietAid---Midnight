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
import ScholarshipCard from '../components/ScholarshipCard';
import { usePrivateEligibility } from '../context/PrivateEligibilityContext';
import { rankScholarships } from '../utils/privateMatcher';

/**
 * Local private matching page.
 * Fetches PUBLIC scholarships only — never POSTs the private profile.
 */
const PrivateMatchesPage = ({ isLoggedIn }) => {
  const navigate = useNavigate();
  const { profile, isConfigured } = usePrivateEligibility();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login', { replace: true });
      return;
    }
    if (!isConfigured) {
      navigate('/private-profile', { replace: true });
      return;
    }

    const run = async () => {
      try {
        setLoading(true);
        // Public rules only — private profile stays in the client.
        const res = await axiosInstance.get('/scholarships');
        const ranked = rankScholarships(profile, res.data);
        setItems(ranked);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load scholarships.');
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [isLoggedIn, isConfigured, navigate, profile]);

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
        Private Matches
      </Typography>
      <Alert severity="info" sx={{ mb: 2 }}>
        Match percentages are from <strong>local</strong> private matching in
        your browser. They are not Midnight zero-knowledge proofs. Midnight
        verification happens only when you Apply Privately on a supported
        scholarship.
      </Alert>
      <Button
        component={RouterLink}
        to="/private-profile"
        variant="outlined"
        sx={{ mb: 2 }}
      >
        Edit private profile
      </Button>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {items.length === 0 ? (
        <Typography>No scholarships available.</Typography>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          }}
        >
          {items.map((sch) => (
            <ScholarshipCard
              key={sch._id}
              scholarship={sch}
              showScore
              privateMatch
              detailLink={`/scholarships/${sch._id}`}
            />
          ))}
        </Box>
      )}
    </Container>
  );
};

export default PrivateMatchesPage;
