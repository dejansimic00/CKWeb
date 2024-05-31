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
    console.log("Selected camp iz usee", selectedCamp);
  }, []);

  const handleAssignClick = async (event) => {
    const newStartDate = new Date();

    const dataForPost = {
      startDate: newStartDate,
      campId: selectedCamp.id,
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
                defaultValue={-1}
                className="min-w-48"
                sx={{
                  ".css-1d3z3hw-MuiOutlinedInput-notchedOutline": {
                    border: "2px solid black",
                    borderRadius: "12px",
                  },
                }}
                onChange={(event) => {
                  //console.log(camps.find((c) => c.id == event.target.value));
                  setSelectedCamp(
                    camps.find((c) => c.id == event.target.value)
                  );
                }}
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
                type="submit"
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
