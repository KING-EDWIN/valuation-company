"use client";
import { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, Alert, Paper } from "@mui/material";
import { useUser } from "../../components/UserContext";
import { useRouter } from "next/navigation";

export default function InspectionReportingPage() {
  const { user } = useUser();
  const router = useRouter();
  useEffect(() => {
    if (!user || user.role !== "field_team") router.replace("/login");
  }, [user, router]);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ asset: "", findings: "", photos: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (!user || user.role !== "field_team") return null;

  return (
    <Box maxWidth={500} mx="auto">
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Inspection Reporting</Typography>
        {submitted && <Alert severity="success">Inspection report submitted!</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField label="Asset" name="asset" value={form.asset} onChange={handleChange} fullWidth sx={{ mb: 2 }} required />
          <TextField label="Findings" name="findings" value={form.findings} onChange={handleChange} fullWidth sx={{ mb: 2 }} required />
          <TextField label="Photos (describe)" name="photos" value={form.photos} onChange={handleChange} fullWidth sx={{ mb: 2 }} required />
          <Button type="submit" variant="contained" fullWidth>Submit</Button>
        </form>
      </Paper>
    </Box>
  );
} 