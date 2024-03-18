import React, { useEffect, useState } from 'react';

// material-ui
import { Box, CircularProgress, Grid, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// project imports
// import EarningCard from './TotalOrderLineChart1ard';
import TotalColumnChartCard from './TotalColumnChartCard';
import ChartCurrenVisits from 'components/sections/dashboard/app/ChartCurrenVisits';
import ChartCurrentDownloads from 'components/sections/dashboard/app/ChartCurrentDownloads';
import { gridSpacing } from 'store/constant';
import { chartVIDstyled } from 'components/sections/dashboard/app/totalV-I-Dcolumnbarchart';
import { gql, useQuery } from '@apollo/client';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const PURCHASETICKET = gql`
  query GetPurchaseTicket {
    getPurchaseTicketAll {
      id
      types
      purchasetickettypes {
        price
      }
    }
  }
`;

function sumPricesByOrderIdArray(ticketArray: any[]) {
  const totalPriceByOrderId: any = [];

  // Iterate through each purchase ticket
  ticketArray.forEach((purchaseTicket) => {

    let sumPrice = 0

    // Iterate through each purchase ticket type
    purchaseTicket.purchasetickettypes.forEach((ticketType: any) => {
      // Add the price to the total price for the orderId
      sumPrice += ticketType.price;
    });

    totalPriceByOrderId.push(sumPrice)
  });

  return totalPriceByOrderId;
}

const Dashboard = () => {
  const theme: any = useTheme();
  const [isLoading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const {
    loading: queryPurchaseTicketAllLoading,
    error: queryPurchaseTicketAllError,
    data: queryPurchaseTicketAllData,
  } = useQuery(PURCHASETICKET);


  if (queryPurchaseTicketAllLoading) {
    return (
      <Box display={"flex"} height={"100%"} justifyContent={'center'} alignItems={'center'} >
        <CircularProgress size={80} disableShrink />
      </Box>
    )
  }

  let total: any;
  let totalPriceByEntrance: any = [];
  let totalPriceByIncludeRides: any = [];
  let totalPriceByDreamWorldVisa: any = [];
  let totalPriceBySuperVisa: any = [];

  if (!queryPurchaseTicketAllLoading) {
    total = sumPricesByOrderIdArray(queryPurchaseTicketAllData.getPurchaseTicketAll);

    function sumPricesByTypesArray() {
      // Iterate through each purchase ticket
      queryPurchaseTicketAllData.getPurchaseTicketAll.forEach((purchaseTicket: any) => {

        // Iterate through each purchase ticket type
        purchaseTicket.purchasetickettypes.forEach((ticketType: any) => {
          if (purchaseTicket.types == "Entrance") {
            totalPriceByEntrance.push(ticketType.price)
          } else if (purchaseTicket.types == "IncludeRides") {
            totalPriceByIncludeRides.push(ticketType.price)
          } else if (purchaseTicket.types == "DreamWorldVisa") {
            totalPriceByDreamWorldVisa.push(ticketType.price)
          } else if (purchaseTicket.types == "SuperVisa") {
            totalPriceBySuperVisa.push(ticketType.price)
          }
        });
      });
    }
    sumPricesByTypesArray()

  }

  const TotalPurchaseTicketPrice = {
    name: "ยอดชำระสินค้าทั้งหมด",
    icon: "solar:double-alt-arrow-down-bold-duotone",
    trending: "-1.2%",
    population: String(total.reduce((sum: any, price: any) => sum + price, 0)) + " ฿",
    chart: {
      series: [{
        name: '',
        data: total
      }],
      options: {
        colors: ['#6200ea'],
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
          width: 1,
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
              "<span>" + series[seriesIndex][dataPointIndex] +
              " บาท" +
              "</span>" +
              "</div>"
            )
          },
        }
      }
    }
  }

  const TotalSumPriceOfEntrance = {
    name: "ยอดรวมราคาบัตรผ่านประตู",
    icon: "solar:double-alt-arrow-down-bold-duotone",
    trending: "-1.2%",
    population: String(totalPriceByEntrance.reduce((sum: any, price: any) => sum + price, 0)) + " ฿",
    chart: {
      series: [{
        name: '',
        data: totalPriceByEntrance
      }],
      options: {
        colors: ['#FFC107'],
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
          width: 1,
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
              "<span>" + series[seriesIndex][dataPointIndex] +
              " บาท" +
              "</span>" +
              "</div>"
            )
          },
        }
      }
    }
  }

  const TotalSumPriceOfIncludeRides = {
    name: "ยอดรวมราคาบัตรรวมเครื่องเล่น",
    icon: "solar:double-alt-arrow-down-bold-duotone",
    trending: "-1.2%",
    population: String(totalPriceByDreamWorldVisa.reduce((sum: any, price: any) => sum + price, 0)) + " ฿",
    chart: {
      series: [{
        name: '',
        data: totalPriceByDreamWorldVisa
      }],
      options: {
        colors: ['#2196f3'],
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
          width: 1,
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
              "<span>" + series[seriesIndex][dataPointIndex] +
              " บาท" +
              "</span>" +
              "</div>"
            )
          },
        }
      }
    }
  }

  const TotalSumPriceOfDreamWorldVisa = {
    name: "ยอดรวมราคาบัตรดรีมเวิลวีซ่า",
    icon: "solar:double-alt-arrow-down-bold-duotone",
    trending: "-1.2%",
    population: String(totalPriceByDreamWorldVisa.reduce((sum: any, price: any) => sum + price, 0)) + " ฿",
    chart: {
      series: [{
        name: '',
        data: totalPriceByDreamWorldVisa
      }],
      options: {
        colors: ['#d84315'],
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
          width: 1,
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
              "<span>" + series[seriesIndex][dataPointIndex] +
              " บาท" +
              "</span>" +
              "</div>"
            )
          },
        }
      }
    }
  }

  const TotalSumPriceOfSuperVisa = {
    name: "ยอดรวมราคาบัตรซุปเปอร์วีซ่า",
    icon: "solar:double-alt-arrow-down-bold-duotone",
    trending: "-1.2%",
    population: String(totalPriceBySuperVisa.reduce((sum: any, price: any) => sum + price, 0)) + " ฿",
    chart: {
      series: [{
        name: '',
        data: totalPriceBySuperVisa
      }],
      options: {
        colors: ['#00c853'],
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
          width: 1,
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
              "<span>" + series[seriesIndex][dataPointIndex] +
              " บาท" +
              "</span>" +
              "</div>"
            )
          },
        }
      }
    }
  }

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <TotalColumnChartCard
              isLoading={isLoading}
              name={TotalPurchaseTicketPrice.name}
              icon={TotalPurchaseTicketPrice.icon}
              trending={TotalPurchaseTicketPrice.trending}
              population={TotalPurchaseTicketPrice.population}
              series={TotalPurchaseTicketPrice.chart.series}
              options={TotalPurchaseTicketPrice.chart.options}
            />
          </Grid>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <TotalColumnChartCard
              isLoading={isLoading}
              name={TotalSumPriceOfEntrance.name}
              icon={TotalSumPriceOfEntrance.icon}
              trending={TotalSumPriceOfEntrance.trending}
              population={TotalSumPriceOfEntrance.population}
              series={TotalSumPriceOfEntrance.chart.series}
              options={TotalSumPriceOfEntrance.chart.options}
            />
          </Grid>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <TotalColumnChartCard
              isLoading={isLoading}
              name={TotalSumPriceOfIncludeRides.name}
              icon={TotalSumPriceOfIncludeRides.icon}
              trending={TotalSumPriceOfIncludeRides.trending}
              population={TotalSumPriceOfIncludeRides.population}
              series={TotalSumPriceOfIncludeRides.chart.series}
              options={TotalSumPriceOfIncludeRides.chart.options}
            />
          </Grid>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <TotalColumnChartCard
              isLoading={isLoading}
              name={TotalSumPriceOfDreamWorldVisa.name}
              icon={TotalSumPriceOfDreamWorldVisa.icon}
              trending={TotalSumPriceOfDreamWorldVisa.trending}
              population={TotalSumPriceOfDreamWorldVisa.population}
              series={TotalSumPriceOfDreamWorldVisa.chart.series}
              options={TotalSumPriceOfDreamWorldVisa.chart.options}
            />
          </Grid>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <TotalColumnChartCard
              isLoading={isLoading}
              name={TotalSumPriceOfSuperVisa.name}
              icon={TotalSumPriceOfSuperVisa.icon}
              trending={TotalSumPriceOfSuperVisa.trending}
              population={TotalSumPriceOfSuperVisa.population}
              series={TotalSumPriceOfSuperVisa.chart.series}
              options={TotalSumPriceOfSuperVisa.chart.options}
            />
          </Grid>
        </Grid>
      </Grid>
      {/* <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} md={6} lg={4}>
            <ChartCurrenVisits
              title={<Typography variant='h3' fontFamily={'Sarabun-Medium'}>Current Visits</Typography>}
              subheader={<Typography variant='h7'>ยอดผู้เยี่ยมชมปัจจุบัน</Typography>}
              chartData={[
                { label: 'IOS', value: 4344 },
                { label: 'Android', value: 5435 },
              ]}
              chartColors={[
                theme.palette.lightblue.main,
                theme.palette.errorCustom.main,
              ]}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={8}>
            <ChartCurrentDownloads
              title={<Typography variant='h3' fontFamily={'Sarabun-Medium'}>Current Downloads</Typography>}
              subheader={<Typography variant='h7'>ยอดดาวน์โหลดในแต่ละเดือน</Typography>}
              chartTimes={[
                "2022-01-01",
                "2022-02-02",
                "2022-03-03",
                "2022-04-04",
                "2022-05-05",
                "2022-06-06",
                "2022-07-07",
                "2022-08-08",
                "2022-09-09",
                "2022-10-10",
                "2022-11-11",
                "2022-12-12"
              ]}
              chartColors={[
                theme.palette.lightblue.main,
                theme.palette.errorCustom.main,
              ]}
              chartData={[
                {
                  name: 'IOS',
                  data: [
                    4356, 1124, 2288, 2762, 1394, 2282, 3747, 2821, 4428, 2206, 3045, 4029
                    // [new Date('2023-01-01'), 4356],
                    // [new Date('2023-02-02'), 1124],
                    // [new Date('2023-03-03'), 2288],
                    // [new Date('2023-04-04'), 2762],
                    // [new Date('2023-05-05'), 1394],
                    // [new Date('2023-06-06'), 2282],
                    // [new Date('2023-07-07'), 3747],
                    // [new Date('2023-08-08'), 2821],
                    // [new Date('2023-09-09'), 4428],
                    // [new Date('2023-10-10'), 2206],
                    // [new Date('2023-11-11'), 3045],
                    // [new Date('2023-12-12'), 4029]
                  ],
                },
                {
                  name: 'Android',
                  data: [
                    3024, 2556, 3677, 3089, 4522, 3545, 6499, 5212, 5961, 3673, 3948, 5362
                    // [new Date('2023-01-01'), 2356],
                    // [new Date('2023-02-02'), 3124],
                    // [new Date('2023-03-03'), 4288],
                    // [new Date('2023-04-04'), 5762],
                    // [new Date('2023-05-05'), 2394],
                    // [new Date('2023-06-06'), 2182],
                    // [new Date('2023-07-07'), 5747],
                    // [new Date('2023-08-08'), 1821],
                    // [new Date('2023-09-09'), 428],
                    // [new Date('2023-10-10'), 1206],
                    // [new Date('2023-11-11'), 5045],
                    // [new Date('2023-12-12'), 6029]
                  ],
                },
              ]}
            />
          </Grid>
        </Grid>
      </Grid> */}
      {/* <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12} md={8}>
                        <TotalGrowthBarChart isLoading={isLoading} />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <PopularCard isLoading={isLoading} />
                    </Grid>
                </Grid>
            </Grid> */}
    </Grid>
  );
};

export default Dashboard;
