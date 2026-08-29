import React from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  LinearProgress,
} from '@mui/material';
import SentimentIndicator from './SentimentIndicator';

const ScholarshipCard = (props) => {
  const data = props.scholarship ?? {
    title:           props.title,
    description:     props.description,
    amount:          props.amount,
    deadline:        props.deadline,
    eligibility:     props.eligibility,
    link:            props.link,
    applyLink:       props.applyLink,
    sentiment:       props.sentiment,
    matchPercentage: props.matchPercentage,
  };

  const {
    title,
    description,
    amount,
    deadline,
    eligibility,
    link,
    applyLink,
    sentiment,
    matchPercentage,
  } = data;

  const showScore = props.showScore ?? false;

  return (
    <Card
      variant="outlined"
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        p: 2,
        flexGrow: 1,
        width: '100%',
        boxShadow: 3,
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'scale(1.03)',
          boxShadow: 6,
        },
        ...props.sx,
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>

        {showScore && typeof matchPercentage === 'number' && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="primary" gutterBottom>
              Match Score: {matchPercentage}%
            </Typography>
            <LinearProgress
              variant="determinate"
              value={matchPercentage}
              sx={{
                height: 8,
                borderRadius: 4,
              }}
            />
          </Box>
        )}

        {amount && (
          <Box sx={{ mb: 1 }}>
            <Chip label={`Amount: ${amount}`} size="small" />
          </Box>
        )}

        {deadline && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            <strong>Deadline:</strong> {deadline}
          </Typography>
        )}

        {eligibility && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            <strong>Eligibility:</strong> {eligibility}
          </Typography>
        )}

        {description && (
          <Typography variant="body2" sx={{ mb: 2 }}>
            {description.length > 120
              ? `${description.slice(0, 120)}…`
              : description}
          </Typography>
        )}

        {sentiment && <SentimentIndicator sentiment={sentiment} />}
      </CardContent>

      <CardActions>
        <Button
          size="small"
          color="primary"
          href={link}
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn More
        </Button>

        {applyLink && (
          <Button
            size="small"
            color="secondary"
            href={applyLink}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ ml: 1 }}
          >
            Apply Now
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

ScholarshipCard.propTypes = {
  scholarship: PropTypes.shape({
    title:           PropTypes.string.isRequired,
    description:     PropTypes.string,
    amount:          PropTypes.string,
    deadline:        PropTypes.string,
    eligibility:     PropTypes.string,
    link:            PropTypes.string.isRequired,
    applyLink:       PropTypes.string,
    sentiment:       PropTypes.shape({
      vader: PropTypes.shape({
        pos:      PropTypes.number,
        neu:      PropTypes.number,
        neg:      PropTypes.number,
        compound: PropTypes.number,
      }),
      classification: PropTypes.string,
      compoundScore:   PropTypes.number,
    }),
    matchPercentage: PropTypes.number,
  }),
  title:           PropTypes.string,
  description:     PropTypes.string,
  amount:          PropTypes.string,
  deadline:        PropTypes.string,
  eligibility:     PropTypes.string,
  link:            PropTypes.string,
  applyLink:       PropTypes.string,
  sentiment:       PropTypes.object,
  matchPercentage: PropTypes.number,
  showScore:       PropTypes.bool,
  sx:              PropTypes.object,
};

ScholarshipCard.defaultProps = {
  scholarship:     null,
  title:           '',
  description:     '',
  amount:          '',
  deadline:        '',
  eligibility:     '',
  link:            '',
  applyLink:       '',
  sentiment:       null,
  matchPercentage: null,
  showScore:       false,
  sx:              {},
};

export default ScholarshipCard;
