import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Logo from "../Logo/Logo";
import Input from "../../Input/Input";
import theme from "../../styles/colors";
import Button from "../Button/Button";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
};

const VolunteerModal = ({ open, setOpen }) => {
  const [formData, setFormData] = React.useState({
    firstName: "",
    lastName: "",
    jmbg: "",
    username: "",
    password: "",
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    console.log(id, value);
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = (e) => {
    //TODO register api
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
              className="w-90 rounded-3xl border-black border-3 flex flex-col items-center p-6"
              style={{ background: theme.colors.modal_bg }}
            >
              <Logo></Logo>
              <Input
                id="firstName"
                placeholder="ime"
                value={formData.firstName}
                onChange={handleChange}
              ></Input>
              <Input
                id="lastName"
                placeholder="prezime"
                value={formData.lastName}
                onChange={handleChange}
              ></Input>
              <div className="flex flex-col w-full items-center">
                <p>Datum rodjenja</p>
                <p>NOT YET IMPLEMENTED</p>
                <p>POL</p>
                <p>NOT YET IMPLEMENTED</p>
              </div>
              <Input
                id="jmbg"
                placeholder="JMBG"
                value={formData.jmbg}
                onChange={handleChange}
              ></Input>
              <Input
                id="username"
                placeholder="korisnicko ime"
                value={formData.username}
                onChange={handleChange}
              ></Input>
              <Input
                id="password"
                placeholder="lozinka"
                value={formData.password}
                onChange={handleChange}
              ></Input>
              <Button
                text={"Dodaj"}
                type="submit"
                onClick={handleSubmit} // Handle form submission
              ></Button>{" "}
            </div>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default VolunteerModal;
