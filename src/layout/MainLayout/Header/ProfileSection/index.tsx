import React, { useState, useRef } from 'react';

import { useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  ClickAwayListener,
  Divider,
  Grid,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Popper,
  Stack,
  Switch,
  Typography,
  Tooltip
} from '@mui/material';

// third-party
// import PerfectScrollbar from 'react-perfect-scrollbar';
import { IconLogout } from '@tabler/icons-react';
import { Icon } from '@iconify/react';

// project imports
import MainCard from 'components/cards/MainCard';
import Transitions from 'components/extended/Transitions';
import avatar_11 from 'assets/img/avatars/avatar_11.jpg';


// ==============================|| PROFILE MENU ||============================== //

const ListProfileSection = [
  {
    label: "หน้าแรก",
    navigation: "/",
    icon: <Icon icon="solar:shop-bold-duotone" width={25} />
  },
  {
    label: "โปรไฟล์",
    navigation: "/user/account/profile",
    icon: <Icon icon="solar:user-circle-bold-duotone" width={25} />
  },
  {
    label: "ประวัติการซื้อสินค้า",
    navigation: "/user/account/purchase_history",
    icon: <Icon icon="solar:cart-large-minimalistic-bold-duotone" width={25} />
  },
  {
    label: "ตั้งค่า",
    navigation: "/user/account/setting",
    icon: <Icon icon="solar:settings-bold" width={25} />
  },
  {
    label: "ความช่วยเหลือ",
    navigation: "/user/account/FAQ",
    icon: <Icon icon="solar:question-circle-bold-duotone" width={25} />
  },
  // {
  //   label: "",
  //   navigation: "/user/account/"
  // },
]

const ProfileSection = () => {
  const theme: any = useTheme();
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLInputElement | null>(null);

  const handleLogout = async () => {
    console.log('Logout');
  };

  const handleClose = (event: any) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) { // ถ้าปิดตรงปุ่ม profile จะ return ออกไป
      return;
    }
    setOpen(false);
  };

  const handleListItemClick = (event: unknown, index: number, route = '') => {
    setSelectedIndex(index);
    handleClose(event);

    if (route && route !== '') {
      navigate(route);
    }
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  return (
    <>
      <Tooltip
        disableFocusListener
        disableTouchListener
        id="tooltip-profile"
        title={<Typography variant="h5" color={'#fff'}>โปรไฟล์</Typography>}
        arrow
        componentsProps={{
          tooltip: {
            sx: {
              bgcolor: theme.palette.primary.dark,
              '& .MuiTooltip-arrow': {
                color: theme.palette.primary.dark,
              },
            },
          },
        }}
      >
        <Chip
          sx={{
            height: 48,
            borderRadius: 27,
            transition: 'all .2s ease-in-out',
            borderColor: theme.palette.primary.light,
            backgroundColor: theme.palette.primary.light,
            '&[aria-controls="menu-list-grow"], &:hover': {
              borderColor: theme.palette.primary.dark,
              background: `${theme.palette.primary.dark} !important`,
              '& svg': { // IconSetting
                stroke: theme.palette.secondary.light,
              }
            },
          }}
          icon={
            <Avatar
              src={avatar_11}
              sx={{
                ...theme.typography.mediumAvatar,
                margin: '8px 0 8px 8px !important',
                cursor: 'pointer',
                boxShadow: 5
              }}
              ref={anchorRef}
              aria-controls={open ? 'menu-list-grow' : undefined}
              aria-haspopup="false"
              color="inherit"
            />
          }
          label={<Icon icon="solar:settings-bold" style={{ marginTop: 5 }} width={25} color={theme.palette.primary.main} />}
          variant="outlined"
          ref={anchorRef}
          aria-controls={open ? 'menu-list-grow' : undefined} // menu-list-grow: แสดงพื้นหลัง profile ตลอด
          aria-haspopup="true"
          onClick={handleToggle}
        />
      </Tooltip>
      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        onMouseLeave={handleClose}
        popperOptions={{
          modifiers: [{
            name: 'offset',
            options: {
              offset: [0, 14]
            }
          }]
        }}
        sx={{ height: 300 }}
      >
        {({ TransitionProps }) => (
          <Transitions in={open} {...TransitionProps}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard elevation={6} content={false} sx={{ '&:last-child': { p: 0, m: 0 } }} divider={false}>
                  <Box sx={{ p: 2, pl: 3, pb: 0 }}>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <Typography component="span" variant="h3">
                        Johne Doe
                      </Typography>
                    </Stack>
                    <Typography variant="h5">Adminstrator</Typography>
                  </Box>

                  <Box sx={{ p: 2 }}>
                    <Divider />
                    <List
                      component="nav"
                      sx={{
                        width: '100%',
                        maxWidth: 350,
                        minWidth: 300,
                        [theme.breakpoints.down('md')]: {
                          minWidth: '100%'
                        },
                        '& .MuiListItemButton-root': {

                        },
                        '&:last-child': { p: 0 },
                      }}
                    >
                      {ListProfileSection.map((item, index) => (
                        <div key={index}>
                          <ListItemButton
                            sx={{ borderRadius: `10px` }}
                            selected={selectedIndex === 0}
                            onClick={(event) => handleListItemClick(event, 0, item.navigation)}
                          >
                            <ListItemIcon>
                              {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={<Typography variant="body2">{item.label}</Typography>} />
                          </ListItemButton>
                          {(index === 2 || index === 4) && <Divider />}
                          {index === 2 && (
                            <>
                              <Card
                                sx={{
                                  width: '100%',
                                  bgcolor: darkMode ? theme.palette.primary.light : theme.palette.grey[100],
                                  my: 2,
                                  '& 	.MuiCardContent-root': {
                                    py: 1
                                  }
                                }}
                              >
                                <CardContent>
                                  <Grid container spacing={2} direction="column">
                                    <Grid item container alignItems="center" justifyContent="space-around">
                                      <Grid item>
                                        <Typography variant='h3' sx={{ fontFamily: 'Sarabun-Medium' }}>Dark Mode</Typography>
                                      </Grid>
                                      <Grid item>
                                        <Switch
                                          color="primary"
                                          checked={darkMode}
                                          onChange={(event) => setDarkMode(event.target.checked)}
                                          name="day-night"
                                          size="medium"
                                        />
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </CardContent>
                              </Card>
                              <Divider />
                            </>
                          )}
                        </div>
                      ))}

                      <ListItemButton
                        sx={{ borderRadius: `10px` }}
                        selected={selectedIndex === 5}
                        onClick={handleLogout}
                      >
                        <ListItemIcon>
                          <IconLogout stroke={1.5} size="1.3rem" />
                        </ListItemIcon>
                        <ListItemText primary={<Typography variant="body2">ออกจากระบบ</Typography>} />
                      </ListItemButton>
                    </List>
                  </Box>
                  {/* </PerfectScrollbar> */}
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </>
  );
};

export default ProfileSection;
