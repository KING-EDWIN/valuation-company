"use client";
import { Box, Typography, Button, Stack, Paper } from "@mui/material";
import { useUser } from "../components/UserContext";
import { useRouter } from "next/navigation";

const roles = [
  { key: "admin", label: "Admin" },
  { key: "field_team", label: "Field Team" },
  { key: "qa_officer", label: "QA Officer" },
  { key: "md", label: "Managing Director" },
  { key: "accounts", label: "Accounts" },
];

export default function Home() {
  const { login } = useUser();
  const router = useRouter();

  const handleLogin = (role: string) => {
    login(role as any);
    router.push("/dashboard");
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh" sx={{ background: 'linear-gradient(135deg, #f6f7fb 0%, #e3f0ff 100%)' }}>
      <Paper sx={{ p: 5, borderRadius: 4, mb: 4, minWidth: 340, textAlign: 'center' }}>
        <Typography variant="h3" fontWeight={700} gutterBottom>
          Welcome to Stanfield System
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" mb={3}>
          Please select your role to log in
        </Typography>
        <Stack spacing={3} mt={4}>
          {roles.map(role => (
            <Button
              key={role.key}
              variant="contained"
              size="large"
              sx={{ fontSize: 20, py: 2, borderRadius: 2, fontWeight: 600, background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)' }}
              onClick={() => handleLogin(role.key)}
              fullWidth
            >
              {role.label}
            </Button>
          ))}
        </Stack>
      </Paper>
    </Box>
  );
}
