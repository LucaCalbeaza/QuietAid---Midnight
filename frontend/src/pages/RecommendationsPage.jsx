import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import ScholarshipCard from '../components/ScholarshipCard';
import {
  Box,
  Typography,
  CircularProgress,
  Container,
  Alert,
  TextField,
} from '@mui/material';

const RecommendationsPage = ({ isLoggedIn }) => {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login', { replace: true });
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const recRes = await axiosInstance.get('/scholarships/recommendations');
        setRecommendations(recRes.data);
        setFiltered(recRes.data);
      } catch (err) {
        console.error('Error loading recommendations:', err);
        if (err.response?.status === 401) {
          navigate('/login', { replace: true });
        } else {
          setError(err.response?.data?.error || 'Failed to load scholarships.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFiltered(recommendations);
      return;
    }

    const q = searchQuery.toLowerCase();
    const filteredResults = recommendations.filter((s) =>
      (s.title || s.heading || '').toLowerCase().includes(q)
    );
    setFiltered(filteredResults);
  }, [searchQuery, recommendations]);

  if (loading) {
    return (
      <Container sx={{ textAlign: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ textAlign: 'center', mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ my: 4 }}>
      <Typography variant="h4" gutterBottom>
        Scholarships Tailored for You
      </Typography>

      <Box sx={{ mb: 3 }}>
        <TextField
          label="Search scholarships"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Box>

      {filtered.length === 0 ? (
        <Typography sx={{ mt: 2 }}>
          No scholarships found matching your search.
        </Typography>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          }}
        >
          {filtered.map((sch) => (
            <ScholarshipCard key={sch._id} scholarship={sch} showScore={true} />
          ))}
        </Box>
      )}
    </Container>
  );
};

export default RecommendationsPage;
