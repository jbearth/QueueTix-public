import React from 'react'

// material-ui
import { Typography } from '@mui/material';

// project imports
import NavGroup from './NavGroup';
import menuItem from 'menu-items';
import { ChildrenMenuItems } from 'menu-items/MenuItemsType';
// ==============================|| SIDEBAR MENU LIST ||============================== //

const MenuList = () => {
  const navItems = menuItem.items.map((item: ChildrenMenuItems) => {
    switch (item.type) {
      case 'group':
        return <NavGroup key={item.id} item={item} />;
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Menu Items Error
          </Typography>
        );
    }
  });

  return <>{navItems}</>;
};

export default MenuList;
