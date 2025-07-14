"use client";
import { Box, Typography, Paper, Stack, Divider } from "@mui/material";

function OrgNode({ title, children, color }: { title: string; children?: React.ReactNode; color?: string }) {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" position="relative" mb={2}>
      <Paper elevation={3} sx={{ px: 3, py: 1.5, borderLeft: color ? `6px solid ${color}` : undefined, minWidth: 180, textAlign: 'center', fontWeight: 600 }}>
        <Typography variant="subtitle1" fontWeight={600}>{title}</Typography>
      </Paper>
      {children && (
        <Box mt={1} width="2px" height={24} bgcolor="#bdbdbd" />
      )}
      {children}
    </Box>
  );
}

export default function OrgChartPage() {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={6}>
      <Typography variant="h4" gutterBottom>Organization Chart</Typography>
      <OrgNode title="Managing Director" color="#00897b">
        <OrgNode title="Associate Partners" color="#7c3aed">
          <Stack direction="row" spacing={2} justifyContent="center" sx={{ flexWrap: 'wrap' }}>
            <OrgNode title="Head Finance/Admin" color="#00bcd4">
              <OrgNode title="Assistants" color="#26c6da">
                <OrgNode title="Support Staff" color="#80cbc4" />
              </OrgNode>
            </OrgNode>
            <OrgNode title="Head Valuation" color="#43a047">
              <OrgNode title="Valuation Team" color="#a5d6a7" />
            </OrgNode>
            <OrgNode title="Head Surveying" color="#fbc02d">
              <OrgNode title="Surveying Team" color="#ffe082" />
            </OrgNode>
            <OrgNode title="Lead & Studies Officer" color="#8e24aa" />
            <OrgNode title="Project Planning Officer" color="#3949ab" />
            <OrgNode title="Head Resource/Consultancy" color="#e64a19">
              <OrgNode title="Researchers/Consultants" color="#ffab91" />
            </OrgNode>
            <OrgNode title="Head Asset Management" color="#6d4c41">
              <OrgNode title="Asset Managers" color="#bcaaa4" />
            </OrgNode>
          </Stack>
        </OrgNode>
      </OrgNode>
    </Box>
  );
} 