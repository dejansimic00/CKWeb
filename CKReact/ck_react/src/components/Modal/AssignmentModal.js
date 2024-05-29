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

const AssignmentModal = ({
  open,
  setOpen,
  handleAssign,
  volunteerData,
  camps
}) => {
  const handleClose = () => setOpen(false);

  const handleAssignClick = () => {
    handleAssign(); // Assign  the parent component's delete function
    setOpen(false); // Close the modal
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
            <Typography variant="h6" id="modal-modal-title" component="h2">
              Da li ste sigurni?
            </Typography>
            <div>
              Ime:
              {volunteerData.firstName}
            </div>
           
            <div>
              JMBG:
              {volunteerData.jmbg}
            </div>
            {/** ---------------------kamp---------------------------------- */}
            <div className="flex flex-col w-full items-start">
                <p className="self-start font-bold">Kamp</p>
                <Select
                  defaultValue={ -1}
                  className="min-w-48"
                  sx={{
                    ".css-1d3z3hw-MuiOutlinedInput-notchedOutline": {
                      border: "2px solid black",
                      borderRadius: "12px",
                    },
                  }}
                  onChange={(event) =>
                    {
                    //setFormData({ ...formData, countryId: event.target.value });
                    }
                  }
                >
                  <MenuItem key={-1} value={-1}>
                    {"Izaberi"}
                  </MenuItem>
                  {camps.map((camp) => (
                    <MenuItem value={camp.id}>{camp.name}</MenuItem>
                  ))}
                </Select>
              </div>
            <div className="flex space-x-4">
              <Button
                text={"Da"}
                onClick={handleAssignClick}
                style={{ marginRight: "10px" }}
              />
              <Button text={"Ne"} onClick={handleClose} />
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default AssignmentModal;
