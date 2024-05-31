import { React, useState, useContext, useEffect } from "react";
import logo from "../../../assets/images/logo.png";
import camp from "../../../assets/images/camp.png";
import place from "../../../assets/images/place.png";
import userImg from "../../../assets/images/user.png";
import archive from "../../../assets/images/archive.png";
import dashboard from "../../../assets/images/dashboard.png";
import notification from "../../../assets/images/notification.png";
import NavButton from "../NavButton/NavButton";
import { useAuth } from "../../../hooks/useAuth";
import { useLocalStorage } from "../../../hooks/useLocalStorage";
import LoggedUser from "../../LoggedUser/LoggedUser";
import theme from "../../../styles/colors";
import NavBar from "./NavBar";
import { useSessionStorage } from "../../../hooks/useSessionStorage";

function AdminNavBar() {
  const [selectedPage, setSelectedPage] = useState("");
  const { user, logout } = useAuth();
  const [loggedIn, setLoggedIn] = useState(true);
  const { getItem, setItem } = useSessionStorage();
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    const sp = getItem("selectedPage");
    if (sp) setSelectedPage(sp);
    else {
      setSelectedPage("dashboard");
      setItem("selectedPage", "dashboard");
    }
  }, []);

  useEffect(() => {
    let isAdmin = JSON.parse(getItem("isAdmin"));
    setAdmin(Boolean(isAdmin));
    setLoggedIn(getItem("jmbg") != null);
  }, [user]);

  const handleMouseClick = (event, selected) => {
    setSelectedPage(selected);
    setItem("selectedPage", selected);
  };

  return (
    <>
      {loggedIn && !admin && <NavBar user={user}></NavBar>}
      {loggedIn && admin && (
        <nav
          className="flex flex-col sticky top-0 h-screen min-w-60 mr-4"
          style={{ background: theme.colors.nav_bg }}
        >
          <div className="flex flex-col items-center p-2 mt-4">
            <img src={logo} className="w-20 h-20 mr-2" alt="Logo"></img>
            <p className="font-medium text-2xl">eKamp</p>
          </div>
          <div className="flex flex-col justify-between h-full">
            <div>
              <NavButton
                icon={dashboard}
                text="Izvjestaj"
                isActive={selectedPage === "dashboard"}
                to="/dashboard"
                onAction={(event) => handleMouseClick(event, "dashboard")}
              ></NavButton>

              <NavButton
                icon={userImg}
                text="Volonter"
                isActive={selectedPage === "volunteer"}
                to="/volunteer"
                onAction={(event) => handleMouseClick(event, "volunteer")}
              ></NavButton>

              <NavButton
                icon={camp}
                text="Kamp"
                isActive={selectedPage === "camp"}
                to="/camp"
                onAction={(event) => handleMouseClick(event, "camp")}
              ></NavButton>
              <NavButton
                icon={place}
                text="Lokacije"
                isActive={selectedPage === "place"}
                to="/place"
                onAction={(event) => handleMouseClick(event, "place")}
              ></NavButton>
              <NavButton
                icon={archive}
                text="Arhiva"
                isActive={selectedPage === "archive"}
                to="/archive"
                onAction={(event) => handleMouseClick(event, "archive")}
              ></NavButton>
              <NavButton
                icon={notification}
                text="Obavjestenje"
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

export default AdminNavBar;
