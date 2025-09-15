"use client";
import React, { useState, useEffect, useCallback } from "react";
import { 
  Box, Typography, Button, Card, CardContent, Chip, 
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, FormControl, InputLabel, Select, MenuItem,
  Alert, Paper
} from "@mui/material";
import { useJobs, Job } from "../../components/JobsContext";
import { useUser } from "../../components/UserContext";
import { useNotifications } from "../../components/NotificationsContext";
import { useRouter } from "next/navigation";
import AssignmentIcon from '@mui/icons-material/Assignment';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DescriptionIcon from '@mui/icons-material/Description';
import HomeIcon from '@mui/icons-material/Home';
import BusinessIcon from '@mui/icons-material/Business';
import SchoolIcon from '@mui/icons-material/School';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import ParkIcon from '@mui/icons-material/Park';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import EditIcon from '@mui/icons-material/Edit';
import SendIcon from '@mui/icons-material/Send';
import ScheduleIcon from '@mui/icons-material/Schedule';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SecurityIcon from '@mui/icons-material/Security';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import HistoryIcon from '@mui/icons-material/History';
import HelpIcon from '@mui/icons-material/Help';
import Logo from '../../components/Logo';

const reportTemplates = [
  { id: "vacant-land", label: "Vacant Land Report", icon: ParkIcon, color: "#4caf50" },
  { id: "residential", label: "Residential Property Report", icon: HomeIcon, color: "#2196f3" },
  { id: "commercial", label: "Commercial Property Report", icon: BusinessIcon, color: "#ff9800" },
  { id: "institutional", label: "Institutional Property Report", icon: SchoolIcon, color: "#9c27b0" },
  { id: "vehicle", label: "Vehicle Report", icon: DirectionsCarIcon, color: "#f44336" },
];

const requiredDocuments = [
  { id: "orthophoto", label: "Orthophoto", required: true },
  { id: "topographic", label: "Topographic Map", required: true },
  { id: "area-schedule", label: "Area Schedule", required: true },
  { id: "title-search", label: "Title Search Form", required: true },
  { id: "occupancy-permit", label: "Occupancy Permit", required: true },
];

const optionalDocuments = [
  { id: "inspection-photos", label: "Inspection Photos", required: false },
  { id: "site-sketch", label: "Site Sketch", required: false },
  { id: "measurement-notes", label: "Measurement Notes", required: false },
];

// Emergency contacts data
const emergencyContacts = [
  { name: "Field Supervisor", phone: "+256 701 234 567", email: "supervisor@stanfieldpartners.com", role: "Immediate Supervisor" },
  { name: "Security Team", phone: "+256 702 345 678", email: "security@stanfieldpartners.com", role: "Security Support" },
  { name: "Technical Support", phone: "+256 703 456 789", email: "tech@stanfieldpartners.com", role: "App & Equipment Support" },
  { name: "Emergency Services", phone: "112", email: "", role: "Police/Fire/Ambulance" },
];

// Equipment checklist data
const equipmentChecklist = [
  { id: "measuring-tape", name: "Measuring Tape", status: "checked", category: "Measurement" },
  { id: "camera", name: "Digital Camera", status: "checked", category: "Documentation" },
  { id: "gps-device", name: "GPS Device", status: "checked", category: "Navigation" },
  { id: "safety-vest", name: "Safety Vest", status: "checked", category: "Safety" },
  { id: "hard-hat", name: "Hard Hat", status: "unchecked", category: "Safety" },
  { id: "clipboard", name: "Clipboard", status: "checked", category: "Documentation" },
  { id: "pen-paper", name: "Pen & Paper", status: "checked", category: "Documentation" },
  { id: "first-aid", name: "First Aid Kit", status: "unchecked", category: "Safety" },
  { id: "flashlight", name: "Flashlight", status: "checked", category: "Tools" },
  { id: "water", name: "Water Bottle", status: "checked", category: "Personal" },
];

