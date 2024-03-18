import React, { forwardRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Avatar,
  Chip,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography
} from '@mui/material';

// project imports
import { MENU_OPEN, SET_MENU } from 'store/actions';
import useResponsive from 'hooks/useResponsive';

// assets
import { Icon } from '@iconify/react';

// ==============================|| DRAWER MENU LIST ITEMS ||============================== //

interface NavItemProps {
  item: any,
  level: number
}

const NavItem = ({ item, level }: NavItemProps) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const customization = useSelector((state: any) => state.customization);
  const drawerOpen = useSelector((state: any) => state.customization.opened);
  const isMobile = useResponsive('down', 'lg')

  const itemIcon = item?.icon ? (
    <Icon
      icon={item.icon}
      width={30}
      color={
        customization.isOpen.findIndex((id: number) => id === item?.id) > -1
          ? theme.palette.primary.main : theme.palette.icon.drawer
      }
    />
  ) : (
    <Icon
      icon={"mdi:checkbox-blank-circle"}
      width={10}
      color={
        customization.isOpen.findIndex((id: number) => id === item?.id) > -1
          ? theme.palette.primary.main : theme.palette.icon.drawer
      }
    />
  );

  let itemTarget = '_self';
  if (item.target) {
    itemTarget = '_blank';
  }

  let listItemProps: any = {
    component: forwardRef((props, ref: any) => <Link ref={ref} {...props} to={item.url} target={itemTarget} />)
  };
  if (item?.external) {
    listItemProps = { component: 'a', href: item.url, target: itemTarget };
  }


  const itemHandler = (id: number) => {
    // console.log(item)
    dispatch({ type: MENU_OPEN, id });
    if (isMobile) dispatch({ type: SET_MENU, opened: false });
  };

  // active menu item on page load
  useEffect(() => {
    const currentIndex = document.location.pathname
      .toString()
      .split('/')
      .findIndex((id) => id === item.id);
    if (currentIndex > -1) {
      dispatch({ type: MENU_OPEN, id: item.id });
    }
  }, []);

  return (
    <ListItemButton
      {...listItemProps}
      disabled={item.disabled}
      sx={{
        borderRadius: `${customization.borderRadius}px`,
        mb: 1,
        flexDirection: drawerOpen ? 'row' : 'column',
        alignItems: 'center',
        backgroundColor: level > 1 ? 'transparent !important' : 'inherit',
        ml: level > 1 ? `${level * 18}px` : `0px`,
        px: 0,
      }}
      selected={customization.isOpen.findIndex((id: number) => id === item.id) > -1}
      onClick={() => itemHandler(item.id)}
    >
      <ListItemIcon
        sx={drawerOpen ? {
          my: 'auto',
          minWidth: !item?.icon ? 16 : 32,
          ml: 2.5,
          mr: 2,
        } : {
          my: 'auto',
          width: '100%',
          justifyContent: 'center',
        }}
      >{itemIcon}</ListItemIcon>
      <ListItemText
        primary={
          <Typography
            variant={drawerOpen ? 'h6' : 'h7'}
            color={
              customization.isOpen.findIndex((id: number) => id === item.id) > -1
                ? theme.palette.primary.main : theme.palette.icon.drawer
            }
            fontFamily={'Sarabun-Medium'}
          >
            {item.title}
          </Typography>
        }
        sx={{ m: 0 }}
      />
      {item.chip && (
        <Chip
          color={item.chip.color}
          variant={item.chip.variant}
          size={item.chip.size}
          label={item.chip.label}
          avatar={item.chip.avatar && <Avatar>{item.chip.avatar}</Avatar>}
        />
      )}
    </ListItemButton>
  );
};

export default NavItem;
