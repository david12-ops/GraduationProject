// 'use client';

// import { FirebaseError } from 'firebase-admin';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import React, { FormEvent } from 'react';

// import { authUtils } from '../../../firebase/auth-utils';
// import styles from '../../../styles/stylesForm/style.module.css';

// export const PageRegisterForm = () => {
//   const [email, setEmail] = React.useState('');
//   const [password, setPassword] = React.useState('');
//   const router = useRouter();

//   const handleForm = async (event: FormEvent) => {
//     try {
//       event.preventDefault();

//       await authUtils.register(email, password);

//       alert('User register successfully');

//       return router.push('/');
//     } catch (error) {
//       const err = error as FirebaseError;
//       if (err.code === 'auth/email-already-in-use') {
//         alert('User is already in use');
//       }
//     }
//   };
//   return (
//     <div>
//       <div className={styles.container}>
//         <h1>Register</h1>
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
//             Register
//           </button>
//         </form>
//         <div className={styles.signin}>
//           <p>
//             Already have an account?
//             <Link
//               className={styles.reference}
//               key="login-page"
//               href="../../Forms/login-page"
//             >
//               Sign in
//             </Link>
//             .
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
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

const RequirementsPass = () => {
  return (
    <div
      style={{
        border: '3px solid #FADF79',
        borderRadius: '10px',
        background: '#FADF79',
        margin: '10px',
        padding: '10px',
      }}
    >
      <p style={{ margin: '8px' }}>Password lenght must be min 7 characters</p>
      <p style={{ margin: '8px' }}>
        Must include combination of symbol, number and character
      </p>
      <p style={{ margin: '8px' }}>
        Email accaount can not be part of passsword
      </p>
    </div>
  );
};

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export const PageRegisterForm = () => {
  const [close, SetClose] = React.useState(true);
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
          <Avatar src="/broken-image.jpg" />

          <Typography component="h1" variant="h5">
            Register
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

            <div style={{ display: 'flex', color: 'darkblue' }}>
              <Button onClick={() => SetClose(false)}>
                <InfoOutlinedIcon
                  sx={{ color: 'darkblue', width: '30px', height: '30px' }}
                />
              </Button>
              <p style={{ textAlign: 'center', margin: '10px' }}>
                Password requirements
              </p>
            </div>

            <div> {close === true ? <div></div> : RequirementsPass()}</div>

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

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Register
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};
