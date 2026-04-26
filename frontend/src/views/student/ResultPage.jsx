import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Grid, CircularProgress, Chip, Stack, Avatar,
  LinearProgress, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, IconButton, TextField, InputAdornment, Select,
  MenuItem, Paper, Tooltip, Divider, Tabs, Tab, Alert,
} from '@mui/material';
import {
  Visibility, VisibilityOff, Code, CheckCircle, Cancel,
  Grade as GradeIcon, Send as SendIcon,
} from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import LockIcon from '@mui/icons-material/Lock';
import PageContainer from 'src/components/container/PageContainer';
import axiosInstance from '../../axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

// ── helpers ─────────────────────────────────────────────────
const scoreChipColor = (pct) => pct >= 75 ? 'success' : pct >= 50 ? 'warning' : 'error';
const gradeLabel     = (pct) => {
  if (pct >= 90) return { label: 'Excellent',   emoji: '🏆' };
  if (pct >= 75) return { label: 'Shortlisted', emoji: '✅' };
  if (pct >= 50) return { label: 'Average',     emoji: '⚠️' };
  return               { label: 'Below Cutoff', emoji: '❌' };
};

function StatCard({ label, value, bg, color }) {
  return (
    <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, background: bg, border: `1px solid ${color}30`, textAlign: 'center' }}>
      <Typography variant="caption" sx={{ color: '#5A6A85', fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', mb: 0.5 }}>
        {label}
      </Typography>
      <Typography sx={{ fontWeight: 800, fontSize: '1.8rem', lineHeight: 1, color }}>
        {value}
      </Typography>
    </Paper>
  );
}

