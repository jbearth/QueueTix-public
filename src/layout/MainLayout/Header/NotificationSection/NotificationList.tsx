import React from 'react';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
import {
  Avatar,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography
} from '@mui/material';

// assets
import { IconBrandTelegram, IconMailbox, IconPhoto, IconTicket } from '@tabler/icons-react';

// styles
const ListItemWrapper = styled('div')(({ theme }) => ({
  cursor: 'pointer',
  padding: 16,
  '&:hover': {
    background: theme.palette.primary.light
  },
  '& .MuiListItem-root': {
    padding: 0
  }
}));

// ==============================|| NOTIFICATION LIST ITEM ||============================== //

const NotificationList = () => {
  const theme: any = useTheme();

  const chipSX = {
    height: 24,
    padding: '0 6px'
  };
  const chipErrorSX = {
    ...chipSX,
    color: theme.palette.orange.dark,
    backgroundColor: theme.palette.orange.light,
    marginRight: '5px'
  };

  const chipWarningSX = {
    ...chipSX,
    color: theme.palette.warning.dark,
    backgroundColor: theme.palette.warning.light
  };

  const chipSuccessSX = {
    ...chipSX,
    color: theme.palette.success.dark,
    backgroundColor: theme.palette.success.light,
    height: 28
  };

  return (
    <List
      sx={{
        width: '100%',
        maxWidth: 330,
        py: 0,
        borderRadius: '10px',
        [theme.breakpoints.down('md')]: {
          maxWidth: 300
        },
        '& .MuiDivider-root': {
          my: 0
        },
        '& .list-container': {
          pl: 7,
          pr: 1
        }
      }}
    >
      <ListItemWrapper>
        <ListItem alignItems="center">
          <ListItemAvatar>
            <Avatar alt="MaiWaiLaw" src={"src/assets/img/avatars/avatar_default.jpg"} />
          </ListItemAvatar>
          <ListItemText
            sx={{
              [theme.breakpoints.up('sm')]: {
                display: 'inline-flex',
                justifyContent: 'space-between'
              },
              [theme.breakpoints.down('sm')]: {
                display: 'block',
              },
            }}
            primary={<Typography variant="h4">คุณ MaiWaiLaw</Typography>}
            secondary={<Typography variant="h6" mr={1}>
              2 นาทีที่แล้ว
            </Typography>}
          />
        </ListItem>

        <Grid container direction="column" className="list-container">
          <Grid item xs={12} sx={{ pb: 2 }}>
            <Typography variant="h6">สรุป อัยแค่กๆที่ไม่ใช่ไอๆ หรือ อัยที่ไม่ใข่ไอแค่กๆ</Typography>
          </Grid>
          <Grid item xs={12}>
            <Grid container>
              <Grid item>
                <Chip label="ยังไม่อ่าน" sx={chipErrorSX} />
              </Grid>
              <Grid item>
                <Chip label="ใหม่" sx={chipWarningSX} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </ListItemWrapper>
      <Divider />
      <ListItemWrapper>
        <ListItem alignItems="center">
          <ListItemAvatar>
            <Avatar
              sx={{
                color: theme.palette.success.dark,
                backgroundColor: theme.palette.success.light,
                border: 'none',
                borderColor: theme.palette.success.main
              }}
            >
              <IconTicket stroke={1.5} size="1.3rem" />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            sx={{
              [theme.breakpoints.up('sm')]: {
                display: 'inline-flex',
                justifyContent: 'space-between'
              },
              [theme.breakpoints.down('sm')]: {
                display: 'block',
              },
            }}
            primary={<Typography variant="h4">Purchase Magic Ticket</Typography>}
            secondary={<Typography variant="caption" mr={1}>
              2 นาทีที่แล้ว
            </Typography>}
          />
        </ListItem>
        <Grid container direction="column" className="list-container">
          <Grid item xs={12} sx={{ pb: 2 }}>
            <Typography variant="h6">คุณได้ทำการซื้อตั๋วเมจิคเรียบร้อย</Typography>
          </Grid>
          <Grid item xs={12}>
            <Grid container>
              <Grid item>
                <Chip label="ยังไม่อ่าน" sx={chipErrorSX} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </ListItemWrapper>
      <Divider />
      <ListItemWrapper>
        <ListItem alignItems="center">
          <ListItemAvatar>
            <Avatar
              sx={{
                color: theme.palette.primary.dark,
                backgroundColor: theme.palette.primary.light,
                border: 'none',
                borderColor: theme.palette.primary.main
              }}
            >
              <IconMailbox stroke={1.5} size="1.3rem" />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            sx={{
              [theme.breakpoints.up('sm')]: {
                display: 'inline-flex',
                justifyContent: 'space-between'
              },
              [theme.breakpoints.down('sm')]: {
                display: 'block',
              },
            }}
            primary={<Typography variant="h4">Check Your Mail</Typography>}
            secondary={<Typography variant="caption" mr={1}>
              2 นาทีที่แล้ว
            </Typography>}
          />
        </ListItem>
        <Grid container direction="column" className="list-container">
          <Grid item xs={12} sx={{ pb: 2 }}>
            <Typography variant="h6">ระบบได้ทำการส่ง PIN ไปทางอีเมล กรุณาตรวจสอบอีเมลของคุณ</Typography>
          </Grid>
          <Grid item xs={12}>
            <Grid container sx={{ '& button': { bgcolor: theme.palette.primary.main } }}>
              <Grid item>
                <Button
                  variant="contained"
                  disableElevation
                  color="primary"
                  endIcon={<IconBrandTelegram stroke={1.5} size="1.3rem" />}
                >
                  อีเมล
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </ListItemWrapper>
      <Divider />
      <ListItemWrapper>
        <ListItem alignItems="center">
          <ListItemAvatar>
            <Avatar alt="MaiWaiLaw" src={"src/assets/img/avatars/avatar_default.jpg"} />
          </ListItemAvatar>
          <ListItemText
            sx={{
              [theme.breakpoints.up('sm')]: {
                display: 'inline-flex',
                justifyContent: 'space-between'
              },
              [theme.breakpoints.down('sm')]: {
                display: 'block',
              },
            }}
            primary={<Typography variant="h4">คุณ MaiWaiLaw</Typography>}
            secondary={<Typography variant="caption" mr={1}>
              2 นาทีที่แล้ว
            </Typography>}
          />
        </ListItem>
        <Grid container direction="column" className="list-container">
          <Grid item xs={12} sx={{ pb: 2 }}>
            <Typography component="span" variant="h6">
              อัปโหลดโปรไฟล์เมื่อวันที่&nbsp;
              <Typography component="span" variant="h6">
                14 เมษายน 2565
              </Typography>
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Grid container>
              <Grid item xs={12}>
                <Card
                  sx={{
                    backgroundColor: theme.palette.secondary.light
                  }}
                >
                  <CardContent>
                    <Grid container direction="column">
                      <Grid item xs={12}>
                        <Stack direction="row" spacing={2}>
                          <IconPhoto stroke={1.5} size="1.3rem" />
                          <Typography variant="h4">picture1.jpg</Typography>
                        </Stack>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </ListItemWrapper>
      <Divider />
      <ListItemWrapper>
        <ListItem alignItems="center">
          <ListItemAvatar>
            <Avatar alt="MaiWaiLaw" src={"src/assets/img/avatars/avatar_default.jpg"} />
          </ListItemAvatar>
          <ListItemText
            sx={{
              [theme.breakpoints.up('sm')]: {
                display: 'inline-flex',
                justifyContent: 'space-between'
              },
              [theme.breakpoints.down('sm')]: {
                display: 'block',
              },
            }}
            primary={<Typography variant="h4">คุณ MaiWaiLaw</Typography>}
            secondary={<Typography variant="caption" mr={1}>
              2 นาทีที่แล้ว
            </Typography>}
          />
        </ListItem>
        <Grid container direction="column" className="list-container">
          <Grid item xs={12} sx={{ pb: 2 }}>
            <Typography variant="h6">ยินต้อนรับ คุณ MaiWaiLaw ขอให้สนุกกับสวนสนุกนะครับ</Typography>
          </Grid>
          <Grid item xs={12}>
            <Grid container>
              <Grid item>
                <Chip label="ยืนยันบัญชีสำเร็จ" sx={chipSuccessSX} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </ListItemWrapper>
    </List >
  );
};

export default NotificationList;
