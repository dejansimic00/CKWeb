import { React, useState, useContext, useEffect } from "react";
import logoImg from "../../../assets/images/logo.png";
import residentImg from "../../../assets/images/resident.png";
import archiveImg from "../../../assets/images/archive.png";
import dashboardImg from "../../../assets/images/dashboard.png";
import NavButton from "../NavButton/NavButton";
import LogOutButton from "../../LogOutButton/LogOutButton";
import { useAuth } from "../../../hooks/useAuth";
import LoggedUser from "../../LoggedUser/LoggedUser";
import theme from "../../../styles/colors";
import { useSessionStorage } from "../../../hooks/useSessionStorage";
import notificationImg from "../../../assets/images/notification.png";

function NavBar({ user }) {
  const [selectedPage, setSelectedPage] = useState("dashboard");
  const { logout } = useAuth();
  const [loggedIn, setLoggedIn] = useState(true);
  const { getItem, setItem } = useSessionStorage();

  const handleMouseClick = (event, selected) => {
    setSelectedPage(selected);
    setItem("selectedPage", selected);
  };

  return (
    <>
      {loggedIn && (
        <nav
          className="flex flex-col sticky top-0 h-screen min-w-60 mr-4"
          style={{ background: theme.colors.nav_bg }}
        >
          <div className="flex flex-col items-center p-2 mt-4">
            <img src={logoImg} className="w-12 h-12 mr-2" alt="Logo"></img>
            <p className="font-medium text-2xl">eKamp</p>
          </div>
          <div className="flex flex-col justify-between h-full">
            <div>
              <NavButton
                icon={dashboardImg}
                text="Izvještaj"
                isActive={selectedPage === "dashboard"}
                to="/dashboard"
                onAction={(event) => handleMouseClick(event, "dashboard")}
              ></NavButton>
              <NavButton
                icon={residentImg}
                text="Unesrećeni"
                isActive={selectedPage === "residents"}
                to="/residents"
                onAction={(event) => handleMouseClick(event, "residents")}
              ></NavButton>
              <NavButton
                icon={archiveImg}
                text="Arhiva"
                isActive={selectedPage === "archive"}
                to="/archive"
                onAction={(event) => handleMouseClick(event, "archive")}
              ></NavButton>
              <NavButton
                icon={notificationImg}
                text="Obavještenje"
                isActive={selectedPage === "notification"}
                to="/notification"
                onAction={(event) => handleMouseClick(event, "notification")}
              ></NavButton>
            </div>
            <LoggedUser
              logOutAction={(event) => {
                handleMouseClick(event, "login");
                logout();
                setLoggedIn(false);
              }}
            ></LoggedUser>
          </div>
        </nav>
      )}
    </>
  );
}

export default NavBar;
