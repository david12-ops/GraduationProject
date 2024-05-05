'use client';

import { State, useHookstate } from '@hookstate/core';
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
import React from 'react';

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

const ValidPassword = (
  newPassword: string,
  confirmPassword: string,
): { where: string | undefined; errMesage: string | undefined } => {
  const hasSymbol = /[!"#$%&()*,.:<>?@^{|}]/.test(newPassword);

  const hasNumber = /\d/.test(newPassword);
  if (newPassword.length === 0) {
    return { where: 'newPass', errMesage: 'Nebylo poskytnuto nové heslo' };
  }

  if (newPassword.length < 8) {
    return {
      where: 'newPass',
      errMesage: 'Nové heslo musí být delší než 8 znaků',
    };
  }

  if (!hasSymbol || !hasNumber) {
    return {
      where: 'newPass',
      errMesage: 'Nové heslo není kombinací znaků, čísel a symbolů',
    };
  }

  if (confirmPassword.length === 0) {
    return {
      where: 'confirmPass',
      errMesage: 'Nebylo zadáno potvrzení hesla      ',
    };
  }

  if (newPassword !== confirmPassword) {
    return {
      where: 'confirmPass',
      errMesage: 'Heslo pro potvrzení není stejné jako nové heslo',
    };
  }

  return { where: undefined, errMesage: undefined };
};
const onChangeForm = (
  errSetter: State<{
    errConfirmPassword: string;
    errNewPassword: string;
  }>,
  SetAlert: React.Dispatch<React.SetStateAction<JSX.Element | undefined>>,
) => {
  SetAlert(undefined);
  errSetter.set({
    errConfirmPassword: '',
    errNewPassword: '',
  });
};
const Submit = async (
  SetAlert: React.Dispatch<React.SetStateAction<JSX.Element | undefined>>,
  passwords: { newPassword: string; confirmPassword: string },
  errSetter: State<{
    errConfirmPassword: string;
    errNewPassword: string;
  }>,
  user: User | null | undefined,
) => {
  const validation = ValidPassword(
    passwords.newPassword,
    passwords.confirmPassword,
  );

  if (validation.where && validation.errMesage) {
    switch (validation.where) {
      case 'newPass': {
        errSetter.errNewPassword.set(validation.errMesage);
        return;
      }
      case 'confirmPass': {
        errSetter.errConfirmPassword.set(validation.errMesage);
        return;
      }
      default: {
        return;
      }
    }
  }
  try {
    if (user) {
      await authUtils.changeUsPass(user, passwords.newPassword);
      SetAlert(MyAlert('Úprava hesla uživatele byla úspěšná', 'success'));
    } else {
      SetAlert(MyAlert('Uživatel musí být přihlášen', 'error'));
    }
  } catch (error) {
    const err = error as FirebaseError;
    switch (err.code) {
      case 'auth/requires-recent-login': {
        SetAlert(MyAlert('Znovu se přihlšte', 'error'));
        break;
      }
      default: {
        SetAlert(MyAlert('Úprava hesla uživatele nebyla úspěšná', 'error'));
        break;
      }
    }
  }
};

export const PageFormChangePass = () => {
  const { user } = useAuthContext();
  const setterPassword = useHookstate({
    confirmPassword: '',
    newPassword: '',
  });

  const setterErrPassword = useHookstate({
    errConfirmPassword: '',
    errNewPassword: '',
  });

  const [myAlert, SetmyAlert] = React.useState<JSX.Element | undefined>(
    undefined,
  );

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
          Změna hesla
        </Typography>
        {myAlert}
        <Box
          component="form"
          onChange={() => onChangeForm(setterErrPassword, SetmyAlert)}
          noValidate
          sx={{ mt: 1 }}
        >
          {setterErrPassword.errNewPassword.get() === '' ? (
            <TextField
              margin="normal"
              required
              fullWidth
              onChange={(e) => setterPassword.newPassword.set(e.target.value)}
              id="newPass"
              label="Nové heslo"
              type="password"
              autoComplete="current-password"
              helperText="Zadejte nové heslo"
            />
          ) : (
            <TextField
              margin="normal"
              required
              fullWidth
              error
              id="newPass"
              onChange={(e) => setterPassword.newPassword.set(e.target.value)}
              label="Nové heslo"
              type="password"
              autoComplete="current-password"
              helperText={setterErrPassword.errNewPassword.get()}
            />
          )}

          {setterErrPassword.errConfirmPassword.get() === '' ? (
            <TextField
              margin="normal"
              required
              fullWidth
              onChange={(e) =>
                setterPassword.confirmPassword.set(e.target.value)
              }
              id="confPass"
              label="Heslo k potvrzení"
              type="password"
              autoComplete="current-password"
              helperText="Potvrďte nové heslo"
            />
          ) : (
            <TextField
              margin="normal"
              required
              fullWidth
              error
              onChange={(e) =>
                setterPassword.confirmPassword.set(e.target.value)
              }
              id="confPass"
              label="Heslo k potvrzení"
              type="password"
              autoComplete="current-password"
              helperText={setterErrPassword.errConfirmPassword.get()}
            />
          )}

          <Button
            onClick={() =>
              Submit(
                SetmyAlert,
                {
                  newPassword: setterPassword.newPassword.get(),
                  confirmPassword: setterPassword.confirmPassword.get(),
                },
                setterErrPassword,
                user,
              )
            }
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
