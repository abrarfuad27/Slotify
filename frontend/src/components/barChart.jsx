import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { barElementClasses } from '@mui/x-charts/BarChart';

// Reference documentation : https://mui.com/x/react-charts/axis/
export default function AxisFormatter({ dataset }) {
  const colors = ['#81B5D1'];
  const theme_color = '#085A77';
  const chartParams = {
    yAxis: [
      {
        label: 'Vote Count',
        labelStyle: {
            fontSize: 14,
            fill: `${theme_color}`
        }
      },
    ],
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
    width: 500,
    height: 400,
    sx: {
      [`.${barElementClasses.root}`]: {
        '&:hover': {
          fill:`${theme_color}`,
          stroke: `${theme_color}`,
        },
    
      },
      [`.${axisClasses.root}`]: {
        [`.${axisClasses.line}, .${axisClasses.tick}`]: {
          stroke: `${theme_color}`,
          strokeWidth: 5
        },
        [`.${axisClasses.tickLabel}`]: {
          fill: `${theme_color}`,
        },
      },
    }
  };
  return (
    
    <BarChart
      className='my-bar-chart'
      borderRadius={10}
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