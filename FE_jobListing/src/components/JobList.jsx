import React, { useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Modal,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Stack,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

import JobList from './JobList'; // MUI-styled JobList
import JobForm from './JobForm'; // MUI-styled JobForm

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

const JobManager = ({ jobs, onAddJob, onUpdateJob, onDelete }) => {
  const [showForm, setShowForm] = useState(false);
  const [editJob, setEditJob] = useState(null);
  const [viewJob, setViewJob] = useState(null);

  const handleAddClick = () => {
    setEditJob(null); // Clear edit mode
    setShowForm(true);
  };

  const handleEdit = (job) => {
    setEditJob(job);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setEditJob(null);
    setShowForm(false);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">Job Listings</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddClick}>
          Add New Job
        </Button>
      </Stack>

      {showForm && (
        <JobForm
          editJob={editJob}
          onAddJob={(job) => {
            onAddJob(job);
            handleCloseForm();
          }}
          onUpdateJob={(id, job) => {
            onUpdateJob(id, job);
            handleCloseForm();
          }}
        />
      )}

      <JobList
        jobs={jobs}
        onEdit={handleEdit}
        onDelete={onDelete}
        onView={(job) => setViewJob(job)}
      />

      <Modal open={!!viewJob} onClose={() => setViewJob(null)}>
        <Box sx={modalStyle}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <DialogTitle>{viewJob?.title}</DialogTitle>
            <IconButton onClick={() => setViewJob(null)}>
              <CloseIcon />
            </IconButton>
          </Stack>
          <DialogContent>
            <Typography variant="subtitle1" gutterBottom>
              {viewJob?.company} – {viewJob?.location}
            </Typography>
            <Typography variant="body2" gutterBottom>
              <strong>Job Type:</strong> {viewJob?.job_type}
            </Typography>
            <Typography variant="body2" gutterBottom>
              <strong>Posted:</strong> {viewJob?.posting_date}
            </Typography>
            <Typography variant="body2" gutterBottom>
              <strong>Tags:</strong> {viewJob?.tags}
            </Typography>
            <Typography variant="body2">
              <strong>Link:</strong>{' '}
              <a href={viewJob?.link} target="_blank" rel="noopener noreferrer">
                View Listing
              </a>
            </Typography>
          </DialogContent>
        </Box>
      </Modal>
    </Container>
  );
};

export default JobManager;
