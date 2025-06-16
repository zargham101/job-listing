import React, { useState, useEffect } from 'react';
import JobFormStyles from './JobForm.module.css';

const JobForm = ({ onSubmit, job, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    job_type: 'Full-time',
    tags: '',
    posting_date: new Date().toISOString().split('T')[0],
    link: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title,
        company: job.company,
        location: job.location,
        job_type: job.job_type,
        tags: job.tags,
        posting_date: job.posting_date,
        link: job.link || ''
      });
    }
  }, [job]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.company.trim()) newErrors.company = 'Company is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(job?.id, formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={JobFormStyles.form}>
      <h2>{job ? 'Edit Job' : 'Add New Job'}</h2>
      
      <div className={JobFormStyles.formGroup}>
        <label htmlFor="title">Job Title*</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={errors.title ? JobFormStyles.errorInput : ''}
        />
        {errors.title && <span className={JobFormStyles.error}>{errors.title}</span>}
      </div>
      
      <div className={JobFormStyles.formGroup}>
        <label htmlFor="company">Company*</label>
        <input
          type="text"
          id="company"
          name="company"
          value={formData.company}
          onChange={handleChange}
          className={errors.company ? JobFormStyles.errorInput : ''}
        />
        {errors.company && <span className={JobFormStyles.error}>{errors.company}</span>}
      </div>
      
      <div className={JobFormStyles.formGroup}>
        <label htmlFor="location">Location*</label>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className={errors.location ? JobFormStyles.errorInput : ''}
        />
        {errors.location && <span className={JobFormStyles.error}>{errors.location}</span>}
      </div>
      
      <div className={JobFormStyles.formGroup}>
        <label htmlFor="job_type">Job Type</label>
        <select
          id="job_type"
          name="job_type"
          value={formData.job_type}
          onChange={handleChange}
        >
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Contract">Contract</option>
          <option value="Internship">Internship</option>
          <option value="Remote">Remote</option>
        </select>
      </div>
      
      <div className={JobFormStyles.formGroup}>
        <label htmlFor="tags">Tags (comma separated)</label>
        <input
          type="text"
          id="tags"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          placeholder="e.g., React, Python, Remote"
        />
      </div>
      
      <div className={JobFormStyles.formGroup}>
        <label htmlFor="posting_date">Posting Date</label>
        <input
          type="date"
          id="posting_date"
          name="posting_date"
          value={formData.posting_date}
          onChange={handleChange}
        />
      </div>
      
      <div className={JobFormStyles.formGroup}>
        <label htmlFor="link">Job Link (URL)</label>
        <input
          type="url"
          id="link"
          name="link"
          value={formData.link}
          onChange={handleChange}
          placeholder="https://"
        />
      </div>
      
      <div className={JobFormStyles.formActions}>
        <button type="submit" className={JobFormStyles.submitButton}>
          {job ? 'Update Job' : 'Add Job'}
        </button>
        <button 
          type="button" 
          onClick={onCancel}
          className={JobFormStyles.cancelButton}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default JobForm;