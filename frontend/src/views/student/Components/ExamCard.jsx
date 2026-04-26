import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { CardActionArea, IconButton, Stack, Box, Chip, Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '../../teacher/components/DeleteIcon';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const getStatusInfo = (liveDate, deadDate) => {
  const now = new Date();
  const live = new Date(liveDate);
  const dead = new Date(deadDate);
  if (now < live) return { label: 'UPCOMING', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)' };
  if (now > dead) return { label: 'CLOSED', color: '#ef4444', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.3)' };
  return { label: 'LIVE', color: '#22c55e', bg: 'rgba(34,197,94,0.12)', border: 'rgba(34,197,94,0.3)' };
};

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

const tags = ['DSA', 'Algorithms', 'Problem Solving', 'Data Structures', 'Logic'];

export default function ExamCard({ exam }) {
  const { examName, duration, totalQuestions, examId, liveDate, deadDate } = exam;
  const { userInfo } = useSelector((state) => state.auth);
  const isTeacher = userInfo?.role === 'teacher';
  const navigate = useNavigate();
  const status = getStatusInfo(liveDate, deadDate);

  // Pick 2 random tags based on examName hashcode for visual variety
  const tagSeed = examName ? examName.charCodeAt(0) % tags.length : 0;
  const examTags = [tags[tagSeed], tags[(tagSeed + 1) % tags.length]];

  const handleCardClick = () => {
    if (isTeacher) {
      toast.error('You are an organizer — you cannot take this challenge');
      return;
    }
    if (status.label === 'CLOSED') {
      toast.error('This hackathon challenge has ended');
      return;
    }
    navigate(`/exam/${examId}`);
  };

  return (
    <Card
      sx={{
        background: 'linear-gradient(145deg, #0f172a 0%, #1e293b 100%)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 3,
        overflow: 'hidden',
        position: 'relative',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          border: '1px solid rgba(99,102,241,0.5)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.4), 0 0 20px rgba(99,102,241,0.15)',
        },
      }}
    >
      {/* Top gradient accent bar */}
      <Box
        sx={{
          height: '4px',
          background: status.label === 'LIVE'
            ? 'linear-gradient(90deg, #22c55e, #14b8a6)'
            : status.label === 'UPCOMING'
            ? 'linear-gradient(90deg, #f59e0b, #f97316)'
            : 'linear-gradient(90deg, #64748b, #94a3b8)',
        }}
      />

      <CardActionArea onClick={handleCardClick} sx={{ '&:hover': { background: 'transparent' } }}>
        <CardContent sx={{ p: 2.5 }}>
          {/* Header row */}
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
            <Box sx={{ flex: 1, pr: 1 }}>
              <Typography
                variant="h6"
                sx={{
                  color: '#e2e8f0',
                  fontWeight: 700,
                  fontSize: '1rem',
                  lineHeight: 1.3,
                }}
              >
                {examName}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
              <Chip
                label={status.label}
                size="small"
                sx={{
                  background: status.bg,
                  color: status.color,
                  border: `1px solid ${status.border}`,
                  fontWeight: 700,
                  fontSize: '0.65rem',
                  letterSpacing: '0.1em',
                  height: 22,
                  ...(status.label === 'LIVE' && {
                    animation: 'pulse 2s infinite',
                    '@keyframes pulse': {
                      '0%': { boxShadow: `0 0 0 0 ${status.border}` },
                      '70%': { boxShadow: '0 0 0 6px transparent' },
                      '100%': { boxShadow: '0 0 0 0 transparent' },
                    },
                  }),
                }}
              />
              {isTeacher && (
                <IconButton
                  size="small"
                  onClick={(e) => e.stopPropagation()}
                  sx={{ p: 0.5 }}
                >
                  <DeleteIcon examId={examId} />
                </IconButton>
              )}
            </Box>
          </Stack>

          {/* Tags */}
          <Stack direction="row" spacing={0.5} mb={2} flexWrap="wrap" gap={0.5}>
            {examTags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                sx={{
                  background: 'rgba(99,102,241,0.1)',
                  color: '#a5b4fc',
                  border: '1px solid rgba(99,102,241,0.2)',
                  fontSize: '0.6rem',
                  height: 18,
                  fontWeight: 500,
                }}
              />
            ))}
            <Chip
              label="MCQ + Coding"
              size="small"
              sx={{
                background: 'rgba(20,184,166,0.1)',
                color: '#5eead4',
                border: '1px solid rgba(20,184,166,0.2)',
                fontSize: '0.6rem',
                height: 18,
                fontWeight: 500,
              }}
            />
          </Stack>

          {/* Stats row */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: 1,
              p: 1.5,
              borderRadius: 2,
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ color: '#a5b4fc', fontWeight: 700, fontSize: '1rem' }}>
                {totalQuestions}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.6rem' }}>
                Questions
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center', borderLeft: '1px solid rgba(255,255,255,0.06)', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
              <Typography variant="h6" sx={{ color: '#5eead4', fontWeight: 700, fontSize: '1rem' }}>
                {duration}m
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.6rem' }}>
                Duration
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ color: '#fb923c', fontWeight: 700, fontSize: '0.75rem' }}>
                {formatDate(deadDate)}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.6rem' }}>
                Deadline
              </Typography>
            </Box>
          </Box>

          {/* Footer */}
          <Stack direction="row" justifyContent="space-between" alignItems="center" mt={2}>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.6rem' }}>
              Opens: {formatDate(liveDate)}
            </Typography>
            {!isTeacher && status.label !== 'CLOSED' && (
              <Typography
                variant="caption"
                sx={{
                  color: '#6366f1',
                  fontWeight: 600,
                  fontSize: '0.7rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.3,
                }}
              >
                Take Challenge →
              </Typography>
            )}
            {isTeacher && (
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.6rem' }}>
                Organizer View
              </Typography>
            )}
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
