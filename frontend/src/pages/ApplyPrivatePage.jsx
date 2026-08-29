import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Stack,
  Typography,
} from '@mui/material';
import axiosInstance from '../utils/axiosInstance';
import { usePrivateEligibility } from '../context/PrivateEligibilityContext';
import {
  checkProverHealth,
  proveEvergreenEligibility,
} from '../services/midnightService';
import { EVERGREEN_TITLE } from '../services/evergreenRules';
import { EnrollmentStatus } from '../eligibility/codes';
import WalletStatus from '../components/WalletStatus';


const STAGES = {
  idle: 'Ready',
  preparing: 'Preparing private inputs…',
  connecting: 'Connecting to Midnight prover…',
  generating: 'Generating / submitting eligibility proof…',
  verifying: 'Verifying…',
  success: 'Success',
  failure: 'Failed',
};

const ApplyPrivatePage = ({ isLoggedIn }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profile, isConfigured } = usePrivateEligibility();
  const [scholarship, setScholarship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stage, setStage] = useState('idle');
  const [error, setError] = useState(null);
  const [appRecord, setAppRecord] = useState(null);
  const [proverUp, setProverUp] = useState(null);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login', { replace: true });
      return;
    }
    if (!isConfigured) {
      navigate('/private-profile', { replace: true });
      return;
    }

    const load = async () => {
      try {
        const res = await axiosInstance.get('/scholarships');
        const found = (res.data || []).find((s) => s._id === id);
        setScholarship(found || null);
        if (!found) setError('Scholarship not found.');
        setProverUp(await checkProverHealth());
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load scholarship.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, isLoggedIn, isConfigured, navigate]);

  const handleApply = async () => {
    setError(null);
    setAppRecord(null);
    setStage('preparing');

    if (scholarship?.title !== EVERGREEN_TITLE) {
      setStage('failure');
      setError('Midnight V1 currently supports Evergreen Full-Time Scholars Fund only.');
      return;
    }

    setStage('generating');
    const proof = await proveEvergreenEligibility(profile);
    if (!proof.ok) {
      setStage('failure');
      setError(proof.error || 'Could not generate eligibility proof.');
      return;
    }

    setStage('verifying');

    // Create pseudonymous application only after real Midnight success
    try {
      const createRes = await axiosInstance.post('/private-applications', {
        scholarshipId: scholarship._id,
        midnight: proof.midnight,
        eligibilityVerified: true,
      });
      setAppRecord(createRes.data);
      setStage('success');
    } catch (err) {
      setStage('failure');
      setError(
        err.response?.data?.error ||
          'Proof succeeded but application could not be recorded. Your private application was not submitted.',
      );
    }
  };

  if (loading) {
    return (
      <Container sx={{ textAlign: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ my: 4 }}>
      <Typography variant="h4" gutterBottom>
        Apply Privately
      </Typography>
      <Typography gutterBottom>{scholarship?.title}</Typography>

      <Alert severity="info" sx={{ mb: 2 }}>
        QuietAid will prove: enrollment requirement and financial eligibility
        against public scholarship rules. The provider will <strong>not</strong>{' '}
        receive household income, exact enrollment details, name, or email from
        this step.
      </Alert>

      {proverUp === false && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Local Compact prover is not reachable. Start it with{' '}
          <code>cd midnight-eligibility && npm run prove-server</code>
        </Alert>
      )}

      <WalletStatus />

      <Typography variant="body2" sx={{ mb: 2 }}>
        Session private profile ready:{' '}
        {profile.enrollmentStatusCode === EnrollmentStatus.FULL_TIME
          ? 'full-time enrollment set'
          : 'enrollment set'}
        ; income present:{' '}
        {profile.householdIncome != null ? 'yes' : 'no'} (values not shown
        here).
      </Typography>

      <Stack spacing={2}>
        <Typography>
          Status: <strong>{STAGES[stage] || stage}</strong>
        </Typography>

        {error && (
          <Alert severity="error">
            {error}
            <Box mt={1}>Your private application was not submitted as verified.</Box>
          </Alert>
        )}

        {stage === 'success' && appRecord && (
          <Alert severity="success">
            Private application submitted
            <Box mt={1}>
              Application: {appRecord.publicApplicationId}
              <br />
              Applicant: {appRecord.pseudonym}
              <br />
              Eligibility: Verified
              <br />
              Midnight: Proof/transaction valid
              <br />
              Identity: Not disclosed
            </Box>
            <Button
              sx={{ mt: 1 }}
              component={RouterLink}
              to={`/applications/${appRecord.publicApplicationId}`}
            >
              View Application
            </Button>
          </Alert>
        )}

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            onClick={handleApply}
            disabled={
              stage === 'generating' ||
              stage === 'verifying' ||
              stage === 'preparing'
            }
          >
            Generate Midnight proof & apply
          </Button>
          <Button component={RouterLink} to={`/scholarships/${id}`}>
            Cancel
          </Button>
        </Box>
      </Stack>
    </Container>
  );
};

export default ApplyPrivatePage;
