import * as React from "react";
import { useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "../Button/Button";
import theme from "../../styles/colors";

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
  React.useEffect(() => {
    console.log("municipalityData", municipalityData);
  }, []);
  const handleClose = () => setOpen(false);

  const handleDelete = () => {
    handleDeleteMunicipality(municipalityData.name);
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
            background: theme.colors.modal_bg,
            maxHeight: "100vh",
            overflowY: "auto",

            WebkitScrollbar: {
              width: "0",
            },
            scrollbarWidth: "none",
          }}
        >
          <h2 id="modal-modal-title" className="font-bold text-lg">
            Potvrdi brisanje
          </h2>
          <p id="modal-modal-description" className="text-center mb-4">
            Da li ste sigurni da želite obrisati grad:{" "}
            <strong>{municipalityData?.name}</strong>?
          </p>

          <div className="flex gap-4">
            <Button text="Izađi" onClick={handleClose} />
            <Button text="Obriši" onClick={handleDelete} />
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default DeleteMunicipalityModal;
