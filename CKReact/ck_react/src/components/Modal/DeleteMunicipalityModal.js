import * as React from "react";
import { useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
};

const DeleteMunicipalityModal = ({
  open,
  setOpen,
  handleDeleteMunicipality,
  municipalityData,
}) => {
  const handleClose = () => setOpen(false);

  const handleDelete = () => {
    handleDeleteMunicipality(municipalityData.id);
    handleClose();
  };

  return (
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
            background: "#FFFFFF", // Change background color as needed
            maxHeight: "100vh",
            overflowY: "auto",
          }}
        >
          <h2 id="modal-modal-title">Delete Municipality</h2>
          <p id="modal-modal-description">
            Are you sure you want to delete this municipality?
          </p>
          <Button onClick={handleDelete}>Delete</Button>
          <Button onClick={handleClose}>Cancel</Button>
        </div>
      </Box>
    </Modal>
  );
};

export default DeleteMunicipalityModal;
