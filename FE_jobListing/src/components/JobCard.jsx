import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
  Button,
  Box,
} from '@mui/material';

export default function JobCard({ job, onEdit, onDelete }) {
  return (
    <Card
      elevation={3}
      sx={{
        transition: '0.3s',
        '&:hover': {
          transform: 'scale(1.02)',
          backgroundColor: '#f5f5f5',
        },
        padding: 2,
        borderRadius: 2,
        mb: 2,
      }}
    >
      <CardContent>
        <Typography variant="h6" component="h2" gutterBottom>
          {job.title}
        </Typography>

        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          {job.company} – {job.location} ({job.job_type})
        </Typography>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          Posted on {job.posting_date}
        </Typography>

        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', my: 1 }}>
          {job.tags?.split(',').map((tag, i) => (
            <Chip key={i} label={tag.trim()} size="small" color="primary" />
          ))}
        </Stack>

        <Box mt={2} display="flex" gap={2}>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => onEdit(job)}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => onDelete(job.id)}
          >
            Delete
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
