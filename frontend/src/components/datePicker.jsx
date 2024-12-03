import React, { useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import {Button} from "@mui/material"

// reference : https://github.com/MitterYourTechMate/datepicker/blob/main/src/App.js
//TODO rewrite!
const DatePickerComponent = () => {
  // dayjs.tz.setDefault('Pacific/Auckland');
  let date = new Date()
  const [value, setValue] = React.useState(dayjs(date));
  
  const handleClick = () => {
    alert(`Your Appointment is booked on ${dayjs(value).format('DD-MM-YYYY')}`)
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker           
      value={value}
      onChange={(newValue) => {
        setValue(newValue)
        }}></DatePicker>
        {/* <Button variant="contained" onClick={handleClick} style={{marginLeft:"70%"}}>BOOK APPOINTMENT</Button> */}
      </LocalizationProvider>
  );
};

export default DatePickerComponent;
