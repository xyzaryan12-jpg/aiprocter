import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Grid, Box, Card, Stack, Typography, Chip } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import AuthLogin from './auth/AuthLogin';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useLoginMutation } from './../../slices/usersApiSlice';
import { setCredentials } from './../../slices/authSlice';
import { toast } from 'react-toastify';
import Loader from './Loader';

const userValidationSchema = yup.object({
  email: yup.string('Enter your email').email('Enter a valid email').required('Email is required'),
  password: yup
    .string('Enter your password')
    .min(2, 'Password should be of minimum 8 characters length')
    .required('Password is required'),
});
const initialUserValues = { email: '', password: '' };

const features = [
  { icon: '🎯', label: 'AI-Powered Proctoring' },
  { icon: '🏆', label: 'Hackathon Shortlisting' },
  { icon: '👁️', label: 'Live Face Detection' },
  { icon: '💻', label: 'Integrated Code Editor' },
  { icon: '📊', label: 'Real-time Cheat Logs' },
  { icon: '🔒', label: 'JWT Secure Auth' },
];

const Login = () => {
  const formik = useFormik({
    initialValues: initialUserValues,
    validationSchema: userValidationSchema,
    onSubmit: (values) => handleSubmit(values),
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) navigate('/');
  }, [navigate, userInfo]);

  const handleSubmit = async ({ email, password }) => {
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      formik.resetForm();
      const redirectLocation = JSON.parse(localStorage.getItem('redirectLocation'));
      if (redirectLocation) {
        localStorage.removeItem('redirectLocation');
        navigate(redirectLocation.pathname);
      } else {
        navigate('/');
      }
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <PageContainer title="HackProctor — Login" description="Sign in to HackProctor">
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
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
            top: '-200px',
            left: '-100px',
            pointerEvents: 'none',
          },
          '&:after': {
            content: '""',
            position: 'absolute',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(20,184,166,0.1) 0%, transparent 70%)',
            bottom: '-150px',
            right: '-100px',
            pointerEvents: 'none',
          },
        }}
      >
        <Grid container sx={{ minHeight: '100vh' }}>
          {/* ── LEFT HERO PANEL ── */}
          <Grid
            item
            xs={false}
            md={6}
            sx={{
              display: { xs: 'none', md: 'flex' },
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'flex-start',
              p: 8,
              position: 'relative',
              zIndex: 1,
            }}
          >
            {/* Glowing orb decoration */}
            <Box
              sx={{
                position: 'absolute',
                top: '30%',
                right: '-60px',
                width: '300px',
                height: '300px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)',
                filter: 'blur(40px)',
              }}
            />
            <Chip
              label="🏆 National &amp; International Hackathons"
              sx={{
                mb: 3,
                background: 'rgba(99,102,241,0.2)',
                color: '#a5b4fc',
                border: '1px solid rgba(99,102,241,0.4)',
                fontWeight: 600,
                fontSize: '0.75rem',
                letterSpacing: '0.05em',
              }}
            />
            <Typography
              variant="h1"
              sx={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 800,
                fontSize: { md: '3rem', lg: '3.8rem' },
                lineHeight: 1.1,
                mb: 2,
                background: 'linear-gradient(135deg, #e0e7ff 0%, #a5b4fc 50%, #14b8a6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              HackProctor
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: 'rgba(255,255,255,0.6)',
                fontWeight: 400,
                mb: 5,
                lineHeight: 1.6,
                maxWidth: '460px',
              }}
            >
              The official AI-powered candidate evaluation &amp; shortlisting platform for hackathon organizers.
            </Typography>
            <Grid container spacing={2} sx={{ maxWidth: '420px' }}>
              {features.map((f, i) => (
                <Grid item xs={6} key={i}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      p: 1.5,
                      borderRadius: 2,
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    <Typography fontSize="1.2rem">{f.icon}</Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>
                      {f.label}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', mt: 5, display: 'block' }}>
              Team: Roshan Kumar • Arshlan Shakil Khan • Guntoju Karthikeya &nbsp;|&nbsp; 224IS
            </Typography>
          </Grid>

          {/* ── RIGHT FORM PANEL ── */}
          <Grid
            item
            xs={12}
            md={6}
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
                p: 4,
                width: '100%',
                maxWidth: '480px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(20px)',
                borderRadius: 4,
                boxShadow: '0 25px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
              }}
            >
              {/* Mobile logo */}
              <Box sx={{ display: { xs: 'block', md: 'none' }, mb: 2, textAlign: 'center' }}>
                <Typography
                  variant="h4"
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
              <AuthLogin
                formik={formik}
                subtext={
                  <Typography
                    variant="subtitle2"
                    textAlign="center"
                    sx={{ color: 'rgba(255,255,255,0.5)', mb: 1, letterSpacing: '0.08em', fontSize: '0.7rem', textTransform: 'uppercase' }}
                  >
                    Secure Candidate Evaluation Portal
                  </Typography>
                }
                subtitle={
                  <Stack direction="row" spacing={1} justifyContent="center" mt={3}>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                      New to HackProctor?
                    </Typography>
                    <Typography
                      component={Link}
                      to="/auth/register"
                      variant="body2"
                      fontWeight="600"
                      sx={{ textDecoration: 'none', color: '#a5b4fc' }}
                    >
                      Create an account
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

export default Login;
