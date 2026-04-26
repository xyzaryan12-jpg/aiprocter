import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  TextField,
  InputAdornment,
  IconButton,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';

const EyeIcon = () => <span style={{ fontSize: '1rem', userSelect: 'none' }}>👁</span>;
const EyeOffIcon = () => <span style={{ fontSize: '1rem', userSelect: 'none' }}>🙈</span>;

const darkInput = {
  '& .MuiOutlinedInput-root': {
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '10px',
    color: '#e2e8f0',
    transition: 'all 0.2s ease',
    '& fieldset': {
      borderColor: 'rgba(255,255,255,0.12)',
      transition: 'border-color 0.2s ease',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(99,102,241,0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#6366f1',
      borderWidth: '1.5px',
      boxShadow: '0 0 0 3px rgba(99,102,241,0.15)',
    },
    '&.Mui-error fieldset': {
      borderColor: '#f87171',
    },
  },
  '& .MuiOutlinedInput-input': {
    color: '#e2e8f0',
    padding: '13px 16px',
    '&::placeholder': {
      color: 'rgba(255,255,255,0.25)',
      opacity: 1,
    },
  },
  '& .MuiFormHelperText-root': {
    color: '#f87171',
    marginLeft: 0,
    fontSize: '0.72rem',
  },
};

const labelStyle = {
  color: 'rgba(255,255,255,0.6)',
  fontWeight: 600,
  fontSize: '0.78rem',
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  mb: '6px',
  display: 'block',
};

const AuthRegister = ({ formik, title, subtitle, subtext }) => {
  const { values, errors, touched, handleBlur, handleChange, handleSubmit } = formik;
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      {title && (
        <Typography fontWeight="700" variant="h2" mb={1} sx={{ color: '#e0e7ff' }}>
          {title}
        </Typography>
      )}
      {subtext}

      <Box component="form" mt={1}>
        <Stack spacing={2}>
          {/* Full Name */}
          <Box>
            <Typography component="label" htmlFor="reg-name" sx={labelStyle}>
              Full Name
            </Typography>
            <TextField
              id="reg-name"
              name="name"
              placeholder="Your full name"
              variant="outlined"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!(touched.name && errors.name)}
              helperText={touched.name && errors.name ? errors.name : null}
              fullWidth
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Typography sx={{ fontSize: '1rem', opacity: 0.5, userSelect: 'none' }}>👤</Typography>
                  </InputAdornment>
                ),
              }}
              sx={darkInput}
            />
          </Box>

          {/* Email */}
          <Box>
            <Typography component="label" htmlFor="reg-email" sx={labelStyle}>
              Email Address
            </Typography>
            <TextField
              id="reg-email"
              name="email"
              variant="outlined"
              placeholder="you@example.com"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!(touched.email && errors.email)}
              helperText={touched.email && errors.email ? errors.email : null}
              required
              fullWidth
              autoComplete="email"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Typography sx={{ fontSize: '1rem', opacity: 0.5, userSelect: 'none' }}>✉️</Typography>
                  </InputAdornment>
                ),
              }}
              sx={darkInput}
            />
          </Box>

          {/* Password */}
          <Box>
            <Typography component="label" htmlFor="reg-password" sx={labelStyle}>
              Password
            </Typography>
            <TextField
              id="reg-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              placeholder="Min. 6 characters"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!(touched.password && errors.password)}
              helperText={touched.password && errors.password ? errors.password : null}
              required
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Typography sx={{ fontSize: '1rem', opacity: 0.5, userSelect: 'none' }}>🔒</Typography>
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((v) => !v)}
                      edge="end"
                      size="small"
                      sx={{ color: 'rgba(255,255,255,0.35)', mr: 0.5 }}
                    >
                      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={darkInput}
            />
          </Box>

          {/* Confirm Password */}
          <Box>
            <Typography component="label" htmlFor="reg-confirm" sx={labelStyle}>
              Confirm Password
            </Typography>
            <TextField
              id="reg-confirm"
              name="confirm_password"
              type={showConfirm ? 'text' : 'password'}
              autoComplete="false"
              variant="outlined"
              placeholder="Repeat your password"
              value={values.confirm_password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={!!(touched.confirm_password && errors.confirm_password)}
              helperText={
                touched.confirm_password && errors.confirm_password
                  ? errors.confirm_password
                  : null
              }
              fullWidth
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Typography sx={{ fontSize: '1rem', opacity: 0.5, userSelect: 'none' }}>🔑</Typography>
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirm((v) => !v)}
                      edge="end"
                      size="small"
                      sx={{ color: 'rgba(255,255,255,0.35)', mr: 0.5 }}
                    >
                      {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={darkInput}
            />
          </Box>

          {/* Role toggle — prominent visual cards */}
          <Box>
            <Typography sx={{ ...labelStyle, mb: 1 }}>
              I am registering as a...
            </Typography>
            <ToggleButtonGroup
              value={values.role}
              exclusive
              onChange={(_, newRole) => {
                if (newRole !== null) {
                  handleChange({ target: { name: 'role', value: newRole } });
                }
              }}
              fullWidth
              sx={{ gap: 1 }}
            >
              <ToggleButton
                value="student"
                id="role-student"
                sx={{
                  flex: 1,
                  py: 1.5,
                  borderRadius: '10px !important',
                  border: '1px solid rgba(255,255,255,0.1) !important',
                  background: values.role === 'student'
                    ? 'rgba(99,102,241,0.2) !important'
                    : 'rgba(255,255,255,0.03) !important',
                  color: values.role === 'student' ? '#a5b4fc !important' : 'rgba(255,255,255,0.4) !important',
                  borderColor: values.role === 'student'
                    ? 'rgba(99,102,241,0.6) !important'
                    : 'rgba(255,255,255,0.1) !important',
                  flexDirection: 'column',
                  gap: 0.3,
                  transition: 'all 0.2s ease',
                  textTransform: 'none',
                }}
              >
                <Typography sx={{ fontSize: '1.5rem', lineHeight: 1 }}>🧑‍💻</Typography>
                <Typography variant="body2" fontWeight={700} sx={{ fontSize: '0.8rem' }}>Candidate</Typography>
                <Typography variant="caption" sx={{ opacity: 0.6, fontSize: '0.65rem' }}>Take challenges</Typography>
              </ToggleButton>

              <ToggleButton
                value="teacher"
                id="role-teacher"
                sx={{
                  flex: 1,
                  py: 1.5,
                  borderRadius: '10px !important',
                  border: '1px solid rgba(255,255,255,0.1) !important',
                  background: values.role === 'teacher'
                    ? 'rgba(20,184,166,0.2) !important'
                    : 'rgba(255,255,255,0.03) !important',
                  color: values.role === 'teacher' ? '#5eead4 !important' : 'rgba(255,255,255,0.4) !important',
                  borderColor: values.role === 'teacher'
                    ? 'rgba(20,184,166,0.6) !important'
                    : 'rgba(255,255,255,0.1) !important',
                  flexDirection: 'column',
                  gap: 0.3,
                  transition: 'all 0.2s ease',
                  textTransform: 'none',
                }}
              >
                <Typography sx={{ fontSize: '1.5rem', lineHeight: 1 }}>🏆</Typography>
                <Typography variant="body2" fontWeight={700} sx={{ fontSize: '0.8rem' }}>Organizer</Typography>
                <Typography variant="caption" sx={{ opacity: 0.6, fontSize: '0.65rem' }}>Manage exams</Typography>
              </ToggleButton>
            </ToggleButtonGroup>
            {touched.role && errors.role && (
              <Typography variant="caption" sx={{ color: '#f87171', mt: 0.5, display: 'block' }}>
                {errors.role}
              </Typography>
            )}
          </Box>

          {/* Submit Button */}
          <Box
            sx={{
              position: 'relative',
              mt: 1,
              '&:before': {
                content: '""',
                position: 'absolute',
                inset: -1,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #6366f1, #14b8a6)',
                filter: 'blur(8px)',
                opacity: 0.45,
                zIndex: 0,
                transition: 'opacity 0.3s',
              },
              '&:hover:before': { opacity: 0.75 },
            }}
          >
            <Button
              color="primary"
              variant="contained"
              size="large"
              fullWidth
              onClick={handleSubmit}
              sx={{
                position: 'relative',
                zIndex: 1,
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 50%, #14b8a6 100%)',
                borderRadius: '10px',
                py: 1.4,
                fontWeight: 700,
                fontSize: '0.95rem',
                letterSpacing: '0.04em',
                textTransform: 'none',
                border: 'none',
                boxShadow: 'none',
                '&:hover': {
                  background: 'linear-gradient(135deg, #4f46e5 0%, #4338ca 50%, #0f9d8a 100%)',
                  boxShadow: 'none',
                },
              }}
            >
              Create HackProctor Account →
            </Button>
          </Box>
        </Stack>
      </Box>
      {subtitle}
    </>
  );
};

export default AuthRegister;
