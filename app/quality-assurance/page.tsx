"use client";
import { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, Alert, Paper } from "@mui/material";
import { useUser } from "../../components/UserContext";
import { useRouter } from "next/navigation";

export default function QualityAssurancePage() {
  const { user } = useUser();
  const router = useRouter();
  useEffect(() => {
    if (!user || user.role !== "qa_officer") router.replace("/login");
  }, [user, router]);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ reportId: "", notes: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (!user || user.role !== "qa_officer") return null;

  return (
    <Box maxWidth={500} mx="auto">
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Quality Assurance</Typography>
        {submitted && <Alert severity="success">QA complete and sent to MD!</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField label="Report ID" name="reportId" value={form.reportId} onChange={handleChange} fullWidth sx={{ mb: 2 }} required />
          <TextField label="Validation Notes" name="notes" value={form.notes} onChange={handleChange} fullWidth sx={{ mb: 2 }} required />
          <Button type="submit" variant="contained" fullWidth>Submit</Button>
        </form>
      </Paper>
    </Box>
  );
} 