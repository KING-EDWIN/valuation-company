"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography, Button, MenuItem, Select, FormControl, InputLabel, Paper } from "@mui/material";
import { useUser } from "../../components/UserContext";

const roleLabels: Record<string, string> = {
  system_manager: "System Manager",
  field_team: "Field Team",
  qa_officer: "QA Officer",
  md: "Managing Director",
  accounts: "Accounts",
};

export default function LoginPage() {
  const { login, roles } = useUser();
  const [role, setRole] = useState(roles[0]);
  const router = useRouter();

  const handleLogin = () => {
    login(role);
    router.push("/dashboard");
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
      <Paper sx={{ p: 4, minWidth: 320 }}>
        <Typography variant="h5" gutterBottom>Login</Typography>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Role</InputLabel>
          <Select value={role} label="Role" onChange={e => setRole(e.target.value)}>
            {roles.map(r => (
              <MenuItem key={r} value={r}>{roleLabels[r]}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="contained" fullWidth onClick={handleLogin}>Login</Button>
      </Paper>
    </Box>
  );
} 