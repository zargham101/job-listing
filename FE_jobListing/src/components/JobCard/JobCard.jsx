import React from 'react';
import JobCardStyles from './JobCard.module.css';

const JobCard = ({ job, onEdit, onDelete }) => {
  return (
    <div className={JobCardStyles.card}>
      <div className={JobCardStyles.cardHeader}>
        <h3>{job.title}</h3>
        <div className={JobCardStyles.company}>{job.company}</div>
      </div>
      
      <div className={JobCardStyles.details}>
        <div className={JobCardStyles.detailItem}>
          <span className={JobCardStyles.detailLabel}>Location:</span>
          <span>{job.location}</span>
        </div>
        <div className={JobCardStyles.detailItem}>
          <span className={JobCardStyles.detailLabel}>Type:</span>
          <span>{job.job_type}</span>
        </div>
        <div className={JobCardStyles.detailItem}>
          <span className={JobCardStyles.detailLabel}>Posted:</span>
          <span>{job.posting_date}</span>
        </div>
      </div>
      
      {job.tags && (
        <div className={JobCardStyles.tags}>
          {job.tags.split(',').map((tag, index) => (
            <span key={index} className={JobCardStyles.tag}>
              {tag.trim()}
            </span>
          ))}
        </div>
      )}
      
      <div className={JobCardStyles.actions}>
        <button 
          onClick={() => onEdit(job)}
          className={JobCardStyles.editButton}
        >
          Edit
        </button>
        <button 
          onClick={() => onDelete(job.id)}
          className={JobCardStyles.deleteButton}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default JobCard;