"use client";
import { useState } from "react";
import { Box, Typography, TextField, Button, Paper, MenuItem, Alert, Stack, Grid, Card, CardContent } from "@mui/material";
import { useJobs, AssetType } from "../../components/JobsContext";
import PersonIcon from '@mui/icons-material/Person';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const landFields = [
  { name: "location", label: "Location" },
  { name: "landTitle", label: "Land Title" },
  { name: "plotNo", label: "Plot Number" },
  { name: "size", label: "Size (acres)" },
];
const carFields = [
  { name: "make", label: "Make" },
  { name: "model", label: "Model" },
  { name: "regNo", label: "Registration Number" },
  { name: "year", label: "Year" },
];

const demoJobs = [
  {
    clientName: "Equity Bank",
    assetType: "land" as AssetType,
    assetDetails: { location: "Kampala", landTitle: "LT1234", plotNo: "45A", size: "2", make: "", model: "", regNo: "", year: "" },
  },
  {
    clientName: "Stanbic Bank",
    assetType: "car" as AssetType,
    assetDetails: { location: "", landTitle: "", plotNo: "", size: "", make: "Toyota", model: "Corolla", regNo: "UAA123X", year: "2018" },
  },
  {
    clientName: "Private Client",
    assetType: "land" as AssetType,
    assetDetails: { location: "Entebbe", landTitle: "LT5678", plotNo: "12B", size: "1.5", make: "", model: "", regNo: "", year: "" },
  },
];

export default function ClientAcquisitionPage() {
  const { addJob, jobs } = useJobs();
  const [assetType, setAssetType] = useState<AssetType>("land");
  const [clientName, setClientName] = useState("");
  const [assetDetails, setAssetDetails] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleAssetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAssetDetails({ ...assetDetails, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addJob({ clientName, assetType, assetDetails });
    setSubmitted(true);
    setClientName("");
    setAssetDetails({});
  };

  const handleLoadDemo = () => {
    demoJobs.forEach(job => addJob(job));
  };

  // Add more comprehensive demo data
  const handleLoadFullDemo = () => {
    const fullDemoJobs = [
      {
        clientName: "KCB Bank",
        assetType: "land" as AssetType,
        assetDetails: { location: "Mbarara", landTitle: "LT8888", plotNo: "78D", size: "4.5", make: "", model: "", regNo: "", year: "" },
      },
      {
        clientName: "DFCU Bank",
        assetType: "car" as AssetType,
        assetDetails: { location: "", landTitle: "", plotNo: "", size: "", make: "Nissan", model: "X-Trail", regNo: "UCC789Z", year: "2019" },
      },
      {
        clientName: "Private Client - Ms. Nakato",
        assetType: "land" as AssetType,
        assetDetails: { location: "Masaka", landTitle: "LT2222", plotNo: "33E", size: "1.8", make: "", model: "", regNo: "", year: "" },
      }
    ];
    fullDemoJobs.forEach(job => addJob(job));
  };

  const fields = assetType === "land" ? landFields : carFields;
  const pending = jobs.filter(j => j.status !== "complete").length;
  const completed = jobs.filter(j => j.status === "complete").length;

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={6}>
      <Typography variant="h4" gutterBottom>Client Acquisition</Typography>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={3} mb={4} justifyContent="center">
        <Card sx={{ minWidth: 180, bgcolor: '#e3f2fd' }}>
          <CardContent>
            <AssignmentIcon color="primary" />
            <Typography variant="h6">Total Jobs</Typography>
            <Typography variant="h5">{jobs.length}</Typography>
          </CardContent>
        </Card>
        <Card sx={{ minWidth: 180, bgcolor: '#fffde7' }}>
          <CardContent>
            <PersonIcon color="secondary" />
            <Typography variant="h6">Pending</Typography>
            <Typography variant="h5">{pending}</Typography>
          </CardContent>
        </Card>
        <Card sx={{ minWidth: 180, bgcolor: '#e8f5e9' }}>
          <CardContent>
            <CheckCircleIcon color="success" />
            <Typography variant="h6">Completed</Typography>
            <Typography variant="h5">{completed}</Typography>
          </CardContent>
        </Card>
      </Stack>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 3 }}>
        <Button variant="outlined" color="secondary" onClick={handleLoadDemo}>Load Demo Data</Button>
        <Button variant="outlined" color="primary" onClick={handleLoadFullDemo}>Load Full Demo</Button>
      </Stack>
      <Paper sx={{ p: 4, maxWidth: 500, width: "100%" }}>
        <Typography variant="h5" gutterBottom>Add New Client Job</Typography>
        {submitted && <Alert severity="success" sx={{ mb: 2 }}>Client job added successfully!</Alert>}
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField label="Client Name" value={clientName} onChange={e => setClientName(e.target.value)} required fullWidth />
            <TextField
              select
              label="Asset Type"
              value={assetType}
              onChange={e => setAssetType(e.target.value as AssetType)}
              required
              fullWidth
            >
              <MenuItem value="land">Land</MenuItem>
              <MenuItem value="car">Car</MenuItem>
            </TextField>
            {fields.map(f => (
              <TextField
                key={f.name}
                label={f.label}
                name={f.name}
                value={assetDetails[f.name] || ""}
                onChange={handleAssetChange}
                required
                fullWidth
              />
            ))}
            <Button type="submit" variant="contained" color="primary" fullWidth>Add Client Job</Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
} 