import DataTable from "../../components/DataTable/DataTable";
import API_URLS from "../../utils/api";
import React, { useEffect, useState, useRef } from "react";
import search from "../../assets/images/search.png";
import Logo from "../../components/Logo/Logo";
import Button from "../../components/Button/Button";
import VolunteerModal from "../../components/Modal/VolunteerModal";
import editImg from "../../assets/images/edit.png";
import deleteImg from "../../assets/images/delete.png";
import campImg from "../../assets/images/camp-red.png";
import DeleteVolunteerModal from "../../components/Modal/DeleteVolunteerModal";
import AssignmentModal from "../../components/Modal/AssignmentModal";
import { useSessionStorage } from "../../hooks/useSessionStorage";

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
      .catch((error) => console.error("Error fetching data:", error));

    fetch(API_URLS.ASSIGNMENTS, {
      headers: {
        Authorization: `Bearer ${getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const x = data.filter((row) => row.endDate === null);
        setAssignments(x);
      })
      .catch((error) =>
        console.error("Greska pri dohvatanju drzava iz baze:", error)
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
          <div>
            <button onClick={() => setDeleteVolunteerModal(true)}>
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
            <button
              onClick={() => {
                handleAssignClick(params.row);
              }}
            >
              <img
                className="w-6 h-6"
                src={campImg}
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
  };

  const handleEditClick = (row) => {
    //setSelectedRow(row, console.log("setSelectedRow Completed"));
    setSelectedRow(row);
    setTimeout(() => {
      setEditVolunteerModal(true);
    }, 1);
  };

  const handleAssignClick = (row) => {
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

    console.log(body);

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
        console.error("Error fetching data:", error);
      }
    };

    fetchUpdatedData();
  };

  return (
    <div className="flex flex-col items-center w-full pt-10">
      {newVolunteerModal && (
        <VolunteerModal
          open={newVolunteerModal}
          setOpen={setNewVolunteerModal}
          countries={countries}
          assingments={assignments}
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
              placeholder="Pretrazi ..."
            ></input>
          </div>
          <Button
            text={"Novi volonter"}
            onClick={newVolonterOnClick}
            plusSign={true}
          ></Button>
        </div>
        <DataTable
          columns={[...columns]}
          rows={filteredData}
          onRowSelectionModelChange={handleRowSelection}
        />
      </div>
    </div>
  );
};

export default Volunteer;
