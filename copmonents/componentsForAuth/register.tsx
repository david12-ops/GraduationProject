import { State, useHookstate } from '@hookstate/core';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Alert } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
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

const ValidCredentials = (
  password: string,
  email: string,
): { where: string | undefined; errMesage: string | undefined } => {
  const data = { pass: password, em: email };
  const hasSymbol = /[ !"#$%&()*,.<>?@^{|}]/.test(password);
  const hasNumber = /\d/.test(password);
  if (data.em.length === 0) {
    return { where: 'email', errMesage: 'E-mail nebyl poskytnut' };
  }

  if (data.pass.length === 0) {
    return { where: 'password', errMesage: 'Nebylo poskytnuto heslo' };
  }

  if (data.pass.length < 8) {
    return { where: 'password', errMesage: 'Délka hesla je malá' };
  }

  if (!hasSymbol || !hasNumber) {
    return {
      where: 'password',
      errMesage: 'Heslo není kombinací znaků, čísel a symbolů',
    };
  }

  const getPartEmIndex = data.em.indexOf('@');

  if (
    password.includes(data.em.slice(0, getPartEmIndex)) &&
    getPartEmIndex > 0
  ) {
    return {
      where: 'password',
      errMesage: 'Heslo obsahuje e-mailový účet',
    };
  }

  return { where: undefined, errMesage: undefined };
};

const onChangeForm = (
  errSetter: State<{
    errEmail: string;
    errPassword: string;
  }>,
  SetAlert: React.Dispatch<React.SetStateAction<JSX.Element | undefined>>,
) => {
  SetAlert(undefined);
  errSetter.set({
    errEmail: '',
    errPassword: '',
  });
};

const RequirementsPass = () => {
  return (
    <div
      style={{
        border: '3px solid #FADF79',
        borderRadius: '10px',
        background: '#FADF79',
        padding: '10px',
      }}
    >
      <p style={{ margin: '6px' }}>Délka větší nebo rovna 8</p>
      <p style={{ margin: '6px' }}>Kombinace symbolu, čísla, znaku</p>
      <p style={{ margin: '6px' }}>Část e-mailu není součástí hesla</p>
    </div>
  );
};

const defaultTheme = createTheme();

const Submit = async (
  data: { password: string; email: string },
  SetAlert: React.Dispatch<React.SetStateAction<JSX.Element | undefined>>,
  errSetter: State<{
    errEmail: string;
    errPassword: string;
  }>,
) => {
  const validation = ValidCredentials(data.password, data.email);

  if (validation.where && validation.errMesage) {
    switch (validation.where) {
      case 'password': {
        errSetter.errPassword.set(validation.errMesage);
        return;
      }
      case 'email': {
        errSetter.errEmail.set(validation.errMesage);
        return;
      }
      default: {
        return;
      }
    }
  }
  try {
    await authUtils.register(data.email, data.password);
    await router.push('../../');
  } catch (error) {
    const err = error as FirebaseError;
    switch (err.code) {
      case 'auth/email-already-in-use': {
        errSetter.errEmail.set('E-mail používá jiný uživatel');
        break;
      }
      case 'auth/invalid-email': {
        errSetter.errEmail.set('E-mail není validní');
        break;
      }
      default: {
        SetAlert(MyAlert('Registrace uživatelé nebyla úspěšná', 'error'));
      }
    }
  }
};

const Credentials = async (
  data: { emeil: string; password: string },
  SetAlert: React.Dispatch<React.SetStateAction<JSX.Element | undefined>>,
  errSetter: State<{
    errEmail: string;
    errPassword: string;
  }>,
) => {
  if (data.emeil.length > 0 && data.password.length > 0) {
    await Submit(
      {
        password: data.password,
        email: data.emeil,
      },
      SetAlert,
      errSetter,
    );
  } else {
    SetAlert(
      MyAlert(
        'Nebyly poskytnuty přihlašovací údaje k vašemu novému účtu',
        'error',
      ),
    );
  }
};

export const PageRegisterForm = () => {
  const [close, SetClose] = React.useState(true);
  const [myAlert, SetmyAlert] = React.useState<JSX.Element | undefined>(
    undefined,
  );
  const credentials = useHookstate({
    email: '',
    password: '',
  });

  const errCredentials = useHookstate({
    errEmail: '',
    errPassword: '',
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
        >
          <Avatar src="/broken-image.jpg" />
          <Typography component="h1" variant="h5">
            Registrace
          </Typography>
          {myAlert}
          <Box
            component="form"
            onChange={() => onChangeForm(errCredentials, SetmyAlert)}
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
                helperText="Zadejte nový e-mail"
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

            <div style={{ display: 'flex', color: 'darkblue' }}>
              <Button onClick={() => SetClose((prev) => !prev)}>
                <InfoOutlinedIcon
                  sx={{ color: 'darkblue', width: '30px', height: '30px' }}
                />
              </Button>
              <p style={{ textAlign: 'center', margin: '10px' }}>
                Požadavky na heslo
              </p>
            </div>

            <div>{close === true ? <div></div> : RequirementsPass()}</div>

            {errCredentials.errPassword.get() === '' ? (
              <TextField
                margin="normal"
                required
                fullWidth
                onChange={(e) => credentials.password.set(e.target.value)}
                label="Heslo"
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
                onChange={(e) => credentials.password.set(e.target.value)}
                label="Heslo"
                type="password"
                autoComplete="current-password"
                helperText={errCredentials.errPassword.get()}
              />
            )}

            <Button
              onClick={() =>
                Credentials(
                  {
                    emeil: credentials.email.get(),
                    password: credentials.password.get(),
                  },
                  SetmyAlert,
                  errCredentials,
                )
              }
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Zaregistrovat se
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};
