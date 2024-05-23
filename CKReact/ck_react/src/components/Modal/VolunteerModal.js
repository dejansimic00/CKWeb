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


const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
};

const VolunteerModal = ({ open, setOpen }) => {
  const [formData, setFormData] = React.useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    sex: "",
    countryId: "",
    jmbg: "",
    username: "",
    password: "",
  });
  const [countries, setCountries] = useState(["Srbija", "Republika Srpska"]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  //----------------------------------------------------- dohvatanje drzava
  useEffect(() => {
    // Simulate fetching data from the server
    const fetchData = async () => {
      try {
        const url = API_URLS.COUNTRIES;
        const response = await fetch(url);
        const data = await response.json();
        setCountries(data);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchData();
  }, []);

  // ------------------------------------------------ formatiranje datuma

  const formatDate = (dateString) => {

    const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Add leading zero if necessary
  const day = String(date.getDate()).padStart(2, '0'); // Add leading zero if necessary

  return `${year}-${month}-${day}`;
   
  };  

  // ------------------------------------------------ slanje zahtjeva
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      
      const response = await fetch(API_URLS.EMPLOYEES, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });


      if (!response.ok) {
        throw new Error("Failed to register employee");
      }

      console.log("Employee registered successfully");
    } catch (error) {
      console.error("Error registering employee:", error.message);
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
              <Logo></Logo>
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
                  value={formData.dateOfBirth} // Set the value of the DatePicker to the dateOfBirth field in formData
                  onChange={(selectedDate) =>
                    setFormData({ ...formData, dateOfBirth: formatDate(selectedDate) })
                  } // Pass a callback function to update date_of_birth field in formData when the date is changed
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
                  defaultValue={-1}
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
              ></Input>
              <Button
                text={"Dodaj"}
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
