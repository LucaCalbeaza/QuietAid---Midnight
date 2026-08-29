import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import axiosInstance from '../utils/axiosInstance';
import ScholarshipCard from '../components/ScholarshipCard';

const HomePage = () => {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        const response = await axiosInstance.get('/scholarships');
        setScholarships(response.data);
      } catch (error) {
        console.error('Error fetching scholarships:', error);
        setErrorMsg(
          error.response?.data?.error || 'Unable to load scholarships at this time.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchScholarships();
  }, []);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (errorMsg) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{errorMsg}</Alert>
      </Container>
    );
  }

  if (!scholarships.length) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h6">No scholarships found.</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Typography variant="h4" gutterBottom>
        Latest Scholarships
      </Typography>
      <Grid
        container
        spacing={3}
        sx={{
          margin: 0,
          width: '100%',
        }}
      >
        {scholarships.map((scholarship) => (
          <Grid
            item
            key={scholarship._id}
            xs={12}
            sm={6}
            sx={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <ScholarshipCard
              title={scholarship.title}
              description={scholarship.description}
              amount={scholarship.amount}
              deadline={scholarship.deadline}
              eligibility={scholarship.eligibility}
              link={scholarship.link}
              applyLink={scholarship.applyLink}
              sentiment={scholarship.sentiment}
              sx={{ flexGrow: 1, width: '100%' }}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default HomePage;
