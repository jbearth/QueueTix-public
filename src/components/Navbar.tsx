import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Container,
  Paper,
  Stack,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

// Authen-Token
import { useAuth } from '../data/Auth';

// project import
import ProfileSection from 'layout/MainLayout/Header/ProfileSection';
import MainCard from 'components/cards/MainCard';
import Translations from 'layout/MainLayout/Header/Translations';
import NotificationSection from 'layout/MainLayout/Header/NotificationSection';
import Search from 'layout/MainLayout/Header/SearchSection';

// third-party package
import HoverPopover from "material-ui-popup-state/HoverPopover";
import PopupState, { bindHover, bindPopover } from "material-ui-popup-state";

// asset
import { IconCaretDown, IconCaretUp, IconMap2, IconMenu2, IconApps } from '@tabler/icons-react';


const pages = [
  {
    namePages: 'สวนสนุกและบัตร',
    navigateName: '/Product'
  },
  {
    namePages: 'เกี่ยวกับสวนสนุก',
    navigateName: '/AboutThemePark'
  },
  {
    namePages: 'สิ่งที่ไม่ควรพลาด',
    navigateName: '/Blog'
  },
  {
    namePages: 'โปรโมชั่นพิเศษ',
    navigateName: '/Blog'
  },
  {
    namePages: 'ติดต่อเรา',
    navigateName: '/Blog'
  },
];

const card = [
  {
    name: "บัตรเข้าสวนสนุก",
    link: "/"
  },
  {
    name: "โปรโมชั่นร้านอาหาร",
    link: "/"
  },
  {
    name: "ประสบการณ์พิเศษ",
    link: "/"
  },
  {
    name: "โปรโมชั่นพิเศษ",
    link: "/"
  },
]

const thingstodo = [
  {
    name: "สถานที่ท่องเที่ยว",
    link: "/"
  },
  {
    name: "ตัวละครของสวนสนุก",
    link: "/"
  },
  {
    name: "ความบันเทิง",
    link: "/"
  },
  {
    name: "ร้านค้า",
    link: "/"
  },
  {
    name: "สันทนาการ",
    link: "/"
  },
]

