// Christina Chen
import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { barElementClasses } from '@mui/x-charts/BarChart';

// Bar chart to display poll statistics
// Reference documentation : https://mui.com/x/react-charts/axis/
export default function PollBarChart({ dataset }) {
  const colors = ['#81B5D1'];
  const theme_color = '#085A77';
  
  // Chart styling customization
  const chartParams = {
    // Style y-axis
    yAxis: [
      {
        label: 'Vote Count',
        labelStyle: {
            fontSize: 14,
            fill: `${theme_color}`
        }
      },
    ],
    // data
    series: [
      {
        dataKey: 'vote_count',
        valueFormatter: (v) =>
          `${v} vote(s)`,
      },
    ],
    // hide legend
    slotProps: {
      legend: { hidden: true }
    },
    dataset, 
    width: 500,
    height: 400,

    // styling colors and axis widths
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

      // set data
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
      // set colors
      colors={colors}
      // set styling
      {...chartParams}
    />
  );
}