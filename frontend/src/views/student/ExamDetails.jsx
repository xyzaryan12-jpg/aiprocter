import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  Stack,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import { uniqueId } from 'lodash';
import * as React from 'react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useGetQuestionsQuery } from 'src/slices/examApiSlice';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const DescriptionAndInstructions = () => {
  const navigate = useNavigate();

  const { examId } = useParams();
  const { data: questions, isLoading } = useGetQuestionsQuery(examId);

  const testId = uniqueId();
  const [certify, setCertify] = useState(false);
  const handleCertifyChange = () => setCertify(!certify);

  const handleTest = () => {
    const isValid = true;
    if (isValid) {
      navigate(`/exam/${examId}/${testId}`);
    } else {
      toast.error('Challenge is not currently active.');
    }
  };

  return (
    <Card sx={{ background: 'linear-gradient(145deg, #0f172a, #1e293b)', border: 'none' }}>
      <CardContent sx={{ p: { xs: 3, md: 4 } }}>
        {/* Header Badge */}
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1,
            px: 2,
            py: 0.5,
            borderRadius: 2,
            background: 'rgba(99,102,241,0.15)',
            border: '1px solid rgba(99,102,241,0.3)',
            mb: 3,
          }}
        >
          <Typography sx={{ fontSize: '0.85rem' }}>🏆</Typography>
          <Typography variant="caption" sx={{ color: '#a5b4fc', fontWeight: 600, letterSpacing: '0.05em' }}>
            HackProctor — Shortlisting Challenge
          </Typography>
        </Box>

        <Typography variant="h2" mb={2} sx={{ color: '#e0e7ff', fontWeight: 800, fontSize: { xs: '1.5rem', md: '2rem' } }}>
          Challenge Description
        </Typography>
        <Typography sx={{ color: 'rgba(255,255,255,0.65)', lineHeight: 1.8, mb: 1 }}>
          This proctored evaluation is designed to shortlist the most eligible candidates for national
          and international hackathons. It tests your problem-solving ability, algorithmic thinking,
          and coding skills under timed, monitored conditions. A minimum score of{' '}
          <strong style={{ color: '#a5b4fc' }}>75%</strong> is recommended to qualify for shortlisting.
        </Typography>

        <Typography sx={{ color: '#5eead4', fontWeight: 500, mb: 3, fontSize: '0.85rem' }}>
          #Hackathon #DSA #Algorithms #ProblemSolving #MCQ #Coding #Shortlisting
        </Typography>

        <Typography variant="h3" mb={2} mt={3} sx={{ color: '#e0e7ff', fontWeight: 700 }}>
          📋 Test Instructions
        </Typography>
        <Box
          component="ol"
          sx={{
            color: 'rgba(255,255,255,0.7)',
            lineHeight: 2,
            pl: 2.5,
            '& li': { mb: 0.5 },
            '& strong': { color: '#a5b4fc' },
          }}
        >
          <li>This challenge consists of <strong>MCQ questions</strong> followed by a <strong>Coding problem</strong>.</li>
          <li>You must complete both sections to be considered for shortlisting.</li>
          <li>There is <strong>negative marking</strong> for wrong MCQ answers — attempt carefully.</li>
          <li><strong>Do NOT switch browser tabs or minimize the window</strong> — the AI proctor will flag this immediately.</li>
          <li>The test runs in <strong>full-screen mode</strong> only. Exiting full-screen will end the test.</li>
          <li>Your <strong>webcam must remain active</strong> throughout. Face must be clearly visible.</li>
          <li>The AI will detect and log: multiple faces, no face visible, cell phones, prohibited objects, and <strong>tab switches</strong>.</li>
          <li>The coding section supports <strong>Python, JavaScript, and Java</strong>.</li>
          <li>All answers are auto-saved as you proceed. Click <strong>Submit</strong> only when done.</li>
          <li>Results and shortlisting status are visible on the <strong>Results</strong> page after submission.</li>
        </Box>

        <Box
          sx={{
            mt: 3,
            p: 2,
            borderRadius: 2,
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.2)',
          }}
        >
          <Typography variant="body2" sx={{ color: '#fca5a5', fontWeight: 600, mb: 0.5 }}>
            ⚠️ Proctoring Notice
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
            Your actions, webcam feed, and behavior are being monitored by AI. Any signs of malpractice
            will be logged and reported to hackathon organizers, which may result in disqualification.
          </Typography>
        </Box>

        <Typography variant="h3" mb={2} mt={4} sx={{ color: '#e0e7ff', fontWeight: 700 }}>
          ✅ Confirmation
        </Typography>
        <Stack direction="column" alignItems="center" spacing={3}>
          <FormControlLabel
            control={
              <Checkbox
                checked={certify}
                onChange={handleCertifyChange}
                sx={{
                  color: 'rgba(255,255,255,0.3)',
                  '&.Mui-checked': { color: '#6366f1' },
                }}
              />
            }
            label={
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                I have read all instructions, agree to the proctoring terms, and confirm my identity is
                accurate for this hackathon shortlisting challenge.
              </Typography>
            }
          />
          <Box
            sx={{
              position: 'relative',
              '&:before': certify
                ? {
                    content: '""',
                    position: 'absolute',
                    inset: -2,
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #6366f1, #14b8a6)',
                    zIndex: 0,
                    filter: 'blur(6px)',
                    opacity: 0.6,
                  }
                : {},
            }}
          >
            <Box
              component="button"
              disabled={!certify}
              onClick={handleTest}
              sx={{
                position: 'relative',
                zIndex: 1,
                px: 5,
                py: 1.5,
                fontWeight: 700,
                fontSize: '1rem',
                letterSpacing: '0.05em',
                border: 'none',
                borderRadius: '8px',
                cursor: certify ? 'pointer' : 'not-allowed',
                background: certify
                  ? 'linear-gradient(135deg, #6366f1, #14b8a6)'
                  : 'rgba(255,255,255,0.08)',
                color: certify ? '#fff' : 'rgba(255,255,255,0.3)',
                transition: 'all 0.3s ease',
                '&:hover': certify ? { opacity: 0.9, transform: 'scale(1.02)' } : {},
              }}
            >
              🚀 Start Challenge
            </Box>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

const imgUrl =
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80';

export default function ExamDetails() {
  return (
    <>
      <Grid container sx={{ minHeight: '100vh', background: '#0a0e1a' }}>
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: `linear-gradient(to bottom, rgba(10,14,26,0.3), rgba(10,14,26,0.7)), url(${imgUrl})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            p: 6,
          }}
        >
          <Box
            sx={{
              p: 3,
              borderRadius: 3,
              background: 'rgba(10,14,26,0.7)',
              border: '1px solid rgba(99,102,241,0.2)',
              backdropFilter: 'blur(10px)',
              maxWidth: '480px',
            }}
          >
            <Typography
              variant="h3"
              sx={{
                color: '#fff',
                fontWeight: 800,
                mb: 1,
                background: 'linear-gradient(135deg, #e0e7ff, #a5b4fc)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              HackProctor
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>
              AI-powered proctored evaluation for fair, standardized hackathon candidate shortlisting.
            </Typography>
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          sm={8}
          md={5}
          sx={{
            background: '#0f172a',
            overflowY: 'auto',
            maxHeight: '100vh',
          }}
        >
          <DescriptionAndInstructions />
        </Grid>
      </Grid>
    </>
  );
}
