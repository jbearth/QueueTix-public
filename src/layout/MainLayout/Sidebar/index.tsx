import React from 'react'

// material-ui
import {
  Box,
  SwipeableDrawer,

} from '@mui/material';

// third-party
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';

// project imports
import MenuList from './MenuList';
import DrawerHeader from './DrawerHeader';
import MiniDrawerStyled from './MiniDrawerStyled';
import useResponsive from 'hooks/useResponsive';

// ==============================|| SIDEBAR DRAWER ||============================== //

interface SidebarProps {
  drawerOpen: boolean,
  handleLeftDrawerToggle: any
}

const Sidebar = (
  {
    drawerOpen,
    handleLeftDrawerToggle
  }: SidebarProps
) => {

  const isDesktop = useResponsive('up', 'lg');

  const contentLeftDrawer = (
    <>
      {/* logo drawer */}
      <DrawerHeader drawerOpen={drawerOpen} />

      {/* drawer on desktop */}
      <SimpleBar
        style={{
          height: 'calc(100% - 80px)',
          overflow: drawerOpen ? 'auto' : 'hidden',
        }}
        forceVisible="y"
        autoHide={false}
      >
        <MenuList />
      </SimpleBar>
    </>
  )

  const contentLeftDrawerOnMobile = (
    <>
      {/* logo drawer */}
      <DrawerHeader drawerOpen={drawerOpen} />

      {/* drawer on mobile */}
      <SimpleBar
        style={{
          height: 'calc(100% - 80px)',
        }}
      >
        <MenuList />
      </SimpleBar>
    </>
  )

  return (
    <Box
      component="nav" sx={{ flexShrink: { md: 0 }, zIndex: 1300 }} aria-label="Drawer Left"
    >
      {isDesktop ? (
        <MiniDrawerStyled
          variant="permanent"
          open={drawerOpen}
        >
          {contentLeftDrawer}
        </MiniDrawerStyled>
      ) : (
        <SwipeableDrawer
          open={drawerOpen}
          onOpen={() => undefined}
          onClose={handleLeftDrawerToggle}
        >
          {contentLeftDrawerOnMobile}
        </SwipeableDrawer>
      )}
    </Box >
  );
};

export default Sidebar;