// ───────────────────────────────────────────────── EvaluationDialog (teacher)
function EvaluationDialog({ open, onClose, result, onGraded }) {
  const [tab, setTab]               = useState(0);
  const [codingMarks, setCodingMarks] = useState('');
  const [feedback, setFeedback]     = useState('');
  const [releasing, setReleasing]   = useState(false);
  const [saving, setSaving]         = useState(false);

  useEffect(() => {
    if (result) {
      setCodingMarks(result.codingMarks ?? '');
      setFeedback(result.feedback ?? '');
    }
  }, [result]);

  if (!result) return null;

  const mcqPct  = result.percentage || 0;
  const mcqColor = scoreChipColor(mcqPct);
  const grade   = gradeLabel(mcqPct);
  const correctCount = result.mcqReview?.filter((q) => q.isCorrect).length || 0;
  const totalQ       = result.mcqReview?.length || 0;

  const handleSaveGrade = async (releaseNow = false) => {
    try {
      setSaving(true);
      await axiosInstance.put(
        `/api/users/results/${result._id}/grade`,
        { codingMarks: Number(codingMarks) || 0, feedback, releaseToStudent: releaseNow || result.showToStudent },
        { withCredentials: true }
      );
      toast.success(releaseNow ? '✅ Graded & released to candidate!' : '💾 Evaluation saved!');
      onGraded();
      if (releaseNow) onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to save evaluation');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      {/* ── Header ── */}
      <DialogTitle sx={{ pb: 1, borderBottom: '1px solid #e5eaef' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="h6" fontWeight={800} color="#2A3547">
              📋 Candidate Evaluation
            </Typography>
            <Stack direction="row" spacing={1} mt={0.5} alignItems="center">
              <Avatar sx={{ width: 24, height: 24, fontSize: '0.65rem', fontWeight: 700, background: 'linear-gradient(135deg, #5D87FF, #13DEB9)' }}>
                {(result.userId?.name || '?')[0].toUpperCase()}
              </Avatar>
              <Typography variant="body2" color="textSecondary">
                {result.userId?.name} · {result.userId?.email}
              </Typography>
              <Chip label={`${grade.emoji} ${grade.label}`} size="small" color={mcqColor} sx={{ fontWeight: 700 }} />
            </Stack>
          </Box>
          <IconButton onClick={onClose}><CloseIcon /></IconButton>
        </Stack>
      </DialogTitle>

      {/* ── Score summary banner ── */}
      <Box sx={{ px: 3, py: 1.5, background: '#F8FAFC', borderBottom: '1px solid #e5eaef' }}>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <Box textAlign="center">
              <Typography variant="caption" sx={{ color: '#5A6A85', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>MCQ Score</Typography>
              <Typography fontWeight={800} sx={{ color: '#5D87FF', fontSize: '1.4rem' }}>{mcqPct.toFixed(0)}%</Typography>
            </Box>
          </Grid>
          <Grid item xs={3}>
            <Box textAlign="center">
              <Typography variant="caption" sx={{ color: '#5A6A85', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Correct / Total</Typography>
              <Typography fontWeight={800} sx={{ color: '#2A3547', fontSize: '1.4rem' }}>{correctCount}/{totalQ}</Typography>
            </Box>
          </Grid>
          <Grid item xs={3}>
            <Box textAlign="center">
              <Typography variant="caption" sx={{ color: '#5A6A85', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>MCQ Marks</Typography>
              <Typography fontWeight={800} sx={{ color: '#13DEB9', fontSize: '1.4rem' }}>{result.totalMarks || 0}</Typography>
            </Box>
          </Grid>
          <Grid item xs={3}>
            <Box textAlign="center">
              <Typography variant="caption" sx={{ color: '#5A6A85', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Total Score</Typography>
              <Typography fontWeight={800} sx={{ color: '#FFAE1F', fontSize: '1.4rem' }}>
                {(result.totalMarks || 0) + (Number(codingMarks) || result.codingMarks || 0)}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* ── Tabs ── */}
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ px: 3, borderBottom: '1px solid #e5eaef', minHeight: 44 }} TabIndicatorProps={{ style: { height: 3 } }}>
        <Tab label={`MCQ Answers (${totalQ})`} sx={{ textTransform: 'none', fontWeight: 600, minHeight: 44 }} />
        <Tab label={`Code Submissions (${result.codingSubmissions?.length || 0})`} sx={{ textTransform: 'none', fontWeight: 600, minHeight: 44 }} />
        <Tab label="🎯 Evaluate & Grade" sx={{ textTransform: 'none', fontWeight: 700, minHeight: 44, color: '#5D87FF' }} />
      </Tabs>

      <DialogContent sx={{ pt: 2.5, maxHeight: '52vh', overflowY: 'auto' }}>

        {/* ── Tab 0: MCQ Review ── */}
        {tab === 0 && (
          <Stack spacing={2}>
            {!result.mcqReview?.length ? (
              <Typography color="textSecondary" textAlign="center" py={3}>No MCQ questions for this exam.</Typography>
            ) : result.mcqReview.map((q, i) => (
              <Paper key={q.questionId} elevation={0} sx={{ p: 2, borderRadius: 2, border: `1px solid ${q.isCorrect ? '#13DEB930' : '#FA896B30'}`, background: q.isCorrect ? '#E6FFFA' : '#FDEDE8' }}>
                <Stack direction="row" spacing={1} alignItems="flex-start" mb={1.5}>
                  <Chip label={`Q${i + 1}`} size="small" color="primary" sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700 }} />
                  <Typography variant="body2" sx={{ color: '#2A3547', fontWeight: 600, flex: 1 }}>{q.questionText}</Typography>
                  {q.isCorrect
                    ? <CheckCircle sx={{ color: '#13DEB9', flexShrink: 0 }} />
                    : <Cancel sx={{ color: '#FA896B', flexShrink: 0 }} />
                  }
                </Stack>

                <Grid container spacing={1.5}>
                  {q.options.map((opt) => {
                    const isSelected = opt._id?.toString() === q.selectedOptionId?.toString();
                    const isCorrect  = opt.isCorrect;
                    let bg = '#fff', border = '1px solid #e5eaef', color = '#2A3547';
                    if (isCorrect)              { bg = '#E6FFFA'; border = '1px solid #13DEB9'; color = '#00796b'; }
                    if (isSelected && !isCorrect){ bg = '#FDEDE8'; border = '1px solid #FA896B'; color = '#b71c1c'; }
                    return (
                      <Grid item xs={6} key={opt._id}>
                        <Box sx={{ p: 1, borderRadius: 1.5, background: bg, border, display: 'flex', alignItems: 'center', gap: 0.8 }}>
                          {isCorrect  && <CheckCircle sx={{ color: '#13DEB9', fontSize: '0.9rem' }} />}
                          {isSelected && !isCorrect && <Cancel sx={{ color: '#FA896B', fontSize: '0.9rem' }} />}
                          <Typography variant="caption" sx={{ color, fontWeight: isSelected || isCorrect ? 700 : 400, fontSize: '0.75rem' }}>
                            {opt.optionText}
                          </Typography>
                        </Box>
                      </Grid>
                    );
                  })}
                </Grid>

                <Stack direction="row" spacing={2} mt={1.5}>
                  <Typography variant="caption" sx={{ color: '#5A6A85', fontSize: '0.68rem' }}>
                    <b>Selected:</b> {q.selectedOptionText || 'Not answered'}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#5A6A85', fontSize: '0.68rem' }}>
                    <b>Correct:</b> {q.correctOptionText}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#5A6A85', fontSize: '0.68rem' }}>
                    <b>Marks:</b> {q.isCorrect ? `+${q.marks}` : '0'}/{q.marks}
                  </Typography>
                </Stack>
              </Paper>
            ))}
          </Stack>
        )}

        {/* ── Tab 1: Code Submissions ── */}
        {tab === 1 && (
          <Box>
            {!result.codingSubmissions?.length ? (
              <Box textAlign="center" py={4}>
                <Typography sx={{ fontSize: '2rem', mb: 1 }}>💻</Typography>
                <Typography color="textSecondary">No coding submissions for this candidate.</Typography>
              </Box>
            ) : result.codingSubmissions.map((sub, i) => (
              <Box key={i} mb={3}>
                <Paper elevation={0} sx={{ p: 2, mb: 1.5, borderRadius: 2, border: '1px solid #e5eaef', background: '#F8FAFC' }}>
                  <Stack direction="row" spacing={1} mb={1} alignItems="center" flexWrap="wrap" gap={0.5}>
                    <Chip label={`Q${i + 1}`} size="small" color="primary" sx={{ height: 20, fontWeight: 700, fontSize: '0.65rem' }} />
                    <Chip label={sub.language || 'unknown'} size="small" color="info" variant="outlined" />
                    <Chip label={sub.status || 'pending'} size="small" color={sub.status === 'passed' ? 'success' : 'warning'} variant="outlined" />
                  </Stack>
                  {sub.question && (
                    <Typography variant="body2" sx={{ color: '#2A3547', fontWeight: 600, mb: 0.5 }}>
                      {sub.question}
                    </Typography>
                  )}
                  {sub.description && (
                    <Typography variant="caption" color="textSecondary">{sub.description}</Typography>
                  )}
                </Paper>
                {sub.code ? (
                  <Box sx={{ borderRadius: 2, overflow: 'hidden', border: '1px solid #e5eaef' }}>
                    <SyntaxHighlighter language={sub.language || 'python'} style={atomOneDark} customStyle={{ margin: 0, fontSize: '0.82rem', maxHeight: 280 }}>
                      {sub.code}
                    </SyntaxHighlighter>
                  </Box>
                ) : (
                  <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px dashed #e5eaef', textAlign: 'center' }}>
                    <Typography variant="caption" color="textSecondary">No code submitted</Typography>
                  </Paper>
                )}
              </Box>
            ))}
          </Box>
        )}

        {/* ── Tab 2: Evaluate & Grade ── */}
        {tab === 2 && (
          <Box>
            <Alert severity="info" sx={{ mb: 2.5, borderRadius: 2 }}>
              MCQ marks of <b>{result.totalMarks || 0}</b> are auto-calculated. Assign additional marks for coding quality below.
            </Alert>

            {/* Coding marks */}
            <Paper elevation={0} sx={{ p: 2.5, mb: 2.5, borderRadius: 2, border: '1px solid #e5eaef' }}>
              <Typography variant="subtitle2" fontWeight={700} color="#2A3547" mb={1.5}>
                🎯 Coding Evaluation Marks
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="flex-start">
                <Box flex={1}>
                  <Typography variant="caption" color="textSecondary" display="block" mb={0.5}>
                    Assign marks for code quality, logic & approach
                  </Typography>
                  <TextField
                    type="number"
                    size="small"
                    fullWidth
                    value={codingMarks}
                    onChange={(e) => setCodingMarks(e.target.value)}
                    placeholder="e.g. 20"
                    inputProps={{ min: 0, max: 100 }}
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><GradeIcon sx={{ color: '#5A6A85', fontSize: '1rem' }} /></InputAdornment>,
                    }}
                  />
                </Box>
                <Paper elevation={0} sx={{ p: 2, borderRadius: 2, background: '#ECF2FF', border: '1px solid #5D87FF30', textAlign: 'center', minWidth: 130 }}>
                  <Typography variant="caption" sx={{ color: '#5D87FF', fontWeight: 600, fontSize: '0.65rem', display: 'block' }}>TOTAL SCORE</Typography>
                  <Typography sx={{ color: '#5D87FF', fontWeight: 800, fontSize: '2rem', lineHeight: 1 }}>
                    {(result.totalMarks || 0) + (Number(codingMarks) || 0)}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#5A6A85', fontSize: '0.6rem' }}>
                    MCQ {result.totalMarks || 0} + Code {Number(codingMarks) || 0}
                  </Typography>
                </Paper>
              </Stack>
            </Paper>

            {/* Evaluation criteria reference */}
            <Paper elevation={0} sx={{ p: 2, mb: 2.5, borderRadius: 2, border: '1px solid #e5eaef', background: '#FFFBF0' }}>
              <Typography variant="subtitle2" fontWeight={700} color="#2A3547" mb={1}>
                📌 Evaluation Parameters
              </Typography>
              <Grid container spacing={1}>
                {[
                  { param: 'Code Correctness',     range: '0–40%', desc: 'Does the code give the right output?' },
                  { param: 'Logic & Approach',     range: '0–30%', desc: 'Is the algorithm efficient?' },
                  { param: 'Code Quality',          range: '0–20%', desc: 'Clean, readable, well-structured?' },
                  { param: 'Edge Case Handling',    range: '0–10%', desc: 'Handles null/empty/boundary inputs?' },
                ].map(({ param, range, desc }) => (
                  <Grid item xs={12} sm={6} key={param}>
                    <Box sx={{ p: 1.5, borderRadius: 1.5, background: '#fff', border: '1px solid #e5eaef' }}>
                      <Stack direction="row" justifyContent="space-between" mb={0.3}>
                        <Typography variant="caption" fontWeight={700} color="#2A3547" fontSize="0.75rem">{param}</Typography>
                        <Chip label={range} size="small" color="warning" variant="outlined" sx={{ height: 18, fontSize: '0.6rem', fontWeight: 700 }} />
                      </Stack>
                      <Typography variant="caption" color="textSecondary" fontSize="0.68rem">{desc}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Paper>

            {/* Feedback */}
            <Paper elevation={0} sx={{ p: 2.5, borderRadius: 2, border: '1px solid #e5eaef' }}>
              <Typography variant="subtitle2" fontWeight={700} color="#2A3547" mb={1}>
                💬 Teacher Feedback
              </Typography>
              <TextField
                multiline
                rows={4}
                fullWidth
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Write feedback for the candidate — what they did well, areas to improve, shortlisting decision..."
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Paper>
          </Box>
        )}
      </DialogContent>

      {/* ── Footer Actions ── */}
      <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid #e5eaef', gap: 1, flexWrap: 'wrap' }}>
        {tab === 2 && (
          <>
            <Box sx={{ mr: 'auto' }}>
              <Chip
                icon={result.showToStudent ? <Visibility /> : <LockIcon />}
                label={result.showToStudent ? 'Released to candidate' : 'Not yet released'}
                color={result.showToStudent ? 'success' : 'default'}
                variant="outlined"
                size="small"
              />
            </Box>
            <Button onClick={() => onClose()} disabled={saving} variant="outlined" sx={{ textTransform: 'none', borderRadius: 2 }}>
              Cancel
            </Button>
            <Button
              onClick={() => handleSaveGrade(false)}
              disabled={saving}
              variant="outlined"
              color="primary"
              sx={{ textTransform: 'none', borderRadius: 2, fontWeight: 600 }}
            >
              {saving ? 'Saving...' : '💾 Save (Not Released)'}
            </Button>
            <Button
              onClick={() => handleSaveGrade(true)}
              disabled={saving}
              variant="contained"
              color="primary"
              startIcon={<SendIcon />}
              sx={{ textTransform: 'none', borderRadius: 2, fontWeight: 700 }}
            >
              {saving ? 'Releasing...' : '🚀 Save & Release to Candidate'}
            </Button>
          </>
        )}
        {tab !== 2 && (
          <>
            <Button onClick={onClose} sx={{ textTransform: 'none' }}>Close</Button>
            <Button onClick={() => setTab(2)} variant="contained" color="primary" sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2 }}>
              Go to Evaluate →
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}

// ──────────────────────────────────────────── ResultPage main component
const ResultPage = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const isTeacher = userInfo?.role === 'teacher';

  const [results, setResults]         = useState([]);
  const [exams, setExams]             = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [searchTerm, setSearchTerm]   = useState('');
  const [selectedExam, setSelectedExam] = useState('all');
  const [evalDialog, setEvalDialog]   = useState(false);
  const [activeResult, setActiveResult] = useState(null);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const examsRes = await axiosInstance.get('/api/users/exam', { withCredentials: true });
      setExams(examsRes.data);
      const endpoint = isTeacher ? '/api/users/results/all' : '/api/users/results/user';
      const res = await axiosInstance.get(endpoint, { withCredentials: true });
      setResults(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch results');
      toast.error('Failed to fetch results');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, [userInfo]);

  const filteredResults = results.filter((r) => {
    const name  = r.userId?.name  || userInfo?.name  || '';
    const email = r.userId?.email || userInfo?.email || '';
    const matchSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchExam = selectedExam === 'all' ||
      r.examId === selectedExam || r.examId?._id === selectedExam;
    return matchSearch && matchExam;
  });

  const avgPct      = filteredResults.length ? filteredResults.reduce((a, r) => a + (r.percentage || 0), 0) / filteredResults.length : 0;
  const shortlisted = filteredResults.filter((r) => (r.percentage || 0) >= 75).length;
  const graded      = filteredResults.filter((r) => r.gradedAt).length;

  if (loading) return <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh"><CircularProgress /></Box>;
  if (error)   return <Box p={4} textAlign="center"><Typography color="error">{error}</Typography><Button onClick={fetchAll} sx={{ mt: 2 }}>Retry</Button></Box>;

  // ═══════════════════════════════ STUDENT VIEW ══════════════════
  if (!isTeacher) {
    const released = results.filter((r) => r.showToStudent);
    const pending  = results.filter((r) => !r.showToStudent);

    return (
      <PageContainer title="HackProctor — My Results" description="Your hackathon exam results">
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#2A3547', mb: 0.5 }}>
            📊 My Results
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            Results are released by the organizer after evaluation
          </Typography>

          {/* Stats */}
          <Grid container spacing={2.5} mb={3}>
            <Grid item xs={6} sm={3}><StatCard label="Challenges Taken"   value={results.length}                    bg="#ECF2FF" color="#5D87FF" /></Grid>
            <Grid item xs={6} sm={3}><StatCard label="Results Released"   value={released.length}                   bg="#E6FFFA" color="#13DEB9" /></Grid>
            <Grid item xs={6} sm={3}><StatCard label="Pending Evaluation" value={pending.length}                    bg="#FEF5E5" color="#FFAE1F" /></Grid>
            <Grid item xs={6} sm={3}><StatCard label="Shortlisted (≥75%)" value={released.filter(r => (r.percentage||0) >= 75).length} bg="#f3fef3" color="#2e7d32" /></Grid>
          </Grid>

          {/* Pending notice */}
          {pending.length > 0 && (
            <Alert severity="info" icon={<LockIcon />} sx={{ mb: 2.5, borderRadius: 2 }}>
              <strong>{pending.length} submission{pending.length > 1 ? 's' : ''} pending organizer evaluation.</strong> You'll see marks here once the organizer grades and releases them.
            </Alert>
          )}

          {results.length === 0 ? (
            <Paper elevation={0} sx={{ p: 8, textAlign: 'center', border: '1px solid #e5eaef', borderRadius: 3 }}>
              <Typography sx={{ fontSize: '3rem', mb: 1 }}>🎯</Typography>
              <Typography color="textSecondary">Complete a challenge to see results here.</Typography>
            </Paper>
          ) : (
            <Stack spacing={2.5}>
              {results.map((result) => {
                const isReleased = result.showToStudent;
                const pct        = result.percentage || 0;
                const chipColor  = scoreChipColor(pct);
                const grade      = gradeLabel(pct);
                const examName   = result.examId?.examName || 'Hackathon Challenge';
                const totalScore = (result.totalMarks || 0) + (result.codingMarks || 0);

                return (
                  <Paper key={result._id} elevation={0} sx={{ borderRadius: 3, border: `1px solid ${isReleased ? '#e5eaef' : '#FFAE1F40'}`, overflow: 'hidden' }}>
                    <LinearProgress variant="determinate" value={Math.min(pct, 100)} color={chipColor} sx={{ height: 4 }} />
                    <Box sx={{ p: 3 }}>
                      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ sm: 'flex-start' }} gap={2}>
                        <Box flex={1}>
                          <Stack direction="row" alignItems="center" spacing={1} mb={0.5} flexWrap="wrap" gap={0.5}>
                            <Typography variant="h6" sx={{ color: '#2A3547', fontWeight: 700 }}>{examName}</Typography>
                            {isReleased
                              ? <Chip label={`${grade.emoji} ${grade.label}`} color={chipColor} size="small" sx={{ fontWeight: 700 }} />
                              : <Chip icon={<LockIcon />} label="Pending Evaluation" color="warning" size="small" variant="outlined" sx={{ fontWeight: 600 }} />
                            }
                          </Stack>
                          <Typography variant="caption" color="textSecondary">
                            Submitted: {new Date(result.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                          </Typography>
                          {result.gradedAt && (
                            <Typography variant="caption" color="textSecondary" display="block">
                              Evaluated: {new Date(result.gradedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                            </Typography>
                          )}
                        </Box>

                        {/* Score ring — only when released */}
                        {isReleased && (
                          <Box textAlign="center" flexShrink={0}>
                            <Box sx={{ position: 'relative', width: 72, height: 72, mx: 'auto' }}>
                              <CircularProgress variant="determinate" value={100} size={72} sx={{ color: '#F2F6FA', position: 'absolute', top: 0, left: 0 }} />
                              <CircularProgress variant="determinate" value={Math.min(pct, 100)} size={72} color={chipColor} sx={{ position: 'absolute', top: 0, left: 0 }} />
                              <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Typography sx={{ fontWeight: 800, fontSize: '0.9rem', lineHeight: 1, color: pct >= 75 ? '#2e7d32' : pct >= 50 ? '#e65100' : '#c62828' }}>
                                  {pct.toFixed(0)}%
                                </Typography>
                              </Box>
                            </Box>
                            <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.6rem' }}>MCQ Score</Typography>
                          </Box>
                        )}
                      </Stack>

                      {/* Marks — only show when released */}
                      {isReleased ? (
                        <>
                          <Grid container spacing={2} mt={1.5}>
                            <Grid item xs={4}>
                              <Paper elevation={0} sx={{ p: 1.5, borderRadius: 2, background: '#ECF2FF', border: '1px solid #5D87FF20', textAlign: 'center' }}>
                                <Typography variant="caption" sx={{ color: '#5A6A85', fontSize: '0.62rem', display: 'block' }}>MCQ Marks</Typography>
                                <Typography sx={{ color: '#5D87FF', fontWeight: 800, fontSize: '1.3rem' }}>{result.totalMarks ?? 0}</Typography>
                              </Paper>
                            </Grid>
                            <Grid item xs={4}>
                              <Paper elevation={0} sx={{ p: 1.5, borderRadius: 2, background: '#FEF5E5', border: '1px solid #FFAE1F20', textAlign: 'center' }}>
                                <Typography variant="caption" sx={{ color: '#5A6A85', fontSize: '0.62rem', display: 'block' }}>Coding Marks</Typography>
                                <Typography sx={{ color: '#FFAE1F', fontWeight: 800, fontSize: '1.3rem' }}>{result.codingMarks ?? 0}</Typography>
                              </Paper>
                            </Grid>
                            <Grid item xs={4}>
                              <Paper elevation={0} sx={{ p: 1.5, borderRadius: 2, background: '#E6FFFA', border: '1px solid #13DEB920', textAlign: 'center' }}>
                                <Typography variant="caption" sx={{ color: '#5A6A85', fontSize: '0.62rem', display: 'block' }}>Total Score</Typography>
                                <Typography sx={{ color: '#13DEB9', fontWeight: 800, fontSize: '1.3rem' }}>{totalScore}</Typography>
                              </Paper>
                            </Grid>
                          </Grid>

                          {/* Cutoff bar */}
                          <Box mt={2}>
                            <Stack direction="row" justifyContent="space-between" mb={0.5}>
                              <Typography variant="caption" color="textSecondary" fontSize="0.65rem">MCQ progress</Typography>
                              <Typography variant="caption" sx={{ color: '#5A6A85', fontSize: '0.65rem', fontWeight: 600 }}>Shortlist cutoff: 75%</Typography>
                            </Stack>
                            <LinearProgress variant="determinate" value={Math.min(pct, 100)} color={chipColor} sx={{ height: 6, borderRadius: 3, background: '#F2F6FA' }} />
                          </Box>

                          {/* Teacher feedback */}
                          {result.feedback && (
                            <Paper elevation={0} sx={{ mt: 2, p: 2, borderRadius: 2, background: '#FFFBF0', border: '1px solid #FFAE1F30' }}>
                              <Typography variant="caption" sx={{ color: '#FFAE1F', fontWeight: 700, fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', mb: 0.5 }}>
                                💬 Organizer Feedback
                              </Typography>
                              <Typography variant="body2" color="#2A3547">{result.feedback}</Typography>
                            </Paper>
                          )}
                        </>
                      ) : (
                        <Box sx={{ mt: 2, p: 2, borderRadius: 2, background: '#FEF5E5', border: '1px solid #FFAE1F30', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <LockIcon sx={{ color: '#FFAE1F', fontSize: '1.2rem' }} />
                          <Box>
                            <Typography variant="body2" sx={{ color: '#2A3547', fontWeight: 600 }}>Evaluation in progress</Typography>
                            <Typography variant="caption" color="textSecondary">
                              The organizer is reviewing your submission. Marks will appear here once released.
                            </Typography>
                          </Box>
                        </Box>
                      )}
                    </Box>
                  </Paper>
                );
              })}
            </Stack>
          )}
        </Box>
      </PageContainer>
    );
  }

  // ═══════════════════════════════ TEACHER VIEW ══════════════════
  return (
    <PageContainer title="HackProctor — Evaluation Dashboard" description="Evaluate and grade candidates">
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#2A3547', mb: 0.5 }}>
          📊 Evaluation Dashboard
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
          Review submissions, assign coding marks, and release results to candidates
        </Typography>

        {/* Stats */}
        <Grid container spacing={2.5} mb={3}>
          <Grid item xs={6} sm={3}><StatCard label="Total Submissions" value={filteredResults.length}                    bg="#ECF2FF" color="#5D87FF" /></Grid>
          <Grid item xs={6} sm={3}><StatCard label="Graded"            value={graded}                                    bg="#E6FFFA" color="#13DEB9" /></Grid>
          <Grid item xs={6} sm={3}><StatCard label="Shortlisted (≥75%)" value={shortlisted}                              bg="#f3fef3" color="#2e7d32" /></Grid>
          <Grid item xs={6} sm={3}><StatCard label="Pending Grade"      value={filteredResults.length - graded}          bg="#FEF5E5" color="#FFAE1F" /></Grid>
        </Grid>

        {/* Filters */}
        <Paper elevation={0} sx={{ p: 2, mb: 3, border: '1px solid #e5eaef', borderRadius: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <Select value={selectedExam} onChange={(e) => setSelectedExam(e.target.value)} size="small" sx={{ minWidth: 200 }}>
            <MenuItem value="all">All Challenges</MenuItem>
            {exams.map((e) => <MenuItem key={e._id} value={e._id}>{e.examName}</MenuItem>)}
          </Select>
          <TextField
            placeholder="Search by name or email..."
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ flex: 1, minWidth: 200 }}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#5A6A85', fontSize: '1.1rem' }} /></InputAdornment> }}
          />
        </Paper>

        {/* Table */}
        <Paper elevation={0} sx={{ border: '1px solid #e5eaef', borderRadius: 3, overflow: 'hidden' }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '40px 2fr 1.8fr 1.4fr 1fr 1fr 1fr 90px 60px', gap: 1, px: 2.5, py: 1.5, background: '#F2F6FA', borderBottom: '1px solid #e5eaef' }}>
            {['#', 'Candidate', 'Email', 'Challenge', 'MCQ%', 'MCQ Marks', 'Total', 'Status', 'Action'].map((h) => (
              <Typography key={h} variant="caption" sx={{ color: '#5A6A85', fontWeight: 700, fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</Typography>
            ))}
          </Box>

          {filteredResults.length === 0 ? (
            <Box textAlign="center" py={6}>
              <Typography color="textSecondary">No submissions found.</Typography>
            </Box>
          ) : filteredResults.map((result, idx) => {
            const pct        = result.percentage || 0;
            const chipColor  = scoreChipColor(pct);
            const grade      = gradeLabel(pct);
            const totalScore = (result.totalMarks || 0) + (result.codingMarks || 0);
            const isGraded   = !!result.gradedAt;
            const examName   = exams.find((e) => e._id === result.examId || e._id === result.examId?._id)?.examName
                             || result.examId?.examName || 'Challenge';
            const candidateName  = result.userId?.name  || '—';
            const candidateEmail = result.userId?.email || '—';

            return (
              <Box
                key={result._id}
                sx={{
                  display: 'grid', gridTemplateColumns: '40px 2fr 1.8fr 1.4fr 1fr 1fr 1fr 90px 60px',
                  gap: 1, px: 2.5, py: 2, borderBottom: '1px solid #e5eaef', alignItems: 'center',
                  '&:hover': { background: '#F8FAFC' }, '&:last-child': { borderBottom: 'none' },
                  background: !isGraded ? '#FFFBF0' : 'white',
                }}
              >
                <Typography sx={{ color: '#5A6A85', fontSize: '0.78rem', fontWeight: 600 }}>{idx + 1}</Typography>

                <Stack direction="row" alignItems="center" spacing={1} sx={{ minWidth: 0 }}>
                  <Avatar sx={{ width: 30, height: 30, fontSize: '0.7rem', fontWeight: 700, background: 'linear-gradient(135deg, #5D87FF, #13DEB9)', flexShrink: 0 }}>
                    {(candidateName[0] || '?').toUpperCase()}
                  </Avatar>
                  <Typography sx={{ color: '#2A3547', fontWeight: 600, fontSize: '0.88rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {candidateName}
                  </Typography>
                </Stack>

                <Typography sx={{ color: '#5A6A85', fontSize: '0.78rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {candidateEmail}
                </Typography>

                <Typography sx={{ color: '#2A3547', fontSize: '0.8rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {examName}
                </Typography>

                <Chip label={`${pct.toFixed(0)}%`} size="small" color={chipColor} sx={{ fontWeight: 700 }} />

                <Typography sx={{ color: '#5D87FF', fontWeight: 700, fontSize: '0.88rem' }}>
                  {result.totalMarks ?? 0}
                </Typography>

                <Typography sx={{ color: isGraded ? '#13DEB9' : '#5A6A85', fontWeight: 700, fontSize: '0.88rem' }}>
                  {isGraded ? totalScore : '—'}
                </Typography>

                <Stack spacing={0.5}>
                  <Chip
                    label={isGraded ? (result.showToStudent ? '🔓 Released' : '✅ Graded') : '⏳ Pending'}
                    size="small"
                    color={isGraded ? (result.showToStudent ? 'success' : 'info') : 'warning'}
                    variant={isGraded ? 'filled' : 'outlined'}
                    sx={{ fontWeight: 700, fontSize: '0.62rem', height: 22 }}
                  />
                </Stack>

                <Tooltip title="Open Evaluation Panel">
                  <Button
                    size="small"
                    variant={isGraded ? 'outlined' : 'contained'}
                    color="primary"
                    onClick={() => { setActiveResult(result); setEvalDialog(true); }}
                    sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.7rem', minWidth: 0, px: 1.5, py: 0.5, borderRadius: 1.5 }}
                  >
                    {isGraded ? 'Review' : 'Grade'}
                  </Button>
                </Tooltip>
              </Box>
            );
          })}
        </Paper>
      </Box>

      {/* Evaluation Dialog */}
      <EvaluationDialog
        open={evalDialog}
        onClose={() => { setEvalDialog(false); setActiveResult(null); }}
        result={activeResult}
        onGraded={fetchAll}
      />
    </PageContainer>
  );
};

export default ResultPage;
