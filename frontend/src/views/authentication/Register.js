import React, { useEffect } from 'react';
import { Grid, Box, Card, Typography, Stack, Chip } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import PageContainer from 'src/components/container/PageContainer';
import AuthRegister from './auth/AuthRegister';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useRegisterMutation } from './../../slices/usersApiSlice';
import { setCredentials } from './../../slices/authSlice';
import Loader from './Loader';

const userValidationSchema = yup.object({
  name: yup.string().min(2).max(25).required('Please enter your name'),
  email: yup.string('Enter your email').email('Enter a valid email').required('Email is required'),
  password: yup
    .string('Enter your password')
    .min(6, 'Password should be of minimum 6 characters length')
    .required('Password is required'),
  confirm_password: yup
    .string()
    .required('Confirm Password is required')
    .oneOf([yup.ref('password'), null], 'Password must match'),
  role: yup.string().oneOf(['student', 'teacher'], 'Invalid role').required('Role is required'),
});

const initialUserValues = {
  name: '',
  email: '',
  password: '',
  confirm_password: '',
  role: 'student',
};

const steps = [
  { num: '01', label: 'Create Account', desc: 'Register as Candidate or Organizer' },
  { num: '02', label: 'Browse Challenges', desc: 'View active hackathon exams' },
  { num: '03', label: 'Get Shortlisted', desc: 'Score high & get selected' },
];

const Register = () => {
  const formik = useFormik({
    initialValues: initialUserValues,
    validationSchema: userValidationSchema,
    onSubmit: (values) => handleSubmit(values),
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) navigate('/');
  }, [navigate, userInfo]);

  const handleSubmit = async ({ name, email, password, confirm_password, role }) => {
    if (password !== confirm_password) {
      toast.error('Passwords do not match');
    } else {
      try {
        const res = await register({ name, email, password, role }).unwrap();
        dispatch(setCredentials({ ...res }));
        formik.resetForm();
        navigate('/auth/login');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <PageContainer title="HackProctor — Register" description="Create your HackProctor account">
      <Box
        sx={{
          display: 'flex',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0a0e1a 0%, #0d1b2a 50%, #0a1628 100%)',
          position: 'relative',
          overflow: 'hidden',
          '&:before': {
            content: '""',
            position: 'absolute',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(20,184,166,0.12) 0%, transparent 70%)',
            top: '-150px',
            right: '-100px',
            pointerEvents: 'none',
          },
          '&:after': {
            content: '""',
            position: 'absolute',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
            bottom: '-100px',
            left: '-80px',
            pointerEvents: 'none',
          },
        }}
      >
        <Grid container sx={{ minHeight: '100vh' }}>
          {/* ── LEFT HERO PANEL ── */}
          <Grid
            item
            xs={false}
            md={5}
            sx={{
              display: { xs: 'none', md: 'flex' },
              flexDirection: 'column',
              justifyContent: 'center',
              p: 8,
              position: 'relative',
              zIndex: 1,
            }}
          >
            <Chip
              label="🚀 Join the Hackathon Ecosystem"
              sx={{
                mb: 3,
                background: 'rgba(20,184,166,0.15)',
                color: '#5eead4',
                border: '1px solid rgba(20,184,166,0.3)',
                fontWeight: 600,
                fontSize: '0.75rem',
              }}
            />
            <Typography
              variant="h2"
              sx={{
                fontWeight: 800,
                lineHeight: 1.1,
                mb: 2,
                background: 'linear-gradient(135deg, #e0e7ff 0%, #a5b4fc 50%, #14b8a6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Join HackProctor
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: 'rgba(255,255,255,0.55)', mb: 6, lineHeight: 1.8, maxWidth: '380px' }}
            >
              The standardized evaluation platform trusted by hackathon organizers to fairly and
              efficiently shortlist the best talent nationwide.
            </Typography>
            <Stack spacing={3}>
              {steps.map((s) => (
                <Box key={s.num} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #6366f1, #14b8a6)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      color: '#fff',
                    }}
                  >
                    {s.num}
                  </Box>
                  <Box>
                    <Typography variant="body1" sx={{ color: '#e0e7ff', fontWeight: 600 }}>
                      {s.label}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>
                      {s.desc}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Grid>

          {/* ── RIGHT FORM PANEL ── */}
          <Grid
            item
            xs={12}
            md={7}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              p: { xs: 2, sm: 4 },
              position: 'relative',
              zIndex: 1,
            }}
          >
            <Card
              elevation={0}
              sx={{
                p: { xs: 3, sm: 4 },
                width: '100%',
                maxWidth: '520px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(20px)',
                borderRadius: 4,
                boxShadow: '0 25px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
              }}
            >
              <Box sx={{ display: { xs: 'block', md: 'none' }, mb: 2, textAlign: 'center' }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #a5b4fc, #14b8a6)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  HackProctor
                </Typography>
              </Box>
              <AuthRegister
                formik={formik}
                onSubmit={handleSubmit}
                subtext={
                  <Typography
                    variant="subtitle2"
                    textAlign="center"
                    sx={{
                      color: 'rgba(255,255,255,0.4)',
                      mb: 1,
                      letterSpacing: '0.08em',
                      fontSize: '0.7rem',
                      textTransform: 'uppercase',
                    }}
                  >
                    Hackathon Candidate &amp; Organizer Registration
                  </Typography>
                }
                subtitle={
                  <Stack direction="row" justifyContent="center" spacing={1} mt={3}>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                      Already have an account?
                    </Typography>
                    <Typography
                      component={Link}
                      to="/auth/login"
                      variant="body2"
                      fontWeight="600"
                      sx={{ textDecoration: 'none', color: '#a5b4fc' }}
                    >
                      Sign In
                    </Typography>
                    {isLoading && <Loader />}
                  </Stack>
                }
              />
            </Card>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Register;
