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

const DeleteResidentModal = ({ open, setOpen, handleDelete, residentData }) => {
  const handleClose = () => setOpen(false);

  const handleConfirmDelete = () => {
    handleDelete(); // Call the parent component's delete function
    setOpen(false); // Close the modal
  };

  React.useEffect(() => {
    console.log("residentData", residentData);
  }, []);

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
              Potvrdite odlazak
            </Typography>
            <p>
              Da li unesrećeni{" "}
              <strong>
                {" "}
                {residentData.firstName + " " + residentData.lastName}{" "}
              </strong>
              zaista napušta kamp?
            </p>
            <div className="flex space-x-4">
              <Button
                text={"Da"}
                onClick={handleConfirmDelete}
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

export default DeleteResidentModal;
