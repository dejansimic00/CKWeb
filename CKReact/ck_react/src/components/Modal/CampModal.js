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

const CampModal = ({ open, setOpen, mode = "add", campData = {} }) => {
  const [formData, setFormData] = useState({
    id: campData?.id ?? "",
    name: campData?.name ?? "",
    placeId: campData?.placeId ?? "", // Store the place ID here
    capacity: campData?.capacity ?? "",
    campStatusId: campData?.campStatusId ?? "", // Changed to campStatusId
  });
  const [statuses, setStatuses] = useState([]);
  const [places, setPlaces] = useState([]);

  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const response = await fetch(API_URLS.CAMP_STATUSES);
        if (!response.ok) {
          throw new Error("Failed to fetch statuses");
        }
        const data = await response.json();
        setStatuses(data);
      } catch (error) {
        console.error("Error fetching statuses:", error);
      }
    };

    const fetchPlaces = async () => {
      try {
        const response = await fetch(API_URLS.PLACES);
        if (!response.ok) {
          throw new Error("Failed to fetch places");
        }
        const data = await response.json();
        setPlaces(data);
      } catch (error) {
        console.error("Error fetching places:", error);
      }
    };

    fetchStatuses();
    fetchPlaces();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const url =
      mode === "add" ? API_URLS.CAMPS : `${API_URLS.CAMPS}/${campData.id}`;
    const method = mode === "add" ? "POST" : "PUT";

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${mode === "add" ? "register" : "update"} camp`);
      }

      console.log(`Camp ${mode === "add" ? "registered" : "updated"} successfully`);
      handleClose();
    } catch (error) {
      console.error(`Error ${mode === "add" ? "registering" : "updating"} camp:`, error.message);
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
            <Input
              id="name"
              placeholder="ime"
              value={formData.name}
              onChange={handleChange}
            />
            <div className="flex flex-col w-full items-start">
              <p className="self-start font-bold">Lokacija</p>
              <Select
                id="placeId"
                value={formData.placeId}
                className="min-w-48"
                onChange={(e) => setFormData({ ...formData, placeId: e.target.value })}
                sx={{
                  ".css-1d3z3hw-MuiOutlinedInput-notchedOutline": {
                    border: "2px solid black",
                    borderRadius: "12px",
                  },
                }}
              >
                <MenuItem value="">
                  {"Izaberi lokaciju"}
                </MenuItem>
                {places.map((place) => (
                  <MenuItem key={place.id} value={place.id}>
                    {place.description}
                  </MenuItem>
                ))}
              </Select>
            </div>
            <Input
              id="capacity"
              placeholder="kapacitet"
              value={formData.capacity}
              onChange={handleChange}
            />
            <div className="flex flex-col w-full items-start">
              <p className="self-start font-bold">Status</p>
              <Select
                id="campStatusId" // Set the ID for the status select
                value={formData.campStatusId}
                className="min-w-48"
                sx={{
                  ".css-1d3z3hw-MuiOutlinedInput-notchedOutline": {
                    border: "2px solid black",
                    borderRadius: "12px",
                  },
                }}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    campStatusId: event.target.value,
                  })
                }
              >
                <MenuItem key={0} value="">
                  {"Izaberi"}
                </MenuItem>
                {statuses.map((status) => (
                  <MenuItem key={status.id} value={status.id}>
                    {status.name}
                  </MenuItem>
                ))}
              </Select>
            </div>
            <Button text={mode === "add" ? "Dodaj" : "Sačuvaj"} type="submit" />
          </div>
        </form>
      </Box>
    </Modal>
  );
};

export default CampModal;
