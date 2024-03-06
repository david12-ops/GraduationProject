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
    if (!auth.currentUser) {
      // zeptat se jestli to neudelat verejny
      SetAlert(MyAlert('User not logged to change ', 'error'));
      return;
    }

    await authUtils.channgeUsEmail(auth.currentUser, email);
    SetAlert(MyAlert('User password update successfull', 'success'));

    // return await router.push('/');
  } catch (error) {
    const err = error as FirebaseError;
    if (err.code === 'auth/user-not-found') {
      SetAlert(
        MyAlert(
          'Bad password or user name or you do not have account',
          'error',
        ),
      );
    }
  }
};

const onChangeForm = (
  SetEmErr: React.Dispatch<React.SetStateAction<string>>,
  SetAlert: React.Dispatch<React.SetStateAction<JSX.Element>>,
) => {
  SetAlert(<div></div>);
  SetEmErr('Any');
};
export const PageFormChangeEm = () => {
  const [newEm, SetNewEm] = useState('');
  const [erroEmail, SetEmailErr] = useState('Any');
  const [myAlert, SetmyAlert] = React.useState(<div></div>);
  // const router = useRouter();

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
        {myAlert}
        <Typography component="h1" variant="h5">
          Change email
        </Typography>
        <Box
          component="form"
          onChange={() => onChangeForm(SetEmailErr, SetmyAlert)}
          noValidate
          sx={{ mt: 1 }}
        >
          {erroEmail === 'Any' ? (
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
