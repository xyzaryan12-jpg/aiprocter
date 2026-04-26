import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Tooltip,
  Chip,
  Stack,
  LinearProgress,
  InputAdornment,
  Avatar,
  Paper,
} from '@mui/material';
import { useGetExamsQuery } from 'src/slices/examApiSlice';
import { useGetCheatingLogsQuery } from 'src/slices/cheatingLogApiSlice';
import CloseIcon from '@mui/icons-material/Close';
import ImageIcon from '@mui/icons-material/Image';
import SearchIcon from '@mui/icons-material/Search';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import GroupIcon from '@mui/icons-material/Group';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import BlockIcon from '@mui/icons-material/Block';
import TabIcon from '@mui/icons-material/Tab';

// ── Violation count badge ─────────────────────────────────
function ViolationBadge({ count }) {
  const isDanger = count > 5;
  const isWarn  = count > 2;
  const color   = isDanger ? '#d32f2f' : isWarn ? '#ed6c02' : '#2e7d32';
  const bg      = isDanger ? '#FDEDE8'  : isWarn ? '#FEF5E5'  : '#E6FFFA';

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 40,
        height: 28,
        borderRadius: '8px',
        background: bg,
        px: 1,
      }}
    >
      <Typography sx={{ color, fontWeight: 800, fontSize: '0.85rem', fontFamily: 'monospace' }}>
        {count}
      </Typography>
      {isDanger && <WarningAmberIcon sx={{ color, fontSize: '0.8rem', ml: 0.3 }} />}
    </Box>
  );
}

