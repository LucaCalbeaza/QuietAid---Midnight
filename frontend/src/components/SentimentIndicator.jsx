import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Tooltip } from '@mui/material';

const SentimentIndicator = ({ sentiment }) => {
  if (!sentiment) return null;

  const { vader, classification } = sentiment;

  
  const compound = vader?.compound ?? 0;

  if (!vader) {
    console.warn('Missing vader data in sentiment:', sentiment);
  }

  const emoji =
    classification === 'positive'
      ? '😊'
      : classification === 'negative'
      ? '😞'
      : '😐';

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        mt: 1,
      }}
    >
      <Tooltip title={`Compound: ${compound.toFixed(3)}`}>
        <Typography variant="h5" sx={{ mr: 1 }}>
          {emoji}
        </Typography>
      </Tooltip>
      <Typography variant="body2" color="textSecondary">
        {classification.charAt(0).toUpperCase() + classification.slice(1)}
      </Typography>
    </Box>
  );
};

SentimentIndicator.propTypes = {
  sentiment: PropTypes.shape({
    vader: PropTypes.shape({
      pos: PropTypes.number,
      neu: PropTypes.number,
      neg: PropTypes.number,
      compound: PropTypes.number,
    }),
    classification: PropTypes.oneOf(['positive', 'neutral', 'negative']),
    compoundScore: PropTypes.number,
  }),
};

SentimentIndicator.defaultProps = {
  sentiment: null,
};

export default SentimentIndicator;
