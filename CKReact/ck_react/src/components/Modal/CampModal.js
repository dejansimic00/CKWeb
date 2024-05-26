import * as React from "react";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Logo from "../Logo/Logo";
import Input from "../../Input/Input";
import theme from "../../styles/colors";
import Button from "../Button/Button";
import { MenuItem, Select } from "@mui/material";
import API_URLS from "../../utils/api";

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
  campData = {},
  statuses,
}) => {
  const [formData, setFormData] = React.useState({
    id: campData?.id ?? "",
    name: campData?.name ?? "",
    place: campData?.place ?? "",
    placeDescription: campData?.placeDescription ?? "",
    capacity: campData?.capacity ?? "",
    campStatusName: campData?.campStatusName ?? "",
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  useEffect(() => {
    //console.log(statuses);
  }, [statuses]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const url =
      mode === "add" ? API_URLS.CAMPS : `${API_URLS.CAMPS}/${campData.id}`;
    const method = mode === "add" ? "POST" : "PUT"; // or "PATCH" if you prefer partial updates

    if (true) {
      console.log(JSON.stringify(formData));
      return;
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
                id="name"
                placeholder="ime"
                value={formData.name}
                onChange={handleChange}
              ></Input>
              {/** ---------------------Mjesto---------------------------------- */}
              <Input
                id="place"
                placeholder="mjesto"
                value={formData.place}
                onChange={handleChange}
              ></Input>
              {/** ---------------------Lokacija---------------------------------- */}
              <Input
                id="placeDescription"
                placeholder="lokacija"
                value={formData.placeDescription}
                onChange={handleChange}
              ></Input>
              {/** ---------------------Kapacitet---------------------------------- */}
              <Input
                id="capacity"
                placeholder="kapacitet"
                value={formData.capacity}
                onChange={handleChange}
              ></Input>
              {/** ---------------------Status---------------------------------- */}
              <div className="flex flex-col w-full items-start">
                <p className="self-start font-bold">Status</p>
                <Select
                  defaultValue={
                    statuses.find(
                      (status) => status.name === campData.campStatusName
                    )?.id ?? 0
                  }
                  className="min-w-48"
                  sx={{
                    ".css-1d3z3hw-MuiOutlinedInput-notchedOutline": {
                      border: "2px solid black",
                      borderRadius: "12px",
                    },
                  }}
                  onChange={(event) => {
                    setFormData({
                      ...formData,
                      campStatusName: event.target.name,
                    });
                  }}
                >
                  <MenuItem key={0} value={0}>
                    {"Izaberi"}
                  </MenuItem>
                  {statuses.map((status) => (
                    <MenuItem key={status.id} value={status.id}>
                      {status.name}
                    </MenuItem>
                  ))}
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

export default VolunteerModal;
