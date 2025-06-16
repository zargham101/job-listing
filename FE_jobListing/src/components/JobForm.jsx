import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Stack, Typography } from "@mui/material";


export default function JobForm({ onAddJob, onUpdateJob, editJob, onCancel }) {
  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    job_type: "Full-time",
    tags: "",
    posting_date: "",
    link: "",
  });

  useEffect(() => {
    if (editJob) {
      setForm({
        title: editJob.title || "",
        company: editJob.company || "",
        location: editJob.location || "",
        job_type: editJob.job_type || "Full-time",
        tags: editJob.tags || "",
        posting_date: editJob.posting_date || "",
        link: editJob.link || "",
      });
    }
  }, [editJob]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editJob) {
      await onUpdateJob(editJob.id, form);
    } else {
      await onAddJob(form);
    }
    setForm({
      title: "",
      company: "",
      location: "",
      job_type: "Full-time",
      tags: "",
      posting_date: "",
      link: "",
    });
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        maxWidth: 600,
        margin: "auto",
        p: 3,
        backgroundColor: "#fff",
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Typography variant="h6" mb={2}>
        {editJob ? "Edit Job" : "Add New Job"}
      </Typography>

      <Stack spacing={2}>
        <TextField
          label="Title"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <TextField
          label="Company"
          name="company"
          value={form.company}
          onChange={handleChange}
          required
        />
        <TextField
          label="Location"
          name="location"
          value={form.location}
          onChange={handleChange}
          required
        />
        <TextField
          label="Job Type"
          name="job_type"
          value={form.job_type}
          onChange={handleChange}
        />
        <TextField
          label="Tags (comma-separated)"
          name="tags"
          value={form.tags}
          onChange={handleChange}
        />
        <TextField
          label="Posting Date"
          name="posting_date"
          type="date"
          value={form.posting_date}
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          label="Job Link"
          name="link"
          value={form.link}
          onChange={handleChange}
        />
        <Button type="submit" variant="contained" color="primary">
          {editJob ? "Update Job" : "Add Job"}
        </Button>
      </Stack>
      {onCancel && (
        <Button
          variant="outlined"
          color="secondary"
          onClick={onCancel}
          style={{ marginLeft: "1rem" }}
        >
          Cancel
        </Button>
      )}
    </Box>
  );
}
