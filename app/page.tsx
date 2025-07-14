"use client";
import { Box, Typography, Button, Stack, Paper } from "@mui/material";
import Link from "next/link";

export default function Home() {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={6} sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f6f7fb 0%, #e3f0ff 100%)' }}>
      <Paper sx={{ p: 4, maxWidth: 700, mb: 4, borderRadius: 4 }}>
        <Typography variant="h4" gutterBottom>
          Stanfield&apos;s General Organization Structure
        </Typography>
        <Typography paragraph>
          The company is manned by four well experienced, conscientious and highly proficient property professionals, who are well acquainted with Uganda&apos;s property market. We have 14 full time employees and 8 part time employees. These work in tandem with other retained consultants and administrative staff with the number fluctuating depending on the project at hand and project requirements.
        </Typography>
        <Typography paragraph>
          Our staff recruitment, selection and training policy contained in our Stanfield Property Partners Human Resource Manual well documents the procedures emphasized in choosing and developing our staff. Our network extends into our sister valuation firms, and land offices which we continuously consult.
        </Typography>
      </Paper>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <Button variant="contained" color="primary" component={Link} href="/org-chart">Org Chart</Button>
        <Button variant="contained" color="secondary" component={Link} href="/process-flow">Process Flow</Button>
        <Button variant="outlined" color="primary" component={Link} href="/login">Login</Button>
        <Button variant="outlined" color="secondary" component={Link} href="/dashboard">Dashboard</Button>
      </Stack>
    </Box>
  );
}
