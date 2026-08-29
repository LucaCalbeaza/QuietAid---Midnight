import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosInstance';
import EditProfileForm from '../components/EditProfileForm';
import { CircularProgress, Box, Typography } from '@mui/material';

const EditProfilePage = () => {
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const res = await axios.get('/users/me');
        setUserId(res.data._id);
      } catch (err) {
        console.error('Error fetching user info:', err);
        setError('Failed to fetch user information.');
      } finally {
        setLoading(false);
      }
    };
    fetchUserId();
  }, []);

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !userId) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography color="error">
          {error || 'Unable to determine user ID.'}
        </Typography>
      </Box>
    );
  }

  // Pass the fetched userId into the form
  return <EditProfileForm userId={userId} />;
};

export default EditProfilePage;
