import { State, useHookstate } from '@hookstate/core';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Alert, Button } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { FirebaseError } from 'firebase-admin';
import * as React from 'react';

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

const handleErros = (
  errCode: string,
  SetAlert: React.Dispatch<React.SetStateAction<JSX.Element>>,
  errSetter: State<{
    errEmail: string;
    errPassword: string;
  }>,
) => {
  switch (errCode) {
    case 'auth/invalid-email': {
      errSetter.errEmail.set('Email is not valid');
      break;
    }
    case 'auth/wrong-password': {
      errSetter.errPassword.set('Password is incorrect');
      break;
    }
    case 'auth/user-not-found': {
      SetAlert(
        MyAlert(
          'Bad password or user name or you do not have account',
          'error',
        ),
      );
      break;
    }
    case 'auth/too-many-requests': {
      SetAlert(MyAlert('Too many attemps for login, try again later', 'error'));
      break;
    }
    default: {
      SetAlert(MyAlert('User registration failed', 'error'));
      break;
    }
  }
};

const Submit = async (
  SetAlert: React.Dispatch<React.SetStateAction<JSX.Element>>,
  errSetter: State<{
    errEmail: string;
    errPassword: string;
  }>,
  data: { password: string; email: string },
) => {
  if (data.email.length === 0) {
    errSetter.errEmail.set('Email was not provided');
    return;
  }

  if (data.password.length === 0) {
    errSetter.errPassword.set('Password was not provided');
    return;
  }

  try {
    await authUtils.login(data.email, data.password);
    SetAlert(MyAlert('User registration succesfull', 'success'));
  } catch (error) {
    const err = error as FirebaseError;
    handleErros(err.code, SetAlert, errSetter);
  }
};

const onChangeForm = (
  errSetter: State<{
    errEmail: string;
    errPassword: string;
  }>,
  SetAlert: React.Dispatch<React.SetStateAction<JSX.Element>>,
) => {
  SetAlert(<div></div>);
  errSetter.set({
    errEmail: '',
    errPassword: '',
  });
};

const ForgotenPass = async (
  email: string,
  errSetter: State<{
    errEmail: string;
    errPassword: string;
  }>,
  SetAlert: React.Dispatch<React.SetStateAction<JSX.Element>>,
) => {
  if (errSetter.errEmail.get() === '') {
    await authUtils.fotgotenPass(email);
  } else {
    SetAlert(MyAlert('Invalid email or email does not exist', 'error'));
  }
};
// TODO remove, this demo shouldn't need to reset the theme.
// const defaultTheme = createTheme();

export const PageFormLogin = () => {
  const [myAlert, SetmyAlert] = React.useState(<div></div>);

  const errCredentials = useHookstate({
    errEmail: '',
    errPassword: '',
  });

  const credentials = useHookstate({
    email: '',
    password: '',
  });

  return (
    // <ThemeProvider theme={defaultTheme}>
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
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        {myAlert}
        <Box
          component="form"
          onChange={() => onChangeForm(errCredentials, SetmyAlert)}
          noValidate
          sx={{ mt: 1 }}
        >
          {errCredentials.errEmail.get() === '' ? (
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              onChange={(e) => credentials.email.set(e.target.value)}
              autoComplete="email"
              autoFocus
              helperText="Enter your email"
            />
          ) : (
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              error
              label="Email Address"
              onChange={(e) => credentials.email.set(e.target.value)}
              autoComplete="email"
              autoFocus
              helperText={errCredentials.errEmail.get()}
            />
          )}
          {errCredentials.errPassword.get() === '' ? (
            <TextField
              margin="normal"
              required
              fullWidth
              onChange={(e) => credentials.password.set(e.target.value)}
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              helperText="Enter your password"
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
            />
          )}

          <Grid container>
            <Grid>
              <Button
                onClick={() =>
                  ForgotenPass(
                    credentials.email.get(),
                    errCredentials,
                    SetmyAlert,
                  )
                }
              >
                Forgot password?
              </Button>
            </Grid>
            <Grid item>
              <Link href="register-page" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
          <Button
            onClick={() =>
              Submit(SetmyAlert, errCredentials, {
                email: credentials.email.get(),
                password: credentials.password.get(),
              })
            }
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Login
          </Button>
        </Box>
      </Box>
    </Container>
    // </ThemeProvider>
  );
};
