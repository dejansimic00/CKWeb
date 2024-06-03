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

const ResidentModal = ({
  open,
  setOpen,
  mode = "add",
  residentData = {},
  countries,
  campId,
}) => {
  const [formData, setFormData] = React.useState({
    firstName: residentData?.firstName ?? "",
    lastName: residentData?.lastName ?? "",
    dateOfBirth: residentData?.dateOfBirth ?? "",
    sex: residentData?.sex ?? "F",
    jmbg: residentData?.jmbg ?? "",
    countryId: residentData?.countryId ?? "",
    needsHospitalisation: residentData?.needsHospitalisation ?? "",
    employeeId: parseInt(residentData?.employeeId),
  });

  const [residencePeriodData, setResidencePeriodData] = useState();
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { getItem } = useSessionStorage();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  useEffect(() => {
    setFormData({ ...formData, employeeId: parseInt(getItem("id")) });
    setResidencePeriodData({
      startDate: new Date().toISOString(),
      endDate: null,
      campId: campId,
    });
  }, []);

  // ------------------------------------------------ slanje zahtjeva
  const handleSubmit = async (event) => {
    event.preventDefault();

    const url1 =
      mode === "add"
        ? API_URLS.RESIDENTS
        : `${API_URLS.RESIDENTS}/${residentData.id}`;
    const method1 = mode === "add" ? "POST" : "PUT"; // or "PATCH" if you prefer partial updates

    const url2 = API_URLS.RESIDENCE_PERIOD;
    //   mode === "add"
    //     ? API_URLS.RESIDENCE_PERIOD
    //     : `${API_URLS.RESIDENCE_PERIOD}/${residentData.id}`;
    const method2 = "POST"; //= mode === "add" ? "POST" : "PUT"; // or "PATCH" if you prefer partial updates

    console.log(formData, "formData");
    console.log(residencePeriodData, "residencePeriodData");

    try {
      const response1 = await fetch(url1, {
        method: method1,
        headers: {
          Authorization: `Bearer ${getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response1.ok) {
        throw new Error(
          `Failed to ${mode === "add" ? "register" : "update"} employee`
        );
      }

      const data1 = await response1.json(); // Parse the response JSON
      const residentId = data1.id; // Extract the ID from the parsed data

      console.log(await response1.id);
      setResidencePeriodData({ ...residencePeriodData, id: response1.id });

      const response2 = await fetch(url2, {
        method: method2,
        headers: {
          Authorization: `Bearer ${getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...residencePeriodData, residentId }),
      });

      if (!response2.ok) {
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
              {/* ---------------------drzava----------------------------------*/}
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
                    {"Izaber    i"}
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
              {/* ---------------------hospitalizacija----------------------------------*/}
              <div className="flex flex-col w-full items-start">
                <p className="self-start font-bold">Hospitalizacija</p>
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
                    setFormData({
                      ...formData,
                      needsHospitalisation: event.target.value ? "true" : "false",
                    })
                  }
                >
                  <MenuItem key={-1} value={-1}>
                    {"Izaberi"}
                  </MenuItem>
                  <MenuItem key={1} value={1}>
                    {"Da"}
                  </MenuItem>
                  <MenuItem key={0} value={0}>
                    {"Ne"}
                  </MenuItem>
                </Select>
              </div>
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

export default ResidentModal;
