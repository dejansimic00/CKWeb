import * as React from "react";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Logo from "../Logo/Logo";
import Input from "../../Input/Input";
import theme from "../../styles/colors";
import Button from "../Button/Button";
import { MenuItem, Select } from "@mui/material";
import API_URLS from "../../utils/api";
import { useSessionStorage } from "../../hooks/useSessionStorage";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
};

const CountryModal = ({
  open,
  setOpen,
  mode = "add",
  countryData = {},
  countries,
  setCountries,
}) => {
  const [formData, setFormData] = React.useState({
    name: countryData?.name ?? "",
  });

  const [errors, setErrors] = React.useState({});
  const { getItem } = useSessionStorage();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Country name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const url =
      mode === "add"
        ? API_URLS.COUNTRIES
        : `${API_URLS.COUNTRIES}/${countryData.id}`;
    const method = mode === "add" ? "POST" : "PUT";

    if (!validateForm()) {
      console.log(errors);
      return;
    }

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          Authorization: `Bearer ${getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error();
      }

      console.log(
        `Država ${mode === "add" ? "kreirana" : "ažurirana"} uspješno`
      );
    } catch (error) {
      console.error(
        `Greška pri  ${mode === "add" ? "kreiranju" : "ažuriranju"} države:`,
        error
      );
    }

    handleClose();
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <form>
            <div
              className="w-90 rounded-3xl border-black border-3 gap-3 flex flex-col items-center p-6"
              style={{
                background: theme.colors.modal_bg,
                maxHeight: "100vh",
                overflowY: "auto",

                WebkitScrollbar: {
                  width: "0",
                },
                scrollbarWidth: "none",
              }}
            >
              <Logo />
              <strong className="self-start">Ime države</strong>
              <Input
                id="name"
                placeholder="Ime države"
                value={formData.name}
                onChange={handleChange}
              />

              <Button
                text={mode === "add" ? "Dodaj" : "Sačuvaj"}
                type="submit"
                onClick={handleSubmit}
              />
            </div>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default CountryModal;
