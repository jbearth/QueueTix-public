import React from 'react'

// material-ui
import {
  Avatar,
  Box,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { drawerWidth } from 'store/constant';

import logoDrawer from 'assets/img/logoDrawer.png'

// ==================== || Logo & Toggler Button || ====================== //

function DrawerHeader({ drawerOpen }: any) {
  const theme = useTheme();

  return (
    <>
      <Box
        sx={{
          ...theme.mixins.toolbar,
          width: '100%',
          display: 'inline-flex',
          margin: drawerOpen ? '12px 0px 0px 0px' : '10px 0px 10px 0px',
          justifyContent: 'space-evenly',
          alignItems: 'center',
          overflow: 'hidden',
          [theme.breakpoints.down('lg')]: {
            width: drawerWidth,
          },
          '& 	.MuiCheckbox-root': {
            borderRadius: 5,
          },
        }}
      >
        <Avatar alt="logo Drawer" src={logoDrawer} sx={{ width: 'auto', height: 40 }} variant="square" />
        <Typography
          sx={{
            mr: 1,
            fontFamily: 'Sarabun-Bold',
            fontSize: 26,
            background: "-webkit-linear-gradient(-45deg, #2196f3 30%, #3f51b5 60%, #673ab7 90%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}
          display={drawerOpen ? "block" : "none"}
        >
          QUEUETIX
        </Typography>
      </Box >
    </>
  )
}

export default DrawerHeader