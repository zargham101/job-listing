import React, { useState, useEffect } from 'react';
import { fetchJobs, createJob, updateJob, deleteJob } from '../../services/api';
import JobCard from '../../components/JobCard/JobCard';
import JobForm from '../../components/JobForm/JobForm';
import FilterControls from '../../components/FilterControls/FilterControls';
import HomePageStyles from './HomePage.module.css';

const HomePage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [filters, setFilters] = useState({
    job_type: '',
    location: '',
    tag: '',
    sort: '',
    search: '',
  });

  useEffect(() => {
    const loadJobs = async () => {
      try {
        setLoading(true);
        const data = await fetchJobs(filters);
        setJobs(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadJobs();
  }, [filters]);

  const handleCreateJob = async (jobData) => {
    try {
      const newJob = await createJob(jobData);
      setJobs([newJob, ...jobs]);
      setShowForm(false);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateJob = async (id, jobData) => {
    try {
      await updateJob(id, jobData);
      setJobs(jobs.map(job => job.id === id ? { ...job, ...jobData } : job));
      setEditingJob(null);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteJob = async (id) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await deleteJob(id);
        setJobs(jobs.filter(job => job.id !== id));
        setError(null);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const filteredJobs = jobs.filter(job => {
    if (!filters.search) return true;
    const searchLower = filters.search.toLowerCase();
    return (
      job.title.toLowerCase().includes(searchLower) ||
      job.company.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className={HomePageStyles.homePage}>
      <div className={HomePageStyles.controls}>
        <button 
          onClick={() => {
            setShowForm(!showForm);
            setEditingJob(null);
          }}
          className={HomePageStyles.addButton}
        >
          {showForm ? 'Cancel' : 'Add Job'}
        </button>
        
        <FilterControls 
          filters={filters}
          setFilters={setFilters}
        />
      </div>

      {error && <div className={HomePageStyles.error}>{error}</div>}

      {(showForm || editingJob) && (
        <JobForm 
          onSubmit={editingJob ? handleUpdateJob : handleCreateJob}
          job={editingJob}
          onCancel={() => {
            setShowForm(false);
            setEditingJob(null);
          }}
        />
      )}

      {loading ? (
        <div className={HomePageStyles.loading}>Loading jobs...</div>
      ) : filteredJobs.length === 0 ? (
        <div className={HomePageStyles.noJobs}>No jobs found matching your criteria</div>
      ) : (
        <div className={HomePageStyles.jobList}>
          {filteredJobs.map(job => (
            <JobCard 
              key={job.id}
              job={job}
              onEdit={() => setEditingJob(job)}
              onDelete={() => handleDeleteJob(job.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;