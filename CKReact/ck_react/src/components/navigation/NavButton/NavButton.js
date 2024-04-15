import React from "react";
import Button from "@mui/material/Button";
import theme from "../../../styles/colors";
import { ThemeProvider, createTheme } from "@mui/material";
import { Link } from "react-router-dom";

function NavButton({ isActive, icon, onAction, text = "def", to }) {
  const btnColor = isActive
    ? theme.colors.nav_btn_active
    : theme.colors.nav_btn; // Get the active button color from the theme

  const my_theme = createTheme({
    palette: {
      ochre: {
        main: btnColor,

        contrastText: "#242105",
      },
    },
  });

  return (
    <div className="m-2 ">
      <ThemeProvider theme={my_theme}>
        <Link to={to} style={{ textDecoration: "none" }}>
          <Button
            variant="contained"
            color="ochre"
            onClick={onAction}
            className="w-full "
            style={{
              justifyContent: "flex-start",
            }}
          >
            <div className="flex items-center ml-3">
              <img src={icon} className="w-6 h-6 mr-4" />
              <p>{text}</p>
            </div>
          </Button>
        </Link>
      </ThemeProvider>
    </div>
  );
}

export default NavButton;
