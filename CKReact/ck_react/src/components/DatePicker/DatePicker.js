import * as React from "react";
import { useState, useEffect } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker as MUI } from "@mui/x-date-pickers/DatePicker";
import { ThemeProvider } from "styled-components";
import { createTheme } from "@mui/material/styles";
import dayjs from "dayjs";

const DatePicker = ({ value, onChange, readOnly = false }) => {
  const [date, setDate] = useState(dayjs(value));

  const newTheme = createTheme({
    components: {
      MUI: {
        styleOverrides: {
          root: {
            color: "#bbdefb",
            borderRadius: "20px",
            borderWidth: "1px",
            borderColor: "#2196f3",
            border: "1px solid",
            backgroundColor: "#ff0000",
          },
        },
      },
    },
  });

  const handleDateChange = (newDate) => {
    setDate(newDate);
    onChange(newDate); // Ensure the parent onChange handler is called with the new date
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ThemeProvider theme={newTheme}>
        <MUI
          readOnly={readOnly}
          sx={{
            ".css-o9k5xi-MuiInputBase-root-MuiOutlinedInput-root": {
              borderRadius: "12px",
              border: "2px solid black",
              outline: "none",
            },
            ".css-1d3z3hw-MuiOutlinedInput-notchedOutline": {
              border: "none",
            },
          }}
          className="w-full"
          value={date}
          onChange={handleDateChange}
          format="DD/MM/YYYY"
        />
      </ThemeProvider>
    </LocalizationProvider>
  );
};

export default DatePicker;
