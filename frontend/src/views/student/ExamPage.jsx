import React from 'react';
import { Box, Typography } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import Exams from './Components/Exams';

const ExamPage = () => {
  return (
    <PageContainer title="HackProctor — Challenges" description="Active Hackathon Shortlisting Challenges">
      <Box>
        <Exams />
      </Box>
    </PageContainer>
  );
};

export default ExamPage;
