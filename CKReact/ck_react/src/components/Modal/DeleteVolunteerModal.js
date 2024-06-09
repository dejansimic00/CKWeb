import * as React from "react";
import { Box, Typography, Modal, MenuItem, Select } from "@mui/material";
import Logo from "../Logo/Logo";
import Input from "../../Input/Input";
import theme from "../../styles/colors";
import Button from "../Button/Button";
import DatePicker from "../DatePicker/DatePicker";
import API_URLS from "../../utils/api";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "rgb(217, 217, 217)",
  border: "1px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: "10px",
};

const DeleteVolunteerModal = ({
  open,
  setOpen,
  handleDelete,
  volunteerData,
}) => {
  const handleClose = () => setOpen(false);

  const handleConfirmDelete = () => {
    handleDelete(); // Call the parent component's delete function
    setOpen(false); // Close the modal
  };

  React.useEffect(() => {
    console.log(volunteerData);
  }, []);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <div className="flex flex-col items-center space-y-6">
          <Typography variant="h6" id="modal-modal-title" component="h2">
            Da li ste sigurni?
          </Typography>
          <div className="w-full flex flex-col space-y-2">
            <div className="flex justify-between">
              <span>Ime:</span>
              <span>{volunteerData.firstName}</span>
            </div>
            <div className="flex justify-between">
              <span>Prezime:</span>
              <span>{volunteerData.lastName}</span>
            </div>
            <div className="flex justify-between">
              <span>JMBG:</span>
              <span>{volunteerData.jmbg}</span>
            </div>
          </div>
          <div className="flex space-x-4">
            <Button text={"Ne"} onClick={handleClose} />
            <Button
              text={"Da"}
              type="submit"
              onClick={handleConfirmDelete}
              style={{ marginRight: "10px" }}
            />
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default DeleteVolunteerModal;
