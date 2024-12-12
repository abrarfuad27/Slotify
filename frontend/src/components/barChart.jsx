import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { createTheme, responsiveFontSizes } from '@mui/material/styles';

//https://mui.com/material-ui/customization/typography/
let theme = createTheme();
theme = responsiveFontSizes(theme);


//https://mui.com/x/react-charts/tooltip/

// const dataset = [
//   { date: 'Dec 5th, 2024 | 3pm - 5pm', option: 'option 1', vote_count: 471 },
//   { date: 'Dec 6th, 2024 | 3pm - 5pm', option: 'option 2', vote_count: 583 },
//   { date: 'Dec 7th, 2024 | 3pm - 5pm', option: 'option 3', vote_count: 90.35 },
  
//   { date: 'Dec 8th, 2024 | 3pm - 5pm', option: 'option 4', vote_count: 400 },
  
// ];

// const chartParams = {
//   yAxis: [
//     {
//       label: 'Vote Count',
//     },
//   ],
//   series: [
//     {
//     //   label: 'GDP',
//       dataKey: 'vote_count',
//       valueFormatter: (v) =>
//         `${v} votes`,
//     },
//   ],
//   slotProps: { legend: { hidden: true } },
//   dataset,
//   width: 600,
//   height: 400,
//   sx: {
//     [`.${axisClasses.left} .${axisClasses.label}`]: {
//       transform: 'translate(-20px, 0)',
//     },
//   },
// };
const colors = ['#81B5D1'];
// const axisStyle = {
//     axisLine: { stroke: 'red', 
//     strokeWidth: 10,
//     }, 
//     tickLine: { 
//         stroke: 'red', 
//         strokeWidth: 1,
//     },
//     tickText: { 
//         fill: 'green', 
//     },
// };

    // const dataset = [
    // { date: 'Dec 5th, 2024 | 3pm - 5pm', option: 'option 1', vote_count: 471 },
    // { date: 'Dec 6th, 2024 | 3pm - 5pm', option: 'option 2', vote_count: 583 },
    // { date: 'Dec 7th, 2024 | 3pm - 5pm', option: 'option 3', vote_count: 90.35 },
    
    // { date: 'Dec 8th, 2024 | 3pm - 5pm', option: 'option 4', vote_count: 400 },
  
    // ];


export default function AxisFormatter({dataset, chartParams}) {
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
              
        },{
          labelStyle:{fontSize:20}
        }
      ]}
      colors={colors}
      {...chartParams}
    />
  );
}