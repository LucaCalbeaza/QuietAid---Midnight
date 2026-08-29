// frontend/src/pages/ScholarshipsPage.jsx
import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import ScholarshipList from '../components/ScholarshipList';

const ScholarshipsPage = () => {
  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Available Scholarships
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Browse through the latest scholarships we’ve scraped and analyzed.
        </Typography>
      </Box>

      <ScholarshipList />
    </Container>
  );
};

export default ScholarshipsPage;
