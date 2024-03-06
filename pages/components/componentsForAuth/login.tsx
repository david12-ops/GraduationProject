// 'use client';

// import { FirebaseError } from 'firebase-admin';
// import { useRouter } from 'next/router';
// import React, { FormEvent } from 'react';

// import { authUtils } from '@/firebase/auth-utils';

// import styles from '../../../styles/stylesForm/style.module.css';

// export const PageFormLogin = () => {
//   const [email, setEmail] = React.useState('');
//   const [password, setPassword] = React.useState('');
//   const router = useRouter();
//   const handleForm = async (event: FormEvent) => {
//     try {
//       event.preventDefault();
//       await authUtils.login(email, password);
//       alert('User login successfully');
//       return await router.push('/');
//     } catch (error) {
//       // nechyta error
//       const err = error as FirebaseError;
//       if (err.code === 'auth/user-not-found') {
//         alert('Bad password or user name or you do not have account');
//       }
//     }
//   };
//   return (
//     <div>
//       <div className={styles.container}>
//         <h1>Login</h1>
//         <form onSubmit={handleForm} className={styles.form}>
//           <label htmlFor="email">
//             <p>Email</p>
//             <input
//               className={styles.email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               type="email"
//               name="email"
//               id="email"
//               placeholder="example@mail.com"
//             />
//           </label>
//           <label htmlFor="password">
//             <p>Password</p>
//             <input
//               className={styles.password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               type="password"
//               name="password"
//               id="password"
//               placeholder="password"
//             />
//           </label>

//           <button className={styles.registerbtn} type="submit">
//             Sign up
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };
import { State, useHookstate } from '@hookstate/core';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Alert, Button } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import {
  browserSessionPersistence,
  getAuth,
  setPersistence,
} from 'firebase/auth';
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

const Submit = async (
  SetAlert: React.Dispatch<React.SetStateAction<JSX.Element>>,
  errSetter: State<{
    errEmail: string;
    errPassword: string;
  }>,
  data: { password: string; email: string },
  isCheck: boolean,
  // eslint-disable-next-line sonarjs/cognitive-complexity
) => {
  // event.preventDefault();
  // const data = new FormData(event.currentTarget);
  // window.localStorage.removeItem()
  const errMsgEmail = 'Email is not valid';
  const errMsgLogin = 'Bad password or user name or you do not have account';
  const errMsgPassword =
    'Password is not valid (must be a string with at least six characters)';
  if (data.email.length === 0) {
    errSetter.errEmail.set('Email was not provided');
    return;
  }

  if (data.password.length === 0) {
    errSetter.errPassword.set('Password was not provided');
    return;
  }

  const login = async () => {
    const auth = getAuth();
    const response: {
      email: string;
      password: string;
      errMsg: { login: string; password: string; email: string };
    } = {
      email: 'Any',
      password: 'Any',
      errMsg: { login: 'Any', password: 'Any', email: 'Any' },
    };

    return setPersistence(auth, browserSessionPersistence).then(async () => {
      // New sign-in will be persisted with session persistence.
      try {
        await authUtils.login(data.email, data.password);
        response.email = data.email;
        response.password = data.password;
        // response.errMsg.login = 'Any';
        // response.errMsg.email = 'Any';
        // response.errMsg.password = 'Any';
        // SetAlert(MyAlert('User registration succesfull', 'success'));
      } catch (error) {
        const err = error as FirebaseError;
        if (err.code === 'auth/user-not-found') {
          // response.email = 'Any';
          // response.password = 'Any';
          // SetAlert(
          //   MyAlert(
          //     'Bad password or user name or you do not have account',
          //     'error',
          //   ),
          // );
          // response.errMsg.email = 'Any';
          // response.errMsg.password = 'Any';
          response.errMsg.login = errMsgLogin;
        }
        if (err.code === 'auth/invalid-email') {
          response.errMsg.email = errMsgEmail;
          // errSetter.errEmail.set('Email is not valid');
        }
        if (err.code === 'auth/invalid-password') {
          response.errMsg.password = errMsgPassword;
          // errSetter.errPassword.set('Password is not valid');
        }
      }

      return response;
    });
  };

  let response;
  if (isCheck) {
    response = login();
    console.error('respooonse', await response);
    const { errMsg, email, password } = await response;
    if (errMsg.login !== 'Any') {
      SetAlert(MyAlert(errMsg.login, 'error'));
    }
    if (errMsg.password !== 'Any') {
      errSetter.errPassword.set(errMsg.password);
    }
    if (email !== 'Any' && password !== 'Any') {
      SetAlert(MyAlert('User registration succesfull', 'success'));
    }
  } else {
    try {
      await authUtils.login(data.email, data.password);
      SetAlert(MyAlert('User registration succesfull', 'success'));
    } catch (error) {
      const err = error as FirebaseError;
      // eslint-disable-next-line max-depth
      if (err.code === 'auth/user-not-found') {
        SetAlert(MyAlert(errMsgLogin, 'error'));
      }
      // eslint-disable-next-line max-depth
      if (err.code === 'auth/invalid-email') {
        errSetter.errEmail.set(errMsgEmail);
      }
      // eslint-disable-next-line max-depth
      if (err.code === 'auth/invalid-password') {
        errSetter.errPassword.set(errMsgPassword);
      }
    }
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
    errEmail: 'Any',
    errPassword: 'Any',
  });
};

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export const PageFormLogin = () => {
  // const storage = window.localStorage;

  const [myAlert, SetmyAlert] = React.useState(<div></div>);
  const [isChecked, SetIsChecked] = React.useState(false);

  const errCredentials = useHookstate({
    errEmail: 'Any',
    errPassword: 'Any',
  });

  const credentials = useHookstate({
    email: '',
    password: '',
  });

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
          onChange={() => onChangeForm(errCredentials, SetmyAlert)}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
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
            {errCredentials.errEmail.get() === 'Any' ? (
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                onChange={(e) => credentials.email.set(e.target.value)}
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
                onChange={(e) => credentials.email.set(e.target.value)}
                autoComplete="email"
                autoFocus
                helperText={errCredentials.errEmail.get()}
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
              />
            )}
            <FormControlLabel
              control={
                <Checkbox
                  value="remember"
                  onChange={(e) => SetIsChecked(e.target.checked)}
                  color="primary"
                />
              }
              label="Remember me"
            />
            <Grid container>
              <Grid item xs>
                <Link href="change-pass-page" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="register-page" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
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
    </ThemeProvider>
  );
};
