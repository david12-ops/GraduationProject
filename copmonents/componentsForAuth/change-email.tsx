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
import { User } from 'firebase/auth';
import { FirebaseError } from 'firebase-admin';
import React, { useState } from 'react';

import { authUtils } from '@/firebase/auth-utils';

import { useAuthContext } from '../auth-context-provider';

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
  SetAlert: React.Dispatch<React.SetStateAction<JSX.Element | undefined>>,
  user: User | null | undefined,
) => {
  try {
    if (user) {
      await authUtils.channgeUsEmail(user, email);
      SetAlert(MyAlert('Změna emailu byla úspěšná', 'success'));
    }
  } catch (error) {
    const err = error as FirebaseError;
    switch (err.code) {
      case 'auth/user-not-found': {
        SetAlert(MyAlert('E-mail neexistuje', 'error'));
        break;
      }
      case 'auth/invalid-email': {
        SetAlert(MyAlert('E-mail není validní', 'error'));
        break;
      }
      default: {
        SetAlert(MyAlert('Úprava emailu uživatele nebyla úspěšná', 'error'));
        break;
      }
    }
  }
};

const onChangeForm = (
  SetEmErr: React.Dispatch<React.SetStateAction<string>>,
  SetAlert: React.Dispatch<React.SetStateAction<JSX.Element | undefined>>,
) => {
  SetAlert(undefined);
  SetEmErr('');
};
export const PageFormChangeEm = () => {
  const [newEm, SetNewEm] = useState('');
  const [erroEmail, SetEmailErr] = useState('');
  const [myAlert, SetmyAlert] = React.useState<JSX.Element | undefined>(
    undefined,
  );
  const { user } = useAuthContext();

  return (
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
          Změna emailu
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
              label="E-mail"
              onChange={(e) => SetNewEm(e.target.value)}
              autoComplete="email"
              autoFocus
              helperText="Zadejte nový e-mail"
            />
          ) : (
            <TextField
              margin="normal"
              required
              fullWidth
              error
              label="E-mail"
              onChange={(e) => SetNewEm(e.target.value)}
              autoComplete="email"
              autoFocus
              helperText={erroEmail}
            />
          )}

          <Button
            onClick={() => Submit(newEm, SetmyAlert, user)}
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Odeslat
          </Button>
        </Box>
      </Box>
    </Container>
  );
};
