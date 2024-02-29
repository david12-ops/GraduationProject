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
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import * as React from 'react';

const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  console.log({
    email: data.get('email'),
    password: data.get('password'),
  });
};

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export const PageFormLogin = () => {
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
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};