// Weather data
const weatherData = {
  current: { temp: 28, condition: "Partly Cloudy", humidity: 65, wind: "12 km/h" },
  forecast: [
    { day: "Today", temp: "28°C", condition: "Partly Cloudy", chance: "20%" },
    { day: "Tomorrow", temp: "26°C", condition: "Light Rain", chance: "60%" },
    { day: "Wednesday", temp: "29°C", condition: "Sunny", chance: "10%" },
  ]
};

export default function FieldDashboard() {
  const { user } = useUser();
  const { jobs, updateJob } = useJobs();
  const { addNotification } = useNotifications();
  const router = useRouter();
  
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [reportData, setReportData] = useState<Record<string, string | number | null>>({});
  const [uploadedDocuments, setUploadedDocuments] = useState<{ [key: string]: File | null }>({});
  const [inspectionDialogOpen, setInspectionDialogOpen] = useState(false);
  const [formProgress, setFormProgress] = useState(0);
  const [emergencyContactsDialogOpen, setEmergencyContactsDialogOpen] = useState(false);
  const [equipmentDialogOpen, setEquipmentDialogOpen] = useState(false);
  const [weatherDialogOpen, setWeatherDialogOpen] = useState(false);
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);
  const [fieldHistoryDialogOpen, setFieldHistoryDialogOpen] = useState(false);
  const [assignedToMe, setAssignedToMe] = useState<any[]>([]);
  const [loadingAssignments, setLoadingAssignments] = useState<boolean>(false);

  // Fetch assignments for this field worker directly from server so new assignments appear instantly
  useEffect(() => {
    const fetchAssigned = async () => {
      if (!user?.id) return;
      try {
        setLoadingAssignments(true);
        const res = await fetch('/api/job-assignments');
        const data = await res.json();
        if (data?.success) {
          const mine = (data.data || []).filter((a: any) => a.field_worker_id === user.id && a.current_stage === 'field');
          setAssignedToMe(mine);
        } else {
          setAssignedToMe([]);
        }
      } catch (e) {
        setAssignedToMe([]);
      } finally {
        setLoadingAssignments(false);
      }
    };
    fetchAssigned();
    const interval = setInterval(fetchAssigned, 8000);
    return () => clearInterval(interval);
  }, [user?.id]);

  // Filter jobs for field team
  const fieldJobs = jobs.filter(job => 
    job.status === "pending fieldwork" || job.status === "pending QA"
  );

  const total = fieldJobs.length;
  const pending = fieldJobs.filter(j => j.status === "pending fieldwork").length;
  const completed = fieldJobs.filter(j => j.status === "pending QA").length;

  // Calculate form progress
  const calculateFormProgress = useCallback(() => {
    if (!selectedTemplate) return 0;
    
    const totalFields = getReportTemplateFields(selectedTemplate).length;
    const completedFields = getReportTemplateFields(selectedTemplate)
      .filter(field => reportData[field.name] && reportData[field.name] !== '').length;
    
    const requiredDocsCount = requiredDocuments.length;
    const uploadedRequiredDocs = requiredDocuments
      .filter(doc => uploadedDocuments[doc.id]).length;
    
    const fieldProgress = (completedFields / totalFields) * 60; // 60% weight for fields
    const docProgress = (uploadedRequiredDocs / requiredDocsCount) * 40; // 40% weight for docs
    
    return Math.round(fieldProgress + docProgress);
  }, [selectedTemplate, reportData, uploadedDocuments]);

  useEffect(() => {
    setFormProgress(calculateFormProgress());
  }, [reportData, uploadedDocuments, selectedTemplate, calculateFormProgress]);

  const getReportTemplateFields = (templateId: string) => {
    const baseFields = [
      { name: "gpsCoordinates", label: "GPS Coordinates", type: "text", required: true },
      { name: "siteAccessibility", label: "Site Accessibility", type: "select", required: true, options: ["Easy", "Moderate", "Difficult", "Very Difficult"] },
      { name: "siteSecurity", label: "Site Security", type: "select", required: true, options: ["High", "Medium", "Low", "None"] },
      { name: "environmentalFactors", label: "Environmental Factors", type: "text", required: true },
      { name: "weatherConditions", label: "Weather Conditions", type: "select", required: true, options: ["Clear", "Cloudy", "Rainy", "Windy", "Other"] },
      { name: "accessConditions", label: "Access Conditions", type: "select", required: true, options: ["Excellent", "Good", "Fair", "Poor"] },
    ];

    switch (templateId) {
      case "vacant-land":
        return [
          ...baseFields,
          { name: "landTopography", label: "Land Topography", type: "text", required: true },
          { name: "soilType", label: "Soil Type", type: "text", required: true },
          { name: "vegetation", label: "Vegetation Cover", type: "text", required: true },
          { name: "drainage", label: "Drainage Pattern", type: "text", required: true },
          { name: "boundaries", label: "Boundary Markers", type: "text", required: true },
        ];
      case "residential":
        return [
          ...baseFields,
          { name: "buildingType", label: "Building Type", type: "text", required: true },
          { name: "constructionQuality", label: "Construction Quality", type: "select", required: true, options: ["Excellent", "Good", "Fair", "Poor"] },
          { name: "age", label: "Building Age (years)", type: "number", required: true },
          { name: "condition", label: "Overall Condition", type: "select", required: true, options: ["Excellent", "Good", "Fair", "Poor"] },
          { name: "maintenance", label: "Maintenance Level", type: "select", required: true, options: ["Well Maintained", "Moderately Maintained", "Poorly Maintained"] },
        ];
      case "commercial":
        return [
          ...baseFields,
          { name: "buildingUse", label: "Current Building Use", type: "text", required: true },
          { name: "floorSpace", label: "Floor Space (sq ft)", type: "number", required: true },
          { name: "parking", label: "Parking Availability", type: "text", required: true },
          { name: "utilities", label: "Utility Connections", type: "text", required: true },
          { name: "compliance", label: "Regulatory Compliance", type: "select", required: true, options: ["Fully Compliant", "Partially Compliant", "Non-Compliant"] },
        ];
      case "institutional":
        return [
          ...baseFields,
          { name: "institutionType", label: "Institution Type", type: "text", required: true },
          { name: "capacity", label: "Capacity/Size", type: "text", required: true },
          { name: "facilities", label: "Available Facilities", type: "text", required: true },
          { name: "accessibility", label: "Accessibility Features", type: "text", required: true },
          { name: "safety", label: "Safety Standards", type: "select", required: true, options: ["Excellent", "Good", "Fair", "Poor"] },
        ];
      case "vehicle":
        return [
          { name: "make", label: "Vehicle Make", type: "text", required: true },
          { name: "model", label: "Vehicle Model", type: "text", required: true },
          { name: "year", label: "Manufacturing Year", type: "number", required: true },
          { name: "mileage", label: "Mileage", type: "number", required: true },
          { name: "condition", label: "Overall Condition", type: "select", required: true, options: ["Excellent", "Good", "Fair", "Poor"] },
          { name: "engine", label: "Engine Condition", type: "select", required: true, options: ["Excellent", "Good", "Fair", "Poor"] },
          { name: "body", label: "Body Condition", type: "select", required: true, options: ["Excellent", "Good", "Fair", "Poor"] },
          { name: "interior", label: "Interior Condition", type: "select", required: true, options: ["Excellent", "Good", "Fair", "Poor"] },
        ];
      default:
        return baseFields;
    }
  };

  const handleFieldChange = (fieldName: string, value: string | number) => {
    setReportData(prev => ({ ...prev, [fieldName]: value }));
  };

  const handleFileUpload = (documentId: string, file: File) => {
    setUploadedDocuments(prev => ({ ...prev, [documentId]: file }));
  };

  const handleStartInspection = (job: Job) => {
    setSelectedJob(job);
    setSelectedTemplate(job.assetType || "vacant-land");
    setReportData({});
    setUploadedDocuments({});
    setInspectionDialogOpen(true);
  };

  const handleStartInspectionFromAssignment = (assignment: any) => {
    const mapped: Job = {
      id: assignment.job_id,
      clientName: assignment.client_name,
      assetType: assignment.asset_type,
      assetDetails: assignment.asset_details || {},
      status: "pending fieldwork",
      createdAt: new Date().toISOString()
    } as unknown as Job;
    handleStartInspection(mapped);
  };

  const handleInspectionSubmit = () => {
    if (!selectedJob) return;

    // Update job with field report data
    const updatedJob = {
      ...selectedJob,
      status: "pending QA" as const,
      fieldReport: "Field inspection completed",
      fieldReportBy: user?.role || "field_team",
      fieldReportTemplate: selectedTemplate,
      fieldDocuments: uploadedDocuments,
      fieldReportData: {
        inspectionDate: new Date().toISOString(),
        siteConditions: String(reportData.siteAccessibility || ''),
        measurements: String(reportData.gpsCoordinates || ''),
        photos: [],
        notes: String(reportData.notes || ''),
        documents: {
          orthophoto: uploadedDocuments.orthophoto ? 'uploaded' : '',
          topographic: uploadedDocuments.topographic ? 'uploaded' : '',
          areaSchedule: uploadedDocuments['area-schedule'] ? 'uploaded' : '',
          titleSearch: uploadedDocuments['title-search'] ? 'uploaded' : '',
          occupancyPermit: uploadedDocuments['occupancy-permit'] ? 'uploaded' : '',
          additionalDocs: []
        }
      },
    };

    updateJob(selectedJob.id, updatedJob as Partial<Job>);

    // Send notification to admin
    addNotification("admin", {
      title: "Field Inspection Complete",
      message: `Field inspection completed for ${selectedJob.clientName} - Ready for QA review`,
      type: "info",
      priority: "medium"
    });

    setInspectionDialogOpen(false);
    setSelectedJob(null);
    setSelectedTemplate("");
    setReportData({});
    setUploadedDocuments({});
  };

  const handleEmergencyCall = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  const handleEmergencyEmail = (email: string) => {
    window.open(`mailto:${email}`, '_self');
  };

  const toggleEquipmentStatus = (equipmentId: string) => {
    // This would update the equipment status in a real app
    console.log(`Toggled equipment: ${equipmentId}`);
  };

  if (!user || user.role !== "field_team") {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4" color="error">
          Access Denied - Field Team Only
        </Typography>
      </Box>
    );
  }

  // Inline styles split out to avoid any parsing oddities with nested braces
  const pageRootStyles: any = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    py: 4,
    px: 2
  };

  return (
    <Box sx={{ p: 4 }}>
      <Button variant="outlined" onClick={() => router.push('/dashboard')} sx={{ mb: 2 }}>← Return to Dashboard</Button>
      <Typography variant="h4" fontWeight={700} mb={2}>Field Team Dashboard</Typography>
      <Typography variant="body1" color="text.secondary" mb={3}>
        {pending > 0 ? `${pending} pending inspections` : 'All inspections completed'}
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
        <Button variant="contained" onClick={() => router.push('/field-dashboard/report-completion')}>Open Assigned Jobs</Button>
        <Button variant="outlined" onClick={() => router.push('/schedule-inspection')}>Schedule Inspection</Button>
      </Box>

      {/* Assigned to you (compact) */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>Assigned To You</Typography>
        {loadingAssignments ? (
          <Alert severity="info">Loading your assignments…</Alert>
        ) : assignedToMe.length === 0 ? (
          <Alert severity="warning">No direct assignments yet.</Alert>
        ) : (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
            {assignedToMe.map((a) => (
              <Card key={`${a.id}-${a.job_id}`} sx={{ p: 2, borderLeft: '6px solid #ff9800' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600}>{a.client_name}</Typography>
                    <Typography variant="body2" color="text.secondary">{a.asset_type} • {a.asset_details?.location || 'Location not specified'}</Typography>
                  </Box>
                  <Button size="small" variant="contained" onClick={() => handleStartInspectionFromAssignment(a)}>Start</Button>
                </Box>
              </Card>
            ))}
          </Box>
        )}
      </Box>
 
      <Alert severity="info">
        Minimal view is active to resolve a compiler parse issue. Workflows (assignments, inspection submission) continue via other navigation.
      </Alert>
    </Box>
  );
} 