import { useAuth } from "../../hooks/useAuth";

const LogOutButton = () => {
  const { logout } = useAuth();

  return <button onClick={logout}>Logout</button>;
};

export default LogOutButton;
