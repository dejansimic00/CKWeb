import { useState } from "react";

export const useSessionStorage = () => {
  const [value, setValue] = useState(null);

  const setItem = (key, newValue) => {
    sessionStorage.setItem(key, newValue);
    setValue(newValue);
  };

  const getItem = (key) => {
    const value = sessionStorage.getItem(key);
    setValue(value);
    return value;
  };

  const removeItem = (key) => {
    sessionStorage.removeItem(key);
    setValue(null);
  };

  return { value, setItem, getItem, removeItem };
};
