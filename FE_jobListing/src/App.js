import React, { useEffect, useState } from 'react';
import JobManager from './components/JobList';
import AddJobForm from './components/JobForm';
import FilterSortBar from './components/FilterBar';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

function App() {
  const [jobs, setJobs] = useState([]);
  const [editJob, setEditJob] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchJobs = async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.keyword) params.append('title', filters.keyword);
      if (filters.job_type) params.append('job_type', filters.job_type);
      if (filters.location) params.append('location', filters.location);
      if (filters.tag) params.append('tag', filters.tag);
      if (filters.sort) params.append('sort', filters.sort);

      const response = await fetch(`http://localhost:5000/jobs?${params.toString()}`);
      const data = await response.json();
      setJobs(data);
    } catch (err) {
      console.error('Failed to fetch jobs', err);
    }
  };

  const handleAddJob = async (jobData) => {
    try {
      const response = await fetch('http://localhost:5000/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobData),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(`Error: ${error.error}`);
        return;
      }

      await fetchJobs();
      setShowForm(false);
    } catch (err) {
      alert('Failed to add job');
    }
  };

  const handleUpdateJob = async (id, jobData) => {
    try {
      const response = await fetch(`http://localhost:5000/jobs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobData),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(`Error: ${error.error}`);
        return;
      }

      setEditJob(null);
      setShowForm(false);
      await fetchJobs();
    } catch (err) {
      alert('Failed to update job');
    }
  };

  const handleDeleteJob = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this job?');
    if (!confirmDelete) return;

    try {
      await fetch(`http://localhost:5000/jobs/${id}`, { method: 'DELETE' });
      await fetchJobs();
    } catch (err) {
      alert('Failed to delete job');
    }
  };

  const handleEditClick = (job) => {
    setEditJob(job);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setEditJob(null);
    setShowForm(false);
  };

  const handleAddNewJobClick = () => {
    setEditJob(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-center mb-6">Job Listings</h1>

      <div className="text-center mb-4">
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddNewJobClick}
        >
          Add New Job
        </Button>
      </div>

      {showForm && (
        <AddJobForm
          onAddJob={handleAddJob}
          onUpdateJob={handleUpdateJob}
          editJob={editJob}
          onCancel={handleCancel}
        />
      )}

      <FilterSortBar onFilter={fetchJobs} />

      <JobManager jobs={jobs} onDelete={handleDeleteJob} onEdit={handleEditClick} />
    </div>
  );
}

export default App;
