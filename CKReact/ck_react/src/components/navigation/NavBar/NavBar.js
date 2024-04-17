import { React, useState } from "react";
import logo from "../../../assets/images/logo.png";
import resident from "../../../assets/images/refugee.png";
import archive from "../../../assets/images/archive.png";
import dashboard from "../../../assets/images/dashboard.png";
import NavButton from "../NavButton/NavButton";

function NavBar() {
  const [selectedPage, setSelectedPage] = useState("dashboard");

  const handleMouseClick = (event, selected) => {
    setSelectedPage(selected);
    console.log(selected);
  };

  return (
    <nav className="flex-col bg-gray-200 h-screen">
      <div className="flex items-center  p-2">
        <img src={logo} className="w-12 h-12 mr-2"></img>
        <p className="font-medium text-2xl">EC</p>
      </div>
      <div className="w-full ">
        <NavButton
          icon={dashboard}
          text="Izvjestaj"
          isActive={selectedPage === "dashboard"}
          to="/"
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
      </div>
      <div></div>
    </nav>
  );
}

export default NavBar;
