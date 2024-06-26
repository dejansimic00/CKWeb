import DataTable from "../../components/DataTable/DataTable";
import API_URLS from "../../utils/api";
import React, { useEffect, useState, useRef } from "react";
import search from "../../assets/images/search.png";
import Logo from "../../components/Logo/Logo";
import Button from "../../components/Button/Button";
import VolunteerModal from "../../components/Modal/VolunteerModal";
import editImg from "../../assets/images/edit.png";
import exchange from "../../assets/images/exchange.png";
import campImg from "../../assets/images/camp-red.png";
import DeleteVolunteerModal from "../../components/Modal/DeleteVolunteerModal";
import AssignmentModal from "../../components/Modal/AssignmentModal";
import { useSessionStorage } from "../../hooks/useSessionStorage";
import VolunteerInfoModal from "../../components/Modal/VolunteerInfoModal";

const Volunteer = () => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [filterModel, setFilterModel] = useState({});
  const [newVolunteerModal, setNewVolunteerModal] = useState(false);
  const [deleteVolunteerModal, setDeleteVolunteerModal] = useState(false);
  const [editVolunteerModal, setEditVolunteerModal] = useState(false);
  const [editAssignmentModal, setEditAssignmentModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const selectedRowRef = useRef(null); // Create a ref
  const [countries, setCountries] = useState();
  const [countryId, setCountryId] = useState();
  const [assignments, setAssignments] = useState();
  const [camps, setCamps] = useState([]);
  const { getItem } = useSessionStorage();
  const [refreshData, setRefreshData] = useState(false);
  const [volunteerInfoModal, setVolunteerInfoModal] = useState(false);

  useEffect(() => {
    fetch(API_URLS.EMPLOYEES, {
      headers: {
        Authorization: `Bearer ${getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const x = data.filter((row) => row.role !== "ADMIN");

        setData(x);
      })
      .catch((error) =>
        console.error("Greška pri dohvatanju podataka o zaposlenima:", error)
      );

    fetch(API_URLS.ASSIGNMENTS, {
      headers: {
        Authorization: `Bearer ${getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const x = data.filter((row) => row.endDate === null);
        setAssignments(x);
        //setAssignments(data)
      })
      .catch((error) =>
        console.error("Greska pri dohvatanju zaduzenja iz baze:", error)
      );
  }, [refreshData]);

  useEffect(() => {
    // Fetch data from the API

    fetch(API_URLS.COUNTRIES, {
      headers: {
        Authorization: `Bearer ${getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setCountries(data))
      .catch((error) =>
        console.error("Greska pri dohvatanju drzava iz baze:", error)
      );

    fetch(API_URLS.CAMPS, {
      headers: {
        Authorization: `Bearer ${getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setCamps(data))
      .catch((error) =>
        console.error("Greska pri dohvatanju drzava iz baze:", error)
      );

    setColumns([
      { field: "id", headerName: "ID", width: 70 },
      { field: "firstName", headerName: "Ime", width: 150 },
      { field: "lastName", headerName: "Prezime", width: 150 },
      { field: "dateOfBirth", headerName: "Datum rođenja", width: 130 },
      { field: "sex", headerName: "Pol", width: 90 },
      { field: "jmbg", headerName: "JMBG", width: 150 },
      { field: "countryName", headerName: "Država", width: 150 },
      { field: "campName", headerName: "Kamp", width: 150 },
      //{ field: "password", headerName: "Lozinka", width: 150 },
      { field: "username", headerName: "Korisničko ime", width: 150 },
      {
        field: "status",
        headerName: "Status",
        width: 150,
        valueGetter: (params) => {
          return params === "ACTIVE" ? "Aktivan" : "Blokiran";
        },
      },
      {
        field: "actions",
        headerName: "Akcije",
        width: 150,
        renderCell: (params) => (
          <div className="flex flex-row justify-center items-center space-x-5 h-full ">
            <button
              className="w-6 h-6"
              onClick={(event) => {
                handleDeleteClick(event, params.row);
              }}
            >
              <img
                src={exchange}
                alt="Obrisi volontera"
                about="Obrisi volontera"
                title="Promijeni status volontera"
              ></img>
            </button>
            <button
              onClick={(event) => {
                handleEditClick(event, params.row);
              }}
            >
              <img
                src={editImg}
                alt="Izmijeni volontera"
                title="Izmijeni volontera"
              ></img>
            </button>
            <button
              onClick={(event) => {
                handleAssignClick(event, params.row);
              }}
            >
              <img
                className="w-6 h-6"
                src={campImg}
                title="Zaduženje na kampu"
                alt="Izmijeni volontera"
                about="Izmijeni volontera"
              ></img>
            </button>
          </div>
        ),
      },
      //{ field: "isAdmin", headerName: "Admin", width: 100 },
    ]);
  }, []); // Empty dependency array ensures useEffect runs only once

  const handleRowSelection = (selected) => {
    const row = data.find((row) => row.id === selected[0]);
    setSelectedRow(row);
    selectedRowRef.current = row; // Update the ref
    setVolunteerInfoModal(true);
  };

  const handleDeleteClick = (event, row) => {
    event.stopPropagation();
    //setSelectedRow(row, console.log("setSelectedRow Completed"));
    setSelectedRow(row);
    setTimeout(() => {
      setDeleteVolunteerModal(true);
    }, 1);
  };

  const handleEditClick = (event, row) => {
    event.stopPropagation();
    //setSelectedRow(row, console.log("setSelectedRow Completed"));
    setSelectedRow(row);
    setTimeout(() => {
      setEditVolunteerModal(true);
    }, 1);
  };

  const handleAssignClick = (event, row) => {
    event.stopPropagation();
    setSelectedRow(row);
    setTimeout(() => {
      setEditAssignmentModal(true);
    }, 1);
  };

  useEffect(() => {
    if (selectedRow && countries.length > 0) {
      const country = countries.find((c) => c.name === selectedRow.countryName);
      const countryId = country ? country.id : null;
      setCountryId(countryId);
    }
  }, [selectedRow, countries]);

  const handleSearchTextChange = (event) => {
    setSearchText(event.target.value);
  };

  useEffect(() => {
    console.log("DATA", data);
    console.log("ASSIGNMENTS", assignments);
    data.forEach((row) => {
      const campNameX = assignments?.find((ass) => {
        return ass.employeeId === row.id;
      })?.campName;
      row.campName = campNameX;
    });
  }, [assignments, data]);

  const handleDeleteVolunteer = async (event) => {
    const status = selectedRow.status === "ACTIVE" ? "BLOCKED" : "ACTIVE";
    const body = {
      accountStatus: status,
    };

    try {
      const URL = API_URLS.EMPLOYEES + "/" + selectedRow.id + "/status";
      const response = await fetch(URL, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(response.status + " " + response.statusText);
      }

      setRefreshData(!refreshData);

      console.log("Zaposleni uspjesno deaktiviran");
    } catch (error) {
      console.error("Greska kod brisanja korisnika:", error.message);
    }
  };

  const filteredData = data.filter((row) =>
    Object.values(row).some((value) =>
      value?.toString().toLowerCase().includes(searchText.toLowerCase())
    )
  );

  const newVolonterOnClick = () => {
    setNewVolunteerModal(true);
  };

  const handleAssignmentChange = () => {
    // Re-fetch the data or update the local state here
    const fetchUpdatedData = async () => {
      try {
        const response = await fetch(API_URLS.EMPLOYEES, {
          headers: {
            Authorization: `Bearer ${getItem("token")}`,
          },
        });
        const result = await response.json();
        setData(result);
        setRefreshData(!refreshData);
      } catch (error) {
        console.error("Greška pri dohvatanju podataka o zaposlenima:", error);
      }
    };

    fetchUpdatedData();
  };

  return (
    <div className="flex flex-col md:items-center w-full    p-10">
      {newVolunteerModal && (
        <VolunteerModal
          open={newVolunteerModal}
          setOpen={setNewVolunteerModal}
          countries={countries}
          assingments={assignments}
          data={data}
          setData={setData}
        ></VolunteerModal>
      )}

      {editVolunteerModal && (
        <VolunteerModal
          open={editVolunteerModal}
          setOpen={setEditVolunteerModal}
          mode="edit"
          volunteerData={{ ...selectedRow, countryId }}
          countries={countries}
          assingments={assignments}
          data={data}
          setData={setData}
        ></VolunteerModal>
      )}
      {deleteVolunteerModal && (
        <DeleteVolunteerModal
          open={deleteVolunteerModal}
          setOpen={setDeleteVolunteerModal}
          handleDelete={handleDeleteVolunteer}
          volunteerData={selectedRow}
        ></DeleteVolunteerModal>
      )}
      {volunteerInfoModal && (
        <VolunteerInfoModal
          open={volunteerInfoModal}
          setOpen={setVolunteerInfoModal}
          id={selectedRowRef.current.id}
          selectedRow={selectedRow}
        />
      )}
      {editAssignmentModal && (
        <AssignmentModal
          open={editAssignmentModal}
          setOpen={setEditAssignmentModal}
          volunteerData={selectedRow}
          camps={camps}
          assignments={assignments}
          onAssignmentChange={handleAssignmentChange} // Pass the callback here
        ></AssignmentModal>
      )}
      <div className="">
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
            text={"Novi volonter"}
            onClick={newVolonterOnClick}
            plusSign={true}
          ></Button>
        </div>
        <div className="w-full overflow-x-auto">
          <DataTable
            columns={[...columns]}
            rows={filteredData}
            onRowSelectionModelChange={handleRowSelection}
            initialState={{
              columns: {
                columnVisibilityModel: {
                  // Hide columns status and traderName, the other columns will remain visible
                  id: false,
                  dateOfBirth: false,
                  sex: false,
                  jmbg: false,
                  countryName: false,
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Volunteer;
