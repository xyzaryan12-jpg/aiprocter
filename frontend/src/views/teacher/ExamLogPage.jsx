import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import CheatingTable from './components/CheatingTable';

const ExamLogPage = () => {
  return (
    <PageContainer title="HackProctor — Proctoring Logs" description="AI Proctoring Analytics Dashboard">
      <Box>
        {/* Header */}
        <Box mb={3}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#2A3547' }}>
              🔍 Proctoring Analytics
            </Typography>
            <Chip
              label="ORGANIZER ONLY"
              size="small"
              color="error"
              variant="outlined"
              sx={{ fontWeight: 700, fontSize: '0.65rem', letterSpacing: '0.05em', height: 22 }}
            />
          </Box>
          <Typography variant="body2" color="textSecondary">
            Real-time AI proctoring logs — violations detected during hackathon challenge attempts
          </Typography>
        </Box>

        <CheatingTable />
      </Box>
    </PageContainer>
  );
};

export default ExamLogPage;
