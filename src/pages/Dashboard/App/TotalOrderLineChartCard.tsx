import React, { useState } from 'react';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { Avatar, Box, Grid, Typography } from '@mui/material';

// third-party
import Chart from 'react-apexcharts';

// project imports
import MainCard from 'components/cards/MainCard';
import SkeletonTotalOrderCard from 'components/cards/Skeleton/EarningCard';


// assets
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';
import { Icon } from '@iconify/react';

const CardWrapper = styled(MainCard)(({ theme }: any) => ({
  backgroundColor: theme.palette.background.paper,
  overflow: 'hidden',
  position: 'relative',
  '&>div': {
    position: 'relative',
    zIndex: 5
  },
  '&:after': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: theme.palette.primary[800],
    borderRadius: '50%',
    zIndex: 1,
    top: -85,
    right: -95,
    [theme.breakpoints.down('sm')]: {
      top: -105,
      right: -140
    }
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    zIndex: 1,
    width: 210,
    height: 210,
    background: theme.palette.primary[800],
    borderRadius: '50%',
    top: -125,
    right: -15,
    opacity: 0.5,
    [theme.breakpoints.down('sm')]: {
      top: -155,
      right: -70
    }
  }
}));

// ==============================|| DASHBOARD - TOTAL ORDER LINE CHART CARD ||============================== //

const TotalOrderLineChartCard = ({ isLoading }: any) => {
  const theme: any = useTheme();

  const [timeValue, setTimeValue] = useState(false);
  const handleChangeTime = (event: any, newValue: any) => {
    setTimeValue(newValue);
  };

  return (
    <>
      {isLoading ? (
        <SkeletonTotalOrderCard />
      ) : (
        <CardWrapper content={false}>
          <Box sx={{ p: 2.25 }}>
            <Grid container direction="column">
              <Grid item>
                <Grid container alignItems={'center'}>
                  <Grid item mt={0.5}>
                    <Avatar
                      variant="rounded"
                      sx={{
                        ...theme.typography.commonAvatar,
                        ...theme.typography.largeAvatar,
                        backgroundColor: theme.palette.primary[700],
                        mr: 2,
                        width: 30
                      }}
                    >
                      <LocalMallOutlinedIcon />
                    </Avatar>
                  </Grid>
                  <Grid item>
                    <Typography variant='h3' fontFamily={'Sarabun-SemiBold'} >Total Visitor Web Users</Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item sx={{ mb: 0.75 }}>
                <Grid container alignItems="center">
                  <Grid item xs={6}>
                    <Grid container alignItems="center" mt={2}>
                      <Grid item>
                        <Icon
                          icon={"material-symbols:trending-up-rounded"}
                          width={28}
                          style={{
                            backgroundColor: theme.palette.success.light,
                            color: theme.palette.success.dark,
                            borderRadius: 14,
                            padding: 3
                          }}
                        />
                      </Grid>
                      <Grid item>
                        <Typography variant='h3' sx={{ fontFamily: 'Segoe UI', fontWeight: 600 }}>
                          +5.2%
                        </Typography>
                      </Grid>
                      <Grid item xs={12} mt={2}>
                        <Typography
                          variant='h1'
                          fontFamily={'Sarabun-Bold'}
                        >
                          18,926
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={6}>
                    {/* <Chart {...ChartTotalView} /> */}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </CardWrapper>
      )}
    </>
  );
};

export default TotalOrderLineChartCard;
