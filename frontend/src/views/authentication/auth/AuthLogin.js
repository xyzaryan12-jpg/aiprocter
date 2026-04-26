import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  InputAdornment,
  IconButton,
  TextField,
  Checkbox,
  FormControlLabel,
} from '@mui/material';

// Simple inline icons using Unicode/emoji to avoid import issues
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
    mt: 0.5,
  },
  '& .MuiInputAdornment-root': {
    color: 'rgba(255,255,255,0.3)',
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

const AuthLogin = ({ formik, title, subtitle, subtext }) => {
  const { values, errors, touched, handleBlur, handleChange, handleSubmit } = formik;
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      {title && (
        <Typography fontWeight="700" variant="h2" mb={1} sx={{ color: '#e0e7ff' }}>
          {title}
        </Typography>
      )}
      {subtext}

      <Stack spacing={2.5} mt={1}>
        {/* Email Field */}
        <Box>
          <Typography component="label" htmlFor="login-email" sx={labelStyle}>
            Email Address
          </Typography>
          <TextField
            id="login-email"
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

        {/* Password Field */}
        <Box>
          <Typography component="label" htmlFor="login-password" sx={labelStyle}>
            Password
          </Typography>
          <TextField
            id="login-password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            placeholder="Enter your password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={!!(touched.password && errors.password)}
            helperText={touched.password && errors.password ? errors.password : null}
            required
            fullWidth
            autoComplete="current-password"
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

        {/* Remember me row */}
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <FormControlLabel
            control={
              <Checkbox
                defaultChecked
                size="small"
                sx={{ color: 'rgba(255,255,255,0.25)', '&.Mui-checked': { color: '#6366f1' }, p: 0.5 }}
              />
            }
            label={
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>
                Remember me
              </Typography>
            }
          />
          <Typography
            variant="caption"
            sx={{ color: '#a5b4fc', cursor: 'pointer', fontWeight: 500, '&:hover': { color: '#818cf8' } }}
          >
            Forgot password?
          </Typography>
        </Stack>

        {/* Submit Button */}
        <Box
          sx={{
            position: 'relative',
            '&:before': {
              content: '""',
              position: 'absolute',
              inset: -1,
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #6366f1, #14b8a6)',
              filter: 'blur(8px)',
              opacity: 0.5,
              zIndex: 0,
              transition: 'opacity 0.3s',
            },
            '&:hover:before': { opacity: 0.8 },
          }}
        >
          <Button
            color="primary"
            variant="contained"
            size="large"
            fullWidth
            type="submit"
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
            Sign In to HackProctor →
          </Button>
        </Box>
      </Stack>
      {subtitle}
    </>
  );
};

export default AuthLogin;
