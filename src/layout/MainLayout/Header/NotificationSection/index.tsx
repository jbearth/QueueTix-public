import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Avatar,
  Box,
  Button,
  CardActions,
  ClickAwayListener,
  Divider,
  Grid,
  MenuItem,
  Paper,
  Popper,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery
} from '@mui/material';

// third-party
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';

// project imports
import MainCard from 'components/cards/MainCard';
import Transitions from 'components/extended/Transitions';
import NotificationList from './NotificationList';

// assets
import { IconBell } from '@tabler/icons-react';

// notification status options
const status = [
  {
    value: 'all',
    label: 'การแจ้งเตือนทั้งหมด'
  },
  {
    value: 'new',
    label: 'มาใหม่'
  },
  {
    value: 'unread',
    label: 'ที่ยังไม่ได้อ่าน'
  },
  {
    value: 'other',
    label: 'อื่นๆ'
  }
];

// ==============================|| NOTIFICATION ||============================== //

const NotificationSection = () => {
  const theme: any = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('all');
  const anchorRef: any = useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: any) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }
    prevOpen.current = open;
  }, [open]);

  const handleChange = (event: any) => {
    if (event?.target.value) setValue(event?.target.value);
  };

  return (
    <>
      <Tooltip
        disableFocusListener
        disableTouchListener
        title={<Typography variant="h5" color={'#fff'}>ข้อความแจ้งเตือน</Typography>}
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
        <Box
          sx={{
            mr: 3,
            [theme.breakpoints.down('lg')]: {
              mr: 2
            }
          }}
        >
          <Avatar
            variant="rounded"
            sx={{
              ...theme.typography.commonAvatar,
              width: 35,
              height: 35,
              transition: 'all .2s ease-in-out',
              bgcolor: 'transparent',
              // bgcolor: theme.palette.primary.light,
              color: theme.palette.primary.dark,
              '&[aria-controls="menu-list-grow"],&:hover': {
                bgcolor: theme.palette.primary.dark,
                color: theme.palette.primary.light
              }
            }}
            ref={anchorRef}
            aria-controls={open ? 'menu-list-grow' : undefined}
            aria-haspopup="true"
            onClick={handleToggle}
            color="inherit"
          >
            <IconBell stroke={2} size="1.4rem" />
          </Avatar>
        </Box>
      </Tooltip>
      <Popper
        placement={isMobile ? 'bottom' : 'bottom-end'}
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
              offset: [isMobile ? 5 : 0, 20]
            }
          }]
        }}
      >
        {({ TransitionProps }) => (
          <Transitions position={isMobile ? 'top' : 'top-right'} in={open} {...TransitionProps}>
            <Paper>
              <ClickAwayListener
                mouseEvent="onMouseDown"
                touchEvent="onTouchStart"
                onClickAway={handleClose}
              >
                <MainCard elevation={6} content={false}>
                  <Grid
                    container
                    direction="column"
                    spacing={2}
                    sx={{
                      [theme.breakpoints.up('sm')]: {
                        minWidth: 'calc(100vh - 380px)',
                      },
                      [theme.breakpoints.up('xl')]: {
                        minWidth: 'calc(100vh - 440px)',
                      },
                      width: '100%',
                    }}
                  >
                    <Grid item xs={12}>
                      <Grid
                        container
                        alignItems="center"
                        justifyContent="space-between"
                        sx={{ pt: 2, px: 2 }}
                      >
                        <Grid item>
                          <Stack direction="row" spacing={2}>
                            <Typography variant="subtitle1">ข้อความแจ้งเตือน</Typography>
                            {/* <Chip
                            size="small"
                            label="01"
                            sx={{
                              color: theme.palette.background.default,
                              bgcolor: theme.palette.warning.dark
                            }}
                          /> */}
                          </Stack>
                        </Grid>
                        <Grid item>
                          <Typography
                            component={Link}
                            to="#"
                            sx={{
                              fontSize: '0.75rem',
                              color: theme.palette.grey[500],
                              textDecoration: 'underline',
                              '&:hover': { color: theme.palette.primary[400] }
                            }}
                          >
                            ทําเครื่องหมายว่าอ่านแล้ว
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item xs={12}>
                      <SimpleBar
                        style={{
                          maxHeight: 'calc(100vh - 205px)',
                          padding: 0,
                          margin: 0
                        }}
                        forceVisible="y"
                        autoHide={false}
                      >
                        <Grid container direction="column" spacing={2} pr={2}>
                          <Grid item xs={12}>
                            <Box
                              component={"form"}
                              sx={{
                                px: 2, pt: 0.25,
                                '& .MuiTextField-root': { m: 1, width: '100%' },
                              }}
                              noValidate
                              autoComplete="off"
                            >
                              <TextField
                                id="outlined-select-currency"
                                select
                                value={value}
                                defaultValue={"all"}
                                onChange={handleChange}
                              >
                                {status.map((option) => (
                                  <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                  </MenuItem>
                                ))}
                              </TextField>
                            </Box>
                          </Grid>
                          <Grid item xs={12}>
                            <Divider />
                          </Grid>
                        </Grid>

                        {/* ===== โชว์ข้อความแจ้งเตือน ===== */}
                        <NotificationList />

                      </SimpleBar>
                    </Grid>
                  </Grid>

                  <Divider />

                  <CardActions sx={{ p: 1.25, justifyContent: 'center' }}>
                    <Button size="small" disableElevation>
                      ดูทั้งหมด
                    </Button>
                  </CardActions>
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions >
        )}
      </Popper >
    </>
  );
};

export default NotificationSection;
