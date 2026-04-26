import React, { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Stack,
  Avatar,
  Button,
  TextField,
  Chip,
  Divider,
  Alert,
  Paper,
} from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useUpdateUserMutation } from '../../slices/usersApiSlice';
import { setCredentials } from '../../slices/authSlice';

const validationSchema = yup.object({
  name: yup.string().min(2).max(25).required('Name is required'),
  email: yup.string().email('Enter a valid email').required('Email is required'),
  password: yup.string().min(6, 'Min 6 characters').required('Password is required'),
  confirm_password: yup
    .string()
    .required('Confirm Password is required')
    .oneOf([yup.ref('password'), null], 'Passwords must match'),
});

const UserAccount = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [updateProfile, { isLoading }] = useUpdateUserMutation();
  const [showForm, setShowForm] = useState(false);
  const isTeacher = userInfo?.role === 'teacher';

  const formik = useFormik({
    initialValues: {
      name: userInfo?.name || '',
      email: userInfo?.email || '',
      password: '',
      confirm_password: '',
      role: userInfo?.role || 'student',
    },
    validationSchema,
    onSubmit: async ({ name, email, password, confirm_password, role }) => {
      if (password !== confirm_password) { toast.error('Passwords do not match'); return; }
      try {
        const res = await updateProfile({ _id: userInfo._id, name, email, password, role }).unwrap();
        dispatch(setCredentials(res));
        toast.success('Profile updated successfully');
        setShowForm(false);
      } catch (err) {
        toast.error(err?.data?.message || err.error || 'Update failed');
      }
    },
  });

  const initials = (userInfo?.name || 'U').split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <PageContainer title="HackProctor — My Profile" description="Manage your HackProctor account">
      <Box>
        {/* Header */}
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#2A3547', mb: 0.5 }}>
          👤 My Profile
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
          Manage your HackProctor account information
        </Typography>

        <Grid container spacing={3}>
          {/* ── Profile Card ── */}
          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e5eaef', textAlign: 'center', height: '100%' }}>
              {/* Avatar */}
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <Avatar
                  sx={{
                    width: 88, height: 88, fontSize: '2rem', fontWeight: 800,
                    background: 'linear-gradient(135deg, #5D87FF, #13DEB9)',
                    boxShadow: '0 0 0 4px #ECF2FF',
                  }}
                >
                  {initials}
                </Avatar>
              </Box>

              <Typography variant="h5" sx={{ color: '#2A3547', fontWeight: 700, mb: 0.5 }}>
                {userInfo?.name || 'User'}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                {userInfo?.email}
              </Typography>

              <Chip
                label={isTeacher ? '🏆 Organizer' : '🧑‍💻 Candidate'}
                color={isTeacher ? 'success' : 'primary'}
                sx={{ fontWeight: 700, mb: 3 }}
              />

              <Divider sx={{ mb: 3 }} />

              {/* Info rows */}
              <Stack spacing={2} textAlign="left">
                {[
                  { label: 'Full Name', value: userInfo?.name },
                  { label: 'Email', value: userInfo?.email },
                  { label: 'Role', value: isTeacher ? 'Organizer (Teacher)' : 'Candidate (Student)' },
                  { label: 'Account ID', value: `#${(userInfo?._id || '').slice(-6).toUpperCase()}` },
                ].map(({ label, value }) => (
                  <Box key={label}>
                    <Typography variant="caption" sx={{ color: '#5A6A85', fontWeight: 600, fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      {label}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#2A3547', fontWeight: 500 }}>
                      {value || '—'}
                    </Typography>
                  </Box>
                ))}
              </Stack>

              <Box mt={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  color="primary"
                  onClick={() => setShowForm((v) => !v)}
                  sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 600 }}
                >
                  {showForm ? 'Cancel Edit' : '✏️ Edit Profile'}
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* ── Right panel ── */}
          <Grid item xs={12} md={8}>
            {!showForm && (
              <>
                {/* Info cards */}
                <Grid container spacing={2} mb={3}>
                  {[
                    { icon: '🏆', label: 'Platform', value: 'HackProctor', color: '#5D87FF', bg: '#ECF2FF' },
                    { icon: isTeacher ? '📋' : '🎯', label: isTeacher ? 'Role' : 'Status', value: isTeacher ? 'Organizer' : 'Active Candidate', color: '#13DEB9', bg: '#E6FFFA' },
                    { icon: '🔒', label: 'Security', value: 'JWT Auth', color: '#FFAE1F', bg: '#FEF5E5' },
                    { icon: '🤖', label: 'Proctoring', value: 'AI-Powered', color: '#FA896B', bg: '#FDEDE8' },
                  ].map(({ icon, label, value, color, bg }) => (
                    <Grid item xs={6} key={label}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2, borderRadius: 3, background: bg, border: `1px solid ${color}30`,
                          transition: 'all 0.2s',
                          '&:hover': { transform: 'translateY(-2px)', boxShadow: `0 4px 16px ${color}20` },
                        }}
                      >
                        <Typography sx={{ fontSize: '1.5rem', mb: 0.5 }}>{icon}</Typography>
                        <Typography variant="caption" sx={{ color: '#5A6A85', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block' }}>
                          {label}
                        </Typography>
                        <Typography sx={{ color, fontWeight: 700, fontSize: '0.95rem' }}>{value}</Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>

                {/* Permissions */}
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e5eaef' }}>
                  <Typography variant="subtitle2" sx={{ color: '#2A3547', fontWeight: 700, mb: 2, textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.75rem' }}>
                    Account Permissions
                  </Typography>
                  <Stack spacing={1.5}>
                    {(isTeacher
                      ? [
                          { perm: 'Create hackathon challenges', granted: true },
                          { perm: 'Add MCQ questions', granted: true },
                          { perm: 'View proctoring logs & analytics', granted: true },
                          { perm: 'Manage candidate shortlisting', granted: true },
                          { perm: 'Take challenges (Candidate only)', granted: false },
                        ]
                      : [
                          { perm: 'Browse active challenges', granted: true },
                          { perm: 'Attempt hackathon exams', granted: true },
                          { perm: 'View own results', granted: true },
                          { perm: 'AI-proctored code editor', granted: true },
                          { perm: 'Create or manage exams (Organizer only)', granted: false },
                        ]
                    ).map(({ perm, granted }) => (
                      <Stack key={perm} direction="row" alignItems="center" spacing={1.5}>
                        <Typography sx={{ fontSize: '0.85rem' }}>{granted ? '✅' : '❌'}</Typography>
                        <Typography variant="body2" sx={{ color: granted ? '#2A3547' : '#adb5bd' }}>
                          {perm}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                </Paper>
              </>
            )}

            {/* ── Edit Form ── */}
            {showForm && (
              <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e5eaef' }}>
                <Typography variant="h6" sx={{ color: '#2A3547', fontWeight: 700, mb: 2.5 }}>
                  Update Account Information
                </Typography>
                <Stack spacing={2.5}>
                  {[
                    { name: 'name', label: 'Full Name', placeholder: 'Your full name', type: 'text' },
                    { name: 'email', label: 'Email Address', placeholder: 'you@example.com', type: 'email' },
                    { name: 'password', label: 'New Password', placeholder: 'Min. 6 characters', type: 'password' },
                    { name: 'confirm_password', label: 'Confirm Password', placeholder: 'Repeat password', type: 'password' },
                  ].map(({ name, label, placeholder, type }) => (
                    <Box key={name}>
                      <Typography variant="subtitle2" sx={{ color: '#2A3547', fontWeight: 600, mb: 0.5 }}>{label}</Typography>
                      <TextField
                        name={name}
                        type={type}
                        fullWidth
                        size="small"
                        value={formik.values[name]}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={!!(formik.touched[name] && formik.errors[name])}
                        helperText={formik.touched[name] && formik.errors[name]}
                        placeholder={placeholder}
                      />
                    </Box>
                  ))}
                  <Alert severity="info">Your role cannot be changed after registration.</Alert>
                  <Button
                    onClick={formik.handleSubmit}
                    disabled={isLoading}
                    fullWidth
                    variant="contained"
                    color="primary"
                    sx={{ borderRadius: '10px', py: 1.2, fontWeight: 700, textTransform: 'none', fontSize: '0.95rem' }}
                  >
                    {isLoading ? 'Saving...' : '💾 Save Changes'}
                  </Button>
                </Stack>
              </Paper>
            )}
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default UserAccount;
