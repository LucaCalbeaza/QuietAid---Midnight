import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
  Alert,
  Stack,
} from '@mui/material';
import { usePrivateEligibility } from '../context/PrivateEligibilityContext';
import {
  EnrollmentStatus,
  DemoStateCode,
  gpaToX100,
  x100ToGpa,
} from '../eligibility/codes';

const PrivateProfilePage = () => {
  const navigate = useNavigate();
  const { profile, replaceProfile, clearProfile, isConfigured } =
    usePrivateEligibility();

  const [form, setForm] = useState({
    enrollmentStatusCode: profile.enrollmentStatusCode,
    householdIncome:
      profile.householdIncome != null ? String(profile.householdIncome) : '',
    gpa: profile.gpaX100 != null ? String(x100ToGpa(profile.gpaX100)) : '',
    stateCode: profile.stateCode,
    firstGeneration: profile.firstGeneration,
    disabilityEligible: profile.disabilityEligible,
    housingInsecurity: profile.housingInsecurity,
  });

  const handleChange = (field) => (event) => {
    const value =
      event.target.type === 'checkbox'
        ? event.target.checked
        : event.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    const gpaNum = form.gpa === '' ? null : Number(form.gpa);
    const incomeNum =
      form.householdIncome === '' ? null : Number(form.householdIncome);

    replaceProfile({
      enrollmentStatusCode: Number(form.enrollmentStatusCode),
      householdIncome: incomeNum,
      incomeBand: null,
      gpaX100: gpaNum == null || Number.isNaN(gpaNum) ? null : gpaToX100(gpaNum),
      stateCode: Number(form.stateCode),
      firstGeneration: !!form.firstGeneration,
      disabilityEligible: !!form.disabilityEligible,
      housingInsecurity: !!form.housingInsecurity,
    });
  };

  const handleFindMatches = () => {
    handleSave();
    navigate('/private-matches');
  };

  return (
    <Container maxWidth="sm" sx={{ my: 4 }}>
      <Typography variant="h4" gutterBottom>
        QuietAid
      </Typography>
      <Typography variant="h5" gutterBottom>
        Private Eligibility Profile
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        Your eligibility details stay private in this browser session. They are
        not saved to the scholarship provider or QuietAid servers. They are used
        for local matching and Midnight proof generation. Providers receive
        verification results rather than raw values. Refreshing the page clears
        this profile (hackathon MVP — in-memory only).
      </Alert>

      {isConfigured && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Private profile is loaded in memory for this session.
        </Alert>
      )}

      <Stack spacing={2}>
        <FormControl fullWidth>
          <InputLabel id="enrollment-label">Enrollment</InputLabel>
          <Select
            labelId="enrollment-label"
            label="Enrollment"
            value={form.enrollmentStatusCode}
            onChange={handleChange('enrollmentStatusCode')}
          >
            <MenuItem value={EnrollmentStatus.ANY}>Not specified</MenuItem>
            <MenuItem value={EnrollmentStatus.FULL_TIME}>Full-Time</MenuItem>
            <MenuItem value={EnrollmentStatus.PART_TIME}>Part-Time</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Household income (USD)"
          type="number"
          fullWidth
          value={form.householdIncome}
          onChange={handleChange('householdIncome')}
          helperText="Used privately for matching and Midnight income checks"
        />

        <TextField
          label="GPA (0–4)"
          type="number"
          inputProps={{ min: 0, max: 4, step: 0.01 }}
          fullWidth
          value={form.gpa}
          onChange={handleChange('gpa')}
        />

        <FormControl fullWidth>
          <InputLabel id="state-label">U.S. state (demo)</InputLabel>
          <Select
            labelId="state-label"
            label="U.S. state (demo)"
            value={form.stateCode}
            onChange={handleChange('stateCode')}
          >
            <MenuItem value={DemoStateCode.ANY}>Not specified</MenuItem>
            <MenuItem value={DemoStateCode.CALIFORNIA}>California</MenuItem>
            <MenuItem value={DemoStateCode.TEXAS}>Texas</MenuItem>
          </Select>
        </FormControl>

        <FormControlLabel
          control={
            <Switch
              checked={form.firstGeneration}
              onChange={handleChange('firstGeneration')}
            />
          }
          label="First-generation student"
        />
        <FormControlLabel
          control={
            <Switch
              checked={form.disabilityEligible}
              onChange={handleChange('disabilityEligible')}
            />
          }
          label="Accessibility / disability eligibility"
        />
        <FormControlLabel
          control={
            <Switch
              checked={form.housingInsecurity}
              onChange={handleChange('housingInsecurity')}
            />
          }
          label="Housing insecurity"
        />

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button variant="contained" onClick={handleFindMatches}>
            Find Private Matches
          </Button>
          <Button variant="outlined" onClick={handleSave}>
            Keep in memory
          </Button>
          <Button color="warning" onClick={clearProfile}>
            Clear private profile
          </Button>
        </Box>
      </Stack>
    </Container>
  );
};

export default PrivateProfilePage;
