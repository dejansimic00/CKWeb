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

const VolunteerInfoModal = ({
  open,
  setOpen,
  id,
  selectedRow,
  volunteerData = {},
}) => {
  const [formData, setFormData] = React.useState({
    firstName: selectedRow?.firstName ?? "",
    lastName: selectedRow?.lastName ?? "",
    dateOfBirth: selectedRow?.dateOfBirth ?? "",
    sex: selectedRow?.sex ?? "F",
    jmbg: selectedRow?.jmbg ?? "",
    countryName: selectedRow?.countryName ?? "",
    campName: selectedRow?.campName ?? "",
    username: selectedRow?.username ?? "",
    status: selectedRow?.status ?? "ACTIVE",
  });   

  const [assignments, setAssignments] = useState([]);
  const [columns, setColumns] = useState([]);

  const handleClose = () => setOpen(false);
  const { getItem } = useSessionStorage();


  useEffect(()=>{
    console.log("selectedassignmentsRow", assignments)
  },[assignments])


  useEffect(() => {

    ////////////// trenutno dohvata trenutne ass, gdje je endDate null
    if (selectedRow){
    fetch(API_URLS.EMPLOYEES + "/" + selectedRow.id + "/assignments", {
      headers: {
        Authorization: `Bearer ${getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        
        // console.log("assigmnetns", data)
        // const assArray = [data];
        // setAssignments( assArray);
        setAssignments(data)
      })
      .catch((error) =>
        console.error(
          "Greška pri dohvatanju podataka o istoriji volontera:",
          error
        )
      );

    setColumns([
      { field: "id", headerName: "ID"},
      { field: "startDate", headerName: "Pocetak zaduzenja", width: 150 },
      { field: "endDate", headerName: "Kraj zaduzenja", width: 150 },
      { field: "campName", headerName: "Kamp", flex:1 },
      { field: "employeeId", headerName: "Kamp"},
      
    ]);}
  }, [selectedRow]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };



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
                id="sex"
                placeholder="Pol"
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
            {/** ---------------------kamp---------------------------------- */}
            <div className="flex flex-col w-full items-center">
              <p className="self-start font-bold">Kamp</p>
              <Input
                readOnly={true}
                id="campName"
                placeholder="Kamp"
                value={formData.campName}
                onChange={handleChange}
              ></Input>
            </div>
            {/** ---------------------korisnicko ime---------------------------------- */}
            <div className="flex flex-col w-full items-center">
              <p className="self-start font-bold">Korisničko ime</p>
              <Input
                readOnly={true}
                id="username"
                placeholder="Korisničko ime"
                value={formData.username}
                onChange={handleChange}
              ></Input>
            </div>
            {/** ---------------------status---------------------------------- */}
            <div className="flex flex-col w-full items-center">
              <p className="self-start font-bold">Status</p>
              <Input
                readOnly={true}
                id="status"
                placeholder="Status"
                value={formData.status === "ACTIVE" ? "Aktivan" : "Blokiran"}
                onChange={handleChange}
              ></Input>
            </div>
            {assignments && (
              <div className="w-full border-black border-2 rounded-lg">
                <DataTable 
                    columns={columns} 
                    rows={assignments}
                    initialState={{
                        columns: {
                            columnVisibilityModel: {
                                id: false,
                                employeeId: false
                            },
                        },
                    }}
                />
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

export default VolunteerInfoModal;
