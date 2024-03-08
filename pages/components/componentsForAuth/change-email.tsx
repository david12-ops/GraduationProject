'use client';

import {
  Alert,
  Box,
  Button,
  Container,
  CssBaseline,
  TextField,
  Typography,
} from '@mui/material';
import { getAuth } from 'firebase/auth';
import { FirebaseError } from 'firebase-admin';
import React, { useState } from 'react';

import { authUtils } from '@/firebase/auth-utils';

const MyAlert = (message: string, type: string) => {
  switch (type) {
    case 'success': {
      return <Alert severity="success">{message}</Alert>;
    }
    case 'error': {
      return <Alert severity="error">{message}</Alert>;
    }
    default: {
      return <div></div>;
    }
  }
};

const Submit = async (
  email: string,
  SetAlert: React.Dispatch<React.SetStateAction<JSX.Element>>,
) => {
  const auth = getAuth();
  try {
    if (auth.currentUser) {
      await authUtils.channgeUsEmail(auth.currentUser, email);
      SetAlert(MyAlert('User password update successfull', 'success'));
    }
  } catch (error) {
    const err = error as FirebaseError;
    switch (err.code) {
      case 'auth/user-not-found': {
        SetAlert(MyAlert('Email does not exist', 'error'));
        break;
      }
      case 'auth/invalid-email': {
        SetAlert(MyAlert('Email is not valid', 'error'));
        break;
      }
      default: {
        SetAlert(MyAlert('User password update failed', 'error'));
        break;
      }
    }
  }
};

const onChangeForm = (
  SetEmErr: React.Dispatch<React.SetStateAction<string>>,
  SetAlert: React.Dispatch<React.SetStateAction<JSX.Element>>,
) => {
  SetAlert(<div></div>);
  SetEmErr('');
};
export const PageFormChangeEm = () => {
  const [newEm, SetNewEm] = useState('');
  const [erroEmail, SetEmailErr] = useState('');
  const [myAlert, SetmyAlert] = React.useState(<div></div>);
  // const router = useRouter();
  // bude treba i password

  return (
    // <ThemeProvider>
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Change email
        </Typography>
        {myAlert}
        <Box
          component="form"
          onChange={() => onChangeForm(SetEmailErr, SetmyAlert)}
          noValidate
          sx={{ mt: 1 }}
        >
          {erroEmail === '' ? (
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              onChange={(e) => SetNewEm(e.target.value)}
              autoComplete="email"
              autoFocus
              helperText="Enter new email"
            />
          ) : (
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              error
              label="Email Address"
              onChange={(e) => SetNewEm(e.target.value)}
              autoComplete="email"
              autoFocus
              helperText={erroEmail}
            />
          )}

          <Button
            onClick={() => Submit(newEm, SetmyAlert)}
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </Container>
    // </ThemeProvider>
  );
};
