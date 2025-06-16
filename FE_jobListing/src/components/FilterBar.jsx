import React, { useState } from 'react';
import {
  TextField,
  Select,
  MenuItem,
  Button,
  Box,
  InputLabel,
  FormControl,
  Stack,
} from '@mui/material';

export default function FilterSortBar({ onFilter }) {
  const [filters, setFilters] = useState({
    keyword: '',
    job_type: '',
    location: '',
    tag: '',
    sort: ''
  });

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleApply = () => {
    onFilter(filters);
  };

  const handleReset = () => {
    const cleared = { keyword: '', job_type: '', location: '', tag: '', sort: '' };
    setFilters(cleared);
    onFilter(cleared);
  };

  return (
    <Box sx={{ padding: 2, border: '1px solid #ddd', borderRadius: 2, mb: 3 }}>
      <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} useFlexGap flexWrap="wrap">
        <TextField
          name="keyword"
          label="Search by title or company"
          value={filters.keyword}
          onChange={handleChange}
          fullWidth
        />

        <FormControl fullWidth>
          <InputLabel>Job Type</InputLabel>
          <Select
            name="job_type"
            value={filters.job_type}
            onChange={handleChange}
            label="Job Type"
          >
            <MenuItem value="">All Job Types</MenuItem>
            <MenuItem value="Full-time">Full-time</MenuItem>
            <MenuItem value="Part-time">Part-time</MenuItem>
            <MenuItem value="Internship">Internship</MenuItem>
          </Select>
        </FormControl>

        <TextField
          name="location"
          label="Location (e.g., Remote, Karachi)"
          value={filters.location}
          onChange={handleChange}
          fullWidth
        />

        <TextField
          name="tag"
          label="Tag (e.g., React)"
          value={filters.tag}
          onChange={handleChange}
          fullWidth
        />

        <FormControl fullWidth>
          <InputLabel>Sort</InputLabel>
          <Select
            name="sort"
            value={filters.sort}
            onChange={handleChange}
            label="Sort"
          >
            <MenuItem value="">Sort by date</MenuItem>
            <MenuItem value="posting_date_desc">Newest First</MenuItem>
            <MenuItem value="posting_date_asc">Oldest First</MenuItem>
          </Select>
        </FormControl>

        <Stack direction="row" spacing={2}>
          <Button variant="contained" color="primary" onClick={handleApply}>
            Apply
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleReset}>
            Reset
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
