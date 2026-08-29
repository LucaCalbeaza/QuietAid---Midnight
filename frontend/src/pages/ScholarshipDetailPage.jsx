import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import axiosInstance from '../utils/axiosInstance';
import { EVERGREEN_TITLE } from '../services/evergreenRules';

const ScholarshipDetailPage = ({ isLoggedIn }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [scholarship, setScholarship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get('/scholarships');
        const found = (res.data || []).find((s) => s._id === id);
        if (!found) {
          setError('Scholarship not found.');
        } else {
          setScholarship(found);
        }
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load scholarship.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <Container sx={{ textAlign: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !scholarship) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error || 'Not found'}</Alert>
      </Container>
    );
  }

  const pe = scholarship.privateEligibility || {};
  const midnightOk = !!scholarship.midnightEnabled;

  return (
    <Container maxWidth="md" sx={{ my: 4 }}>
      <Typography variant="h4" gutterBottom>
        {scholarship.title}
      </Typography>
      {scholarship.provider && (
        <Typography color="text.secondary" gutterBottom>
          Provider: {scholarship.provider}
        </Typography>
      )}
      <Typography sx={{ mb: 1 }}>
        <strong>Award:</strong> {scholarship.amount || '—'}
      </Typography>
      <Typography sx={{ mb: 2 }}>
        <strong>Deadline:</strong> {scholarship.deadline || '—'}
      </Typography>
      <Typography paragraph>{scholarship.description}</Typography>

      <Typography variant="h6" gutterBottom>
        Public eligibility requirements
      </Typography>
      <List dense>
        {(scholarship.publicRequirements || []).map((r) => (
          <ListItem key={r}>
            <ListItemText primary={r} />
          </ListItem>
        ))}
      </List>

      <Box sx={{ my: 2 }}>
        {midnightOk ? (
          <Alert severity="success" sx={{ mb: 2 }}>
            Private verification supported. Midnight verification available
            {scholarship.title === EVERGREEN_TITLE
              ? ' (V1: enrollment + income).'
              : '.'}
          </Alert>
        ) : (
          <Alert severity="info" sx={{ mb: 2 }}>
            Midnight private apply is not enabled for this scholarship yet.
            Local private matching still works.
          </Alert>
        )}
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Public rules (not your private values): enrollment=
        {pe.enrollmentStatus || 'any'}; max household income=
        {pe.maxHouseholdIncome ?? 'n/a'}; min GPA={pe.minGPA ?? 'n/a'}
      </Typography>

      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {midnightOk && (
          <Button
            variant="contained"
            disabled={!isLoggedIn}
            onClick={() => navigate(`/scholarships/${id}/apply-private`)}
          >
            Apply Privately with Midnight
          </Button>
        )}
        {!isLoggedIn && midnightOk && (
          <Button component={RouterLink} to="/login">
            Login to apply privately
          </Button>
        )}
        <Button component={RouterLink} to="/private-matches" variant="outlined">
          Back to private matches
        </Button>
      </Box>
    </Container>
  );
};

export default ScholarshipDetailPage;
