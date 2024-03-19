// import { AccountCircle } from '@mui/icons-material';
// import MenuIcon from '@mui/icons-material/Menu';
// import MoreIcon from '@mui/icons-material/MoreVert';
// import {
//   AppBar,
//   Box,
//   IconButton,
//   Menu,
//   MenuItem,
//   Toolbar,
//   Typography,
// } from '@mui/material';
// import Link from 'next/link';
// import React, { FC } from 'react';

// import { authUtils } from '@/firebase/auth-utils';

// export const Navbar: FC = () => {
//   // betterMenuCmp - komponenta jako Menu
//   const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
//   const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
//     React.useState<null | HTMLElement>(null);
//   const [BurgeranchorEL, setBurgerAnchorEl] =
//     React.useState<null | HTMLElement>(null);

//   const isBurgerMenuOpen = Boolean(BurgeranchorEL);
//   const isMenuOpen = Boolean(anchorEl);
//   const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

//   const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleMobileMenuClose = () => {
//     setMobileMoreAnchorEl(null);
//     setBurgerAnchorEl(null);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//     handleMobileMenuClose();
//     setBurgerAnchorEl(null);
//   };

//   const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
//     setMobileMoreAnchorEl(event.currentTarget);
//   };

//   const handleBurgerMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
//     setBurgerAnchorEl(event.currentTarget);
//   };

//   const menuId = 'primary-search-account-menu';
//   const renderMenu = (
//     <Menu
//       anchorEl={anchorEl}
//       anchorOrigin={{
//         vertical: 'top',
//         horizontal: 'right',
//       }}
//       id={menuId}
//       keepMounted
//       transformOrigin={{
//         vertical: 'top',
//         horizontal: 'right',
//       }}
//       open={isMenuOpen}
//       onClose={handleMenuClose}
//     >
//       <Link key="my-account" href="/../my-account">
//         <MenuItem onClick={handleMenuClose}>My account</MenuItem>
//       </Link>
//       <Link key="register-page" href="/../Forms/register-page">
//         <MenuItem onClick={handleMenuClose}>Register</MenuItem>
//       </Link>
//       <Link key="changepass-page" href="/../Forms/changepass-page">
//         <MenuItem onClick={handleMenuClose}>Change password</MenuItem>
//       </Link>
//       <Link key="changeEm-page" href="/../Forms/changeEm-page">
//         <MenuItem onClick={handleMenuClose}>Change email</MenuItem>
//       </Link>
//       <Link key="index" href="/../../">
//         <MenuItem onClick={authUtils.logout}>Odhlásit</MenuItem>
//       </Link>
//     </Menu>
//   );

//   const mobileMenuId = 'primary-search-account-menu-mobile';
//   const renderMobileMenu = (
//     <Menu
//       anchorEl={mobileMoreAnchorEl}
//       anchorOrigin={{
//         vertical: 'top',
//         horizontal: 'right',
//       }}
//       id={mobileMenuId}
//       keepMounted
//       transformOrigin={{
//         vertical: 'top',
//         horizontal: 'right',
//       }}
//       open={isMobileMenuOpen}
//       onClose={handleMobileMenuClose}
//     >
//       <MenuItem onClick={handleProfileMenuOpen}>
//         <IconButton
//           size="large"
//           aria-label="account of current user"
//           aria-controls="primary-search-account-menu"
//           aria-haspopup="true"
//           color="inherit"
//         >
//           <AccountCircle />
//         </IconButton>
//         <p>Profile</p>
//       </MenuItem>
//     </Menu>
//   );

//   const burgerMenuId = 'primary-burger-menu';
//   const renderBurgerMenu = (
//     <Menu
//       anchorEl={BurgeranchorEL}
//       anchorOrigin={{
//         vertical: 'top',
//         horizontal: 'right',
//       }}
//       id={burgerMenuId}
//       keepMounted
//       transformOrigin={{
//         vertical: 'top',
//         horizontal: 'right',
//       }}
//       open={isBurgerMenuOpen}
//       onClose={handleMenuClose}
//     >
//       <Link key="index" href="/">
//         <MenuItem onClick={handleMenuClose}>Home</MenuItem>{' '}
//       </Link>
//     </Menu>
//   );

