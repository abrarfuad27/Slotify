import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { barElementClasses } from '@mui/x-charts/BarChart';
// https://mui.com/x/react-charts/axis/

const colors = ['#81B5D1'];

export default function AxisFormatter({ dataset }) {
  const chartParams = {
    series: [
      {
        //   label: 'GDP',
        dataKey: 'vote_count',
        valueFormatter: (v) =>
          `${v} vote(s)`,
      },
    ],
    slotProps: {
      legend: { hidden: true }
    },
    dataset,
    width: 600,
    height: 400,
    sx: {
      [`.${barElementClasses.root}`]: {
        '&:hover': {
          fill: '#085A77',
          stroke: '#085A77',
        },
  
      },
      [`.${axisClasses.root}`]: {
        [`.${axisClasses.tick}`]: {
          stroke : 'none'
        },
        [`.${axisClasses.line}`]: {
          stroke: '#085A77',
          strokeWidth: 5
        },
        [`.${axisClasses.tickLabel}`]: {
          fill: '#085A77',
        },
      },
    }
  };
  return (
    
    <BarChart
      className='my-bar-chart'
      borderRadius={10}
      // leftAxis={null} //removes the vertical bar
      xAxis={[
        {
          categoryGapRatio: 0.7,
          scaleType: 'band',
          dataKey: 'option',
          valueFormatter: (option, context) =>
            context.location === 'tick'
              ? option
              : `Date: ${dataset.find((d) => d.option === option)?.date} (${option})`,

        }, {
          labelStyle: { fontSize: 20 }
        }
      ]}
      colors={colors}
      {...chartParams}
    />
  );
}