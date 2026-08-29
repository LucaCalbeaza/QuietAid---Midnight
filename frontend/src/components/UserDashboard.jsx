import React, { useState, useEffect } from 'react';
import {
  Card,
  Grid,
  Typography,
  Button,
  CircularProgress,
  useTheme,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axiosInstance';

const UserDashboard = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('/users/me');
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const calculateProfileCompletion = () => {
    const requiredFields = [
      'firstName',
      'lastName',
      'email',
      'educationLevel',
      'currentInstitution',
      'GPA',
      'dateOfBirth',
      'location.country',
      'income',
      'casteCategory',
      'gender',
      'major',
    ];

    const filled = requiredFields.filter((field) => {
      const [main, sub] = field.split('.');
      return sub ? !!userData[main]?.[sub] : !!userData[main];
    });

    return (filled.length / requiredFields.length) * 100;
  };

  const handleEditProfile = () => {
    navigate('/edit-profile');
  };

  if (loading) {
    return (
      <div style={{ padding: 24, textAlign: 'center', marginTop: 50 }}>
        <CircularProgress />
      </div>
    );
  }

  const {
    firstName,
    email,
    educationLevel,
    GPA,
    major,
    dateOfBirth,
    gender,
    location,
    income,
    casteCategory,
  } = userData;

  return (
    <div style={{ padding: 24 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Card sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>
              Welcome, {firstName || 'User'}!
            </Typography>

            <div style={{ marginTop: 16, marginBottom: 16 }}>
              <div
                style={{
                  height: 10,
                  backgroundColor: '#e0e0e0',
                  borderRadius: 5,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${calculateProfileCompletion()}%`,
                    backgroundColor: theme.palette.primary.main,
                    transition: 'width 0.3s ease-in-out',
                  }}
                />
              </div>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Profile Completion: {calculateProfileCompletion().toFixed(0)}%
              </Typography>
            </div>

            <Typography variant="body1" gutterBottom>Email: {email}</Typography>
            <Typography variant="body1" gutterBottom>
              Education: {educationLevel}
            </Typography>
            {GPA && (
              <Typography variant="body1" gutterBottom>
                GPA: {GPA}
              </Typography>
            )}
            {major && (
              <Typography variant="body1" gutterBottom>
                Major: {major}
              </Typography>
            )}
            {dateOfBirth && (
              <Typography variant="body1" gutterBottom>
                DOB: {dateOfBirth}
              </Typography>
            )}
            {gender && (
              <Typography variant="body1" gutterBottom>
                Gender: {gender}
              </Typography>
            )}
            {location?.country && (
              <Typography variant="body1" gutterBottom>
                Location: {location.city}, {location.state}, {location.country}
              </Typography>
            )}
            {income && (
              <Typography variant="body1" gutterBottom>
                Income: ₹{income}
              </Typography>
            )}
            {casteCategory && (
              <Typography variant="body1" gutterBottom>
                Caste Category: {casteCategory}
              </Typography>
            )}

            <Button
              variant="contained"
              color="primary"
              onClick={handleEditProfile}
              fullWidth
              sx={{ mt: 2 }}
            >
              Edit Profile
            </Button>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default UserDashboard;