// ── Stat card ─────────────────────────────────────────────
function StatCard({ label, value, icon, bg, color }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: 3,
        background: bg,
        border: `1px solid ${color}30`,
        height: '100%',
        transition: 'transform .15s',
        '&:hover': { transform: 'translateY(-2px)', boxShadow: `0 4px 16px ${color}20` },
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
        <Box>
          <Typography
            variant="caption"
            sx={{ color: '#5A6A85', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', mb: 0.5 }}
          >
            {label}
          </Typography>
          <Typography sx={{ color, fontWeight: 800, fontSize: '2rem', lineHeight: 1 }}>
            {value}
          </Typography>
        </Box>
        <Box
          sx={{
            width: 40, height: 40, borderRadius: '12px',
            background: `${color}18`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color,
          }}
        >
          {icon}
        </Box>
      </Stack>
    </Paper>
  );
}

// ─────────────────────────────────────────────────────────
export default function CheatingTable() {
  const [filter, setFilter]             = useState('');
  const [selectedExamId, setSelectedExamId] = useState('');
  const [cheatingLogs, setCheatingLogs] = useState([]);
  const [selectedLog, setSelectedLog]   = useState(null);
  const [openDialog, setOpenDialog]     = useState(false);

  const { data: examsData, isLoading: examsLoading, error: examsError } = useGetExamsQuery();
  const {
    data: cheatingLogsData,
    isLoading: logsLoading,
    error: logsError,
  } = useGetCheatingLogsQuery(selectedExamId, { skip: !selectedExamId });

  useEffect(() => {
    if (examsData?.length > 0) setSelectedExamId(examsData[0].examId);
  }, [examsData]);

  useEffect(() => {
    if (cheatingLogsData) setCheatingLogs(Array.isArray(cheatingLogsData) ? cheatingLogsData : []);
  }, [cheatingLogsData]);

  const filteredLogs = cheatingLogs.filter(
    (log) =>
      (log.username || '').toLowerCase().includes(filter.toLowerCase()) ||
      (log.email    || '').toLowerCase().includes(filter.toLowerCase()),
  );

  // ── Analytics ─────────────────────────────────────────
  const totalViolations = filteredLogs.reduce(
    (a, l) => a + (l.noFaceCount||0) + (l.multipleFaceCount||0) + (l.cellPhoneCount||0) + (l.prohibitedObjectCount||0) + (l.tabSwitchCount||0), 0
  );
  const flaggedCount = filteredLogs.filter(
    (l) => (l.noFaceCount||0)+(l.multipleFaceCount||0)+(l.cellPhoneCount||0)+(l.prohibitedObjectCount||0)+(l.tabSwitchCount||0) > 3
  ).length;
  const avgViolations = filteredLogs.length > 0 ? (totalViolations / filteredLogs.length).toFixed(1) : '0.0';

  const sumNoFace   = filteredLogs.reduce((a,l) => a+(l.noFaceCount||0), 0);
  const sumMulti    = filteredLogs.reduce((a,l) => a+(l.multipleFaceCount||0), 0);
  const sumPhone    = filteredLogs.reduce((a,l) => a+(l.cellPhoneCount||0), 0);
  const sumObject   = filteredLogs.reduce((a,l) => a+(l.prohibitedObjectCount||0), 0);
  const sumTabSwitch = filteredLogs.reduce((a,l) => a+(l.tabSwitchCount||0), 0);
  const violMax     = Math.max(sumNoFace, sumMulti, sumPhone, sumObject, sumTabSwitch, 1);

  if (examsLoading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
      <CircularProgress />
    </Box>
  );

  if (examsError || !examsData?.length) return (
    <Box p={3} textAlign="center">
      <Typography color="textSecondary">
        {examsError ? 'Error loading exams.' : 'No challenges found. Create one first.'}
      </Typography>
    </Box>
  );

  return (
    <Box>
      {/* ── Filter bar ──────────────────────────────── */}
      <Paper
        elevation={0}
        sx={{ p: 2, mb: 3, border: '1px solid #e5eaef', borderRadius: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}
      >
        <Select
          value={selectedExamId || ''}
          onChange={(e) => setSelectedExamId(e.target.value)}
          size="small"
          sx={{ minWidth: 220, borderRadius: 2 }}
        >
          {examsData.map((exam) => (
            <MenuItem key={exam.examId} value={exam.examId}>
              {exam.examName || 'Unnamed Exam'}
            </MenuItem>
          ))}
        </Select>

        <TextField
          placeholder="Search by name or email..."
          size="small"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          sx={{ flex: 1, minWidth: 200 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#5A6A85', fontSize: '1.1rem' }} />
              </InputAdornment>
            ),
          }}
        />

        <Chip
          label={`${filteredLogs.length} candidate${filteredLogs.length !== 1 ? 's' : ''}`}
          color="primary"
          variant="outlined"
          sx={{ fontWeight: 600 }}
        />
      </Paper>

      {/* ── Stat cards ──────────────────────────────── */}
      <Grid container spacing={2.5} mb={3}>
        <Grid item xs={6} sm={3}>
          <StatCard label="Total Candidates" value={filteredLogs.length} icon={<GroupIcon />} bg="#ECF2FF" color="#5D87FF" />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard label="Flagged (>3 violations)" value={flaggedCount} icon={<WarningAmberIcon />} bg="#FDEDE8" color="#FA896B" />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard label="Total Violations" value={totalViolations} icon={<BlockIcon />} bg="#FEF5E5" color="#FFAE1F" />
        </Grid>
        <Grid item xs={6} sm={3}>
          <StatCard label="Avg per Candidate" value={avgViolations} icon={<PersonOffIcon />} bg="#E6FFFA" color="#13DEB9" />
        </Grid>
      </Grid>

      {/* ── Violation distribution ───────────────────── */}
      <Paper elevation={0} sx={{ p: 2.5, mb: 3, border: '1px solid #e5eaef', borderRadius: 3 }}>
        <Typography
          variant="subtitle2"
          sx={{ color: '#2A3547', fontWeight: 700, mb: 2, textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.75rem' }}
        >
          Violation Breakdown
        </Typography>
        <Stack spacing={2}>
          {[
            { label: 'No Face Detected',   icon: <PersonOffIcon fontSize="small" />, count: sumNoFace, color: '#5D87FF' },
            { label: 'Multiple Faces',      icon: <GroupIcon fontSize="small" />,     count: sumMulti,  color: '#FA896B' },
            { label: 'Cell Phone',          icon: <SmartphoneIcon fontSize="small" />,count: sumPhone,  color: '#FFAE1F' },
            { label: 'Prohibited Object',   icon: <BlockIcon fontSize="small" />,     count: sumObject, color: '#13DEB9' },
            { label: 'Tab Switch',          icon: <TabIcon fontSize="small" />,       count: sumTabSwitch, color: '#9333ea' },
          ].map(({ label, icon, count, color }) => (
            <Box key={label}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.5}>
                <Stack direction="row" alignItems="center" spacing={0.8}>
                  <Box sx={{ color, display: 'flex' }}>{icon}</Box>
                  <Typography variant="body2" sx={{ color: '#2A3547', fontWeight: 500 }}>{label}</Typography>
                </Stack>
                <Typography variant="body2" sx={{ color, fontWeight: 700, fontFamily: 'monospace' }}>{count}</Typography>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={Math.min((count / violMax) * 100, 100)}
                sx={{
                  height: 6, borderRadius: 3,
                  background: '#F2F6FA',
                  '& .MuiLinearProgress-bar': { background: color, borderRadius: 3 },
                }}
              />
            </Box>
          ))}
        </Stack>
      </Paper>

      {/* ── Candidate table ──────────────────────────── */}
      {logsLoading ? (
        <Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>
      ) : logsError ? (
        <Typography color="error" sx={{ p: 2 }}>
          Error loading logs: {logsError?.data?.message || 'Unknown error'}
        </Typography>
      ) : filteredLogs.length === 0 ? (
        <Paper elevation={0} sx={{ p: 6, textAlign: 'center', border: '1px solid #e5eaef', borderRadius: 3 }}>
          <Typography sx={{ fontSize: '2.5rem', mb: 1 }}>📋</Typography>
          <Typography color="textSecondary">
            {filter ? 'No candidates match your search.' : 'No proctoring logs yet for this challenge.'}
          </Typography>
        </Paper>
      ) : (
        <Paper elevation={0} sx={{ border: '1px solid #e5eaef', borderRadius: 3, overflow: 'hidden' }}>
          {/* Table header */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '44px 2fr 2.5fr 1fr 1fr 1fr 1fr 1fr 60px',
              gap: 1,
              px: 3,
              py: 1.5,
              background: '#F2F6FA',
              borderBottom: '1px solid #e5eaef',
            }}
          >
            {['#', 'Candidate', 'Email', 'No Face', 'Multi-Face', 'Phone', 'Object', 'Tab Switch', 'Snaps'].map((h) => (
              <Typography
                key={h}
                variant="caption"
                sx={{ color: '#5A6A85', fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}
              >
                {h}
              </Typography>
            ))}
          </Box>

          {/* Table rows */}
          {filteredLogs.map((log, index) => {
            const totalViol = (log.noFaceCount||0)+(log.multipleFaceCount||0)+(log.cellPhoneCount||0)+(log.prohibitedObjectCount||0)+(log.tabSwitchCount||0);
            const isFlagged = totalViol > 3;

            return (
              <Box
                key={log._id || index}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '44px 2fr 2.5fr 1fr 1fr 1fr 1fr 1fr 60px',
                  gap: 1,
                  px: 3,
                  py: 2,
                  borderBottom: '1px solid #e5eaef',
                  background: isFlagged ? '#FFF5F2' : 'white',
                  alignItems: 'center',
                  transition: 'background 0.15s',
                  '&:hover': { background: isFlagged ? '#FDEDE8' : '#F8FAFC' },
                  '&:last-child': { borderBottom: 'none' },
                }}
              >
                <Typography sx={{ color: '#5A6A85', fontSize: '0.8rem', fontWeight: 600 }}>
                  {index + 1}
                </Typography>

                {/* Name + avatar */}
                <Stack direction="row" alignItems="center" spacing={1.2} sx={{ minWidth: 0 }}>
                  <Avatar
                    sx={{
                      width: 32, height: 32, fontSize: '0.75rem', fontWeight: 700,
                      background: 'linear-gradient(135deg, #5D87FF, #13DEB9)',
                      flexShrink: 0,
                    }}
                  >
                    {(log.username || '?')[0].toUpperCase()}
                  </Avatar>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      sx={{ color: '#2A3547', fontWeight: 600, fontSize: '0.88rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                    >
                      {log.username || 'Unknown'}
                    </Typography>
                    {isFlagged && (
                      <Typography sx={{ color: '#FA896B', fontSize: '0.62rem', fontWeight: 700 }}>
                        ⚠ Flagged
                      </Typography>
                    )}
                  </Box>
                </Stack>

                <Typography
                  sx={{ color: '#5A6A85', fontSize: '0.78rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                >
                  {log.email || '—'}
                </Typography>

                <ViolationBadge count={log.noFaceCount || 0} />
                <ViolationBadge count={log.multipleFaceCount || 0} />
                <ViolationBadge count={log.cellPhoneCount || 0} />
                <ViolationBadge count={log.prohibitedObjectCount || 0} />
                <ViolationBadge count={log.tabSwitchCount || 0} />

                <Tooltip title={log.screenshots?.length ? `View ${log.screenshots.length} screenshot(s)` : 'No screenshots'}>
                  <span>
                    <IconButton
                      size="small"
                      onClick={() => { setSelectedLog(log); setOpenDialog(true); }}
                      disabled={!log.screenshots?.length}
                    >
                      <ImageIcon fontSize="small" color={log.screenshots?.length ? 'primary' : 'disabled'} />
                    </IconButton>
                  </span>
                </Tooltip>
              </Box>
            );
          })}
        </Paper>
      )}

      {/* ── Screenshots dialog ──────────────────────── */}
      <Dialog
        open={openDialog}
        onClose={() => { setOpenDialog(false); setSelectedLog(null); }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h6" fontWeight={700}>📸 Violation Screenshots</Typography>
            <Typography variant="caption" color="textSecondary">
              {selectedLog?.username} · {selectedLog?.email}
            </Typography>
          </Box>
          <IconButton onClick={() => { setOpenDialog(false); setSelectedLog(null); }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedLog?.screenshots?.length ? (
            <Grid container spacing={2} pt={1}>
              {selectedLog.screenshots.map((s, i) => (
                <Grid item xs={12} sm={6} md={4} key={i}>
                  <Card elevation={1} sx={{ borderRadius: 2 }}>
                    <CardMedia component="img" height="160" image={s.url} alt={s.type} sx={{ objectFit: 'cover' }} />
                    <CardContent sx={{ p: 1.5 }}>
                      <Chip size="small" label={s.type} color="error" variant="outlined" />
                      <Typography variant="caption" color="textSecondary" display="block" mt={0.5} fontSize="0.65rem">
                        {new Date(s.detectedAt).toLocaleString()}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box textAlign="center" py={4}>
              <Typography color="textSecondary">No screenshots available.</Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
