import React, { useRef } from "react";
import { useState, useEffect } from "react";
import search from "../../assets/images/search.png";
import DataTable from "../../components/DataTable/DataTable";
import API_URLS from "../../utils/api";
import { useSessionStorage } from "../../hooks/useSessionStorage";
import ResidentInfoModal from "../../components/Modal/ResidentInfoModal.js";

function Archive() {
  const [residents, setResidents] = useState([]);
  const [columns, setColumns] = useState([]);
  const { getItem } = useSessionStorage();

  const [searchText, setSearchText] = useState("");
  const [residentInfoModal, setResidentInfoModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState();
  const selectedRowRef = useRef(null);

  useEffect(() => {
    fetch(API_URLS.RESIDENTS, {
      headers: {
        Authorization: `Bearer ${getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("RESIDENTI", data);
        setResidents(data);
      })
      .catch((error) =>
        console.error("Greška pri dohvatanju unesrećenih", error)
      );

    setColumns([
      { field: "id", headerName: "ID", width: 50 },
      { field: "firstName", headerName: "Ime", width: 150 },
      { field: "lastName", headerName: "Prezime", width: 150 },
      { field: "dateOfBirth", headerName: "Datum rođenja", width: 150 },
      { field: "sex", headerName: "Pol", width: 50 },
      { field: "jmbg", headerName: "JMBG", width: 150 },
      { field: "countryName", headerName: "Država", width: 150 },
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
      {
        field: "employeeId",
        headerName: "Dodao volonter",
        width: 150,
        renderCell: (params) => {
          return (
            <div>
              {params.row.employeeFirstName + " " + params.row.employeeLastName}
            </div>
          );
        },
      },
    ]);
  }, []);

  const handleSearchTextChange = (event) => {
    setSearchText(event.target.value);
  };
  const filteredData = residents.filter((row) =>
    Object.values(row).some((value) =>
      value?.toString().toLowerCase().includes(searchText.toLowerCase())
    )
  );

  const handleRowSelection = (selected) => {
    const row = residents.find((row) => row.id === selected[0]);
    setSelectedRow(row);
    selectedRowRef.current = row;
    setResidentInfoModal(true);
  };

  return (
    <div className="flex flex-col items-center w-full  pt-10">
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
        </div>
        {residentInfoModal && (
          <ResidentInfoModal
            open={residentInfoModal}
            setOpen={setResidentInfoModal}
            id={selectedRowRef.current.id}
            selectedRow={selectedRow}
          ></ResidentInfoModal>
        )}
        <div className="w-full overflow-x-auto">
          <DataTable
            columns={[...columns]}
            rows={filteredData}
            onRowSelectionModelChange={handleRowSelection}
          />
        </div>
      </div>
    </div>
  );
}

export default Archive;
