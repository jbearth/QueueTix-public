import React from 'react';

// material-ui
import { Grid, Typography } from '@mui/material';

// third-party
import ReactApexChart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';

// project imports
import CardWarpper from 'components/cards/CardWarpper';
import SkeletonTotalOrderCard from 'components/cards/Skeleton/EarningCard';
import { fCurrency } from 'utils/formatNumber';

// assets
import { Icon } from '@iconify/react';

// ----------------------------------------------------------------------

// AppConversionRates.propTypes = {
//   title: PropTypes.string,
//   subheader: PropTypes.string,
//   chartData: PropTypes.array.isRequired,
// };

interface Props {
  isLoading: boolean,
  chartColors: string,
  chartData: any[],
  dataCard: {
    name: string,
    icon: string,
    trending: string,
    population: string,
  }
}

export default function ChartTotalColumnCard({ isLoading, chartData, chartColors, dataCard }: Props) {

  const theme: any = useTheme();

  // const chartOptions = useChart({
  //   colors: chartColors,
  //   charts: {
  //     toolbar: {
  //       show: false,
  //     },
  //     sparkline: {
  //       enabled: true
  //     }
  //   },
  //   stroke: {
  //     width: 0,
  //   },
  //   tooltip: {
  //     custom: function ({ series, seriesIndex, dataPointIndex }: any) {
  //       return (
  //         '<div class="arrow_box">' +
  //         "<span>" + fNumber(series[seriesIndex][dataPointIndex]) +
  //         " คน" +
  //         "</span>" +
  //         "</div>"
  //       )
  //     },
  //   },
  //   grid: {
  //     show: false,
  //   },
  //   plotOptions: {
  //     bar: {
  //       horizontal: false,
  //       columnWidth: '60%',
  //       borderRadius: 2
  //     },
  //   },
  //   xaxis: {
  //     type: 'numeric',
  //     labels: {
  //       show: false
  //     }
  //     // categories: chartLabels,
  //   },
  //   yaxis: {
  //     labels: {
  //       show: false
  //     }
  //   },
  // });

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
                  <Typography variant='h6' fontFamily={'Sarabun-SemiBold'} >{dataCard.name}</Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item sx={{ mb: 1.5 }}>
              <Grid container alignItems="center">
                <Grid item xs={8}>
                  <Grid container alignItems="center" mt={2}>
                    <Grid item>
                      <Icon
                        icon={dataCard.icon}
                        width={30}
                        style={{
                          color: dataCard.icon === "solar:double-alt-arrow-down-bold-duotone" ? theme.palette.orange.dark : theme.palette.success.dark,
                          marginTop: 2,
                          padding: 0
                        }}
                      />
                    </Grid>
                    <Grid item>
                      <Typography variant='h5' sx={{ fontFamily: 'PublicSans-SemiBold', ml: 1 }}>
                        {dataCard.trending}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} mt={1}>
                      <Typography
                        variant='h3'
                        fontFamily={'Sarabun-Bold'}
                      >
                        {dataCard.population}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={4}>
                  <ReactApexChart
                    height={80}
                    width={110}
                    type={'bar'}
                    series={chartData}
                    options={{
                      colors: [chartColors],
                      chart: {
                        height: 80,
                        type: 'bar',
                        toolbar: {
                          show: false,
                        },
                        sparkline: {
                          enabled: true
                        }
                      },
                      grid: {
                        show: false,
                      },
                      plotOptions: {
                        bar: {
                          horizontal: false,
                          columnWidth: '60%',
                          borderRadius: 3
                        },
                      },
                      stroke: {
                        width: 0,
                      },
                      dataLabels: {
                        enabled: false
                      },
                      fill: {
                        opacity: 1,
                      },
                      xaxis: {
                        type: 'numeric',
                        labels: {
                          show: false
                        }
                      },
                      yaxis: {
                        labels: {
                          show: false
                        }
                      },
                      tooltip: {
                        custom: function ({ series, seriesIndex, dataPointIndex }: any) {
                          return (
                            '<div class="arrow_box">' +
                            "<span>" + fCurrency(series[seriesIndex][dataPointIndex]) +
                            " ฿" +
                            "</span>" +
                            "</div>"
                          )
                        },
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardWarpper>
      )}
    </>
  );
}
