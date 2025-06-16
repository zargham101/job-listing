import React from 'react';
import FilterControlsStyles from './FilterControls.module.css';

const FilterControls = ({ filters, setFilters }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const handleSearchChange = (e) => {
    setFilters({
      ...filters,
      search: e.target.value
    });
  };

  const resetFilters = () => {
    setFilters({
      job_type: '',
      location: '',
      tag: '',
      sort: '',
      search: ''
    });
  };

  const hasFilters = filters.job_type || filters.location || filters.tag || filters.sort || filters.search;

  return (
    <div className={FilterControlsStyles.filterControls}>
      <div className={FilterControlsStyles.searchGroup}>
        <input
          type="text"
          placeholder="Search by title or company..."
          value={filters.search}
          onChange={handleSearchChange}
          className={FilterControlsStyles.searchInput}
        />
      </div>
      
      <div className={FilterControlsStyles.filterGroup}>
        <select
          name="job_type"
          value={filters.job_type}
          onChange={handleChange}
          className={FilterControlsStyles.filterSelect}
        >
          <option value="">All Job Types</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Contract">Contract</option>
          <option value="Internship">Internship</option>
          <option value="Remote">Remote</option>
        </select>
        
        <select
          name="location"
          value={filters.location}
          onChange={handleChange}
          className={FilterControlsStyles.filterSelect}
        >
          <option value="">All Locations</option>
          <option value="Remote">Remote</option>
          <option value="New York">New York</option>
          <option value="San Francisco">San Francisco</option>
          <option value="London">London</option>
          <option value="Berlin">Berlin</option>
          <option value="Tokyo">Tokyo</option>
        </select>
        
        <select
          name="tag"
          value={filters.tag}
          onChange={handleChange}
          className={FilterControlsStyles.filterSelect}
        >
          <option value="">All Tags</option>
          <option value="React">React</option>
          <option value="Python">Python</option>
          <option value="JavaScript">JavaScript</option>
          <option value="Java">Java</option>
          <option value="Frontend">Frontend</option>
          <option value="Backend">Backend</option>
        </select>
        
        <select
          name="sort"
          value={filters.sort}
          onChange={handleChange}
          className={FilterControlsStyles.filterSelect}
        >
          <option value="">Sort By</option>
          <option value="posting_date_desc">Newest First</option>
          <option value="posting_date_asc">Oldest First</option>
        </select>
      </div>
      
      {hasFilters && (
        <button 
          onClick={resetFilters}
          className={FilterControlsStyles.resetButton}
        >
          Reset Filters
        </button>
      )}
    </div>
  );
};

export default FilterControls;