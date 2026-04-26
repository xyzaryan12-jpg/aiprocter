import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  LinearProgress,
  Chip,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router';
import axiosInstance from '../../../axios';
import { toast } from 'react-toastify';

export default function MultipleChoiceQuestion({
  questions = [],
  saveUserTestScore,
  submitTest,
  currentQuestionIndex,
  setCurrentQuestionIndex,
}) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState(new Map());
  const [answeredSet, setAnsweredSet] = useState(new Set()); // track answered Q indices
  const navigate = useNavigate();
  const { examId } = useParams();

  const [isLastQuestion, setIsLastQuestion] = useState(false);

  useEffect(() => {
    setIsLastQuestion(currentQuestion === questions.length - 1);
    if (setCurrentQuestionIndex) setCurrentQuestionIndex(currentQuestion);
  }, [currentQuestion, questions.length]);

  // Guard: no questions
  if (!questions || questions.length === 0) {
    return (
      <Box
        sx={{
          width: '100%',
          textAlign: 'center',
          py: 6,
          px: 3,
        }}
      >
        <Typography sx={{ fontSize: '3rem', mb: 2 }}>📋</Typography>
        <Typography variant="h5" sx={{ color: 'rgba(255,255,255,0.5)', mb: 1, fontWeight: 600 }}>
          No MCQ Questions
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.3)', mb: 4 }}>
          There are no multiple-choice questions for this challenge.<br />
          You may proceed directly to the coding section.
        </Typography>
        <Button
          variant="contained"
          onClick={submitTest}
          sx={{
            background: 'linear-gradient(135deg, #6366f1, #14b8a6)',
            borderRadius: '10px',
            px: 4,
            py: 1.2,
            fontWeight: 700,
            textTransform: 'none',
            boxShadow: 'none',
          }}
        >
          🚀 Proceed to Coding Section
        </Button>
      </Box>
    );
  }

  const currentQ = questions[currentQuestion];
  const progressPercent = ((currentQuestion) / questions.length) * 100;

  const handleOptionSelect = (optionId) => {
    setSelectedOption(optionId);
  };

  const handleNextQuestion = async () => {
    let isCorrect = false;
    if (currentQ && currentQ.options) {
      const correctOption = currentQ.options.find((o) => o.isCorrect);
      if (correctOption && selectedOption) {
        isCorrect = correctOption._id === selectedOption;
      }
    }

    setAnswers((prev) => {
      const newMap = new Map(prev);
      newMap.set(currentQ._id, selectedOption);
      return newMap;
    });
    setAnsweredSet((prev) => new Set([...prev, currentQuestion]));

    if (isCorrect) {
      setScore(score + 1);
      saveUserTestScore();
    }

    if (isLastQuestion) {
      try {
        const answersObject = Object.fromEntries(answers);
        if (selectedOption) answersObject[currentQ._id] = selectedOption;
        await axiosInstance.post('/api/users/results', { examId, answers: answersObject }, { withCredentials: true });
        navigate(`/exam/${examId}/codedetails`);
      } catch (error) {
        console.error('Error saving results:', error);
        toast.error('Failed to save results. Please try again.');
      }
    }

    setSelectedOption(null);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  return (
    <Box sx={{ width: '100%', p: { xs: 2, sm: 3 } }}>
      {/* ── Top Progress ── */}
      <Box mb={3}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Chip
              label={`Q ${currentQuestion + 1} / ${questions.length}`}
              size="small"
              sx={{
                background: 'rgba(99,102,241,0.2)',
                color: '#a5b4fc',
                border: '1px solid rgba(99,102,241,0.3)',
                fontWeight: 700,
                fontSize: '0.72rem',
                height: 22,
              }}
            />
            <Chip
              label={`Score: ${score}`}
              size="small"
              sx={{
                background: 'rgba(34,197,94,0.12)',
                color: '#4ade80',
                border: '1px solid rgba(34,197,94,0.2)',
                fontWeight: 600,
                fontSize: '0.65rem',
                height: 22,
              }}
            />
          </Box>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.65rem' }}>
            {answeredSet.size} answered
          </Typography>
        </Stack>
        <LinearProgress
          variant="determinate"
          value={progressPercent}
          sx={{
            height: 4,
            borderRadius: 2,
            background: 'rgba(255,255,255,0.06)',
            '& .MuiLinearProgress-bar': {
              background: 'linear-gradient(90deg, #6366f1, #14b8a6)',
              borderRadius: 2,
            },
          }}
        />
      </Box>

      {/* ── Question Text ── */}
      <Box
        sx={{
          mb: 3,
          p: 2.5,
          borderRadius: 2,
          background: 'rgba(99,102,241,0.06)',
          border: '1px solid rgba(99,102,241,0.15)',
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: '#a5b4fc',
            fontSize: '0.65rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            display: 'block',
            mb: 1,
          }}
        >
          Question {currentQuestion + 1}
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: '#e2e8f0',
            fontWeight: 600,
            lineHeight: 1.5,
            fontSize: { xs: '0.95rem', sm: '1.05rem' },
          }}
        >
          {currentQ?.question}
        </Typography>
      </Box>

      {/* ── Answer Options ── */}
      <Stack spacing={1.5} mb={3}>
        {(currentQ?.options || []).map((option, idx) => {
          const isSelected = selectedOption === option._id;
          const optLetters = ['A', 'B', 'C', 'D'];

          return (
            <Box
              key={option._id}
              onClick={() => handleOptionSelect(option._id)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                p: 1.8,
                borderRadius: 2,
                cursor: 'pointer',
                background: isSelected
                  ? 'rgba(99,102,241,0.2)'
                  : 'rgba(255,255,255,0.03)',
                border: isSelected
                  ? '1.5px solid rgba(99,102,241,0.6)'
                  : '1px solid rgba(255,255,255,0.08)',
                transition: 'all 0.18s ease',
                userSelect: 'none',
                '&:hover': {
                  background: isSelected
                    ? 'rgba(99,102,241,0.25)'
                    : 'rgba(255,255,255,0.06)',
                  border: isSelected
                    ? '1.5px solid rgba(99,102,241,0.7)'
                    : '1px solid rgba(255,255,255,0.15)',
                  transform: 'translateX(2px)',
                },
              }}
            >
              {/* Option letter badge */}
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '8px',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: isSelected
                    ? 'linear-gradient(135deg, #6366f1, #4f46e5)'
                    : 'rgba(255,255,255,0.06)',
                  color: isSelected ? '#fff' : 'rgba(255,255,255,0.5)',
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  transition: 'all 0.18s ease',
                }}
              >
                {optLetters[idx] || idx + 1}
              </Box>
              <Typography
                variant="body2"
                sx={{
                  color: isSelected ? '#e0e7ff' : 'rgba(255,255,255,0.65)',
                  fontWeight: isSelected ? 600 : 400,
                  lineHeight: 1.4,
                  transition: 'all 0.18s ease',
                }}
              >
                {option.optionText}
              </Typography>
              {isSelected && (
                <Box sx={{ ml: 'auto', flexShrink: 0 }}>
                  <Typography sx={{ fontSize: '1rem' }}>✓</Typography>
                </Box>
              )}
            </Box>
          );
        })}
      </Stack>

      {/* ── Navigation ── */}
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.65rem' }}>
          Select an option to continue
        </Typography>
        <Button
          variant="contained"
          onClick={handleNextQuestion}
          disabled={selectedOption === null}
          sx={{
            background: 'linear-gradient(135deg, #6366f1, #14b8a6)',
            borderRadius: '10px',
            px: 3,
            py: 1,
            fontWeight: 700,
            fontSize: '0.85rem',
            textTransform: 'none',
            boxShadow: 'none',
            letterSpacing: '0.02em',
            '&:disabled': {
              background: 'rgba(255,255,255,0.06)',
              color: 'rgba(255,255,255,0.2)',
            },
            '&:hover': {
              background: 'linear-gradient(135deg, #4f46e5, #0f9d8a)',
              boxShadow: 'none',
              transform: 'translateY(-1px)',
            },
            transition: 'all 0.2s ease',
          }}
        >
          {isLastQuestion ? '🚀 Go to Coding →' : 'Next Question →'}
        </Button>
      </Stack>
    </Box>
  );
}
