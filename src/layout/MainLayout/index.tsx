import React from 'react'

// material-ui
import {
  CssBaseline,
  Toolbar,
  Box,
  CircularProgress,
} from '@mui/material';

// thirds-party
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';

// project imports
import Breadcrumbs from 'components/extended/Breadcrumbs';
import navigation from 'menu-items/management';
import Header from 'layout/MainLayout/Header';
import Sidebar from 'layout/MainLayout/Sidebar';
import { SET_MENU } from 'store/actions';

// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout = () => {
  const location = useLocation();
  const dispatch = useDispatch();


  // Handle left drawer
  const leftDrawerOpened = useSelector((state: any) => state.customization.opened);
  const handleLeftDrawerToggle = () => {
    dispatch({ type: SET_MENU, opened: !leftDrawerOpened });
  };

  return (
    <Box sx={{ display: "flex", width: '100%', bgcolor: 'transparent' }}>
      <CssBaseline />

      {/* header */}
      <Header drawerOpen={leftDrawerOpened} handleLeftDrawerToggle={handleLeftDrawerToggle} />

      {/* drawer */}
      <Sidebar
        drawerOpen={leftDrawerOpened}
        handleLeftDrawerToggle={handleLeftDrawerToggle}
      />

      <Box
        component="main"
        sx={{
          width: '100%',
          flexGrow: 1,
          p: {
            xs: 2,
            sm: 3,
            md: 4,
          }
        }}
      >
        <Toolbar />
        {location.pathname.slice(1).split("/")[1] === "management" &&
          <Breadcrumbs navigation={navigation} title />
        }
        <Outlet />
      </Box>

    </Box>
  );
};

export default MainLayout;
