import React, { useState, useRef } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Avatar,
  Box,
  ClickAwayListener,
  Popper,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Paper,
  Typography,
  Tooltip,
  useMediaQuery
} from '@mui/material';

// third-party

// project imports
import MainCard from 'components/cards/MainCard';
import Transitions from 'components/extended/Transitions';

// assets
import { Icon } from '@iconify/react';


// ==============================|| TRANSLATIONS ||============================== //

const Translations = () => {
  const theme: any = useTheme();
  const matchesXs = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
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

  const handleListItemClick = (event: unknown, index: number) => {
    setSelectedIndex(index);
    handleClose(event);
  };

  return (
    <>
      <Tooltip
        disableFocusListener
        disableTouchListener
        title={<Typography variant="h5" color={'#fff'}>เปลี่ยนภาษา</Typography>}
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
            mr: 2,
            [theme.breakpoints.down('md')]: {
              mr: 1
            }
          }}
        >
          <Avatar
            variant="square"
            sx={{
              ...theme.typography.commonAvatar,
              width: 35,
              height: 35,
              transition: 'all .2s ease-in-out',
              bgcolor: 'transparent',
              color: theme.palette.primary.dark,
              '&[aria-controls="menu-list-grow"],&:hover': {
                bgcolor: theme.palette.primary.dark,
                color: theme.palette.primary.light
              }
            }}
            ref={anchorRef}
            // src={selectedIndex === 0 ? Thai_flag : Eng_flag}
            aria-controls={open ? 'menu-list-grow' : undefined}
            aria-haspopup="true"
            onClick={handleToggle}
            color="inherit"
          >
            {selectedIndex === 0 ?
              <Icon icon={"flag:th-4x3"} width={20} />
              : <Icon icon={"flag:gb-4x3"} width={20} />
              // <img src={Thai_flag} alt="flag" style={{ width: 20 }} />
              // : <img src={Eng_flag} alt="flag" style={{ width: 20 }} />
            }
          </Avatar>
        </Box>
      </Tooltip >
      <Popper
        placement={matchesXs ? 'bottom' : 'bottom-end'}
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
              offset: [matchesXs ? 5 : 0, 20]
            }
          }]
        }}
      >
        {({ TransitionProps }) => (
          <Transitions position={matchesXs ? 'top' : 'top-right'} in={open} {...TransitionProps}>
            <Paper>
              <ClickAwayListener
                mouseEvent="onMouseDown"
                touchEvent="onTouchStart"
                onClickAway={handleClose}
              >
                <MainCard elevation={6} content={false}>

                  <Box sx={{ p: 2 }}>
                    <Typography variant="h4" fontFamily={'Sarabun-SemiBold'}>Language</Typography>
                  </Box>

                  <Divider />

                  <List
                    sx={{
                      width: '100%',
                      maxWidth: 170,
                      minWidth: 130,
                      backgroundColor: theme.palette.background.paper,
                      borderRadius: '10px',
                      [theme.breakpoints.down('md')]: {
                        minWidth: '100%'
                      },
                      '& .MuiListItemButton-root': {
                        mb: 0.5,
                        // py: 0.5,
                        '&:hover': {
                          bgcolor: theme.palette.primary.light
                        }
                      },
                      '& .MuiListItemIcon-root': {
                        minWidth: 'auto',
                        mr: 2,
                      },
                      '& .Mui-selected': {
                        bgcolor: theme.palette.primary.light
                      },
                      '&:last-child': { p: 1 },
                    }}
                  >
                    <ListItemButton
                      sx={{ borderRadius: `10px` }}
                      selected={selectedIndex === 0}
                      onClick={(event) => handleListItemClick(event, 0)}
                    >
                      <ListItemIcon>
                        <Icon icon={"flag:th-4x3"} width={20} />
                      </ListItemIcon>
                      <ListItemText primary={<Typography variant="h4">Thai</Typography>} />
                    </ListItemButton>

                    <ListItemButton
                      sx={{ borderRadius: `10px`, }}
                      selected={selectedIndex === 1}
                      onClick={(event) => handleListItemClick(event, 1)}
                    >
                      <ListItemIcon>
                        <Icon icon={"flag:gb-4x3"} width={20} />
                      </ListItemIcon>
                      <ListItemText primary={<Typography variant="h4">Eng</Typography>} />
                    </ListItemButton>
                  </List>
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </>
  );
};

export default Translations;
