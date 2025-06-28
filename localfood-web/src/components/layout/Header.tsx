import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Button,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  LocationOn as LocationIcon,
  ShoppingCart as CartIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { toggleSidebar } from '../../store/slices/uiSlice';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useDispatch();
  
  const { sidebarOpen } = useSelector((state: RootState) => state.ui);
  const { currentLocation } = useSelector((state: RootState) => state.location);

  const navigationItems = [
    { label: 'Home', path: '/' },
    { label: 'Products', path: '/products' },
    { label: 'Categories', path: '/categories' },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      dispatch(toggleSidebar());
    }
  };

  const renderNavigationItems = () => (
    <>
      {navigationItems.map((item) => (
        <Button
          key={item.path}
          color="inherit"
          onClick={() => handleNavigation(item.path)}
          sx={{
            mx: 1,
            color: location.pathname === item.path ? 'secondary.main' : 'inherit',
          }}
        >
          {item.label}
        </Button>
      ))}
    </>
  );

  const renderMobileNavigationItems = () => (
    <List>
      {navigationItems.map((item) => (
        <ListItem key={item.path} disablePadding>
          <ListItemButton
            onClick={() => handleNavigation(item.path)}
            selected={location.pathname === item.path}
          >
            <ListItemText primary={item.label} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );

  return (
    <>
      <AppBar position="sticky" elevation={1}>
        <Toolbar>
          {/* Mobile menu button */}
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => dispatch(toggleSidebar())}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Logo */}
          <Typography
            variant="h6"
            component="div"
            onClick={() => navigate('/')}
            sx={{
              flexGrow: isMobile ? 1 : 0,
              mr: 4,
              cursor: 'pointer',
              fontWeight: 700,
            }}
          >
            🍕 LocalFood
          </Typography>

          {/* Desktop navigation */}
          {!isMobile && (
            <Box sx={{ flexGrow: 1, display: 'flex' }}>
              {renderNavigationItems()}
            </Box>
          )}

          {/* Action buttons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Location indicator */}
            {currentLocation && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mr: 1,
                  display: { xs: 'none', sm: 'flex' },
                }}
              >
                <LocationIcon sx={{ fontSize: 16, mr: 0.5 }} />
                <Typography variant="body2">
                  Location set
                </Typography>
              </Box>
            )}

            {/* Search button */}
            <IconButton
              color="inherit"
              onClick={() => navigate('/search')}
              title="Search"
            >
              <SearchIcon />
            </IconButton>

            {/* Cart button */}
            <IconButton
              color="inherit"
              onClick={() => navigate('/cart')}
              title="Shopping Cart"
            >
              <CartIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile drawer */}
      <Drawer
        anchor="left"
        open={sidebarOpen}
        onClose={() => dispatch(toggleSidebar())}
        sx={{
          display: { xs: 'block', md: 'none' },
        }}
      >
        <Box sx={{ width: 250, pt: 2 }}>
          <Typography
            variant="h6"
            sx={{ px: 2, mb: 2, fontWeight: 700 }}
          >
            🍕 LocalFood
          </Typography>
          {renderMobileNavigationItems()}
        </Box>
      </Drawer>
    </>
  );
};

export default Header;