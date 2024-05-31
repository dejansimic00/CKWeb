import React, { useEffect, useState, useRef } from "react";
import DataTable from "../../components/DataTable/DataTable";
import API_URLS from "../../utils/api";
import search from "../../assets/images/search.png";
import Button from "../../components/Button/Button";
import PlaceModal from "../../components/Modal/PlaceModal";
import editImg from "../../assets/images/edit.png";
import deleteImg from "../../assets/images/delete.png";
import DeletePlaceModal from "../../components/Modal/DeletePlaceModal";
import { useSessionStorage } from "../../hooks/useSessionStorage";

const Place = () => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [newPlaceModal, setNewPlaceModal] = useState(false);
  const [deletePlaceModal, setDeletePlaceModal] = useState(false);
  const [editPlaceModal, setEditPlaceModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const selectedRowRef = useRef(null);
  const [municipalities, setMunicipalities] = useState([]);
  const { getItem } = useSessionStorage();
  const [refresh, setRefresh] = useState(true);

  useEffect(() => {
    // Fetch places data

    fetch(API_URLS.PLACES, {
      headers: {
        Authorization: `Bearer ${getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched Places Data: ", data); // Check if data is fetched correctly
        setData(data); // Update the data state
      })
      .catch((error) => console.error("Error fetching places", error));
  }, [refresh]);

  useEffect(() => {
    // Fetch municipalities data
    fetch(API_URLS.MUNICIPALITIES, {
      headers: {
        Authorization: `Bearer ${getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched Municipalities Data: ", data); // Check if municipalities data is fetched correctly
        setMunicipalities(data); // Update the municipalities state
      })
      .catch((error) => console.error("Error fetching municipalities", error));

    setColumns([
      // Define columns
      { field: "id", headerName: "ID", width: 100 },
      { field: "description", headerName: "Description", width: 200 },
      { field: "municipalityName", headerName: "Municipality", width: 200 },
      {
        field: "actions",
        headerName: "Actions",
        width: 150,
        renderCell: (params) => (
          <div>
            <button onClick={() => setDeletePlaceModal(true)}>
              <img src={deleteImg} alt="Delete place" />
            </button>
            <button onClick={() => handleEditClick(params.row)}>
              <img src={editImg} alt="Edit place" />
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
      setEditPlaceModal(true);
    }, 1);
  };

  const handleSearchTextChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleDeletePlace = async () => {
    try {
      const URL = `${API_URLS.PLACES}/${selectedRow.id}`;
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
      //setData(data.filter((item) => item.id !== selectedRow.id));
    } catch (error) {
      console.error("Error deleting place:", error.message);
    }
  };

  const filteredData = data.filter((row) =>
    Object.values(row).some((value) =>
      value?.toString().toLowerCase().includes(searchText.toLowerCase())
    )
  );

  const newPlaceOnClick = () => {
    setNewPlaceModal(true);
  };

  return (
    <div className="flex flex-col items-center w-full pt-10">
      {newPlaceModal && (
        <PlaceModal
          open={newPlaceModal}
          setOpen={setNewPlaceModal}
          municipalities={municipalities}
          refresh={refresh}
          setRefresh={setRefresh}
        />
      )}
      {editPlaceModal && (
        <PlaceModal
          open={editPlaceModal}
          setOpen={setEditPlaceModal}
          mode="edit"
          placeData={{ ...selectedRow }}
          refresh={refresh}
          setRefresh={setRefresh}
          municipalities={municipalities}
        />
      )}
      {deletePlaceModal && (
        <DeletePlaceModal
          open={deletePlaceModal}
          setOpen={setDeletePlaceModal}
          handleDelete={handleDeletePlace}
          placeData={selectedRow}
          refresh={refresh}
          setRefresh={setRefresh}
        />
      )}
      <div>
        <div className="flex justify-between">
          <div className="flex items-center pl-2 h-10 w-80 self-start mb-4 rounded-xl border-black border-2">
            <img src={search} alt="search" className="w-4 h-4" />
            <input
              type="text"
              className="bg-transparent w-full outline-none pl-2"
              onChange={handleSearchTextChange}
              placeholder="Search ..."
            />
          </div>
          <Button
            text={"Nova lokacija"}
            onClick={newPlaceOnClick}
            plusSign={true}
          />
        </div>
        <DataTable
          columns={[...columns]}
          rows={filteredData.map((row) => ({
            id: row.id,
            description: row.description,
            municipalityName: row.municipalityName,
            actions: (
              <div>
                <button onClick={() => setDeletePlaceModal(true)}>
                  <img src={deleteImg} alt="Delete place" />
                </button>
                <button onClick={() => handleEditClick(row)}>
                  <img src={editImg} alt="Edit place" />
                </button>
              </div>
            ),
          }))}
          onRowSelectionModelChange={handleRowSelection}
        />
      </div>
    </div>
  );
};

export default Place;
