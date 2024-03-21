import MenuIcon from '@mui/icons-material/Menu';
import {
  Button,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { User } from 'firebase/auth';
import router from 'next/router';
import React from 'react';

import { authUtils } from '@/firebase/auth-utils';

type PropsUs = {
  user: User | null | undefined;
};

const drawerWidth = 240;
const label = {
  settings: 'Account settings',
  home: 'Home',
  login: 'Login',
  logOut: 'Logout',
};

const Method = async (item: string) => {
  if (item === label.logOut) {
    await authUtils.logout();
  }
  if (item === label.home) {
    await router.push(`/../../`);
  }
  if (item === label.settings) {
    await router.push(`/../user-page`);
  }
  if (item === label.login) {
    await router.push(`/../Forms/login-page`);
  }
};

const NavItems = (user: User | null | undefined) => {
  if (user) {
    return [label.home, label.settings, label.logOut].map((item) => (
      <Button onClick={() => Method(item)} key={item}>
        {item}
      </Button>
    ));
  }
  return [label.home, label.login].map((item) => (
    <Button onClick={() => Method(item)} key={item}>
      {item}
    </Button>
  ));
};

const navItemsDraver = (user: User | null | undefined) => {
  if (user) {
    return [label.home, label.settings, label.logOut].map((item) => (
      <ListItem key={item} disablePadding>
        <ListItemButton sx={{ textAlign: 'center' }}>
          <ListItemText
            onClick={() => Method(item)}
            primary={item}
            sx={{ color: '#0F95F5' }}
          />
        </ListItemButton>
      </ListItem>
    ));
  }
  return [label.home, label.login].map((item) => (
    <ListItem key={item} disablePadding>
      <ListItemButton sx={{ textAlign: 'center' }}>
        <ListItemText
          onClick={() => Method(item)}
          primary={item}
          sx={{ color: '#0F95F5' }}
        />
      </ListItemButton>
    </ListItem>
  ));
};

export const Navbar: React.FC<PropsUs> = ({ user }) => {
  // zkusit getAuth
  // const [stateAuth, SetAuth] = useState(Boolean(user));

  // const onStateChanged = React.useCallback(() => {
  //   SetAuth((prev) => !prev);
  // }, []);

  // useEffect(() => {
  //   authUtils.onAuthStateChange(onStateChanged);
  // }, [onStateChanged]);

  const navItm = NavItems(user);

  const container =
    window === undefined ? undefined : () => window.document.body;

  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2, color: '#167EF5' }}>
        Menu
      </Typography>
      <Divider />
      <List>{navItemsDraver(user)}</List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', paddingBottom: '50px' }}>
      <CssBaseline />
      <AppBar>
        <Toolbar className="nav">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          >
            Bingo balík
          </Typography>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>{navItm}</Box>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
    </Box>
  );
};
