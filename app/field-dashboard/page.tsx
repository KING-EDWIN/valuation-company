"use client";
import { useState, useEffect, useCallback } from "react";
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
  { name: "Field Supervisor", phone: "+256 701 234 567", email: "supervisor@stanfield.com", role: "Immediate Supervisor" },
  { name: "Security Team", phone: "+256 702 345 678", email: "security@stanfield.com", role: "Security Support" },
  { name: "Technical Support", phone: "+256 703 456 789", email: "tech@stanfield.com", role: "App & Equipment Support" },
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

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      py: 4,
      px: 2
    }}>
      <Box maxWidth={1200} mx="auto">
        {/* Dashboard Header */}
        <Box sx={{ 
          background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
          borderRadius: 4,
          p: 4,
          mb: 4,
          color: 'white',
          textAlign: 'center',
          position: 'relative'
        }}>
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => router.push('/dashboard')}
            sx={{
              position: 'absolute',
              top: 16,
              left: 16,
              borderColor: 'rgba(255,255,255,0.5)',
              color: 'white',
              '&:hover': {
                borderColor: 'white',
                backgroundColor: 'rgba(255,255,255,0.1)'
              }
            }}
          >
            ← Return to Dashboard
          </Button>
          
          {/* Logo and Company Name */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 3 }}>
            <Box sx={{ 
              width: 50, 
              height: 50, 
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              bgcolor: 'rgba(255,255,255,0.2)'
            }}>
              {/* Stanfield Logo - CSS Generated */}
              <Box sx={{ 
                width: '100%', 
                height: '100%', 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}>
                {/* Red geometric shape - upper left */}
                <Box sx={{
                  position: 'absolute',
                  top: '10%',
                  left: '10%',
                  width: '40%',
                  height: '40%',
                  backgroundColor: '#e53935',
                  clipPath: 'polygon(0 0, 100% 0, 80% 100%, 0 100%)',
                  zIndex: 2
                }} />
                
                {/* Dark gray geometric shape - lower right */}
                <Box sx={{
                  position: 'absolute',
                  bottom: '10%',
                  right: '10%',
                  width: '40%',
                  height: '40%',
                  backgroundColor: '#424242',
                  clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0 100%)',
                  zIndex: 2
                }} />
                
                {/* Diagonal line connecting the shapes */}
          <Box sx={{
            position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: '80%',
                  height: '3px',
                  backgroundColor: '#1976d2',
                  transform: 'translate(-50%, -50%) rotate(45deg)',
                  zIndex: 1
                }} />
              </Box>
              <Box sx={{ 
                width: '100%', 
                height: '100%', 
                bgcolor: 'rgba(255,255,255,0.3)', 
                borderRadius: 2,
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1.5rem'
              }}>
                SP
              </Box>
            </Box>
            <Typography variant="h5" fontWeight={600} color="white">
              Stanfield Property Partners
            </Typography>
          </Box>
          
          <Typography variant="h4" fontWeight={700} mb={2}>
                Field Team Dashboard
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
            {pending > 0 ? `${pending} pending inspections` : 'All inspections completed'}
              </Typography>
        </Box>

        {/* Statistics Cards */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, mb: 4, justifyContent: 'center' }}>
          <Card sx={{ minWidth: 180, bgcolor: '#e3f2fd' }}>
            <CardContent>
              <AssignmentIcon color="primary" />
              <Typography variant="h6">Total Jobs</Typography>
              <Typography variant="h5">{total}</Typography>
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
        </Box>

        {/* Quick Actions & Tools */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" mb={3} fontWeight={600} color="text.primary">
            Quick Actions & Tools
          </Typography>
          
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
            {/* Schedule Inspection */}
            <Card sx={{ 
              height: '100%', 
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
              }
            }} onClick={() => router.push('/schedule-inspection')}>
              <Box sx={{ 
                position: 'absolute', 
                top: 16, 
                right: 16, 
                zIndex: 1 
              }}>
                <Chip 
                  label="New" 
                  size="small" 
                  color="primary"
                  sx={{ 
                    bgcolor: '#ff9800',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.7rem'
                  }} 
                />
              </Box>
              
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Box sx={{ 
                  width: 60, 
                  height: 60, 
                  borderRadius: '50%', 
                  bgcolor: '#ff9800',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2
                }}>
                  <ScheduleIcon sx={{ color: 'white', fontSize: 30 }} />
                </Box>
                
                <Typography variant="h6" fontWeight={600} mb={1}>
                  Schedule Inspection
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Schedule property inspections and manage field visits
                </Typography>
              </CardContent>
            </Card>

            {/* Field Reports */}
            <Card sx={{ 
              height: '100%', 
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
              }
            }} onClick={() => setInspectionDialogOpen(true)}>
              <Box sx={{ 
                position: 'absolute', 
                top: 16, 
                right: 16, 
                zIndex: 1 
              }}>
                <Chip 
                  label="Active" 
                  size="small" 
                  color="primary"
                  sx={{ 
                    bgcolor: '#1976d2',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.7rem'
                  }} 
                />
              </Box>
              
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Box sx={{ 
                  width: 60, 
                  height: 60, 
                  borderRadius: '50%', 
                  bgcolor: '#1976d2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2
                }}>
                  <DescriptionIcon sx={{ color: 'white', fontSize: 30 }} />
                </Box>
                
                <Typography variant="h6" fontWeight={600} mb={1}>
                  Field Reports
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Create and submit field inspection reports
                </Typography>
              </CardContent>
            </Card>

            {/* Photo Documentation */}
            <Card sx={{ 
              height: '100%', 
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
              }
            }}>
              <Box sx={{ 
                position: 'absolute', 
                top: 16, 
                right: 16, 
                zIndex: 1 
              }}>
                <Chip 
                  label="Pro" 
                  size="small" 
                  color="primary"
                  sx={{ 
                    bgcolor: '#9c27b0',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.7rem'
                  }} 
                />
              </Box>
              
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Box sx={{ 
                  width: 60, 
                  height: 60, 
                  borderRadius: '50%', 
                  bgcolor: '#9c27b0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2
                }}>
                  <CameraAltIcon sx={{ color: 'white', fontSize: 30 }} />
                </Box>
                
                <Typography variant="h6" fontWeight={600} mb={1}>
                  Photo Documentation
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Upload and manage inspection photos
                </Typography>
              </CardContent>
            </Card>

            {/* GPS Mapping */}
            <Card sx={{ 
              height: '100%', 
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
              }
            }}>
              <Box sx={{ 
                position: 'absolute', 
                top: 16, 
                right: 16, 
                zIndex: 1 
              }}>
                <Chip 
                  label="GPS" 
                  size="small" 
                  color="primary"
                  sx={{ 
                    bgcolor: '#4caf50',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.7rem'
                  }} 
                />
              </Box>
              
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Box sx={{ 
                  width: 60, 
                  height: 60, 
                  borderRadius: '50%', 
                  bgcolor: '#4caf50',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2
                }}>
                  <LocationOnIcon sx={{ color: 'white', fontSize: 30 }} />
                </Box>
                
                <Typography variant="h6" fontWeight={600} mb={1}>
                  GPS Mapping
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Record GPS coordinates and map locations
                </Typography>
              </CardContent>
            </Card>

            {/* Equipment Checklist */}
            <Card sx={{ 
              height: '100%', 
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
              }
            }} onClick={() => setEquipmentDialogOpen(true)}>
              <Box sx={{ 
                position: 'absolute', 
                top: 16, 
                right: 16, 
                zIndex: 1 
              }}>
                <Chip 
                  label="Tools" 
                  size="small" 
                  color="primary"
                  sx={{ 
                    bgcolor: '#607d8b',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.7rem'
                  }} 
                />
              </Box>
              
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Box sx={{ 
                  width: 60, 
                  height: 60, 
                  borderRadius: '50%', 
                  bgcolor: '#607d8b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2
                }}>
                  <AssignmentIcon sx={{ color: 'white', fontSize: 30 }} />
                </Box>
                
                <Typography variant="h6" fontWeight={600} mb={1}>
                  Equipment Checklist
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Manage inspection tools and equipment
                </Typography>
              </CardContent>
            </Card>

            {/* Weather Updates */}
            <Card sx={{ 
              height: '100%', 
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
              }
            }} onClick={() => setWeatherDialogOpen(true)}>
              <Box sx={{ 
                position: 'absolute', 
                top: 16, 
                right: 16, 
                zIndex: 1 
              }}>
                <Chip 
                  label="Live" 
                  size="small" 
                  color="primary"
                  sx={{ 
                    bgcolor: '#00bcd4',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.7rem'
                  }} 
                />
              </Box>
              
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Box sx={{ 
                  width: 60, 
                  height: 60, 
                  borderRadius: '50%', 
                  bgcolor: '#00bcd4',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2
                }}>
                  <AccessTimeIcon sx={{ color: 'white', fontSize: 30 }} />
                </Box>
                
                <Typography variant="h6" fontWeight={600} mb={1}>
                  Weather Updates
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Check weather conditions for field work
                </Typography>
              </CardContent>
            </Card>

            {/* Emergency Contacts */}
            <Card sx={{ 
              height: '100%', 
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
              }
            }} onClick={() => setEmergencyContactsDialogOpen(true)}>
              <Box sx={{ 
                position: 'absolute', 
                top: 16, 
                right: 16, 
                zIndex: 1 
              }}>
                <Chip 
                  label="SOS" 
                  size="small" 
                  color="primary"
                  sx={{ 
                    bgcolor: '#f44336',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.7rem'
                  }} 
                />
              </Box>
              
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Box sx={{ 
                  width: 60, 
                  height: 60, 
                  borderRadius: '50%', 
                  bgcolor: '#f44336',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2
                }}>
                  <SecurityIcon sx={{ color: 'white', fontSize: 30 }} />
                </Box>
                
                <Typography variant="h6" fontWeight={600} mb={1}>
                  Emergency Contacts
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Quick access to emergency contacts
                </Typography>
              </CardContent>
            </Card>

            {/* Field History */}
            <Card sx={{ 
              height: '100%', 
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
              }
            }} onClick={() => setFieldHistoryDialogOpen(true)}>
              <Box sx={{ 
                position: 'absolute', 
                top: 16, 
                right: 16, 
                zIndex: 1 
              }}>
                <Chip 
                  label="History" 
                  size="small" 
                  color="primary"
                  sx={{ 
                    bgcolor: '#795548',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.7rem'
                  }} 
                />
              </Box>
              
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Box sx={{ 
                  width: 60, 
                  height: 60, 
                  borderRadius: '50%', 
                  bgcolor: '#795548',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2
                }}>
                  <HistoryIcon sx={{ color: 'white', fontSize: 30 }} />
                </Box>
                
                <Typography variant="h6" fontWeight={600} mb={1}>
                  Field History
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  View past inspections and reports
                </Typography>
              </CardContent>
            </Card>

            {/* Help & Support */}
            <Card sx={{ 
              height: '100%', 
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
              }
            }} onClick={() => setHelpDialogOpen(true)}>
              <Box sx={{ 
                position: 'absolute', 
                top: 16, 
                right: 16, 
                zIndex: 1 
              }}>
                <Chip 
                  label="Help" 
                  size="small" 
                  color="primary"
                  sx={{ 
                    bgcolor: '#ff5722',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.7rem'
                  }} 
                />
              </Box>
              
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Box sx={{ 
                  width: 60, 
                  height: 60, 
                  borderRadius: '50%', 
                  bgcolor: '#ff5722',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2
                }}>
                  <HelpIcon sx={{ color: 'white', fontSize: 30 }} />
                </Box>
                
                <Typography variant="h6" fontWeight={600} mb={1}>
                  Help & Support
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Get help and technical support
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* Field Jobs */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" mb={3} fontWeight={600} color="text.primary">
            Field Jobs
          </Typography>
          
          {fieldJobs.length === 0 ? (
            <Alert severity="info">
              No field jobs assigned yet. Jobs will appear here once assigned by admin.
            </Alert>
          ) : (
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
              {fieldJobs.map((job) => (
                <Card key={job.id} sx={{ 
                  p: 3, 
                  borderLeft: `6px solid ${job.status === "pending fieldwork" ? "#ff9800" : "#4caf50"}`,
                  '&:hover': { boxShadow: 4 }
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ 
                      width: 50, 
                      height: 50, 
                      borderRadius: '50%', 
                      bgcolor: job.status === "pending fieldwork" ? "#ff9800" : "#4caf50",
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '1.2rem',
                      mr: 2
                    }}>
                      {job.clientName?.charAt(0) || 'C'}
                    </Box>
                    <Box>
                      <Typography variant="h6" fontWeight={600}>
                        {job.clientName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Asset: {job.assetType} - {job.assetDetails?.location || 'Location not specified'}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Chip 
                      label={job.status === "pending fieldwork" ? "PENDING INSPECTION" : "PENDING QA"} 
                      color={job.status === "pending fieldwork" ? "warning" : "success"}
                      size="small"
                    />
                    {job.status === "pending fieldwork" && (
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<EditIcon />}
                        onClick={() => handleStartInspection(job)}
                        size="small"
                      >
                        Start Inspection
                      </Button>
                    )}
                    {job.status === "pending QA" && (
                      <Chip 
                        label="✓ Inspection Complete" 
                        color="success" 
                        size="small"
                        icon={<CheckCircleIcon />}
                      />
                    )}
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                    Created: {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Date not available'}
        </Typography>
                </Card>
              ))}
            </Box>
          )}
        </Box>

        {/* Inspection Dialog */}
        <Dialog 
          open={inspectionDialogOpen} 
          onClose={() => setInspectionDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <EditIcon color="primary" />
              Field Inspection: {selectedJob?.clientName}
            </Box>
          </DialogTitle>
          
          <DialogContent>
            {selectedTemplate && (
              <Box>
                {/* Template Selection */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" mb={2}>Report Template</Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 2 }}>
                    {reportTemplates.map((template) => (
                      <Card 
                        key={template.id}
                        sx={{
                          p: 2,
                          cursor: 'pointer',
                          border: selectedTemplate === template.id ? `3px solid ${template.color}` : '1px solid #e0e0e0',
                          bgcolor: selectedTemplate === template.id ? `${template.color}10` : 'white',
                          '&:hover': { borderColor: template.color }
                        }}
                        onClick={() => setSelectedTemplate(template.id)}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box component={template.icon} sx={{ color: template.color }} />
                          <Typography variant="body2" fontWeight={600}>
                            {template.label}
            </Typography>
                        </Box>
                      </Card>
                    ))}
                  </Box>
                </Box>

                {/* Progress Bar */}
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6">
                      Inspection Progress
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formProgress}% Complete
                    </Typography>
                  </Box>
                  <Box sx={{ width: '100%', bgcolor: '#e0e0e0', borderRadius: 1, overflow: 'hidden' }}>
                    <Box
                      sx={{ 
                        width: `${formProgress}%`,
                        height: 8,
                        bgcolor: 'primary.main',
                        transition: 'width 0.3s ease'
                      }} 
                    />
                  </Box>
                </Box>

                {/* Report Fields */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" mb={2}>Inspection Details</Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
                    {getReportTemplateFields(selectedTemplate).map((field) => (
                      <Box key={field.name}>
                        {field.type === "select" ? (
                          <FormControl fullWidth required={field.required}>
                            <InputLabel>{field.label}</InputLabel>
                            <Select
                              value={reportData[field.name] || ''}
                              onChange={(e) => handleFieldChange(field.name, e.target.value)}
                              label={field.label}
                            >
                              {field.options?.map((option) => (
                                <MenuItem key={option} value={option}>{option}</MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        ) : (
                          <TextField
                            label={field.label}
                            type={field.type}
                            value={reportData[field.name] || ''}
                            onChange={(e) => handleFieldChange(field.name, e.target.value)}
                            fullWidth
                            required={field.required}
                          />
                        )}
                      </Box>
                    ))}
                  </Box>
                </Box>

                {/* Required Documents */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" mb={2}>Required Documents</Typography>
                  <Alert severity="info" sx={{ mb: 2 }}>
                    Upload all required documents for this inspection
                  </Alert>
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
                    {requiredDocuments.map((doc) => (
                      <Card key={doc.id} sx={{ 
                        p: 2, 
                        border: uploadedDocuments[doc.id] ? '2px solid #4caf50' : '2px solid #e0e0e0' 
                      }}>
                        <CardContent>
                          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                            {doc.label}
                            <span style={{ color: 'red' }}> *</span>
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Button
                              variant="outlined"
                              component="label"
                              startIcon={<CameraAltIcon />}
                              size="small"
                            >
                              Upload
                              <input
                                type="file"
                                hidden
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    handleFileUpload(doc.id, e.target.files[0]);
                                  }
                                }}
                              />
                            </Button>
                            {uploadedDocuments[doc.id] && (
                              <Chip 
                                label={uploadedDocuments[doc.id]?.name} 
                                color="success" 
                                size="small"
                                onDelete={() => {
                                  setUploadedDocuments(prev => ({ ...prev, [doc.id]: null }));
                                }}
                              />
                            )}
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                </Box>

                {/* Optional Documents */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" mb={2}>Optional Documents</Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
                    {optionalDocuments.map((doc) => (
                      <Card key={doc.id} sx={{ 
                        p: 2, 
                        border: uploadedDocuments[doc.id] ? '2px solid #4caf50' : '2px solid #e0e0e0' 
                      }}>
                        <CardContent>
                          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                            {doc.label}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Button
                              variant="outlined"
                              component="label"
                              startIcon={<CameraAltIcon />}
                              size="small"
                            >
                              Upload
                              <input
                                type="file"
                                hidden
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    handleFileUpload(doc.id, e.target.files[0]);
                                  }
                                }}
                              />
                            </Button>
                            {uploadedDocuments[doc.id] && (
                              <Chip 
                                label={uploadedDocuments[doc.id]?.name} 
                                color="success" 
                                size="small"
                                onDelete={() => {
                                  setUploadedDocuments(prev => ({ ...prev, [doc.id]: null }));
                                }}
                              />
                            )}
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                </Box>

                {/* Additional Notes */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" mb={2}>Additional Field Notes</Typography>
                <TextField
                    label="General observations and findings"
                    multiline
                    rows={4}
                  fullWidth
                    value={reportData.additionalNotes || ''}
                    onChange={(e) => handleFieldChange('additionalNotes', e.target.value)}
                    placeholder="Enter any additional observations, challenges encountered, or special considerations..."
                  />
                </Box>

                {/* Submission Summary */}
                <Paper sx={{ p: 3, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                  <Typography variant="h6" mb={2}>Submission Summary</Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Template: <strong>{reportTemplates.find(t => t.id === selectedTemplate)?.label}</strong>
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Required Docs: <strong>{Object.keys(uploadedDocuments).filter(k => requiredDocuments.find(d => d.id === k) && uploadedDocuments[k]).length}/{requiredDocuments.length}</strong>
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Optional Docs: <strong>{Object.keys(uploadedDocuments).filter(k => optionalDocuments.find(d => d.id === k) && uploadedDocuments[k]).length}/{optionalDocuments.length}</strong>
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Fields Completed: <strong>{getReportTemplateFields(selectedTemplate).filter(f => reportData[f.name] && reportData[f.name] !== '').length}/{getReportTemplateFields(selectedTemplate).length}</strong>
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Overall Progress: <strong>{formProgress}%</strong>
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Total Documents: <strong>{Object.keys(uploadedDocuments).filter(k => uploadedDocuments[k]).length}</strong>
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Box>
            )}
          </DialogContent>

          <DialogActions sx={{ p: 3 }}>
            <Button 
              onClick={() => setInspectionDialogOpen(false)}
              variant="outlined"
            >
              Cancel
            </Button>
                <Button
              onClick={handleInspectionSubmit}
                  variant="contained"
              color="primary"
              startIcon={<SendIcon />}
              disabled={formProgress < 80}
            >
              Submit Inspection Report
                </Button>
          </DialogActions>
        </Dialog>

        {/* Emergency Contacts Dialog */}
        <Dialog 
          open={emergencyContactsDialogOpen} 
          onClose={() => setEmergencyContactsDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{ 
            background: 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}>
            <SecurityIcon />
            Emergency Contacts
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            <Alert severity="warning" sx={{ mb: 3 }}>
              <Typography variant="h6">Emergency Contacts</Typography>
              <Typography variant="body2">
                Use these contacts in case of emergencies, security issues, or technical problems during field work.
              </Typography>
            </Alert>
            
            <Box sx={{ display: 'grid', gap: 2 }}>
              {emergencyContacts.map((contact, index) => (
                <Card key={index} sx={{ p: 2, border: '1px solid #e0e0e0' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="h6" fontWeight={600}>{contact.name}</Typography>
                      <Typography variant="body2" color="text.secondary">{contact.role}</Typography>
                      {contact.phone && (
                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                          <PhoneIcon fontSize="small" />
                          {contact.phone}
                        </Typography>
                      )}
                      {contact.email && (
                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <EmailIcon fontSize="small" />
                          {contact.email}
                        </Typography>
                      )}
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {contact.phone && (
                        <Button
                          variant="contained"
                          color="error"
                          startIcon={<PhoneIcon />}
                          onClick={() => handleEmergencyCall(contact.phone)}
                          size="small"
                        >
                          Call
                        </Button>
                      )}
                      {contact.email && (
                        <Button
                          variant="outlined"
                          startIcon={<EmailIcon />}
                          onClick={() => handleEmergencyEmail(contact.email)}
                          size="small"
                        >
                          Email
                        </Button>
                      )}
                    </Box>
                  </Box>
                </Card>
              ))}
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setEmergencyContactsDialogOpen(false)}>
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Equipment Checklist Dialog */}
        <Dialog 
          open={equipmentDialogOpen} 
          onClose={() => setEquipmentDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{ 
            background: 'linear-gradient(135deg, #607d8b 0%, #455a64 100%)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}>
            <AssignmentIcon />
            Equipment Checklist
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            <Typography variant="h6" mb={3}>Field Equipment Checklist</Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Ensure all required equipment is available before starting field work.
            </Typography>
            
            <Box sx={{ display: 'grid', gap: 2 }}>
              {equipmentChecklist.map((item) => (
                <Card key={item.id} sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600}>{item.name}</Typography>
                      <Chip 
                        label={item.category} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                      />
                    </Box>
                    <Button
                      variant={item.status === "checked" ? "contained" : "outlined"}
                      color={item.status === "checked" ? "success" : "primary"}
                      onClick={() => toggleEquipmentStatus(item.id)}
                      size="small"
                    >
                      {item.status === "checked" ? "✓ Available" : "Mark Available"}
                    </Button>
                  </Box>
                </Card>
              ))}
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setEquipmentDialogOpen(false)}>
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Weather Updates Dialog */}
        <Dialog 
          open={weatherDialogOpen} 
          onClose={() => setWeatherDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{ 
            background: 'linear-gradient(135deg, #00bcd4 0%, #0097a7 100%)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}>
            <AccessTimeIcon />
            Weather Updates
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            <Typography variant="h6" mb={3}>Current Weather Conditions</Typography>
            
            {/* Current Weather */}
            <Card sx={{ p: 3, mb: 3, bgcolor: '#e3f2fd' }}>
              <Typography variant="h5" mb={2}>Current Conditions</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
                <Box>
                  <Typography variant="h4" fontWeight={600}>{weatherData.current.temp}°C</Typography>
                  <Typography variant="body1">{weatherData.current.condition}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2">Humidity: {weatherData.current.humidity}%</Typography>
                  <Typography variant="body2">Wind: {weatherData.current.wind}</Typography>
                </Box>
              </Box>
            </Card>

            {/* Weather Forecast */}
            <Typography variant="h6" mb={2}>3-Day Forecast</Typography>
            <Box sx={{ display: 'grid', gap: 2 }}>
              {weatherData.forecast.map((day, index) => (
                <Card key={index} sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600}>{day.day}</Typography>
                      <Typography variant="body2" color="text.secondary">{day.condition}</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="h6">{day.temp}</Typography>
                      <Typography variant="body2" color="text.secondary">Rain: {day.chance}</Typography>
                    </Box>
                  </Box>
                </Card>
              ))}
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setWeatherDialogOpen(false)}>
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Help & Support Dialog */}
        <Dialog 
          open={helpDialogOpen} 
          onClose={() => setHelpDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{ 
            background: 'linear-gradient(135deg, #ff5722 0%, #e64a19 100%)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}>
            <HelpIcon />
            Help & Support
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            <Typography variant="h6" mb={3}>Field Team Support</Typography>
            
            <Box sx={{ display: 'grid', gap: 3 }}>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" mb={2}>📱 App Support</Typography>
                <Typography variant="body2" mb={2}>
                  Having trouble with the app? Contact technical support immediately.
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<PhoneIcon />}
                  onClick={() => handleEmergencyCall("+256 703 456 789")}
                >
                  Call Tech Support
                </Button>
              </Card>

              <Card sx={{ p: 3 }}>
                <Typography variant="h6" mb={2}>📋 Field Work Guidelines</Typography>
                <Typography variant="body2" mb={2}>
                  • Always wear safety equipment<br/>
                  • Take clear photos of all areas<br/>
                  • Record accurate GPS coordinates<br/>
                  • Complete all required documents<br/>
                  • Report any issues immediately
                </Typography>
              </Card>

              <Card sx={{ p: 3 }}>
                <Typography variant="h6" mb={2}>🚨 Emergency Procedures</Typography>
                <Typography variant="body2" mb={2}>
                  • Call emergency services: 112<br/>
                  • Contact supervisor immediately<br/>
                  • Document any incidents<br/>
                  • Do not put yourself at risk
                </Typography>
              </Card>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setHelpDialogOpen(false)}>
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Field History Dialog */}
        <Dialog 
          open={fieldHistoryDialogOpen} 
          onClose={() => setFieldHistoryDialogOpen(false)}
          maxWidth="lg"
          fullWidth
        >
          <DialogTitle sx={{ 
            background: 'linear-gradient(135deg, #795548 0%, #5d4037 100%)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}>
            <HistoryIcon />
            Field History
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            <Typography variant="h6" mb={3}>Recent Field Inspections</Typography>
            
            {fieldJobs.filter(job => job.status === "pending QA" || job.status === "completed").length === 0 ? (
              <Alert severity="info">
                No completed inspections found. Your inspection history will appear here once you complete field work.
              </Alert>
            ) : (
              <Box sx={{ display: 'grid', gap: 2 }}>
                {fieldJobs
                  .filter(job => job.status === "pending QA" || job.status === "completed")
                  .map((job) => (
                    <Card key={job.id} sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="subtitle1" fontWeight={600}>{job.clientName}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {job.assetType} - {job.assetDetails?.location}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Completed: {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Date not available'}
                          </Typography>
                        </Box>
                        <Chip 
                          label={job.status === "pending QA" ? "Pending Review" : "Completed"} 
                          color={job.status === "pending QA" ? "warning" : "success"}
                        />
                      </Box>
                    </Card>
                  ))}
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setFieldHistoryDialogOpen(false)}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
} 