import React, { forwardRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';

// project imports
import { MENU_OPEN, SET_MENU } from 'store/actions';
import useResponsive from 'hooks/useResponsive';

// ==============================|| DRAWER MENU LIST ITEMS ||============================== //

interface NavCollapseItemProps {
  item: any,
  level: number
}

const NavCollapseItem = ({ item, level }: NavCollapseItemProps) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const customization = useSelector((state: any) => state.customization);
  const isMobile = useResponsive('down', 'lg')

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
      dispatch({ type: MENU_OPEN, id: item?.id });
    }
  }, []);

  const isMatchonSelected = customization.isOpen.findIndex((id: number) => id === item?.id && item?.url === document.location.pathname.toString()) > -1

  return (
    <ListItemButton
      {...listItemProps}
      disabled={item.disabled}
      sx={{
        borderRadius: `${customization.borderRadius}px`,
        mb: 1,
        alignItems: 'center',
        py: level > 1 ? 1 : 1.25,
        '&:hover': {
          bgcolor: theme.palette.grey[300]
        }
      }}
      selected={isMatchonSelected}
      onClick={() => itemHandler(item?.id)}
    >

      <ListItemText
        primary={
          <Typography
            variant={
              isMatchonSelected ? 'fontItemLeftDrawerSelect' : 'h5'
            }
            color={isMatchonSelected ? theme.palette.primary.main : "inherit"}
          >
            {item.title}
          </Typography>
        }
        secondary={
          item.caption && (
            <Typography variant="caption" sx={{ ...theme.typography.subMenuCaption }} display="block" gutterBottom>
              {item.caption}
            </Typography>
          )
        }
      />
    </ListItemButton>
  );
};

export default NavCollapseItem;
