import { useState } from "react";

export const useLocalStorage = () => {
  const [value, setValue] = useState(null);

  const setItem = (key, newValue) => {
    localStorage.setItem(key, newValue);
    setValue(newValue);
  };

  const getItem = (key) => {
    const value = localStorage.getItem(key);
    setValue(value);
    return value;
  };

  const removeItem = (key) => {
    localStorage.removeItem(key);
    setValue(null);
  };

  return { value, setItem, getItem, removeItem };
};
