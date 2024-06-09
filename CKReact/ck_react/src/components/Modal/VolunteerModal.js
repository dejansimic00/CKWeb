import * as React from "react";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Logo from "../Logo/Logo";
import Input from "../../Input/Input";
import theme from "../../styles/colors";
import Button from "../Button/Button";
import DatePicker from "../DatePicker/DatePicker";
import { MenuItem, Select } from "@mui/material";
import API_URLS from "../../utils/api";
import dayjs from "dayjs";
import { useSessionStorage } from "../../hooks/useSessionStorage";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
};

const VolunteerModal = ({
  open,
  setOpen,
  mode = "add",
  volunteerData = {},
  countries,
  data,
  setData,
}) => {
  const [formData, setFormData] = React.useState({
    firstName: volunteerData?.firstName ?? "",
    lastName: volunteerData?.lastName ?? "",
    dateOfBirth: volunteerData?.dateOfBirth ?? "",
    sex: volunteerData?.sex ?? "F",
    countryId: volunteerData?.countryId ?? "",
    jmbg: volunteerData?.jmbg ?? "",
    username: volunteerData?.username ?? "",
    password: volunteerData?.password ?? "",
  });
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { getItem } = useSessionStorage();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  // ------------------------------------------------ slanje zahtjeva
  const handleSubmit = async (event) => {
    event.preventDefault();
    const url =
      mode === "add"
        ? API_URLS.EMPLOYEES
        : `${API_URLS.EMPLOYEES}/${volunteerData.id}`;
    const method = mode === "add" ? "POST" : "PUT"; // or "PATCH" if you prefer partial updates

    if (mode !== "add") {
      delete formData.password;
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
        throw new Error(
          `Greška kod  ${
            mode === "add" ? "kreiranja" : "ažuriranja"
          } zaposlenog`
        );
      }

      const updatedData = data.map((item) =>
        item.id === volunteerData.id ? { ...item, ...formData } : item
      );

      if (mode === "add") {
        updatedData.push(response);
      }
      setData(updatedData);

      handleClose();
      console.log(
        `Zaposleni uspješno${mode === "add" ? "kreiran" : "ažuriran"} `
      );
    } catch (error) {
      console.error(error.message);
    }
  };

  //--------------------------------------------------------------------

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
              {/** ---------------------ime---------------------------------- */}
              <Input
                id="firstName"
                placeholder="ime"
                value={formData.firstName}
                onChange={handleChange}
              ></Input>
              {/** ---------------------prezime---------------------------------- */}
              <Input
                id="lastName"
                placeholder="prezime"
                value={formData.lastName}
                onChange={handleChange}
              ></Input>
              {/** ---------------------datumrodjenja---------------------------------- */}
              <div className="flex flex-col w-full items-center">
                <p className="self-start font-bold">Datum rođenja</p>
                <DatePicker
                  value={formData.dateOfBirth}
                  onChange={(selectedDate) => {
                    setFormData({ ...formData, dateOfBirth: selectedDate });
                  }}
                />
              </div>
              {/** ---------------------pol---------------------------------- */}
              <div className="flex flex-col w-full items-start">
                <p className="self-start font-bold">Pol</p>
                <Select
                  className="min-w-24"
                  defaultValue={"f"}
                  sx={{
                    ".css-1d3z3hw-MuiOutlinedInput-notchedOutline": {
                      border: "2px solid black",
                      borderRadius: "12px",
                    },
                  }}
                  onChange={(event) =>
                    setFormData({ ...formData, sex: event.target.value })
                  }
                >
                  <MenuItem key={"m"} value="m">
                    Muški
                  </MenuItem>
                  <MenuItem key={"f"} value="f">
                    Ženski
                  </MenuItem>
                </Select>
              </div>
              {/** ---------------------drzava---------------------------------- */}
              <div className="flex flex-col w-full items-start">
                <p className="self-start font-bold">Država</p>
                <Select
                  defaultValue={formData.countryId || -1}
                  className="min-w-48"
                  sx={{
                    ".css-1d3z3hw-MuiOutlinedInput-notchedOutline": {
                      border: "2px solid black",
                      borderRadius: "12px",
                    },
                  }}
                  onChange={(event) =>
                    setFormData({ ...formData, countryId: event.target.value })
                  }
                >
                  <MenuItem key={-1} value={-1}>
                    {"Izaberi"}
                  </MenuItem>
                  {countries.map((country) => (
                    <MenuItem value={country.id}>{country.name}</MenuItem>
                  ))}
                </Select>
              </div>
              {/** ---------------------jmbg---------------------------------- */}
              <Input
                key={"ss"}
                id="jmbg"
                placeholder="JMBG"
                value={formData.jmbg}
                onChange={handleChange}
              ></Input>
              {/** ---------------------username---------------------------------- */}
              <Input
                id="username"
                placeholder="korisničko ime"
                value={formData.username}
                onChange={handleChange}
              ></Input>
              {/** ---------------------password---------------------------------- */}
              {mode === "add" && (
                <Input
                  id="password"
                  placeholder="lozinka"
                  value={formData.password}
                  onChange={handleChange}
                  type="password"
                ></Input>
              )}
              <Button
                text={mode === "add" ? "Dodaj" : "Sačuvaj"} // Change button text based on mode
                type="submit"
                onClick={handleSubmit} // Handle form submission
              ></Button>{" "}
            </div>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default VolunteerModal;