function Navbar() {
  const theme: any = useTheme();

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElNavTicket, setAnchorElNavTicket] = React.useState(false);


  const navigate = useNavigate()
  const { user, logout } = useAuth()

  // open NavMenu
  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  // open Ticket
  const handleOpenTicketMenu = () => {
    console.log()
    setAnchorElNavTicket(true);
  };
  // close NavMenu
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };
  // close Ticket
  const handleCloseTicketMenu = () => {
    setAnchorElNavTicket(false);
  };

  const open = Boolean(anchorElNavTicket);

  return (
    <AppBar position="sticky" sx={{ backgroundColor: theme.palette.background.paper, color: "#000" }}>
      <Container maxWidth="xl" sx={{ py: 0.5 }}>
        <Toolbar disableGutters>
          {/* <Box sx={{ display: 'inline-flex', alignItems: 'center' }}> */}

          {/* ===== [ จะแสดงเมื่อขนาดจอน้อยกกว่า 600 px ] ===== */}
          {/* <Button
              href="/"
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
                '&:hover': {
                  bgcolor: 'transparent'
                }
              }}
            >
              <img
                className="h-8 w-auto"
                src="src/assets/img/logo1855123121.png"
                alt="logo"
              />
            </Button>

            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' }, }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <IconMenu2 stroke={1.5} size="1.1rem" color={'#000'} />
              </IconButton>
              <Menu
                sx={{
                  display: { xs: 'block', md: 'none' },
                  mt: '45px'
                }}
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
              >
                {pages.map((page) => (
                  <MenuItem key={page.namePages} onClick={handleCloseNavMenu}>
                    <Typography textAlign="center" color={'#000'}>{page.namePages}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            {/* ============================================ */}

          {/* ===== [ จะแสดงเมื่อขนาดจอมากกว่า 900 px ] ===== */}
          {/* <Button
              href="/"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
                '&:hover': {
                  bgcolor: 'transparent'
                }
              }}
            >
              <img
                className="h-8 w-auto"
                src="src/assets/img/logo1855123121.png"
                alt="logo"
              />
            </Button>

            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              <PopupState variant="popover" popupId="demoPopover">
                {(popupState) => (
                  <div>
                    <Box sx={{ display: 'inline-flex', alignItems: 'center', mr: 1.5 }} {...bindHover(popupState)}>
                      <Typography sx={{ my: 2.05, paddingY: 1 }}>
                        สวนสนุกและบัตร
                      </Typography>
                      {popupState.isOpen ? <IconCaretUp style={{ marginTop: 4 }} stroke={1.5} size="1.1rem" color={'#000'} />
                        : <IconCaretDown style={{ marginTop: 2 }} stroke={1.5} size="1.1rem" color={'#000'} />}
                    </Box>
                    <HoverPopover
                      {...bindPopover(popupState)}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                      }}
                      elevation={3}
                    >
                      <Paper sx={{ bgcolor: 'transparent' }}>
                        <MainCard content={true} contentSX={{
                          bgcolor: 'transparent',
                          '&:last-child': { p: 0 }
                        }}>
                          <Box sx={{ display: 'inline-flex', borderRadius: 1 }}>
                            <Stack direction="column" spacing={0.5} p={2} pb={4}>
                              <Typography variant="h3" paddingX={1} my={1} sx={{ fontFamily: 'Sarabun-SemiBold' }}>
                                บัตร
                              </Typography>
                              {card.map((card, index) => (
                                <Typography
                                  key={index}
                                  variant="h5"
                                  sx={{
                                    paddingX: 1,
                                    paddingY: 0.5,
                                    borderRadius: 2,
                                    '&:hover': { backgroundColor: theme.palette.primary[200], cursor: "pointer" }
                                  }}
                                >
                                  {card.name}
                                </Typography>
                              ))}
                            </Stack>
                            <Stack direction="column" spacing={1} p={2} sx={{ bgcolor: theme.palette.primary.light }}>
                              <Typography variant="h4" paddingX={1} my={1} sx={{ fontFamily: 'Sarabun-SemiBold' }}>
                                เวลาเปิด-ปิดของสวนสนุกวันนี้
                              </Typography>
                              <Typography variant="h5" sx={{ paddingX: 1, paddingY: 0.5, }}>
                                วันพุธ, 12 เมษายน 2023
                              </Typography>
                              <Typography variant="h5" sx={{ paddingX: 1, paddingY: 0.5, }}>
                                เวลา 10:00 น. ถึง 21:00 น.
                              </Typography>
                              <Typography
                                variant="h5"
                                sx={{
                                  paddingX: 1,
                                  paddingY: 0.5,
                                  color: theme.palette.primary.dark,
                                  '&:hover': { textDecoration: 'underline', cursor: "pointer" }
                                }}
                              >
                                ปฏิทินของสวนสนุก
                              </Typography>
                              <div style={{ display: 'inline-flex', alignItems: 'center', marginLeft: 8, }}>
                                <IconMap2 stroke={1.5} size="1.5rem" color={'#000'} />
                                <Typography
                                  variant="h5"
                                  sx={{
                                    paddingX: 1,
                                    paddingY: 0.5,
                                    color: theme.palette.primary.dark,
                                    '&:hover': { textDecoration: 'underline', cursor: "pointer" }
                                  }}
                                >
                                  แผนที่
                                </Typography>
                              </div>
                            </Stack>
                          </Box>
                        </MainCard>
                      </Paper>
                    </HoverPopover>
                  </div>
                )}
              </PopupState>
              <PopupState variant="popover" popupId="demoPopover">
                {(popupState) => (
                  <div>
                    <Box sx={{ display: 'inline-flex', alignItems: 'center', mr: 1 }} {...bindHover(popupState)}>
                      <Typography sx={{ my: 2.05, paddingY: 1 }}>
                        สิ่งที่ไม่ควรพลาด
                      </Typography>
                      {popupState.isOpen ? <IconCaretUp style={{ marginTop: 4 }} stroke={1.5} size="1.1rem" color={'#000'} />
                        : <IconCaretDown style={{ marginTop: 2 }} stroke={1.5} size="1.1rem" color={'#000'} />}
                    </Box>
                    <HoverPopover
                      {...bindPopover(popupState)}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                      }}
                      elevation={3}
                    >
                      <Paper>
                        <MainCard content={true} contentSX={{
                          borderRadius: 10,
                          '&:last-child': { p: 0 }
                        }}>
                          <Box sx={{ display: 'inline-flex' }}>
                            <Stack direction="column" spacing={0.5} p={2} pb={4}>
                              <Typography variant="h3" paddingX={1} my={1} sx={{ fontFamily: 'Sarabun-SemiBold' }}>
                                ร้านอาหาร
                              </Typography>
                              <Typography
                                variant="h5"
                                sx={{
                                  paddingX: 1,
                                  paddingY: 0.5,
                                  borderRadius: 2,
                                  '&:hover': { backgroundColor: theme.palette.primary[200], cursor: "pointer" }
                                }}
                              >
                                ร้านอาหารทั้งหมด
                              </Typography>
                              <Typography
                                variant="h5"
                                sx={{
                                  paddingX: 1,
                                  paddingY: 0.5,
                                  borderRadius: 2,
                                  '&:hover': { backgroundColor: theme.palette.primary[200], cursor: "pointer" }
                                }}
                              >
                                ข้อเสนอร้านอาหาร
                              </Typography>

                              <Typography variant="h3" sx={{ px: 1, pt: 2, pb: 1, fontFamily: 'Sarabun-SemiBold', }}>
                                กิจกรรม
                              </Typography>
                              {thingstodo.map((item, index) => (
                                <Typography
                                  key={index}
                                  variant="h5"
                                  sx={{
                                    paddingX: 1,
                                    paddingY: 0.5,
                                    borderRadius: 2,
                                    '&:hover': { backgroundColor: theme.palette.primary[200], cursor: "pointer" }
                                  }}
                                >
                                  {item.name}
                                </Typography>
                              ))}
                            </Stack>
                            <Stack direction="column" spacing={1} p={2} sx={{ bgcolor: theme.palette.primary.light }}>
                              <Typography variant="h4" paddingX={1} my={1} sx={{ fontFamily: 'Sarabun-SemiBold' }}>
                                ดาวโหลดแอพพลิเคชั่นของสวนสนุก
                              </Typography>
                              <IconApps stroke={2} size="1.5rem" color={'#000'} />
                              <div style={{ display: 'inline-flex', alignItems: 'center', marginLeft: 8, }}>
                                <IconMap2 stroke={1.5} size="1.5rem" color={'#000'} />
                                <Typography
                                  variant="h5"
                                  sx={{
                                    paddingX: 1,
                                    paddingY: 0.5,
                                    color: theme.palette.primary.dark,
                                    '&:hover': { textDecoration: 'underline', cursor: "pointer" }
                                  }}
                                >
                                  แผนที่
                                </Typography>
                              </div>
                            </Stack>
                          </Box>
                        </MainCard>
                      </Paper>
                    </HoverPopover>
                  </div>
                )}
              </PopupState>
              <Button
                onClick={handleCloseNavMenu}
                sx={{
                  my: 2,
                  color: 'black',
                  display: 'block',
                  '&:hover': {
                    backgroundColor: theme.palette.primary.light,
                  },
                }}
              >
                เกี่ยวกับสวนสนุก
              </Button>
              <Button
                onClick={handleCloseNavMenu}
                sx={{
                  my: 2,
                  color: 'black',
                  display: 'block',
                  '&:hover': {
                    backgroundColor: theme.palette.primary.light,
                  },
                }}
              >
                โปรโมชั่นพิเศษ
              </Button>
              <Button
                onClick={handleCloseNavMenu}
                sx={{
                  my: 2,
                  color: 'black',
                  display: 'block',
                  '&:hover': {
                    backgroundColor: theme.palette.primary.light,
                  },
                }}
              >
                ติดต่อเรา
              </Button>
            </Box> */}
          {/* ============================================ */}

          {/* <Box sx={{ display: 'inline-flex', alignItems: 'center', ml: 4 }}> */}
          <Search />
          <Translations />
          <NotificationSection />
          <ProfileSection />
          {/* </Box> */}
          {/* </Box> */}

          {/* {user ? <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenProfileMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: 8, position: 'absolute', right: 5}}
              id="menu-appbar"
              anchorEl={anchorElProfile}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElProfile)}
              onClose={handleCloseProfileMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseProfileMenu}>
                  <Typography textAlign="center" sx={{color: '#000'}}>{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          : 
            <Box sx={{display: 'inline-flex'}}>
              <Button 
                sx={{
                  marginRight: 2,
                  maxWidth: 120,
                  maxHeight: 38,
                  backgroundColor: theme.palette.secondary.main,
                  '&:hover': {
                    backgroundColor: theme.palette.secondary.dark,
                  },
                }} variant="contained">สมัครสมาชิก</Button>
              <Button
                sx={{
                  marginRight: 2,
                  maxWidth: 120,
                  maxHeight: 38,
                  backgroundColor: theme.palette.secondary.main,
                  '&:hover': {
                    backgroundColor: theme.palette.secondary.dark,
                  },
                }} variant="contained">เข้าสู่ระบบ</Button>
            </Box>
          } */}

        </Toolbar>
      </Container>
    </AppBar>
  )
}
export default Navbar;