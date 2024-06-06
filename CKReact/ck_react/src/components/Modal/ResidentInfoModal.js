import * as React from "react";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Logo from "../Logo/Logo";
import Input from "../../Input/Input";
import theme from "../../styles/colors";
import Button from "../Button/Button";
import DatePicker from "../DatePicker/DatePicker";
import { IconButton, MenuItem, Select } from "@mui/material";
import API_URLS from "../../utils/api";
import dayjs from "dayjs";
import { useSessionStorage } from "../../hooks/useSessionStorage";
import DataTable from "../DataTable/DataTable";
import PrintIcon from "@mui/icons-material/Print";
import printImg from "../../assets/images/print.svg";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
};

const ResidentInfoModal = ({
  open,
  setOpen,
  id,
  selectedRow,
  residentData = {},
}) => {
  const [formData, setFormData] = React.useState({
    firstName: selectedRow?.firstName ?? "",
    lastName: selectedRow?.lastName ?? "",
    dateOfBirth: selectedRow?.dateOfBirth ?? "",
    sex: selectedRow?.sex ?? "F",
    jmbg: selectedRow?.jmbg ?? "",
    countryName: selectedRow?.countryName ?? "",
    needsHospitalisation: selectedRow?.needsHospitalisation ?? false,
    employeeJmbg: selectedRow?.employeeJmbg,
  });

  const [residencePeriod, setResidencePeriod] = useState();
  const [columns, setColumns] = useState([]);

  const handleClose = () => setOpen(false);
  const { getItem } = useSessionStorage();

  useEffect(() => {
    fetch(API_URLS.RESIDENCE_PERIOD + "/resident/" + selectedRow.id, {
      headers: {
        Authorization: `Bearer ${getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("data", data);
        setResidencePeriod(data);
      })
      .catch((error) => console.error("Error fetching data:", error));

    setColumns([
      {
        field: "startDate",
        headerName: "Datum pristizanja",
        flex: 1,
        renderCell: (params) => {
          const date = new Date(params.value);
          console.log("starrtDate", date);
          return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
        },
      },
      {
        field: "endDate",
        headerName: "Datum odlaska",
        flex: 1,
        renderCell: (params) => {
          const date = params.value !== null ? new Date(params.value) : null;
          console.log("endDate", date);
          if (date)
            return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
          else return "";
        },
      },
      {
        field: "campName",
        headerName: "Kamp",
        flex: 1,
      },
    ]);
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  useEffect(() => {
    if (residencePeriod) console.log(residencePeriod);
    console.log(formData);
  }, [residencePeriod]);

  const handlePrint = () => {
    window.print();
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
            className="w-[40rem] rounded-3xl border-black border-3 gap-3 flex flex-col items-center p-6"
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
            {/** ---------------------ime---------------------------------- */}
            <div className="flex flex-col w-full items-center">
              <p className="self-start font-bold">Ime i prezime</p>
              <Input
                id="firstName"
                placeholder="ime"
                value={formData.firstName + " " + formData.lastName}
                onChange={handleChange}
                readOnly={true}
              ></Input>
            </div>

            {/** ---------------------datumrodjenja---------------------------------- */}
            <div className="flex flex-col w-full   items-center">
              <p className="self-start font-bold">Datum rođenja</p>
              <div className="w-80 self-start">
                <DatePicker
                  readOnly={true}
                  value={formData.dateOfBirth}
                  onChange={(selectedDate) => {
                    setFormData({ ...formData, dateOfBirth: selectedDate });
                  }}
                />
              </div>
            </div>
            {/** ---------------------pol---------------------------------- */}
            <div className="flex flex-col w-full items-center">
              <p className="self-start font-bold">Pol</p>
              <Input
                readOnly={true}
                id="jmbg"
                placeholder="JMBG"
                value={formData.sex.toLowerCase() === "m" ? "Muški" : "Ženski"}
                onChange={handleChange}
              ></Input>
            </div>

            {/** ---------------------drzava---------------------------------- */}
            <div className="flex flex-col w-full items-start">
              <p className="self-start font-bold">Država</p>
              <Input
                readOnly={true}
                id="countryName"
                placeholder="Država"
                value={formData.countryName}
                onChange={handleChange}
              ></Input>
            </div>
            {/** ---------------------jmbg---------------------------------- */}
            <div className="flex flex-col w-full items-center">
              <p className="self-start font-bold">JMBG</p>
              <Input
                readOnly={true}
                id="jmbg"
                placeholder="JMBG"
                value={formData.jmbg}
                onChange={handleChange}
              ></Input>
            </div>
            {/** ---------------------hospitalizacija---------------------------------- */}
            <div className="flex flex-col w-full items-center">
              <p className="self-start font-bold">Potrebna hospitalizacija</p>
              <Input
                readOnly={true}
                id="jmbg"
                placeholder="JMBG"
                value={formData.needsHospitalisation ? "Da" : "Ne"}
                onChange={handleChange}
              ></Input>
            </div>
            {residencePeriod && (
              <div className="w-full border-black border-2 rounded-lg">
                <DataTable columns={columns} rows={residencePeriod} />
              </div>
            )}
            <div className="flex space-x-4">
              <Button text={"Izađi"} onClick={handleClose}></Button>
              <IconButton onClick={handlePrint}>
                <img
                  className="w-6 h-6 text-red-500 print:hidden"
                  src={printImg}
                  alt="Print"
                />
              </IconButton>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default ResidentInfoModal;
