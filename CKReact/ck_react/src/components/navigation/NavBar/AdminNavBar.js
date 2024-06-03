import { React, useState, useEffect } from "react";
import logo from "../../../assets/images/logo.png";
import camp from "../../../assets/images/camp.png";
import place from "../../../assets/images/place.png";
import userImg from "../../../assets/images/user.png";
import archive from "../../../assets/images/archive.png";
import dashboard from "../../../assets/images/dashboard.png";
import notification from "../../../assets/images/notification.png";
import residentImg from "../../../assets/images/resident.png";
import NavButton from "../NavButton/NavButton";
import LoggedUser from "../../LoggedUser/LoggedUser";
import theme from "../../../styles/colors";
import { useAuth } from "../../../hooks/useAuth";
import { useSessionStorage } from "../../../hooks/useSessionStorage";

function AdminNavBar() {
  const [selectedPage, setSelectedPage] = useState("dashboard");
  const { user, logout } = useAuth();
  const [loggedIn, setLoggedIn] = useState(true);
  const { getItem, setItem } = useSessionStorage();
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    const sp = getItem("selectedPage");
    if (sp) {
      setSelectedPage(sp);
    } else {
      setSelectedPage("dashboard");
      setItem("selectedPage", "dashboard");
    }
  }, []);

  useEffect(() => {
    const isAdmin = JSON.parse(getItem("isAdmin"));
    setAdmin(Boolean(isAdmin));
    setLoggedIn(getItem("jmbg") != null);
  }, [user]);

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
            <img src={logo} className="w-20 h-20 mr-2" alt="Logo" />
            <p className="font-medium text-2xl">eKamp</p>
          </div>
          <div className="flex flex-col justify-between h-full">
            <div>
              <NavButton
                icon={dashboard}
                text="Izvještaj"
                isActive={selectedPage === "dashboard"}
                to="/dashboard"
                onAction={(event) => handleMouseClick(event, "dashboard")}
              />
              {admin ? (
                <>
                  <NavButton
                    icon={userImg}
                    text="Volonter"
                    isActive={selectedPage === "volunteer"}
                    to="/volunteer"
                    onAction={(event) => handleMouseClick(event, "volunteer")}
                  />
                  <NavButton
                    icon={camp}
                    text="Kamp"
                    isActive={selectedPage === "camp"}
                    to="/camp"
                    onAction={(event) => handleMouseClick(event, "camp")}
                  />
                  <NavButton
                    icon={place}
                    text="Lokacije"
                    isActive={selectedPage === "place"}
                    to="/place"
                    onAction={(event) => handleMouseClick(event, "place")}
                  />
                </>
              ) : (
                <NavButton
                  icon={residentImg}
                  text="Unesrećeni"
                  isActive={selectedPage === "residents"}
                  to="/residents"
                  onAction={(event) => handleMouseClick(event, "residents")}
                />
              )}
              <NavButton
                icon={archive}
                text="Arhiva"
                isActive={selectedPage === "archive"}
                to="/archive"
                onAction={(event) => handleMouseClick(event, "archive")}
              />
              <NavButton
                icon={notification}
                text="Obavještenje"
                isActive={selectedPage === "notification"}
                to="/notification"
                onAction={(event) => handleMouseClick(event, "notification")}
              />
            </div>
            <LoggedUser
              logOutAction={(event) => {
                handleMouseClick(event, "login");
                logout();
                setLoggedIn(false);
              }}
            />
          </div>
        </nav>
      )}
    </>
  );
}

export default AdminNavBar;
