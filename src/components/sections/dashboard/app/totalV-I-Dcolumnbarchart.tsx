import { gql, useQuery } from "@apollo/client"

// ===========================|| DASHBOARD - TOTAL VISITOR, INSTALLED, DOWNLOADS BAR CHART ||=========================== //


export const chartVIDstyled: any = [
  {
    name: "Total Active Users",
    icon: "solar:double-alt-arrow-down-bold-duotone",
    trending: "-1.2%",
    population: "18,926",
    chart: {
      series: [{
        name: '',
        data: [8, 18, 12, 51, 68, 11, 39, 37, 27, 20]
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
              " คน" +
              "</span>" +
              "</div>"
            )
          },
        }
      }
    }
  },
  {
    name: "Total Users",
    icon: "solar:double-alt-arrow-up-bold-duotone",
    trending: "+0.2%",
    population: "4,107,235",
    chart: {
      series: [{
        name: '',
        data: [20, 41, 63, 33, 28, 35, 50, 46, 11, 26]
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
              "<span>" + series[seriesIndex][dataPointIndex] +
              " คน" +
              "</span>" +
              "</div>"
            )
          },
        }
      },
    }
  },
  {
    name: "Total Downloads",
    icon: "solar:double-alt-arrow-up-bold-duotone",
    trending: "+5.6%",
    population: "208,472",
    chart: {
      series: [{
        name: '',
        data: [8, 9, 31, 8, 16, 37, 8, 33, 46, 28]
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
              "<span>" + series[seriesIndex][dataPointIndex] +
              " คน" +
              "</span>" +
              "</div>"
            )
          },
        },

      }
    }
  }
]
