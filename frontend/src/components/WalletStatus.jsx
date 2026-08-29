import React, { useState } from 'react';
import { Alert, Box, Button, Typography } from '@mui/material';

/**
 * Wallet connection UI states for Phase 8.
 * Local Compact prover path does not require a browser wallet.
 * This component documents supported states for future 1AM / DApp Connector integration.
 */
const WalletStatus = () => {
  const [status, setStatus] = useState('disconnected');

  const connect = async () => {
    setStatus('connecting');
    const midnight = typeof window !== 'undefined' ? window.midnight : null;
    if (!midnight) {
      setStatus('unsupported');
      return;
    }
    try {
      // Placeholder for react-wallet-connector / 1AM flow — do not invent APIs.
      setStatus('connected');
    } catch {
      setStatus('rejected');
    }
  };

  return (
    <Box sx={{ my: 2 }}>
      <Typography variant="subtitle2">Midnight wallet</Typography>
      {status === 'disconnected' && (
        <Button size="small" onClick={connect}>
          Connect wallet (optional)
        </Button>
      )}
      {status === 'connecting' && (
        <Alert severity="info">Connecting…</Alert>
      )}
      {status === 'connected' && (
        <Alert severity="success">Wallet connected</Alert>
      )}
      {status === 'unsupported' && (
        <Alert severity="warning">
          No Midnight browser wallet detected. V1 demo uses the local Compact
          prover (`npm run prove-server`) instead.
        </Alert>
      )}
      {status === 'rejected' && (
        <Alert severity="error">Wallet connection rejected</Alert>
      )}
    </Box>
  );
};

export default WalletStatus;
