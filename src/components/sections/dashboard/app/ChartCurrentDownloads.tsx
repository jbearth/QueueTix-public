import React from 'react';

// material-ui
import { Box } from '@mui/material';

// third-party
import ReactApexChart from 'react-apexcharts';
import moment from 'moment';
import dayjs from 'dayjs';

// project imports
import MainCard from 'components/cards/MainCard';
import { useChart } from 'components/chart';

// ----------------------------------------------------------------------

interface Props {
  title: any,
  subheader: any,
  chartData: any[],
  chartTimes: any,
  chartColors: string[],
}

export default function ChartCurrentDownloads({ title, subheader, chartTimes, chartColors, chartData }: Props) {
  const chartOptions = useChart({
    colors: chartColors,
    plotOptions: { bar: { columnWidth: '16%' } },
    fill: { type: 'gradient' },
    xaxis: {
      type: 'datetime',
      categories: chartTimes,
      tickPlacement: 'on',
      tickAmount: 11,
      labels: {
        rotate: -10,
        rotateAlways: true,
        formatter: function (_val: any, timestamp: any) {
          return moment(new Date(timestamp)).format("MMM YY")
        }
      },
      style: {
        fontFamily: 'Sarabun-Regular',
        fontSize: '12px'
      },
      // datetimeUTC: true
    },

  });

  return (
    <MainCard
      elevation={0}
      content={false}
      sx={{
        borderRadius: 5,
      }}
      headerSX={{
        // ml: 1,
        '&.MuiCardHeader-action': { mr: 0 }
      }}
      divider={false}
      title={title}
      subheader={subheader}
    >

      <Box sx={{ p: 3, pt: 0, pb: 4 }} dir="ltr">
        {/* @ts-ignore */}
        <ReactApexChart type="area" series={chartData} options={chartOptions} height={340} />
      </Box>
    </MainCard>
  );
}
