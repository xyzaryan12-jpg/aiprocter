import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, Stack, Typography, LinearProgress, Chip } from '@mui/material';
import { toast } from 'react-toastify';

const NumberOfQuestions = ({ questionLength, submitTest, examDurationInSeconds }) => {
  const totalQuestions = questionLength || 0;
  const [timeLeft, setTimeLeft] = useState(examDurationInSeconds * 60);
  const timerRef = useRef(null);

  useEffect(() => {
    setTimeLeft(examDurationInSeconds * 60);
  }, [examDurationInSeconds]);

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          toast.warning('⏰ Time is up! Submitting your challenge...');
          submitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  const totalSeconds = examDurationInSeconds * 60;
  const progress = totalSeconds > 0 ? (timeLeft / totalSeconds) * 100 : 0;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isWarning = timeLeft <= 120; // last 2 min
  const isDanger = timeLeft <= 60;   // last 1 min

  const timerColor = isDanger ? '#ef4444' : isWarning ? '#f59e0b' : '#22c55e';
  const progressColor = isDanger ? '#ef4444' : isWarning ? '#f59e0b' : '#6366f1';

  return (
    <Box
      sx={{
        background: 'linear-gradient(145deg, #0f172a, #1e293b)',
        borderRadius: 3,
        p: 2.5,
        width: '100%',
        border: isDanger
          ? '1px solid rgba(239,68,68,0.4)'
          : isWarning
          ? '1px solid rgba(245,158,11,0.3)'
          : '1px solid rgba(255,255,255,0.08)',
        transition: 'border-color 0.5s ease',
      }}
    >
      {/* ── Timer ── */}
      <Box
        sx={{
          textAlign: 'center',
          mb: 2,
          p: 2,
          borderRadius: 2,
          background: isDanger
            ? 'rgba(239,68,68,0.08)'
            : isWarning
            ? 'rgba(245,158,11,0.08)'
            : 'rgba(99,102,241,0.08)',
          border: `1px solid ${isDanger ? 'rgba(239,68,68,0.2)' : isWarning ? 'rgba(245,158,11,0.2)' : 'rgba(99,102,241,0.15)'}`,
          transition: 'all 0.5s ease',
          ...(isDanger && {
            animation: 'dangerPulse 1s ease-in-out infinite',
            '@keyframes dangerPulse': {
              '0%, 100%': { boxShadow: '0 0 0 0 rgba(239,68,68,0)' },
              '50%': { boxShadow: '0 0 0 6px rgba(239,68,68,0.1)' },
            },
          }),
        }}
      >
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', fontSize: '0.65rem', textTransform: 'uppercase' }}>
          ⏱ Time Remaining
        </Typography>
        <Typography
          sx={{
            fontSize: '2.8rem',
            fontWeight: 800,
            fontFamily: "'Courier New', monospace",
            color: timerColor,
            lineHeight: 1.1,
            mt: 0.5,
            letterSpacing: '0.05em',
            textShadow: `0 0 20px ${timerColor}40`,
            transition: 'color 0.5s ease',
          }}
        >
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </Typography>
        {isDanger && (
          <Typography variant="caption" sx={{ color: '#f87171', fontSize: '0.65rem', fontWeight: 600 }}>
            ⚠️ Submit soon!
          </Typography>
        )}
      </Box>

      {/* Progress bar */}
      <Box mb={2.5}>
        <Stack direction="row" justifyContent="space-between" mb={0.5}>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem' }}>
            Time elapsed
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem' }}>
            {Math.round(100 - progress)}%
          </Typography>
        </Stack>
        <LinearProgress
          variant="determinate"
          value={100 - progress}
          sx={{
            height: 6,
            borderRadius: 3,
            background: 'rgba(255,255,255,0.06)',
            '& .MuiLinearProgress-bar': {
              background: `linear-gradient(90deg, ${progressColor}, ${progressColor}aa)`,
              borderRadius: 3,
              transition: 'all 0.5s ease',
            },
          }}
        />
      </Box>

      {/* ── Question Navigator ── */}
      <Box mb={2}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Question Navigator
          </Typography>
          <Chip
            label={`${totalQuestions} Total`}
            size="small"
            sx={{
              background: 'rgba(99,102,241,0.15)',
              color: '#a5b4fc',
              fontSize: '0.6rem',
              height: 18,
              border: '1px solid rgba(99,102,241,0.2)',
            }}
          />
        </Stack>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 0.8,
          }}
        >
          {Array.from({ length: totalQuestions }, (_, i) => i + 1).map((num) => (
            <Box
              key={num}
              sx={{
                width: 32,
                height: 32,
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.7rem',
                fontWeight: 700,
                cursor: 'pointer',
                background: 'rgba(99,102,241,0.12)',
                color: '#a5b4fc',
                border: '1px solid rgba(99,102,241,0.2)',
                transition: 'all 0.15s ease',
                userSelect: 'none',
                '&:hover': {
                  background: 'rgba(99,102,241,0.25)',
                  transform: 'scale(1.1)',
                },
              }}
            >
              {num}
            </Box>
          ))}
          {totalQuestions === 0 && (
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' }}>
              No questions loaded
            </Typography>
          )}
        </Box>
      </Box>

      {/* Legend */}
      <Stack direction="row" spacing={2} mb={2}>
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Box sx={{ width: 10, height: 10, borderRadius: '3px', background: 'rgba(99,102,241,0.4)', border: '1px solid rgba(99,102,241,0.5)' }} />
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.6rem' }}>Not attempted</Typography>
        </Stack>
      </Stack>

      {/* Proctoring status */}
      <Box
        sx={{
          p: 1.2,
          borderRadius: 2,
          background: 'rgba(34,197,94,0.06)',
          border: '1px solid rgba(34,197,94,0.15)',
          mb: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: '#22c55e',
            boxShadow: '0 0 6px #22c55e',
            flexShrink: 0,
            animation: 'livePulse 1.5s ease-in-out infinite',
            '@keyframes livePulse': {
              '0%, 100%': { opacity: 1 },
              '50%': { opacity: 0.4 },
            },
          }}
        />
        <Typography variant="caption" sx={{ color: '#4ade80', fontSize: '0.65rem', fontWeight: 600 }}>
          AI Proctoring Active — Stay on screen
        </Typography>
      </Box>

      {/* Finish Button */}
      <Button
        variant="contained"
        fullWidth
        onClick={submitTest}
        sx={{
          background: isDanger
            ? 'linear-gradient(135deg, #ef4444, #dc2626)'
            : 'linear-gradient(135deg, #6366f1, #4f46e5)',
          borderRadius: '10px',
          py: 1.2,
          fontWeight: 700,
          fontSize: '0.85rem',
          textTransform: 'none',
          letterSpacing: '0.03em',
          boxShadow: 'none',
          transition: 'all 0.3s ease',
          '&:hover': {
            background: isDanger
              ? 'linear-gradient(135deg, #dc2626, #b91c1c)'
              : 'linear-gradient(135deg, #4f46e5, #4338ca)',
            boxShadow: 'none',
            transform: 'translateY(-1px)',
          },
        }}
      >
        {isDanger ? '⚡ Submit Now' : '✓ Submit Challenge'}
      </Button>
    </Box>
  );
};

export default NumberOfQuestions;
