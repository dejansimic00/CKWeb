import DataTable from "../../components/DataTable/DataTable";
import API_URLS from "../../utils/api";
import React, { useEffect, useState, useRef } from "react";
import search from "../../assets/images/search.png";
import Logo from "../../components/Logo/Logo";
import Button from "../../components/Button/Button";
import ResidentModal from "../../components/Modal/ResidentModal";
import editImg from "../../assets/images/edit.png";
import deleteImg from "../../assets/images/delete.png";
import campImg from "../../assets/images/camp-red.png";
import DeleteResidentModal from "../../components/Modal/DeleteResidentModal.js";
import AssignmentModal from "../../components/Modal/AssignmentModal";
import { useSessionStorage } from "../../hooks/useSessionStorage";
import ResidentInfoModal from "../../components/Modal/ResidentInfoModal.js";

const Residence = () => {
  const [data, setData] = useState([]);
  const [residencePeriod, setResidencePeriod] = useState([]);
  const [residents, setResidents] = useState([]);
  const [columns, setColumns] = useState([]);
  const [filterModel, setFilterModel] = useState({});
  const [newResidentModal, setNewResidentModal] = useState(false);
  const [deleteResidentModal, setDeleteResidentModal] = useState(false);
  const [editResidentModal, setEditResidentModal] = useState(false);
  const [editAssignmentModal, setEditAssignmentModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const selectedRowRef = useRef(null); // Create a ref
  const [assignments, setAssignments] = useState();
  const [camps, setCamps] = useState([]);
  const { getItem } = useSessionStorage();
  const [campName, setCampName] = useState();
  const [countries, setCountries] = useState([]);
  const [campId, setCampId] = useState();
  const [residentInfoModal, setResidentInfoModal] = useState(false);

  useEffect(() => {
    // Fetch data from the API
    fetch(API_URLS.RESIDENCE_PERIOD, {
      headers: {
        Authorization: `Bearer ${getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setResidencePeriod(data);
      })
      .catch((error) => console.error("Error fetching data:", error));

    fetch(API_URLS.RESIDENTS, {
      headers: {
        Authorization: `Bearer ${getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setResidents(data))
      .catch((error) =>
        console.error("Greška pri dohvatanju podataka:", error)
      );

    fetch(API_URLS.ASSIGNMENTS, {
      headers: {
        Authorization: `Bearer ${getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setAssignments(data))
      .catch((error) =>
        console.error("Greška pri dohvatanju podataka:", error)
      );

    fetch(API_URLS.COUNTRIES, {
      headers: {
        Authorization: `Bearer ${getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setCountries(data))
      .catch((error) =>
        console.error("Greška pri dohvatanju podataka:", error)
      );

    fetch(API_URLS.CAMPS, {
      headers: {
        Authorization: `Bearer ${getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setCamps(data))
      .catch((error) => console.error("Error fetching data:", error));

    setColumns([
      { field: "id", headerName: "ID", width: 70, hide: true },
      { field: "firstName", headerName: "Ime", width: 150, flex: 1 },
      { field: "lastName", headerName: "Prezime", width: 150, flex: 1 },
      { field: "dateOfBirth", headerName: "Datum rođenja", width: 130 },
      { field: "sex", headerName: "Pol" },
      { field: "jmbg", headerName: "JMBG", width: 150 },
      { field: "countryName", headerName: "Država" },
      {
        field: "needsHospitalisation",
        headerName: "Potrebna \n hospitalizacija",
        valueGetter: (params) => {
          return params ? "Da" : "Ne";
        },
        renderHeader: (params) => (
          <div className="flex flex-col">
            <span>Potrebna </span>
            <span>hospitalizacija</span>
          </div>
        ),
      },
      { field: "employeeJmbg", headerName: "JMBG Zaposlenog", width: 150 },
      {
        field: "actions",
        headerName: "Akcije",
        renderCell: (params) => (
          <div className="flex flex-row justify-center items-center space-x-5 h-full ">
            <button onClick={() => setDeleteResidentModal(true)}>
              <img
                src={deleteImg}
                alt="Obrisi volontera"
                about="Obrisi volontera"
              ></img>
            </button>
            <button
              onClick={() => {
                handleEditClick(params.row);
              }}
            >
              <img
                src={editImg}
                alt="Izmijeni volontera"
                about="Izmijeni volontera"
              ></img>
            </button>
          </div>
        ),
        renderHeader: (params) => (
          <div className="flex  w-20 justify-center">
            <span>Akcije</span>
          </div>
        ),
      },
    ]);
  }, []);

  useEffect(() => {
    if (assignments) {
      const ass = assignments.find(
        (ass) => ass.employeeId === Number.parseInt(getItem("id"))
      );

      if (!ass) {
        setCampName("");
      } else {
        setCampName(ass.campName);

        const camp = camps?.find((c) => c.name === ass.campName);
        setCampId(camp.id);
      }
    }
  }, [assignments, camps, getItem]);

  useEffect(() => {
    if (residents.length > 0 && residencePeriod.length > 0 && campName) {
      const newResidencePeriod = residencePeriod.filter((resP) => {
        return resP.campName === campName;
      });

      const newData = [];

      newResidencePeriod.forEach((resP) => {
        if (resP.campName === campName) {
          let x = residents.find((res) => res.jmbg === resP.residentJmbg);
          if (x) {
            newData.push(x);
          }
        }
      });

      setData(newData); // Update state once with the new data array
    }
  }, [residents, residencePeriod, campName]);

  const handleRowSelection = (selected) => {
    const row = data.find((row) => row.id === selected[0]);
    setSelectedRow(row);
    selectedRowRef.current = row; // Update the ref
    setResidentInfoModal(true);
  };

  const handleEditClick = (row) => {
    //setSelectedRow(row, console.log("setSelectedRow Completed"));
    setSelectedRow(row);
    setTimeout(() => {
      setEditResidentModal(true);
    }, 1);
  };

  const handleSearchTextChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleDeleteResident = async () => {
    //console.log("bice obrisan korisnik:" + JSON.stringify(selectedRow));
    /*
    try {
      const URL = API_URLS.EMPLOYEES + "/" + selectedRow.id;
      const response = await fetch(URL, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(response.status + " " + response.statusText);
      }

      console.log("Zaposleni uspjesno obrisan");
    } catch (error) {
      console.error("Greska kod brisanja korisnika:", error.message);
    }*/
  };

  const filteredData = data?.filter((row) =>
    Object.values(row).some((value) =>
      value?.toString().toLowerCase().includes(searchText.toLowerCase())
    )
  );

  const newResidentOnClick = () => {
    setNewResidentModal(true);
  };

  return (
    <div className="flex flex-col items-center w-full pt-10">
      <h1>Unesreceni u kampu {campName}</h1>
      {newResidentModal && (
        <ResidentModal
          open={newResidentModal}
          setOpen={setNewResidentModal}
          countries={countries}
          campId={campId}
        ></ResidentModal>
      )}

      {editResidentModal && (
        <ResidentModal
          open={editResidentModal}
          setOpen={setEditResidentModal}
          mode="edit"
          residentData={selectedRow}
          countries={countries}
        ></ResidentModal>
      )}
      {deleteResidentModal && (
        <DeleteResidentModal
          open={deleteResidentModal}
          setOpen={setDeleteResidentModal}
          handleDelete={handleDeleteResident}
          residentData={selectedRow}
        ></DeleteResidentModal>
      )}
      {residentInfoModal && (
        <ResidentInfoModal
          open={residentInfoModal}
          setOpen={setResidentInfoModal}
          id={selectedRowRef.current.id}
          selectedRow={selectedRow}
        ></ResidentInfoModal>
      )}
      {/* {editAssignmentModal && (
        <AssignmentModal
          open={editAssignmentModal}
          setOpen={setEditAssignmentModal}
          residentData={selectedRow}
          camps={camps}
          assignments={assignments}
        >
          {" "}
        </AssignmentModal>
      )} */}
      <div className="w-[60rem]">
        <div className="flex justify-between">
          <div className=" flex items-center pl-2 h-10 w-80  self-start mb-4 rounded-xl border-black border-2">
            <img src={search} alt="search" className="w-4 h-4"></img>
            <input
              type="text"
              className="bg-transparent w-full outline-none pl-2"
              onChange={handleSearchTextChange}
              placeholder="Pretraži ..."
            ></input>
          </div>
          <Button
            text={"Novi UNESR"}
            onClick={newResidentOnClick}
            plusSign={true}
          ></Button>
        </div>
        <DataTable
          columns={[...columns]}
          rows={filteredData}
          onRowSelectionModelChange={handleRowSelection}
          initialState={{
            columns: {
              columnVisibilityModel: {
                // Hide columns status and traderName, the other columns will remain visible
                id: false,
                jmbg: false,
                employeeJmbg: false,
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default Residence;
