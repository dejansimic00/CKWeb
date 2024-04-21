import { React, useState, useContext, useEffect } from "react";
import logo from "../../../assets/images/logo.png";
import resident from "../../../assets/images/refugee.png";
import archive from "../../../assets/images/archive.png";
import dashboard from "../../../assets/images/dashboard.png";
import NavButton from "../NavButton/NavButton";
import LogOutButton from "../../LogOutButton/LogOutButton";
import { useAuth } from "../../../hooks/useAuth";
import { useLocalStorage } from "../../../hooks/useLocalStorage";

function NavBar() {
  const [selectedPage, setSelectedPage] = useState("dashboard");
  const { user, logout } = useAuth();
  const [loggedIn, setLoggedIn] = useState(true);
  const { getItem } = useLocalStorage();

  useEffect(() => {
    let user = getItem("user");
    console.log(user, "ss");
    setLoggedIn(user !== null && user !== undefined);
  }, [user]);

  const handleMouseClick = (event, selected) => {
    console.log(selected);
    setSelectedPage(selected);
  };

  return (
    <>
      {loggedIn && (
        <nav className="flex flex-col bg-gray-200 h-screen">
          <div className="flex items-center  p-2">
            <img src={logo} className="w-12 h-12 mr-2" alt="Logo"></img>
            <p className="font-medium text-2xl">EC</p>
          </div>
          <div className="w-full ">
            <NavButton
              icon={dashboard}
              text="Izvjestaj"
              isActive={selectedPage === "dashboard"}
              to="/dashboard"
              onAction={(event) => handleMouseClick(event, "dashboard")}
            ></NavButton>
            <NavButton
              icon={resident}
              text="User"
              isActive={selectedPage === "residents"}
              to="/residents"
              onAction={(event) => handleMouseClick(event, "residents")}
            ></NavButton>
            <NavButton
              icon={archive}
              text="Arhiva"
              isActive={selectedPage === "archive"}
              to="/archive"
              onAction={(event) => handleMouseClick(event, "archive")}
            ></NavButton>
            <NavButton
              icon={archive}
              text="Odjavi se"
              to="/login"
              onAction={(event) => {
                handleMouseClick(event, "login");
                logout();
                setLoggedIn(false);
              }}
            ></NavButton>
          </div>
        </nav>
      )}
    </>
  );
}

export default NavBar;
