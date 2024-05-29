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

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  //----------------------------------------------------- dohvatanje drzava
  useEffect(() => {
  }, []);

  /*
  // za brisanje, datum se formatira sad iz DatePicker komponente
  // // ------------------------------------------------ formatiranje datuma

  // const formatDate = (dateString) => {
  //   const date = new Date(dateString);
  //   const year = date.getFullYear();
  //   const month = String(date.getMonth() + 1).padStart(2, "0"); // Add leading zero if necessary
  //   const day = String(date.getDate()).padStart(2, "0"); // Add leading zero if necessary

  //   return `${year}-${month}-${day}`;
  // };

  useEffect(() => {
    console.log("srbija");
  }, [formData]); 
  */

  // ------------------------------------------------ slanje zahtjeva
  const handleSubmit = async (event) => {
    //event.preventDefault();

    const url =
      mode === "add"
        ? API_URLS.EMPLOYEES
        : `${API_URLS.EMPLOYEES}/${volunteerData.id}`;
    const method = mode === "add" ? "POST" : "PUT"; // or "PATCH" if you prefer partial updates

    if (true) {
      console.log(JSON.stringify(formData));
      //return;
    }

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to ${mode === "add" ? "register" : "update"} employee`
        );
      }

      console.log(
        `Employee ${mode === "add" ? "registered" : "updated"} successfully`
      );
    } catch (error) {
      console.error(
        `Error ${mode === "add" ? "registering" : "updating"} employee:`,
        error.message
      );
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
          <form onSubmit={handleSubmit}>
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
                    console.log(selectedDate);
                    console.log(formData);
                    setFormData({ ...formData, dateOfBirth: selectedDate });
                  }}
                />
              </div>
              {/** ---------------------pol---------------------------------- */}
              <div className="flex flex-col w-full items-start">
                <p className="self-start font-bold">Pol</p>
                <Select
                  className="min-w-24"
                  defaultValue={"w"}
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
                  <MenuItem value="m">Muški</MenuItem>
                  <MenuItem value="w">Ženski</MenuItem>
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
              <Input
                id="password"
                placeholder="lozinka"
                value={formData.password}
                onChange={handleChange}
                type="password"
              ></Input>
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
