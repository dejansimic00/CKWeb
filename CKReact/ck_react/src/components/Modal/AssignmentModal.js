import * as React from "react";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import theme from "../../styles/colors";
import Button from "../Button/Button";
import { MenuItem, Select } from "@mui/material";
import API_URLS from "../../utils/api";
import { useSessionStorage } from "../../hooks/useSessionStorage";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
};

const AssignmentModal = ({
  open,
  setOpen,
  volunteerData,
  camps,
  assignments,
  onAssignmentChange,
}) => {
  const handleClose = () => setOpen(false);
  const [selectedCamp, setSelectedCamp] = new useState();
  const { getItem } = useSessionStorage();

  useEffect(() => {
    console.log("volunteerData", volunteerData);

    const camp = camps.find((camp) => camp.name === volunteerData.campName);
    console.log("camp", camp);
    setSelectedCamp(camp);
  }, []);

  const handleAssignClick = async (event) => {
    //event.preventDefault();
    const newStartDate = new Date();

    const dataForPost = {
      startDate: newStartDate,
      campId: selectedCamp.id ,
    };

    try {
      const response = await fetch(
        API_URLS.EMPLOYEES + "/" + volunteerData.id + "/change-assignment",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataForPost),
        }
      );

      if (response.ok) {
        console.log("Uspjesno");
        onAssignmentChange(); // Call the callback function to trigger the update
        setOpen(false);
      } else {
        console.error("Failed to update assignment");
      }
    } catch (error) {
      console.error("Error updating assignment:", error);
    }
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
          className="flex flex-col items-center p-6 rounded-3xl border-3 border-black"
          style={{
            background: theme.colors.modal_bg,
            maxHeight: "100vh",
            overflowY: "auto",
          }}
        >
          <Typography variant="h6" id="modal-modal-title" component="h2">
            Da li ste sigurni?
          </Typography>
          <div className="w-full my-2 flex justify-between">
            <Typography variant="body1">Ime:</Typography>
            <Typography variant="body1">{volunteerData.firstName}</Typography>
          </div>
          <div className="w-full my-2 flex justify-between">
            <Typography variant="body1">JMBG:</Typography>
            <Typography variant="body1">{volunteerData.jmbg}</Typography>
          </div>

          <div className="flex flex-col w-full items-start my-2">
            <Typography variant="body1" className="font-bold">
              Kamp
            </Typography>
            <Select
              value={selectedCamp?.id ?? -1}
              className="w-full"
              sx={{
                ".MuiOutlinedInput-notchedOutline": {
                  border: "2px solid black",
                  borderRadius: "12px",
                },
              }}
              onChange={(event) =>{
                const camp = camps.find((c) => c.id == event.target.value) ?? {};
                if (event.target.value === 0) camp.id =0;
                console.log("IZMJANA KAMPA",camp)
                setSelectedCamp(camp)}
              }
            >
              <MenuItem key={-1} value={-1}>
                Izaberi
              </MenuItem>
              <MenuItem key={0} value={0}>
                Razduzi
              </MenuItem>
              {camps.map((camp) => (
                <MenuItem key={camp.id} value={camp.id}>
                  {camp.name}
                </MenuItem>
              ))}
            </Select>
          </div>
          <div className="flex space-x-4 mt-4">
            <Button
              text="Da"
              onClick={handleAssignClick}
              type="submit"
              style={{ marginRight: "10px" }}
            />
            <Button text="Ne" onClick={handleClose} />
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default AssignmentModal;