//   return (
//     <Box>
//       <AppBar position="static">
//         <Toolbar className="appBar">
//           <IconButton
//             size="large"
//             edge="start"
//             color="inherit"
//             aria-label="open drawer"
//             sx={{ mr: 2 }}
//             aria-controls={burgerMenuId}
//             aria-haspopup="true"
//             onClick={handleBurgerMenuOpen}
//           >
//             <MenuIcon />
//           </IconButton>
//           <Typography
//             variant="h6"
//             noWrap
//             component="div"
//             sx={{ display: { xs: 'none', sm: 'block' } }}
//           >
//             MUI
//           </Typography>
//           <Box sx={{ flexGrow: 1 }} />
//           <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
//             <IconButton
//               size="large"
//               edge="end"
//               aria-label="account of current user"
//               aria-controls={menuId}
//               aria-haspopup="true"
//               onClick={handleProfileMenuOpen}
//               color="inherit"
//             >
//               <AccountCircle />
//             </IconButton>
//           </Box>
//           <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
//             <IconButton
//               size="large"
//               aria-label="show more"
//               aria-controls={mobileMenuId}
//               aria-haspopup="true"
//               onClick={handleMobileMenuOpen}
//               color="inherit"
//             >
//               <MoreIcon />
//             </IconButton>
//           </Box>
//         </Toolbar>
//       </AppBar>
//       {renderMobileMenu}
//       {renderMenu}
//       {renderBurgerMenu}
//     </Box>
//   );
// };
// import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { User } from 'firebase/auth';
import router from 'next/router';
import React, { useState } from 'react';

import { authUtils } from '@/firebase/auth-utils';

type Props = {
  user: User | null;
};
// interface Props {
//   /**
//    * Injected by the documentation to work in an iframe.
//    * You won't need it on your project.
//    */
//   window?: () => Window;
// }

// const drawerWidth = 240;

const Method = async (
  item: string,
  SetNavItemsState: React.Dispatch<React.SetStateAction<string>>,
) => {
  if (item === 'Logout') {
    SetNavItemsState('Changed');
    await authUtils.logout();
  }
  if (item === 'Home') {
    SetNavItemsState('Not changed');
    await router.push(`/../../`);
  }
  if (item === 'Account settings') {
    SetNavItemsState('Not changed');
    await router.push(`/../user-page`);
  }
  if (item === 'Login') {
    SetNavItemsState('Not changed');
    await router.push(`/../Forms/login-page`);
  }
};

const NavItems = (
  user: User | null,
  SetNavItemsState: React.Dispatch<React.SetStateAction<string>>,
) => {
  if (user) {
    return ['Home', 'Account settings', 'Logout'].map((item) => (
      <Button
        onClick={() => Method(item, SetNavItemsState)}
        key={item}
        sx={{ color: '#fff' }}
      >
        {item}
      </Button>
    ));
  }
  return ['Home', 'Login'].map((item) => (
    <Button
      onClick={() => Method(item, SetNavItemsState)}
      key={item}
      sx={{ color: '#fff' }}
    >
      {item}
    </Button>
  ));
};

export const Navbar: React.FC<Props> = ({ user }) => {
  const [navItemsState, SetNavItemsState] = useState('Not changed');
  const [navItems, SetNavItems] = useState([<div key={''}></div>]);

  let navItm;
  if (navItemsState === 'Changed') {
    SetNavItems(NavItems(authUtils.getCurrentUser(), SetNavItemsState));
    navItm = navItems;
  }

  if (navItemsState === 'Not changed') {
    navItm = NavItems(user, SetNavItemsState);
  }

  // const { window } = props;
  // const [mobileOpen, setMobileOpen] = React.useState(false);

  // const handleDrawerToggle = () => {
  //   setMobileOpen((prevState) => !prevState);
  // };

  // const drawer = (
  //   <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
  //     <Typography variant="h6" sx={{ my: 2 }}>
  //       MUI
  //     </Typography>
  //     <Divider />
  //     <List>
  //       {navItems.map((item) => (
  //         <ListItem key={item} disablePadding>
  //           <ListItemButton sx={{ textAlign: 'center' }}>
  //             <ListItemText primary={item} />
  //           </ListItemButton>
  //         </ListItem>
  //       ))}
  //     </List>
  //   </Box>
  // );

  // const container =
  //   window === undefined ? undefined : () => window().document.body;

  return (
    <Box sx={{ display: 'flex', paddingBottom: '50px' }}>
      {/* <CssBaseline /> */}
      <AppBar>
        <Toolbar className="appBar">
          {/* <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton> */}
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
      {/* <nav>
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
      </nav> */}
    </Box>
  );
};
