"use client";
import { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, Alert, Paper, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useUser } from "../../components/UserContext";
import { useRouter } from "next/navigation";

export default function MDApprovalPage() {
  const { user } = useUser();
  const router = useRouter();
  useEffect(() => {
    if (!user || user.role !== "md") router.replace("/login");
  }, [user, router]);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ reportId: "", approval: "yes" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name?: string; value: unknown } }) => {
    const { name, value } = 'target' in e ? e.target : { name: undefined, value: undefined };
    setForm(f => ({ ...f, [name!]: value }));
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (!user || user.role !== "md") return null;

  return (
    <Box maxWidth={500} mx="auto">
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>MD Approval</Typography>
        {submitted && <Alert severity="success">Report {form.approval === "yes" ? "approved" : "rejected"}!</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField label="Report ID" name="reportId" value={form.reportId} onChange={handleChange} fullWidth sx={{ mb: 2 }} required />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Approval</InputLabel>
            <Select name="approval" value={form.approval} label="Approval" onChange={handleChange}>
              <MenuItem value="yes">Yes</MenuItem>
              <MenuItem value="no">No</MenuItem>
            </Select>
          </FormControl>
          <Button type="submit" variant="contained" fullWidth>Submit</Button>
        </form>
      </Paper>
    </Box>
  );
} 