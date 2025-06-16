const API_BASE_URL = 'http://localhost:5000'; // Update with your Flask backend URL

export const fetchJobs = async (filters = {}) => {
  const queryParams = new URLSearchParams();
  
  if (filters.job_type) queryParams.append('job_type', filters.job_type);
  if (filters.location) queryParams.append('location', filters.location);
  if (filters.tag) queryParams.append('tag', filters.tag);
  if (filters.sort) queryParams.append('sort', filters.sort);
  
  const response = await fetch(`${API_BASE_URL}/jobs?${queryParams.toString()}`);
  if (!response.ok) throw new Error('Failed to fetch jobs');
  return await response.json();
};

export const createJob = async (jobData) => {
  const response = await fetch(`${API_BASE_URL}/jobs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(jobData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to create job');
  }
  return await response.json();
};

export const updateJob = async (id, jobData) => {
  const response = await fetch(`${API_BASE_URL}/jobs/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(jobData),
  });
  if (!response.ok) throw new Error('Failed to update job');
  return await response.json();
};

export const deleteJob = async (id) => {
  const response = await fetch(`${API_BASE_URL}/jobs/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete job');
  return await response.json();
};