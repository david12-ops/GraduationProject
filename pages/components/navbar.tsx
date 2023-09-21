import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import { MenuList } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { alpha, styled } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import * as React from 'react';
import { FC } from 'react';

import { authUtils } from '@/firebase/auth-utils';

import { useAuthContext } from './auth-context-provider';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

export const SearchAppBar: FC = () => {
  const { user, loading } = useAuthContext();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [BurgeranchorEL, setMobileMoreAnchorEl] =
    React.useState<null | HTMLElement>(null);

  const isMenuOpen = Boolean(anchorEl);
  const isBurgerMenuOpen = Boolean(BurgeranchorEL);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const LogOut = async () => {
    handleMenuClose();
    await authUtils.logout();
  };

  // useEffect(() => {
  //   const listener = () => {
  //     if (!Boolean(anchorEl)) {
  //       throw new Error('Submenu is not open, but scroll listener fired');
  //     }

  //     setAnchorEl(null);
  //   };
  //   const scrollListenerOptions: AddEventListenerOptions = { once: true, passive: true, capture: true };

  //   if (Boolean(setAnchorEl)) {
  //     window.addEventListener('scroll', listener, scrollListenerOptions);
  //   }
  //   return () => {
  //     window.removeEventListener('scroll', listener, scrollListenerOptions);
  //   }
  // }, [setAnchorEl]);

  const SubmenuList = styled(MenuList)(({ theme }) => ({
    minWidth: '200px',
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
  }));

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <Link key="my-account" href="/../my-account">
        <MenuItem onClick={handleMenuClose}>My account</MenuItem>
      </Link>
      <Link key="register-page" href="/../register-page">
        <MenuItem onClick={handleMenuClose}>Register</MenuItem>
      </Link>
      <MenuItem onClick={LogOut}>Log out</MenuItem>
    </Menu>
  );

  // const popoverMenu = (
  //   <Popover
  //   open={isMenuOpen}
  //   id = {menuId}
  //   anchorEl={anchorEl}
  //   onClose={handleMenuClose}
  //   anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
  //   transformOrigin={{ vertical: 'top', horizontal: 'right' }}
  //   disableScrollLock={true}
  //   // style={{ position: 'absolute' }}
  //   >
  //   <MenuList>
  //   <Link key = "MyAccount" href="/../MyAccount"><MenuItem onClick={handleMenuClose}>My account</MenuItem></Link>
  //   <Link key = "RegisterPage" href="/../RegisterPage"><MenuItem onClick={handleMenuClose}>Register</MenuItem></Link>
  //   <MenuItem onClick={handleMenuClose}>Log out</MenuItem>
  //   </MenuList>
  // </Popover>
  // );

  const burgerMenuId = 'primary-burger-menu';
  const renderBurgerMenu = (
    <Menu
      anchorEl={BurgeranchorEL}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={burgerMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isBurgerMenuOpen}
      onClose={handleMenuClose}
    >
      <Link key="" href="/../">
        <MenuItem onClick={handleMenuClose}>Home</MenuItem>
      </Link>
      <Link key="Country1" href="/../Country1">
        <MenuItem onClick={handleMenuClose}>Germany leagues</MenuItem>
      </Link>
      <Link key="Country2" href="/../Country2">
        {' '}
        <MenuItem onClick={handleMenuClose}>England leagues</MenuItem>
      </Link>
      <Link key="Country3" href="/../Country3">
        {' '}
        <MenuItem onClick={handleMenuClose}>Spain Leagues</MenuItem>
      </Link>
      <Link key="Country4" href="/../Country4">
        <MenuItem onClick={handleMenuClose}>France leagues</MenuItem>
      </Link>
      <Link key="Country5" href="/../Country5">
        <MenuItem onClick={handleMenuClose}>Italy leagues</MenuItem>
      </Link>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
            aria-controls={burgerMenuId}
            aria-haspopup="true"
            onClick={handleMobileMenuOpen}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: 'none', sm: 'block' } }}
          >
            TopFive
          </Typography>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              {user?.email ?? <AccountCircle />}
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderBurgerMenu}
      {renderMenu}
    </Box>
  );
};
