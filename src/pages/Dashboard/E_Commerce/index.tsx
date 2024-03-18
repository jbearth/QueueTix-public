import React, { useEffect, useState } from 'react';

// material-ui
import { Grid } from '@mui/material';

// project imports
import { gridSpacing } from 'store/constant';
import ChartTotalColumnCard from './ChartTotalColumnCard';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const E_Commerce = () => {
  const [isLoading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} md={6} lg={4}>
            <ChartTotalColumnCard
              isLoading={isLoading}
              chartColors={"#00c853"}
              chartData={[
                {
                  name: "",
                  data: [120, 330, 448, 260, 240, 580, 325, 712, 284, 410]
                }
              ]}
              dataCard={{
                name: "Product Sold",
                icon: "solar:double-alt-arrow-up-bold-duotone",
                trending: "+5.6%",
                population: "208,472",
              }}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <ChartTotalColumnCard
              isLoading={isLoading}
              chartColors={"#f1f"}
              chartData={[
                {
                  name: "",
                  data: [760, 850, 1010, 980, 870, 1050, 910, 1140, 940]
                }
              ]}
              dataCard={{
                name: "Product Sold",
                icon: "solar:double-alt-arrow-up-bold-duotone",
                trending: "+5.6%",
                population: "208,472",
              }}
            />
          </Grid>
          {/* {chartVIDstyled.map((item: any, index: number) => (
            <Grid key={index} item lg={4} md={6} sm={6} xs={12}>
              <TotalColumnChartCard
                isLoading={isLoading}
                name={item.name}
                icon={item.icon}
                trending={item.trending}
                population={item.population}
                series={item.chart.series}
                options={item.chart.options}
              />
            </Grid>
          ))} */}
        </Grid>
      </Grid>
      {/* <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} md={6} lg={4}>
            
          </Grid>
        </Grid>
      </Grid> */}
    </Grid>
  );
};

export default E_Commerce;
