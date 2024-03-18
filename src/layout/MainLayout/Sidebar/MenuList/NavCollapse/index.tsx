import React, { useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Stack,
  Tooltip,
} from '@mui/material';

// thirds-party
import { Icon } from '@iconify/react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

// project imports
import NavItem from '../NavItem';
import NavCollapseItem from '../NavCollapseItem';

// ==============================|| DRAWER MENU LIST COLLAPSE ITEMS ||============================== //

interface NavCollapseProps {
  menu: any
  level: number
}

const NavCollapse = ({ menu, level }: NavCollapseProps) => {
  const theme: any = useTheme();
  const customization = useSelector((state: any) => state.customization);
  const drawerOpen = useSelector((state: any) => state.customization.opened);
  // const [collapseItem, setCollapseItem] = useState(null);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const handleClick = () => {
    setOpen(!open);
    // setSelected(menu.id);
  };

  const { pathname } = useLocation();
  const checkOpenForParent = (child: any, id: any) => {
    child.forEach((item: any) => {
      if (item.url === pathname) {
        setOpen(true);
        setSelected(id);
      }
    });
  };

  // React.useMemo(() => {
  //   console.log("menucollapse")
  // }, [])

  // menu collapse for sub-levels
  useEffect(() => {
    setOpen(false);
    setSelected(null);
    if (menu.children) {
      menu.children.forEach((item: any) => {
        if (item.children?.length) {
          checkOpenForParent(item.children, menu.id);
        }
        if (item.url === pathname) {
          setSelected(menu.id);
          setOpen(false);
        }
      });
    }
  }, [pathname, menu.children]);

  // menu collapse & item on drawer opened
  const menus = menu.children?.map((item: any) => {
    switch (item.type) {
      case 'collapse':
        return <NavCollapse key={item.id} menu={item} level={level + 1} />;
      case 'item':
        return <NavItem key={item.id} item={item} level={level + 1} />;
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Menu Items Error
          </Typography>
        );
    }
  });
  const menusCollapseItem = menu.children?.map((item: any) => {
    switch (item.type) {
      case 'collapse':
        return <NavCollapse key={item.id} menu={item} level={level + 1} />;
      case 'item':
        return <NavCollapseItem key={item.id} item={item} level={level + 1} />;
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Menu Items Error
          </Typography>
        );
    }
  });

  const menuIcon = menu?.icon ? (
    <Icon
      icon={menu.icon}
      width={30}
      style={{
        color: selected === menu.id ? theme.palette.primary.main : theme.palette.icon.drawer
      }}
    />
  ) : (
    <Icon
      icon={"material-symbols:fiber-manual-record"}
      width={selected === menu.id ? 8 : 6}
      height={selected === menu.id ? 8 : 6}
      style={{
        color: selected === menu.id ? theme.palette.primary.main : theme.palette.icon.drawer
      }}
    />
  );

  const onMenuCollapseDrawerOpen = (
    <>
      <ListItemButton
        sx={{
          borderRadius: `${customization.borderRadius}px`,
          m: '0px 1.5px 5px 0px',
          alignItems: 'center',
          bgcolor: level > 1 ? 'transparent !important' : 'inherit',
          py: level > 1 ? 1 : 1.25,
          pl: `${level * 22}px`,
        }}
        selected={selected === menu.id}
        onClick={handleClick}
      >
        <ListItemIcon
          sx={{
            my: 'auto',
            minWidth: !menu.icon ? 18 : 30,
            mr: 2,
          }}
        >{menuIcon}</ListItemIcon>
        <ListItemText
          primary={
            <Typography
              variant={'h6'}
              color={selected === menu.id ? theme.palette.primary.main : theme.palette.icon.drawer}
              noWrap
            >
              {menu.title}
            </Typography>
          }
        />
        <Icon
          icon={open ? "material-symbols:keyboard-arrow-down-rounded" : "material-symbols:chevron-right-rounded"}
          width={25}
          style={{
            marginTop: 'auto',
            marginBottom: 'auto',
            color: selected === menu.id ? theme.palette.primary.main : theme.palette.icon.drawer
          }}
        />
      </ListItemButton>
    </>
  )

  const onMenuCollapseDrawerClose = (
    <>
      <Tooltip
        id="tooltip-Drawer"
        title={
          <>
            <List
              disablePadding
              sx={{ color: theme.palette.icon.drawer, width: 165 }}
            >
              {menusCollapseItem}
            </List>
          </>
        }
        placement="right"
        disableFocusListener
        disableTouchListener
        componentsProps={{
          tooltip: {
            sx: {
              backgroundImage: `linear-gradient(35deg,
                ${theme.palette.secondary.light} 0%,
                #fff 30%,
                #fff 70%,
                ${theme.palette.primary.light} 100%)
              `,
              boxShadow: `1px 1px 15px ${theme.palette.grey[300]}`
            },
          },
        }}
      >
        <ListItemButton
          sx={{
            borderRadius: `${customization.borderRadius}px`,
            mb: 0.5,
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: level > 1 ? 'transparent !important' : 'inherit',
            py: level > 1 ? 1 : 1.25,
            pl: `${level * 16}px`,
          }}
          selected={selected === menu.id}
        >
          <Stack direction={'row'}>
            <ListItemIcon
              sx={{
                my: 'auto',
                minWidth: !menu.icon ? 18 : 30,
              }}
            >{menuIcon}</ListItemIcon>
            <Icon
              icon={"material-symbols:chevron-right-rounded"}
              width={25}
              style={{
                marginTop: 'auto',
                marginBottom: 'auto',
                color: selected === menu.id ? theme.palette.primary.main : theme.palette.icon.drawer
              }}
            />
          </Stack>
          <ListItemText
            sx={{
              display: 'inline-flex',
              flexWrap: 'nowrap',
              width: 70,
              justifyContent: 'center'
            }}
            primary={
              <Typography
                variant={selected === menu.id ? 'subItemDrawerSelect' : 'subItemDrawerClose'}
                color={selected === menu.id ? theme.palette.primary.main : "inherit"}
                noWrap
              >
                {menu.title}
              </Typography>
            }
          />
        </ListItemButton>
      </Tooltip>
    </>
  )

  return (
    <>
      {drawerOpen ? (
        <>
          {onMenuCollapseDrawerOpen}
          <Collapse in={open} timeout="auto" unmountOnExit>
            <List
              disablePadding
              sx={{
                position: 'relative',
                '&:after': {
                  content: "''",
                  // position: 'absolute',
                  // left: '32px',
                  top: 0,
                  height: '100%',
                  width: '1px',
                  opacity: 1,
                  bgcolor: theme.palette.primary.light,
                }
              }}
            >
              {menus}
            </List>
          </Collapse>
        </>
      ) : (
        onMenuCollapseDrawerClose
      )}
    </>
  );
};

export default NavCollapse;
