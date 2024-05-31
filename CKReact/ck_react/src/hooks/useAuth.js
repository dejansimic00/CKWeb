import { useEffect } from "react";
import { useUser } from "./useUser";
import { useLocalStorage } from "./useLocalStorage";
import { useSessionStorage } from "./useSessionStorage";

export const useAuth = () => {
  const { user, addUser, removeUser, setUser } = useUser();
  const { getItem, removeItem } = useSessionStorage();

  useEffect(() => {
    const storedUser = getItem("user");
    if (storedUser) {
      try {
        addUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user:", error);
      }
    }
  }, [addUser, getItem]);

  const login = (user) => {
    addUser(user);
  };

  const logout = () => {
    // removeItem ("user")
    // removeItem ("jmbg")
    // removeItem ("name")
    // removeItem ("isAdmin")
    sessionStorage.clear();
    removeItem("user");
    removeUser();
  };

  return { user, login, logout, setUser };
};
