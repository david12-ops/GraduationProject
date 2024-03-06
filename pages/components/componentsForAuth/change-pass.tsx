// eslint-disable-next-line unicorn/filename-case

'use client';

import {
  Box,
  Button,
  Container,
  CssBaseline,
  TextField,
  Typography,
} from '@mui/material';
import { getAuth } from 'firebase/auth';
import { useRouter } from 'next/router';
import React from 'react';

import { authUtils } from '@/firebase/auth-utils';

export const PageFormChangePass = () => {
  const [newPassword, setNewPassword] = React.useState('');
  const [ConfirmPass, setConfirmNewPassword] = React.useState('');
  // const { user, loading } = useAuthContext();
  // const ValidPass = (pass: string) => {
  //   // eslint-disable-next-line unicorn/better-regex
  //   // const option = /[A-Z -@*#a-z0-9-]{6,}/;
  //   // if (!option.test(pass)) {
  //   //   return false;
  //   // }
  //   // return true;
  //   const match = pass.match(/[A-Z-#|@|-a-z0-9-]{6,}/);

  //   if (match) {
  //     return true; // Output: 1#2-@9
  //   }
  //   return false;
  // };
  const auth = getAuth();

  console.log(auth.currentUser);

  const router = useRouter();
  // eslint-disable-next-line consistent-return
  const handleForm = async () => {
    // try {
    if (!auth.currentUser) {
      throw new Error('Not logged!');
    }

    // const valid = ValidPass(newPassword);
    // alert(valid);
    // validace hesla, minimalni pozadavky
    if (ConfirmPass !== newPassword) {
      throw new Error('Passwords are not same!');
    }

    // if (valid) {
    //   event.preventDefault();
    //   await authUtils.changeUsPass(auth.currentUser, newPassword);
    //   // eslint-disable-next-line no-alert
    //   alert('User password update successfull');
    //   return await router.push('/');
    // }
    // event.preventDefault();
    // nefunkcni
    console.log(auth.currentUser);
    // const changePass = authUtils.changeUsPass(auth.currentUser, newPassword);
    console.log(authUtils.changeUsPass(auth.currentUser, newPassword));
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    await authUtils.changeUsPass(auth.currentUser, newPassword);
    // eslint-disable-next-line no-alert
    alert('User password update successfull');
    return router.push('/');
    // } catch (error) {
    //   const err = error as FirebaseError;
    //   if (err.code === 'auth/user-not-found') {
    //     alert('Bad password or user name or you do not have account');
    //   }
    // }
  };
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
        {myAlert}
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box
          component="form"
          onChange={() => onChangeForm(errCredentials, SetmyAlert)}
          noValidate
          sx={{ mt: 1 }}
        >
          {errCredentials.errPassword.get() === 'Any' ? (
            <TextField
              margin="normal"
              required
              fullWidth
              onChange={(e) => credentials.password.set(e.target.value)}
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              helperText="Enter new password"
            />
          ) : (
            <TextField
              margin="normal"
              required
              fullWidth
              error
              onChange={(e) => credentials.password.set(e.target.value)}
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              helperText={errCredentials.errPassword.get()}
              value={credentials.password.get()}
            />
          )}

          {errCredentials.errPassword.get() === 'Any' ? (
            <TextField
              margin="normal"
              required
              fullWidth
              onChange={(e) => credentials.password.set(e.target.value)}
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              helperText="Enter new password"
            />
          ) : (
            <TextField
              margin="normal"
              required
              fullWidth
              error
              onChange={(e) => credentials.password.set(e.target.value)}
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              helperText={errCredentials.errPassword.get()}
              value={credentials.password.get()}
            />
          )}

          <Button
            onClick={() =>
              Submit(
                SetmyAlert,
                errCredentials,
                {
                  email: credentials.email.get(),
                  password: credentials.password.get(),
                },
                isChecked,
                credentials,
                SetIsChecked,
              )
            }
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Login{' '}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};
