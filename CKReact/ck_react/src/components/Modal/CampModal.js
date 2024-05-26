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

const VolunteerModal = ({
                          open,
                          setOpen,
                          mode = "add",
                          campData = {},
                        }) => {
  const [formData, setFormData] = useState({
    id: campData?.id ?? "",
    name: campData?.name ?? "",
    place: campData?.place ?? "",
    placeDescription: campData?.placeDescription ?? "",
    capacity: campData?.capacity ?? "",
    campStatusName: campData?.campStatusName ?? "",
  });
  const [statuses, setStatuses] = useState([]);

  const handleOpen = () => setOpen(true);
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

    fetchStatuses();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const url =
      mode === "add" ? API_URLS.CAMPS : `${API_URLS.CAMPS}/${campData.id}`;
    const method = mode === "add" ? "POST" : "PUT"; // or "PATCH" if you prefer partial updates

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to ${mode === "add" ? "register" : "update"} camp`
        );
      }

      console.log(
        `Camp ${mode === "add" ? "registered" : "updated"} successfully`
      );
    } catch (error) {
      console.error(
        `Error ${mode === "add" ? "registering" : "updating"} camp:`,
        error.message
      );
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
              <Input
                id="place"
                placeholder="lokacija"
                value={formData.place}
                onChange={handleChange}
              />
              <Input
                id="placeDescription"
                placeholder="mjesto"
                value={formData.placeDescription}
                onChange={handleChange}
              />
              <Input
                id="capacity"
                placeholder="kapacitet"
                value={formData.capacity}
                onChange={handleChange}
              />
              <div className="flex flex-col w-full items-start">
                <p className="self-start font-bold">Status</p>
                <Select
                  value={formData.campStatusName}
                  className="min-w-48"
                  sx={{
                    ".css-1d3z3hw-MuiOutlinedInput-notchedOutline": {
                      border: "2px solid black",
                      borderRadius: "12px",
                    },
                  }}
                  onChange={(event) => {
                    setFormData({
                      ...formData,
                      campStatusName: event.target.value,
                    });
                  }}
                >
                  <MenuItem key={0} value="">
                    {"Izaberi"}
                  </MenuItem>
                  {statuses.map((status) => (
                    <MenuItem key={status.id} value={status.name}>
                      {status.name}
                    </MenuItem>
                  ))}
                </Select>
              </div>
              <Button
                text={mode === "add" ? "Dodaj" : "Sačuvaj"}
                type="submit"
              />
            </div>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default VolunteerModal;
