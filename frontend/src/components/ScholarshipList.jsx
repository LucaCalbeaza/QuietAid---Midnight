import React, { useEffect, useState } from 'react';
import { Typography, CircularProgress, Alert } from '@mui/material';
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
      <div className="app-status">
        <CircularProgress />
      </div>
    );
  }

  if (errorMsg) {
    return (
      <Alert severity="error">{errorMsg}</Alert>
    );
  }

  if (!scholarships.length) {
    return (
      <Typography variant="h6">No scholarships found.</Typography>
    );
  }

  return (
    <div className="card-grid">
      {scholarships.map((scholarship) => (
        <ScholarshipCard
          key={scholarship._id}
          scholarship={scholarship}
          detailLink={`/scholarships/${scholarship._id}`}
        />
      ))}
    </div>
  );
};

export default ScholarshipList;
