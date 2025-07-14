"use client";
import { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, Alert, Paper, MenuItem } from "@mui/material";
import { useUser } from "../../components/UserContext";
import { useRouter } from "next/navigation";

const teams = ["field_team_1", "field_team_2"];

export default function ScheduleInspectionPage() {
  const { user } = useUser();
  const router = useRouter();
  useEffect(() => {
    if (!user || user.role !== "admin") router.replace("/login");
  }, [user, router]);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ asset: "", team: teams[0] });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (!user || user.role !== "admin") return null;

  return (
    <Box maxWidth={500} mx="auto">
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Assign Inspection</Typography>
        {submitted && <Alert severity="success">Inspection assigned!</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField label="Asset" name="asset" value={form.asset} onChange={handleChange} fullWidth sx={{ mb: 2 }} required />
          <TextField select label="Assign to Team" name="team" value={form.team} onChange={handleChange} fullWidth sx={{ mb: 2 }}>
            {teams.map(t => <MenuItem key={t} value={t}>{t.replace('_', ' ').toUpperCase()}</MenuItem>)}
          </TextField>
          <Button type="submit" variant="contained" fullWidth>Assign</Button>
        </form>
      </Paper>
    </Box>
  );
} 