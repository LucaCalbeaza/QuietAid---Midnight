import React, { useEffect, useState } from 'react';
import { Grid, Typography, CircularProgress, Alert } from '@mui/material';
import axiosInstance from '../utils/axiosInstance';
import ScholarshipCard from './ScholarshipCard';

const ScholarshipList = () => {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        const response = await axiosInstance.get('/scholarships');
        setScholarships(response.data);
      } catch (error) {
        console.error('Failed to fetch scholarships:', error);
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
      <Grid container justifyContent="center" sx={{ mt: 4 }}>
        <CircularProgress />
      </Grid>
    );
  }

  if (errorMsg) {
    return (
      <Grid container justifyContent="center" sx={{ mt: 4 }}>
        <Alert severity="error">{errorMsg}</Alert>
      </Grid>
    );
  }

  if (!scholarships.length) {
    return (
      <Grid container justifyContent="center" sx={{ mt: 4 }}>
        <Typography variant="h6">No scholarships found.</Typography>
      </Grid>
    );
  }

  return (
    <Grid container spacing={3} sx={{ p: 3 }}>
      {scholarships.map((scholarship) => (
        <Grid item xs={12} sm={6} md={4} key={scholarship._id}>
          <ScholarshipCard
            title={scholarship.title}
            description={scholarship.description}
            amount={scholarship.amount}
            deadline={scholarship.deadline}
            eligibility={scholarship.eligibility}
            link={scholarship.link}
            applyLink={scholarship.applyLink}
            sentiment={scholarship.sentiment}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default ScholarshipList;
