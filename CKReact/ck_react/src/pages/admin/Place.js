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
import { Typography } from "@mui/material";
import CountryModal from "../../components/Modal/CountryModal";
import MunicipalityModal from "../../components/Modal/MunicipalityModal";
import DeleteMunicipalityModal from "../../components/Modal/DeleteMunicipalityModal";
import DeleteCountryModal from "../../components/Modal/DeleteCountryModal";

const Place = () => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [newLocationModal, setNewLocationModal] = useState(false);
  const [newMunicipalityModal, setNewMunicipalityModal] = useState(false);
  const [newCountryModal, setNewCountryModal] = useState(false);

  const [deleteLocationModal, setDeleteLocationModal] = useState(false);
  const [deleteMunicipalityModal, setDeleteMunicipalityModal] = useState(false);
  const [deleteCountryModal, setDeleteCountryModal] = useState(false);

  const [editLocationModal, setEditLocationModal] = useState(false);
  const [editMunicipalityModal, setEditMunicipalityModal] = useState(false);
  const [editCountryModal, setEditCountryModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const selectedRowRef = useRef(null);
  const [municipalities, setMunicipalities] = useState([]);
  const { getItem } = useSessionStorage();
  const [refresh, setRefresh] = useState(true);
  const [countries, setCountries] = useState([]);

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
      .catch((error) => console.error("Greška pri dohvatanju mjesta", error));
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

    fetch(API_URLS.COUNTRIES, {
      headers: {
        Authorization: `Bearer ${getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched Countries Data: ", data); // Check if countries data is fetched correctly
        setCountries(data); // Update the countries state
      })
      .catch((error) => console.error("Error fetching countries", error));

    setColumns([
      // Define columns
      { field: "id", headerName: "ID" },
      { field: "description", headerName: "Opis", flex: 2 },
      { field: "municipalityName", headerName: "Mjesto", flex: 1 },
      {
        field: "actions",
        headerName: "Akcije",
        renderCell: (params) => (
          <div>
            <button onClick={() => handleDeletePlaceClick(params.row)}>
              <img src={deleteImg} alt="Delete place" />
            </button>
            <button onClick={() => handleEditLocationClick(params.row)}>
              <img src={editImg} alt="Edit place" />
            </button>
          </div>
        ),
      },
    ]);
  }, [refresh]);

  const handleRowSelection = (selected) => {
    const row = data.find((row) => row.id === selected[0]);
    setSelectedRow(row);
    selectedRowRef.current = row;
  };

  const handleEditLocationClick = (row) => {
    setSelectedRow(row);
    setTimeout(() => {
      setEditLocationModal(true);
    }, 1);
  };

  const handleEditMunicipalityClick = (row) => {
    setSelectedRow(row);
    setTimeout(() => {
      setEditMunicipalityModal(true);
    }, 1);
  };

  const handleEditCountryClick = (row) => {
    setSelectedRow(row);
    setTimeout(() => {
      setEditCountryModal(true);
    }, 1);
  };

  const handleSearchTextChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleDeletePlaceClick = (row) => {
    setSelectedRow(row);
    setDeleteLocationModal(true);
  };

  const handleDeleteMunicipalityClick = (row) => {
    setSelectedRow(row);
    setDeleteMunicipalityModal(true);
  };

  const handleDeleteCountryClick = (row) => {
    setSelectedRow(row);
    setDeleteCountryModal(true);
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
    } catch (error) {
      console.error("Greška pri brisanju mjesta:", error.message);
    }
  };

  const handleDeleteMunicipality = async (id) => {
    try {
      const URL = `${API_URLS.MUNICIPALITIES}/${id}`;
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
    } catch (error) {
      console.error("Greška pri brisanju općine:", error.message);
    }
  };

  const handleDeleteCountry = async (id) => {
    try {
      const URL = `${API_URLS.COUNTRIES}/${id}`;
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
    } catch (error) {
      console.error("Greška pri brisanju države:", error.message);
    }
  };

  const filteredData = data.filter((row) =>
    Object.values(row).some((value) =>
      value?.toString().toLowerCase().includes(searchText.toLowerCase())
    )
  );

  const newLocationOnClick = () => {
    setNewLocationModal(true);
  };

  const newMunicipalityOnClick = () => {
    setNewMunicipalityModal(true);
  };

  const newCountryOnClick = () => {
    setNewCountryModal(true);
  };

  return (
    <div className="flex w-full  items-center justify-center ">
      <div className="flex flex-col  w-[50rem] space-y-24 pt-10">
        {newLocationModal && (
          <PlaceModal
            open={newLocationModal}
            setOpen={setNewLocationModal}
            municipalities={municipalities}
            refresh={refresh}
            setRefresh={setRefresh}
          />
        )}
        {editLocationModal && (
          <PlaceModal
            open={editLocationModal}
            setOpen={setEditLocationModal}
            mode="edit"
            placeData={{ ...selectedRow }}
            refresh={refresh}
            setRefresh={setRefresh}
            municipalities={municipalities}
          />
        )}
        {deleteLocationModal && (
          <DeletePlaceModal
            open={deleteLocationModal}
            setOpen={setDeleteLocationModal}
            handleDelete={handleDeletePlace}
            placeData={selectedRow}
            refresh={refresh}
            setRefresh={setRefresh}
          />
        )}

        {/* gradovi modali */}
        {newMunicipalityModal && (
          <MunicipalityModal
            open={newMunicipalityModal}
            setOpen={setNewMunicipalityModal}
            countries={countries}
            refresh={refresh}
            setRefresh={setRefresh}
          />
        )}

        {editMunicipalityModal && (
          <MunicipalityModal
            open={editMunicipalityModal}
            setOpen={setEditMunicipalityModal}
            countries={countries}
            refresh={refresh}
            setRefresh={setRefresh}
            mode="edit"
            municipalityData={{ ...selectedRow }}
          />
        )}

        {deleteMunicipalityModal && (
          <DeleteMunicipalityModal
            open={deleteMunicipalityModal}
            setOpen={setDeleteMunicipalityModal}
            handleDeleteMunicipality={handleDeleteMunicipality}
            municipalityData={selectedRow}
          />
        )}

        {/* drzave modali */}
        {newCountryModal && (
          <CountryModal
            open={newCountryModal}
            setOpen={setNewCountryModal}
            countries={countries}
            setCountries={setCountries}
          />
        )}

        {editCountryModal && (
          <CountryModal
            open={editCountryModal}
            setOpen={setEditCountryModal}
            countries={countries}
            setCountries={setCountries}
            mode="edit"
            countryData={{ ...selectedRow }}
          />
        )}

        {deleteCountryModal && (
          <DeleteCountryModal
            open={deleteCountryModal}
            setOpen={setDeleteCountryModal}
            handleDeleteCountry={handleDeleteCountry}
            countryData={selectedRow}
          />
        )}

        {/* MJESTA----------------------------------------------------------------------------------------------------- */}
        <div>
          <Typography variant="h4" component="h4">
            Lokacije
          </Typography>
          <div className="flex justify-between ">
            <div className="flex items-center pl-2 h-10 w-80 self-start mb-4 rounded-xl border-black border-2">
              <img src={search} alt="search" className="w-4 h-4" />
              <input
                type="text"
                className="bg-transparent w-full outline-none pl-2"
                onChange={handleSearchTextChange}
                placeholder="Pretraži  ..."
              />
            </div>
            <Button
              text={"Nova lokacija"}
              onClick={newLocationOnClick}
              plusSign={true}
            />
          </div>
          <DataTable
            columns={columns}
            rows={filteredData.map((row) => ({
              id: row.id,
              description: row.description,
              municipalityName: row.municipalityName,
            }))}
            onRowSelectionModelChange={handleRowSelection}
          />
        </div>

        {/* GRADOVI----------------------------------------------------------------------------------------------------- */}
        <div>
          <div className="flex py-4  justify-between items-center">
            <Typography variant="h4" component="h4">
              Gradovi
            </Typography>
            <Button
              text={"Novi grad"}
              onClick={newMunicipalityOnClick}
              plusSign={true}
            />
          </div>
          <DataTable
            columns={[
              { field: "id", headerName: "ID", width: 100 },
              { field: "name", headerName: "Naziv", flex: 1 },
              { field: "postCode", headerName: "Poštanski broj", width: 150 },
              { field: "countryName", headerName: "Država", width: 200 },
              {
                field: "actions",
                headerName: "Akcije",
                renderCell: (params) => (
                  <div>
                    <button
                      onClick={() => handleDeleteMunicipalityClick(params.row)}
                    >
                      <img src={deleteImg} alt="Delete municipality" />
                    </button>
                    <button
                      onClick={() => handleEditMunicipalityClick(params.row)}
                    >
                      <img src={editImg} alt="Edit municipality" />
                    </button>
                  </div>
                ),
              },
            ]}
            rows={municipalities.map((municipality) => ({
              id: municipality.id,
              name: municipality.name,
              postCode: municipality.postCode,
              countryName: municipality.countryName,
            }))}
          />
        </div>

        {/* DRZAVE----------------------------------------------------------------------------------------------------- */}
        <div className="w-full">
          <div className="flex py-4  justify-between items-center">
            <Typography variant="h4" component="h4">
              Države
            </Typography>
            <Button
              className=""
              text={"Nova država"}
              onClick={newCountryOnClick}
              plusSign={true}
            />
          </div>
          <DataTable
            columns={[
              { field: "id", headerName: "ID", width: 100 },
              { field: "name", headerName: "Naziv", flex: 1 },
              {
                field: "actions",
                headerName: "Akcije",
                renderCell: (params) => (
                  <div>
                    <button
                      onClick={() => handleDeleteCountryClick(params.row)}
                    >
                      <img src={deleteImg} alt="Delete country" />
                    </button>
                    <button onClick={() => handleEditCountryClick(params.row)}>
                      <img src={editImg} alt="Edit country" />
                    </button>
                  </div>
                ),
              },
            ]}
            rows={countries.map((country) => ({
              id: country.id,
              name: country.name,
            }))}
          />
        </div>
      </div>
    </div>
  );
};

export default Place;
