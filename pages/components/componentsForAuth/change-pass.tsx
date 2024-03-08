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
import { getAuth } from 'firebase/auth';
import { FirebaseError } from 'firebase-admin';
import React from 'react';

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

const ValidPassword = (
  newPassword: string,
  confirmPassword: string,
): { where: string | undefined; errMesage: string | undefined } => {
  const hasSymbol = /[!"#$%&()*,.:<>?@^{|}]/.test(newPassword);

  const hasNumber = /\d/.test(newPassword);
  if (newPassword.length === 0) {
    return { where: 'newPass', errMesage: 'New password was not provided' };
  }

  if (newPassword.length < 8) {
    return {
      where: 'newPass',
      errMesage: 'New password length must be longer than 8 characters',
    };
  }

  if (!hasSymbol || !hasNumber) {
    return {
      where: 'newPass',
      errMesage:
        'New password is not combination of chars, numbers and symbols',
    };
  }

  if (confirmPassword.length === 0) {
    return {
      where: 'confirmPass',
      errMesage: 'Confirm password was not provided',
    };
  }

  if (newPassword !== confirmPassword) {
    return {
      where: 'confirmPass',
      errMesage: 'Confirm password is not same as new password',
    };
  }

  return { where: undefined, errMesage: undefined };
};
const onChangeForm = (
  errSetter: State<{
    errConfirmPassword: string;
    errNewPassword: string;
  }>,
  SetAlert: React.Dispatch<React.SetStateAction<JSX.Element>>,
) => {
  SetAlert(<div></div>);
  errSetter.set({
    errConfirmPassword: '',
    errNewPassword: '',
  });
};
const Submit = async (
  SetAlert: React.Dispatch<React.SetStateAction<JSX.Element>>,
  passwords: { newPassword: string; confirmPassword: string },
  errSetter: State<{
    errConfirmPassword: string;
    errNewPassword: string;
  }>,
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
    const auth = getAuth();
    if (auth.currentUser) {
      await authUtils.changeUsPass(auth.currentUser, passwords.newPassword);
      SetAlert(MyAlert('User password update successfull', 'success'));
    }
  } catch (error) {
    const err = error as FirebaseError;
    switch (err.code) {
      case 'auth/requires-recent-login': {
        SetAlert(MyAlert('User password not updated successfully', 'error'));
        break;
      }
      default: {
        SetAlert(MyAlert('User password update failed', 'error'));
        break;
      }
    }
  }
};

export const PageFormChangePass = () => {
  const setterPassword = useHookstate({
    confirmPassword: '',
    newPassword: '',
  });

  const setterErrPassword = useHookstate({
    errConfirmPassword: '',
    errNewPassword: '',
  });

  const [myAlert, SetmyAlert] = React.useState(<div></div>);

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
          Change password
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
              label="New password"
              type="password"
              autoComplete="current-password"
              helperText="Enter new password"
            />
          ) : (
            <TextField
              margin="normal"
              required
              fullWidth
              error
              id="newPass"
              onChange={(e) => setterPassword.newPassword.set(e.target.value)}
              label="New password"
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
              label="Confirm password"
              type="password"
              autoComplete="current-password"
              helperText="Confirm new password"
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
              label="Confirm password"
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
              )
            }
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </Container>
  );
};
