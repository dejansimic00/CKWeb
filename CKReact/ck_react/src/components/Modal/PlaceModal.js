import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Input from "../../Input/Input";
import theme from "../../styles/colors";
import Button from "../Button/Button";
import { MenuItem, Select } from "@mui/material";
import API_URLS from "../../utils/api";
import Logo from "../Logo/Logo";
import { useSessionStorage } from "../../hooks/useSessionStorage";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
};

const PlaceModal = ({
  open,
  setOpen,
  mode = "add",
  placeData = {},
  municipalities,
  refresh,
  setRefresh,
}) => {
  const [formData, setFormData] = useState({
    id: placeData?.id ?? "",
    municipalityId: placeData?.municipalityId ?? "",
    description: placeData?.description ?? "",
  });

  useEffect(() => {
    const munid = municipalities.find(
      (mun) => mun.name === placeData.municipalityName
    )?.id;

    setFormData({ ...formData, municipalityId: munid });
  }, []);
  const { getItem } = useSessionStorage();

  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSelectChange = (e) => {
    setFormData({ ...formData, municipalityId: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const url =
      mode === "add" ? API_URLS.PLACES : `${API_URLS.PLACES}/${placeData.id}`;
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
        throw new Error(`Failed to ${mode === "add" ? "add" : "update"} place`);
      }

      setRefresh(!refresh);

      console.log(`Place ${mode === "add" ? "added" : "updated"} successfully`);
      handleClose();
    } catch (error) {
      console.error(
        `Error ${mode === "add" ? "adding" : "updating"} place:`,
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
              id="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
            />
            <div className="flex flex-col w-full items-start">
              <p className="self-start font-bold">Municipality</p>
              <Select
                value={formData.municipalityId}
                className="min-w-48"
                onChange={handleSelectChange}
                sx={{
                  ".css-1d3z3hw-MuiOutlinedInput-notchedOutline": {
                    border: "2px solid black",
                    borderRadius: "12px",
                  },
                }}
              >
                <MenuItem value="">{"Select Municipality"}</MenuItem>
                {municipalities.map((municipality) => (
                  <MenuItem key={municipality.id} value={municipality.id}>
                    {municipality.name}
                  </MenuItem>
                ))}
              </Select>
            </div>
            <Button text={mode === "add" ? "Add" : "Save"} type="submit" />
          </div>
        </form>
      </Box>
    </Modal>
  );
};

export default PlaceModal;
