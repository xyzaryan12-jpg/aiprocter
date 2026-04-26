import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Grid, CircularProgress, Typography, LinearProgress } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import MultipleChoiceQuestion from './Components/MultipleChoiceQuestion';
import NumberOfQuestions from './Components/NumberOfQuestions';
import WebCam from './Components/WebCam';
import { useGetExamsQuery, useGetQuestionsQuery } from '../../slices/examApiSlice';
import { useSaveCheatingLogMutation } from 'src/slices/cheatingLogApiSlice';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useCheatingLog } from 'src/context/CheatingLogContext';

const TestPage = () => {
  const { examId, testId } = useParams();
  const [selectedExam, setSelectedExam] = useState(null);
  const [examDurationInSeconds, setExamDurationInSeconds] = useState(0);
  const { data: userExamdata, isLoading: isExamsLoading } = useGetExamsQuery();
  const { userInfo } = useSelector((state) => state.auth);
  const { cheatingLog, updateCheatingLog, resetCheatingLog } = useCheatingLog();
  const [saveCheatingLogMutation] = useSaveCheatingLogMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMcqCompleted, setIsMcqCompleted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    if (userExamdata) {
      const exam = userExamdata.find((exam) => exam.examId === examId);
      if (exam) {
        setSelectedExam(exam);
        setExamDurationInSeconds(exam.duration);
      }
    }
  }, [userExamdata, examId]);

  const [questions, setQuestions] = useState([]);
  const { data, isLoading } = useGetQuestionsQuery(examId);
  const [score, setScore] = useState(0);
  const navigate = useNavigate();
  const [tabSwitchWarning, setTabSwitchWarning] = useState(false);

  useEffect(() => {
    if (data) setQuestions(data);
  }, [data]);

  // Tab switch detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        updateCheatingLog({
          tabSwitchCount: (cheatingLog.tabSwitchCount || 0) + 1,
        });
        setTabSwitchWarning(true);
        toast.warning('⚠️ Tab switch detected! This has been logged.', {
          position: 'top-center',
          autoClose: 3000,
        });
      }
    };

    const handleWindowBlur = () => {
      updateCheatingLog({
        tabSwitchCount: (cheatingLog.tabSwitchCount || 0) + 1,
      });
      setTabSwitchWarning(true);
      toast.warning('⚠️ Window focus lost! This has been logged.', {
        position: 'top-center',
        autoClose: 3000,
      });
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [cheatingLog.tabSwitchCount, updateCheatingLog]);

  const handleMcqCompletion = () => {
    setIsMcqCompleted(true);
    resetCheatingLog(examId);
    navigate(`/exam/${examId}/codedetails`);
  };

  const handleTestSubmission = async () => {
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);
      const updatedLog = {
        ...cheatingLog,
        username: userInfo.name,
        email: userInfo.email,
        examId: examId,
        noFaceCount: parseInt(cheatingLog.noFaceCount) || 0,
        multipleFaceCount: parseInt(cheatingLog.multipleFaceCount) || 0,
        cellPhoneCount: parseInt(cheatingLog.cellPhoneCount) || 0,
        prohibitedObjectCount: parseInt(cheatingLog.prohibitedObjectCount) || 0,
        tabSwitchCount: parseInt(cheatingLog.tabSwitchCount) || 0,
      };
      await saveCheatingLogMutation(updatedLog).unwrap();
      toast.success('✅ Challenge submitted successfully!');
      navigate('/Success');
    } catch (error) {
      toast.error(error?.data?.message || error?.message || 'Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveUserTestScore = () => setScore(score + 1);

  if (isExamsLoading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        sx={{ background: '#0a0e1a' }}
        gap={2}
      >
        <CircularProgress sx={{ color: '#6366f1' }} size={48} />
        <Typography sx={{ color: 'rgba(255,255,255,0.5)' }}>Loading challenge...</Typography>
      </Box>
    );
  }

  return (
    <PageContainer title="HackProctor — Challenge in Progress" description="Proctored hackathon evaluation">
      {/* Top progress bar for exam brand */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          height: 3,
          background: 'linear-gradient(90deg, #6366f1, #14b8a6)',
        }}
      />

      <Box
        pt="3rem"
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(180deg, rgba(10,14,26,0.3) 0%, transparent 100%)',
        }}
      >
        {/* Exam header strip */}
        {selectedExam && (
          <Box
            sx={{
              mb: 3,
              p: 2,
              borderRadius: 2,
              background: 'rgba(99,102,241,0.08)',
              border: '1px solid rgba(99,102,241,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 1,
            }}
          >
            <Box>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                🏆 HackProctor — Active Challenge
              </Typography>
              <Typography variant="h6" sx={{ color: '#e0e7ff', fontWeight: 700, lineHeight: 1.2 }}>
                {selectedExam.examName}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" sx={{ color: '#a5b4fc', fontWeight: 800 }}>
                  {questions.length}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.6rem' }}>
                  Questions
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" sx={{ color: '#5eead4', fontWeight: 800 }}>
                  {selectedExam.duration}m
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.6rem' }}>
                  Duration
                </Typography>
              </Box>
            </Box>
          </Box>
        )}

        <Grid container spacing={3}>
          {/* ── MCQ Question Area ── */}
          <Grid item xs={12} md={7} lg={7}>
            <Box
              sx={{
                background: 'linear-gradient(145deg, #0f172a, #1e293b)',
                borderRadius: 3,
                border: '1px solid rgba(255,255,255,0.08)',
                minHeight: '420px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                p: 2,
              }}
            >
              {isLoading ? (
                <Box textAlign="center">
                  <CircularProgress sx={{ color: '#6366f1' }} size={40} />
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', display: 'block', mt: 1 }}>
                    Loading questions...
                  </Typography>
                </Box>
              ) : (
                <MultipleChoiceQuestion
                  submitTest={isMcqCompleted ? handleTestSubmission : handleMcqCompletion}
                  questions={questions}
                  saveUserTestScore={saveUserTestScore}
                  currentQuestionIndex={currentQuestionIndex}
                  setCurrentQuestionIndex={setCurrentQuestionIndex}
                />
              )}
            </Box>
          </Grid>

          {/* ── Right Panel: Timer + Webcam ── */}
          <Grid item xs={12} md={5} lg={5}>
            <Grid container spacing={3}>
              {/* Timer / Question Navigator */}
              <Grid item xs={12}>
                <NumberOfQuestions
                  questionLength={questions.length}
                  submitTest={isMcqCompleted ? handleTestSubmission : handleMcqCompletion}
                  examDurationInSeconds={examDurationInSeconds}
                />
              </Grid>

              {/* Webcam */}
              <Grid item xs={12}>
                <Box
                  sx={{
                    background: 'linear-gradient(145deg, #0f172a, #1e293b)',
                    borderRadius: 3,
                    border: '1px solid rgba(255,255,255,0.08)',
                    p: 2,
                    overflow: 'hidden',
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'rgba(255,255,255,0.4)',
                      fontSize: '0.65rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      display: 'block',
                      mb: 1,
                    }}
                  >
                    👁 AI Webcam Monitor
                  </Typography>
                  <WebCam cheatingLog={cheatingLog} updateCheatingLog={updateCheatingLog} />
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default TestPage;
