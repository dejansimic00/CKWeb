import user from "../../assets/images/user.png";
import logout from "../../assets/images/logout.png";
import settings from "../../assets/images/settings.png";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { useState, useEffect } from "react";
import LogOutButton from "../LogOutButton/LogOutButton";
import theme from "../../styles/colors";
import "./LoggedUser.css";
import { Link, json } from "react-router-dom";
import { useSessionStorage } from "../../hooks/useSessionStorage";
import API_URLS from "../../utils/api";

const LoggedUser = ({ logOutAction }) => {
  const { getItem } = useSessionStorage();
  const [userValue, setUserValue] = useState("");
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    setUserValue(getItem("username"));
  }, []);

  const handleCLick = () => {
    setSelected(!selected);
  };
  return (
    <div
      className={`flex flex-col  align-bottom w-full   rounded-t-lg`}
      style={{ background: theme.colors.nav_user_bg }}
    >
      {true && (
        <div
          className={`self-center overflow-hidden flex flex-col items-center  transition-all ease-in-out duration-1000
            ${!selected ? "  max-h-0 " : "  max-h-20 "}
          `}
        >
          {
            //za podesavanja, potencijalni dodatak
            false && (
              <Link to={"settings"}>
                <div className="self-center flex items-center  ">
                  <img
                    className="w-3 h-3 align-middle  mr-2"
                    src={settings}
                    alt="user"
                  ></img>
                  <span>Podesavanja</span>
                </div>
              </Link>
            )
          }
          <div className="self-center flex items-center">
            <LogOutButton logOutAction={logOutAction}></LogOutButton>
          </div>
        </div>
      )}
      <div className="self-center flex items-center" onClick={handleCLick}>
        <img className="w-3 h-3 align-middle  mr-2" src={user} alt="user"></img>
        <span>{userValue}</span>
      </div>
    </div>
  );
};

export default LoggedUser;
