import React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "../Button/Button";
import theme from "../../styles/colors";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
};

const DeleteCountryModal = ({
  open,
  setOpen,
  handleDeleteCountry,
  countryData,
}) => {
  const handleClose = () => setOpen(false);

  const handleDelete = () => {
    handleDeleteCountry(countryData.id);
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
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Potvrda brisanja države
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Da li ste sigurni da želite obrisati državu{" "}
            <b>{countryData?.name}</b>?
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
            <div className="flex space-x-5">
              <Button text={"Obriši"} onClick={handleDelete}></Button>
              <Button text={"Odustani"} onClick={handleClose}></Button>
            </div>
          </Box>
        </div>
      </Box>
    </Modal>
  );
};

export default DeleteCountryModal;
