import React from 'react';
import { Grid, Typography, Box, Stack, CircularProgress, TextField, InputAdornment } from '@mui/material';
import ExamCard from './ExamCard';
import { useGetExamsQuery } from 'src/slices/examApiSlice';
import { useSelector } from 'react-redux';

const Exams = () => {
  const { data: userExams, isLoading, isError } = useGetExamsQuery();
  const { userInfo } = useSelector((state) => state.auth);
  const isTeacher = userInfo?.role === 'teacher';

  const [search, setSearch] = React.useState('');

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress sx={{ color: '#6366f1' }} />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box textAlign="center" py={8}>
        <Typography variant="h2" sx={{ fontSize: '3rem', mb: 2 }}>
          ⚠️
        </Typography>
        <Typography variant="h5" sx={{ color: '#ef4444', mb: 1 }}>
          Unable to load challenges
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Check your connection and try again.
        </Typography>
      </Box>
    );
  }

  const filtered = (userExams || []).filter((exam) =>
    exam.examName?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Box>
      {/* ── Hero Banner ── */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          border: '1px solid rgba(99,102,241,0.2)',
          borderRadius: 3,
          p: { xs: 3, md: 4 },
          mb: 4,
          position: 'relative',
          overflow: 'hidden',
          '&:before': {
            content: '""',
            position: 'absolute',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
            right: '-50px',
            top: '-80px',
          },
        }}
      >
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'center' }} gap={2}>
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                background: 'linear-gradient(135deg, #e0e7ff, #a5b4fc)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 0.5,
              }}
            >
              🏆 Hackathon Challenges
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
              {isTeacher
                ? 'Manage and monitor all active hackathon evaluation rounds'
                : 'Browse and attempt active hackathon shortlisting challenges'}
            </Typography>
          </Box>
          {/* Stats pills */}
          <Stack direction="row" spacing={2} flexShrink={0}>
            <Box
              sx={{
                px: 2,
                py: 1,
                borderRadius: 2,
                background: 'rgba(99,102,241,0.12)',
                border: '1px solid rgba(99,102,241,0.25)',
                textAlign: 'center',
              }}
            >
              <Typography variant="h6" sx={{ color: '#a5b4fc', fontWeight: 700 }}>
                {userExams?.length || 0}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem' }}>
                Total Challenges
              </Typography>
            </Box>
            <Box
              sx={{
                px: 2,
                py: 1,
                borderRadius: 2,
                background: 'rgba(34,197,94,0.1)',
                border: '1px solid rgba(34,197,94,0.2)',
                textAlign: 'center',
              }}
            >
              <Typography variant="h6" sx={{ color: '#4ade80', fontWeight: 700 }}>
                {(userExams || []).filter((e) => {
                  const now = new Date();
                  return now >= new Date(e.liveDate) && now <= new Date(e.deadDate);
                }).length}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem' }}>
                Live Now
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </Box>

      {/* ── Search Bar ── */}
      <Box mb={3}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search challenges..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Typography sx={{ color: 'rgba(255,255,255,0.3)', fontSize: '1rem' }}>🔍</Typography>
              </InputAdornment>
            ),
            sx: {
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 2,
              color: '#e2e8f0',
              '& fieldset': { border: 'none' },
              '&:hover': { background: 'rgba(255,255,255,0.06)' },
            },
          }}
        />
      </Box>

      {/* ── Grid of Cards ── */}
      {filtered.length === 0 ? (
        <Box textAlign="center" py={10}>
          <Typography variant="h2" sx={{ fontSize: '4rem', mb: 2 }}>
            🎯
          </Typography>
          <Typography variant="h5" sx={{ color: 'rgba(255,255,255,0.5)', mb: 1 }}>
            {search ? 'No challenges match your search' : 'No challenges available yet'}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {isTeacher
              ? 'Create your first hackathon challenge using the sidebar.'
              : 'Check back soon — new challenges are being added.'}
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filtered.map((exam) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={exam._id}>
              <ExamCard exam={exam} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Exams;
