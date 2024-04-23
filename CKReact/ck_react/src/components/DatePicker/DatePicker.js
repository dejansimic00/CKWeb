import * as React from "react";
import { useState, useEffect } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker as MUI } from "@mui/x-date-pickers/DatePicker";
import { ThemeProvider } from "styled-components";
import { createTheme } from "@mui/material/styles";

const DatePicker = ({ onChange }) => {
  const [date, setDate] = useState();
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

  const formatDate = (selectedDate) => {
    return `${selectedDate.$y}-${selectedDate.$M + 1}-${selectedDate.$D}`;
  };

  useEffect(() => {
    if (date) {
      onChange(date);
    }
  }, [date, onChange]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ThemeProvider theme={newTheme}>
        <MUI
          sx={{
            ".css-o9k5xi-MuiInputBase-root-MuiOutlinedInput-root ": {
              borderRadius: "12px",
              border: "2px solid black",
              outline: "none",
            },
            ".css-1d3z3hw-MuiOutlinedInput-notchedOutline": {
              border: "none",
            },
          }}
          className="w-full"
          openTo="year"
          views={["year", "month", "day"]}
          format="DD/MM/YYYY"
          onChange={(selectedDate) => {
            setDate(formatDate(selectedDate)); // Update date state with formatted date
          }}
        />
      </ThemeProvider>
    </LocalizationProvider>
  );
};

export default DatePicker;
