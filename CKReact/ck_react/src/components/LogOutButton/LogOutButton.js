import { useAuth } from "../../hooks/useAuth";
import { useState } from "react";
import logoutImg from "../../assets/images/logout.png";
import { Link } from "react-router-dom";

const LogOutButton = ({ logOutAction }) => {
  return (
    <Link to="login" className="self-center flex items-center">
      <img
        className="w-3 h-3 align-middle  mr-2"
        src={logoutImg}
        alt="user"
      ></img>
      <button onClick={logOutAction}>Odjavi se</button>
    </Link>
  );
};

export default LogOutButton;
