import { State, useHookstate } from '@hookstate/core';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Alert, Button, styled } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { FirebaseError } from 'firebase-admin';
import router from 'next/router';
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
      errSetter.errEmail.set('E-mail není validní');
      break;
    }
    case 'auth/wrong-password': {
      SetAlert(MyAlert('Špatné heslo nebo e-mail', 'error'));
      break;
    }
    case 'auth/user-not-found': {
      SetAlert(MyAlert('Špatné heslo nebo email nebo nemáte účet', 'error'));
      break;
    }
    case 'auth/too-many-requests': {
      SetAlert(
        MyAlert(
          'Příliš mnoho pokusů o přihlášení, zkuste to znovu později',
          'error',
        ),
      );
      break;
    }
    default: {
      SetAlert(MyAlert('Přihlášení uživatele nebylo úspěšné', 'error'));
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
    await router.push('../../');
  } catch (error) {
    const err = error as FirebaseError;
    handleErros(err.code, SetAlert, errSetter);
  }
};

const MenuButton = styled(Button)({
  color: 'blue',
  backgroundColor: 'transparent',
  fontSize: '14px',
});

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
  SetAlert: React.Dispatch<React.SetStateAction<JSX.Element>>,
  errSetter: State<{
    errEmail: string;
    errPassword: string;
  }>,
) => {
  try {
    await authUtils.fotgotenPass(email);
    SetAlert(
      MyAlert(
        'Vaše žádost o resetování hesla byla úspěšná. Podívejte se na svůj e-mailový účet',
        'success',
      ),
    );
  } catch (error) {
    const err = error as FirebaseError;
    if (err.code === 'auth/missing-email') {
      errSetter.errEmail.set('E-mail je povinný');
    }
    if (err.code === 'auth/invalid-email') {
      errSetter.errEmail.set('E-mail není validní');
    }
  }
};

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
          Přihlásit se
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
              label="E-mail"
              onChange={(e) => credentials.email.set(e.target.value)}
              autoComplete="email"
              autoFocus
              helperText="Zadej svůj e-mail"
            />
          ) : (
            <TextField
              margin="normal"
              required
              fullWidth
              error
              label="E-mail"
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
              label="Heslo"
              type="password"
              autoComplete="current-password"
              helperText="Zadej své heslo"
            />
          ) : (
            <TextField
              margin="normal"
              required
              fullWidth
              error
              onChange={(e) => credentials.password.set(e.target.value)}
              label="Heslo"
              type="password"
              autoComplete="current-password"
              helperText={errCredentials.errPassword.get()}
            />
          )}

          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
            }}
          >
            <MenuButton
              onClick={async () => {
                await router.push(`../../Forms/register-page`);
              }}
            >
              Zaregistruj se
            </MenuButton>
            <MenuButton
              onClick={() =>
                ForgotenPass(
                  credentials.email.get(),
                  SetmyAlert,
                  errCredentials,
                )
              }
            >
              Zapomenuté heslo
            </MenuButton>
          </Box>
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
            Přihlásit
          </Button>
        </Box>
      </Box>
    </Container>
  );
};
