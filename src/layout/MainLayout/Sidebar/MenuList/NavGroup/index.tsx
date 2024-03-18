import React from 'react';
import { useSelector } from 'react-redux';

// material-ui
import { useTheme, alpha } from '@mui/material/styles';
import { Box, Divider, List, Typography } from '@mui/material';

// project imports
import NavItem from '../NavItem';
import NavCollapse from '../NavCollapse';
import { ChildrenMenuItems } from 'menu-items/MenuItemsType';

// ==============================|| SIDEBAR MENU LIST GROUP ||============================== //



const NavGroup = ({ item }: any) => {
  const theme = useTheme();
  const drawerOpen = useSelector((state: any) => state.customization.opened);

  // menu list collapse & items
  const items = item.children?.map((menu: ChildrenMenuItems) => {
    switch (menu.type) {
      case 'collapse':
        return <NavCollapse key={menu.id} menu={menu} level={1} />;
      case 'item':
        return <NavItem key={menu.id} item={menu} level={1} />;
      default:
        return (
          <Typography key={menu.id} variant="h6" color="error" align="center">
            Menu Items Error
          </Typography>
        );
    }
  });

  return (
    <Box sx={{ height: '100%', overflow: 'hidden' }}>
      <List
        subheader={
          drawerOpen ? (
            <Divider
              variant="middle"
              sx={{
                margin: '12px 0px 18px 0px',
                pr: 1.3,
                alignItems: 'center',
                borderColor: alpha(theme.palette.grey[700], 0.24),
                borderWidth: 1,
                "&::before, &::after": {
                  borderColor: alpha(theme.palette.grey[700], 0.24),
                  borderWidth: 1,
                },
              }}
              textAlign="left"
            >
              <Typography
                sx={{
                  ...theme.typography.menuCaption,
                  color: theme.palette.icon.drawer,
                  mb: 0.3,
                }}
                display={"inline-flex"}
              >
                {item.title}
              </Typography>
            </Divider >
          ) : (
            <Divider variant='middle'
              sx={{
                borderWidth: 1,
                "&::before, &::after": {
                  borderColor: alpha(theme.palette.grey[700], 0.24),
                },
              }} />
          )
        }
      >
        {items}
      </List>
    </Box>
  );
};

export default NavGroup;
