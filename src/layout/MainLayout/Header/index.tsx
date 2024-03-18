import React from 'react'

// material-ui
import {
  Box,
  IconButton,
  Toolbar,
  useScrollTrigger
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import AppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { alpha } from '@mui/material/styles';

// thirds-party
import { Icon } from '@iconify/react';

// project imports
import useResponsive from 'hooks/useResponsive';
import { drawerWidth } from 'store/constant';
import SearchSection from './SearchSection';
import ProfileSection from './ProfileSection';
import NotificationSection from './NotificationSection';
import Translations from './Translations';

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const HEADER_MOBILE = 54;
const HEADER_DESKTOP = 80;


const Header = ({ drawerOpen, handleLeftDrawerToggle }: any) => {
  const theme: any = useTheme();
  const isMobile = useResponsive('down', 'lg');

  function bgBlur(props: any) {
    const color = props?.color || '#000000';
    const blur = props?.blur || 6;
    const opacity = props?.opacity || 0.8;
    const imgUrl = props?.imgUrl;

    if (imgUrl) {
      return {
        position: 'relative',
        backgroundImage: `url(${imgUrl})`,
        '&:before': {
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 9,
          content: '""',
          width: '100%',
          height: '100%',
          backdropFilter: `blur(${blur}px)`,
          WebkitBackdropFilter: `blur(${blur}px)`,
          backgroundColor: alpha(color, opacity),
        },
      };
    }

    return {
      backdropFilter: `blur(${blur}px)`,
      WebkitBackdropFilter: `blur(${blur}px)`,
      backgroundColor: alpha(color, opacity),
    };
  }

  const AppBarStyled = styled(AppBar, {
    shouldForwardProp: (prop) => prop !== 'open'
  })<AppBarProps>(({ theme, open }: any) => {

    const trigger = useScrollTrigger({
      disableHysteresis: true,
      threshold: 0,
    });

    return ({
      ...bgBlur({ color: trigger ? "#F9FAFB" : theme.palette.background.paper }),
      boxShadow: 'none',
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(['width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      }),
      ...(!open && {
        transition: theme.transitions.create(['width'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen
        }),
        width: `calc(100% - 90px)`
      }),
      ...(open && {
        transition: theme.transitions.create(['width'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen
        }),
        width: isMobile ? `calc(100%)` : `calc(100% - ${drawerWidth}px)`,
      })
    })
  });

  const StyledToolbar = styled(Toolbar)(({ theme }) => ({
    minHeight: HEADER_MOBILE,
    [theme.breakpoints.up('lg')]: {
      minHeight: HEADER_DESKTOP,
      padding: theme.spacing(0, 5),
    },
  }));


  return (
    <AppBarStyled
      // position="fixed"
      // color="inherit"
      // elevation={0}
      sx={{
        "& .scrolled": {
          backgroundColor: "red"
        },
      }}
      open={drawerOpen}
    >
      <StyledToolbar>
        <IconButton
          onClick={handleLeftDrawerToggle}
          sx={{
            mr: 1,
            color: theme.palette.primary.main,
            backgroundColor: theme.palette.primary.light,
            '&:hover': {
              color: theme.palette.primary.light,
              backgroundColor: theme.palette.primary.dark
            },
          }}
        >
          {drawerOpen ? (
            <Icon icon="solar:logout-3-bold-duotone" width={25} />
          ) : (
            <Icon icon="solar:login-3-outline" width={25} />
          )}
        </IconButton>

        {/* header search */}
        {/* <SearchSection /> */}
        <Box sx={{ flexGrow: 1 }} />

        {/* translation & notification & profile */}
        {/* <Translations /> */}
        {/* <NotificationSection /> */}
        <ProfileSection />
      </StyledToolbar>
    </AppBarStyled>
  );
};

export default Header;
