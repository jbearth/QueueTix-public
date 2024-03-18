import * as React from 'react';

// material-ui
import { useTheme, styled } from '@mui/material/styles';

// third-party
import ReactApexChart from 'react-apexcharts';

// project imports
import MainCard from 'components/cards/MainCard';
import { fNumber } from 'utils/formatNumber';
import { useChart } from 'components/chart';

// ----------------------------------------------------------------------

const CHART_HEIGHT = 372;
const LEGEND_HEIGHT = 72;

const StyledChartWrapper: any = styled('div')(({ theme }) => ({
  height: CHART_HEIGHT,
  marginTop: theme.spacing(2),
  '& .apexcharts-canvas svg': { height: CHART_HEIGHT },
  '& .apexcharts-canvas svg,.apexcharts-canvas foreignObject': {
    overflow: 'visible',
  },
  '& .apexcharts-legend': {
    height: LEGEND_HEIGHT,
    alignContent: 'center',
    position: 'relative !important',
    borderTop: `solid 1px ${theme.palette.divider}`,
    top: `calc(${CHART_HEIGHT - LEGEND_HEIGHT}px) !important`,
  },
}));

// ----------------------------------------------------------------------

// AppCurrentVisits.propTypes = {
//   title: PropTypes.string,
//   subheader: PropTypes.string,
//   chartColors: PropTypes.arrayOf(PropTypes.string),
//   chartData: PropTypes.array,
// };

interface Props {
  title: any,
  subheader: any,
  chartColors: string[],
  chartData: any[],
}

export default function ChartCurrenVisits({ title, subheader, chartColors, chartData }: Props) {
  const theme = useTheme();

  const chartLabels: any = chartData.map((i: { label: any; }) => i.label);

  const chartSeries: any = chartData.map((i: { value: any; }) => i.value);


  const chartOptions: any = useChart({
    colors: chartColors,
    labels: chartLabels,
    stroke: { colors: [theme.palette.background.paper] },
    legend: { floating: true, horizontalAlign: 'center' },
    dataLabels: { enabled: true, dropShadow: { enabled: false } },
    tooltip: {
      fillSeriesColor: false,
      y: {
        formatter: (seriesName: any) => fNumber(seriesName),
        title: {
          formatter: (seriesName: any) => `${seriesName}`,
        },
      },
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true
          }
        }
      },
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
        ml: 1,
        '&.MuiCardHeader-action': { mr: 0 }
      }}
      divider={false}
      title={title}
      subheader={subheader}
    >
      <StyledChartWrapper dir="ltr">
        {/* @ts-ignore */}
        <ReactApexChart type="donut" series={chartSeries} options={chartOptions} height={280} />
      </StyledChartWrapper>
    </MainCard>
  );
}
