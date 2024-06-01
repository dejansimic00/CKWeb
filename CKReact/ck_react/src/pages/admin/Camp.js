import DataTable from "../../components/DataTable/DataTable";
import API_URLS from "../../utils/api";
import React, { useEffect, useState, useRef } from "react";
import search from "../../assets/images/search.png";
import Logo from "../../components/Logo/Logo";
import Button from "../../components/Button/Button";
import CampModal from "../../components/Modal/CampModal";
import editImg from "../../assets/images/edit.png";
import deleteImg from "../../assets/images/delete.png";
import DeleteCampModal from "../../components/Modal/DeleteCampModal";
import { useSessionStorage } from "../../hooks/useSessionStorage";

const Camp = () => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [newCampModal, setNewCampModal] = useState(false);
  const [deleteCampModal, setDeleteCampModal] = useState(false);
  const [editCampModal, setEditCampModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const selectedRowRef = useRef(null); // Create a ref
  const [campStatusId, setCampStatusId] = useState();
  const [statuses, setStatuses] = useState([]);
  const [places, setPlaces] = useState([]);
  const { getItem } = useSessionStorage();
  const [refresh, setRefresh] = useState(true);

  useEffect(() => {
    // Fetch data from the API
    fetch(API_URLS.CAMPS, {
      headers: {
        Authorization: `Bearer ${getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error("Greska pri dohvatanju kampova", error));
  }, [refresh]);
  useEffect(() => {
    fetch(API_URLS.CAMP_STATUSES, {
      headers: {
        Authorization: `Bearer ${getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        //console.log("CAMP: ", data);
        setStatuses(data);
      })
      .catch((error) =>
        console.error("Greska pri dohvatanju statusa kampa: ", error)
      );

    fetch(API_URLS.PLACES, {
      headers: {
        Authorization: `Bearer ${getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setPlaces(data))
      .catch((error) => console.error("Greska pri dohvatanju lokacija", error));

    setColumns([
      { field: "id", headerName: "ID", width: 20 },
      { field: "name", headerName: "Ime", width: 200 },
      { field: "place", headerName: "Mjesto", width: 150 },
      { field: "placeDescription", headerName: "Lokacija", width: 150 },
      { field: "capacity", headerName: "Kapacitet", width: 150 },
      { field: "campStatusName", headerName: "Status", width: 150 },
      {
        field: "actions",
        headerName: "Akcije",
        width: 150,
        renderCell: (params) => (
          <div>
            <button onClick={() => setDeleteCampModal(true)}>
              <img src={deleteImg} alt="Obrisi kamp" about="Obrisi kamp"></img>
            </button>
            <button
              onClick={() => {
                handleEditClick(params.row);
              }}
            >
              <img
                src={editImg}
                alt="Izmijeni kamp"
                about="Izmijeni kamp"
              ></img>
            </button>
          </div>
        ),
      },
    ]);
  }, []);

  const handleRowSelection = (selected) => {
    const row = data.find((row) => row.id === selected[0]);
    setSelectedRow(row);
    selectedRowRef.current = row;
  };

  const handleEditClick = (row) => {
    setSelectedRow(row);
    setTimeout(() => {
      setEditCampModal(true);
    }, 1);
  };

  // useEffect(() => {
  //   if (selectedRow && statuses.length > 0) {
  //     const status = statuses.find((c) => c.name === selectedRow.status);
  //     const statusId = status ? status.id : null;
  //     setCampStatusId(statusId);
  //   }
  // }, [selectedRow, statuses]);

  const handleSearchTextChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleDeleteCamp = async () => {
    try {
      const URL = API_URLS.CAMPS + "/" + selectedRow.id;
      const response = await fetch(URL, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(response.status + " " + response.statusText);
      }

      setRefresh(!refresh);

      //console.log("Zaposleni uspjesno obrisan");
    } catch (error) {
      console.error("Greska kod brisanja korisnika:", error.message);
    }
  };

  const filteredData = data.filter((row) =>
    Object.values(row).some((value) =>
      value?.toString().toLowerCase().includes(searchText.toLowerCase())
    )
  );

  const newCampOnClick = () => {
    setNewCampModal(true);
  };

  return (
    <div className="flex flex-col items-center w-full pt-10">
      {newCampModal && (
        <CampModal
          open={newCampModal}
          setOpen={setNewCampModal}
          statuses={statuses}
          refresh={refresh}
          places={places}
          setRefresh={setRefresh}
        ></CampModal>
      )}
      {editCampModal && (
        <CampModal
          open={editCampModal}
          setOpen={setEditCampModal}
          mode="edit"
          campData={{ ...selectedRow }}
          statuses={statuses}
          places={places}
          refresh={refresh}
          setRefresh={setRefresh}
        ></CampModal>
      )}
      {deleteCampModal && (
        <DeleteCampModal
          open={deleteCampModal}
          setOpen={setDeleteCampModal}
          handleDelete={handleDeleteCamp}
          campData={selectedRow}
          refresh={refresh}
          setRefresh={setRefresh}
        ></DeleteCampModal>
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
            text={"Novi kamp"}
            onClick={newCampOnClick}
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

export default Camp;
