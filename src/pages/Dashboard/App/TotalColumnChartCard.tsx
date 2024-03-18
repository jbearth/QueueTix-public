import React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Grid, Typography } from '@mui/material';

// third-party
import ReactApexChart from 'react-apexcharts';

// project imports
import CardWarpper from 'components/cards/CardWarpper';
import SkeletonTotalOrderCard from 'components/cards/Skeleton/EarningCard';
import './css/TotalColumnChartCard.css'

// assets
import { Icon } from '@iconify/react';


// ==============================|| DASHBOARD - TOTAL ORDER LINE CHART CARD ||============================== //

interface Props {
  isLoading: boolean,
  name: string,
  icon: string,
  trending: string,
  population: string,
  series: any,
  options: any
}

const TotalColumnChartCard = ({
  isLoading,
  name,
  icon,
  trending,
  population,
  series,
  options
}: Props) => {
  const theme: any = useTheme();

  return (
    <>
      {isLoading ? (
        <SkeletonTotalOrderCard />
      ) : (
        <CardWarpper content={false}>
          <Grid container direction="column">
            <Grid item>
              <Grid container alignItems={'center'}>
                <Grid item>
                  <Typography variant='h6' fontFamily={'Sarabun-SemiBold'} >{name}</Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item sx={{ mb: 1.5 }}>
              <Grid container alignItems="center">
                <Grid item xs={8}>
                  <Grid container alignItems="center" mt={2}>
                    <Grid item xs={12} mt={1}>
                      <Typography
                        variant='h3'
                        fontFamily={'Sarabun-Bold'}
                        mt={3}
                      >
                        {population}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={4}>
                  <div id="chart">
                    {/* @ts-ignore */}
                    <ReactApexChart
                      height={80}
                      width={110}
                      type={'bar'}
                      series={series}
                      options={options}
                    />
                  </div>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardWarpper>
      )}
    </>
  );
};

export default TotalColumnChartCard;
