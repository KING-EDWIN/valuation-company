"use client";
import { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, Alert, Paper } from "@mui/material";
import { useUser } from "../../components/UserContext";
import { useRouter } from "next/navigation";

export default function AccountsPage() {
  const { user } = useUser();
  const router = useRouter();
  useEffect(() => {
    if (!user || user.role !== "accounts") router.replace("/login");
  }, [user, router]);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ client: "", amount: "", notes: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (!user || user.role !== "accounts") return null;

  return (
    <Box maxWidth={500} mx="auto">
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Accounts/Billing</Typography>
        {submitted && <Alert severity="success">Billing finalized!</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField label="Client" name="client" value={form.client} onChange={handleChange} fullWidth sx={{ mb: 2 }} required />
          <TextField label="Amount" name="amount" value={form.amount} onChange={handleChange} fullWidth sx={{ mb: 2 }} required />
          <TextField label="Notes" name="notes" value={form.notes} onChange={handleChange} fullWidth sx={{ mb: 2 }} required />
          <Button type="submit" variant="contained" fullWidth>Submit</Button>
        </form>
      </Paper>
    </Box>
  );
} 