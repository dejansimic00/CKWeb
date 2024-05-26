import React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import theme from "../../styles/colors";
import Button from "../Button/Button";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
};

const DeletePlaceModal = ({ open, setOpen, handleDelete, placeData }) => {
  const handleClose = () => setOpen(false);

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
            Confirm Delete
          </h2>
          <p id="modal-modal-description" className="text-center mb-4">
            Are you sure you want to delete the place: {placeData?.description}?
          </p>
          <div className="flex gap-4">
            <Button text="Cancel" onClick={handleClose} />
            <Button text="Delete" onClick={handleDelete} />
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default DeletePlaceModal;
