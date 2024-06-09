import * as React from "react";
import { useState } from "react";
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

const MunicipalityModal = ({
  open,
  setOpen,
  mode = "add",
  municipalityData = {},
  countries,
}) => {
  const [formData, setFormData] = useState({
    name: municipalityData?.name ?? "",
    postCode: municipalityData?.postCode ?? "",
    countryId: municipalityData?.countryId ?? "",
  });

  React.useEffect(() => {
    console.log(countries);
    console.log(municipalityData);
    const newData = {
      ...formData,
      countryId: countries.find((c) => c.name === municipalityData.countryName)
        ?.id,
    };
    setFormData(newData);
  }, []);
  const [errors, setErrors] = useState({});
  const { getItem } = useSessionStorage();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Municipality name is required";
    }
    if (!formData.postCode.trim()) {
      newErrors.postCode = "Post code is required";
    }
    if (!formData.countryId) {
      newErrors.countryId = "Country is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    //event.preventDefault();

    const url =
      mode === "add"
        ? API_URLS.MUNICIPALITIES
        : `${API_URLS.MUNICIPALITIES}/${municipalityData.id}`;
    const method = mode === "add" ? "POST" : "PUT";

    if (!validateForm()) {
      console.log(errors);
      return;
    }

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
        throw new Error(
          `Failed to ${mode === "add" ? "add" : "update"} municipality`
        );
      }

      console.log(
        `Municipality ${mode === "add" ? "added" : "updated"} successfully`
      );
    } catch (error) {
      console.error(
        `Error ${mode === "add" ? "adding" : "updating"} municipality:`,
        error.message
      );
    }

    handleClose();
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
                placeholder="Municipality name"
                value={formData.name}
                onChange={handleChange}
              />
              <Input
                id="postCode"
                placeholder="Post code"
                value={formData.postCode}
                onChange={handleChange}
              />
              <Select
                value={formData?.countryId ?? 0}
                onChange={(e) =>
                  setFormData({ ...formData, countryId: e.target.value })
                }
              >
                <MenuItem key={0} value={9}>
                  Izaberi državu
                </MenuItem>
                {countries.map((country) => (
                  <MenuItem key={country.id} value={country.id}>
                    {country.name}
                  </MenuItem>
                ))}
              </Select>
              <Button
                text={mode === "add" ? "Add" : "Save"}
                type="submit"
                onClick={handleSubmit}
              />
            </div>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default MunicipalityModal;
