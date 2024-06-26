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
import { useSessionStorage } from "../../hooks/useSessionStorage";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
};

const CampModal = ({
  open,
  setOpen,
  mode = "add",
  campData = {},
  places,
  refresh,
  setRefresh,
}) => {
  const [formData, setFormData] = useState({
    id: campData?.id ?? "",
    name: campData?.name ?? "",
    placeId: campData?.placeId ?? 0, // Store the place ID here
    capacity: campData?.capacity ?? 0,
    campStatusId: campData?.campStatusId ?? 0, // Changed to campStatusId
  });
  const [statuses, setStatuses] = useState([]);
  const { getItem } = useSessionStorage();

  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  useEffect(() => {
    const lokId = places?.find(
      (place) => place.description === campData.placeDescription
    )?.id;

    //console.log(lokId);
    if (lokId) {
      setFormData((prevData) => ({
        ...prevData,
        placeId: lokId,
      }));
    }
  }, []);

  useEffect(() => {
    const statusId = statuses?.find(
      (status) => status.name === campData.campStatusName
    )?.id;
    if (statusId)
      setFormData({
        ...formData,
        campStatusId: statusId,
      });
  }, [statuses]);

  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const response = await fetch(API_URLS.CAMP_STATUSES, {
          headers: {
            Authorization: `Bearer ${getItem("token")}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch statuses");
        }
        const data = await response.json();
        setStatuses(data);
      } catch (error) {
        console.error("Greška pri dohvatanju statusa kampova:", error);
      }
    };

    fetchStatuses();
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
          Authorization: `Bearer ${getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error();
      }

      setRefresh(!refresh);
      handleClose();
    } catch (error) {
      console.error(
        `Greška pri  ${mode === "add" ? "kreiranju" : "ažuriranju"} kampa:`,
        error.message
      );
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
                onChange={(e) => {
                  //console.log(e.target);
                  setFormData({ ...formData, placeId: e.target.value });
                }}
                sx={{
                  ".css-1d3z3hw-MuiOutlinedInput-notchedOutline": {
                    border: "2px solid black",
                    borderRadius: "12px",
                  },
                }}
              >
                <MenuItem key={0} value={0}>
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
              value={undefined}
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
                <MenuItem key={0} value={0}>
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
