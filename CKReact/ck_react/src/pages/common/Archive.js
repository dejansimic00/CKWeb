import React, { useRef } from "react";
import { useState, useEffect } from "react";
import search from "../../assets/images/search.png";
import DataTable from "../../components/DataTable/DataTable";
import API_URLS from "../../utils/api";
import { useSessionStorage } from "../../hooks/useSessionStorage";
import ResidentInfoModal from "../../components/Modal/ResidentInfoModal.js";
import { DataGrid } from "@mui/x-data-grid";

function Archive() {
  const [residents, setResidents] = useState([]);
  const [columns, setColumns] = useState([]);
  const { getItem } = useSessionStorage();

  const [searchText, setSearchText] = useState("");
  const [residentInfoModal, setResidentInfoModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState();
  const selectedRowRef = useRef(null);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [rowCount, setRowCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 10,
    page: 0,
  });

  useEffect(() => {
    console.log("pageSize", pageSize);
    console.log("page", page);
    console.log("paginationModel", paginationModel);
    fetch(
      `${API_URLS.RESIDENTS}?page=${paginationModel.page}&size=${paginationModel.pageSize}`,
      {
        headers: {
          Authorization: `Bearer ${getItem("token")}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setResidents(data.content);
        setRowCount(data.totalElements);
      })
      .catch((error) =>
        console.error("Greška pri dohvatanju unesrećenih", error)
      );
  }, [page, pageSize, paginationModel]);

  useEffect(() => {
    // fetch(API_URLS.RESIDENTS, {
    //   headers: {
    //     Authorization: `Bearer ${getItem("token")}`,
    //   },
    // })
    //   .then((response) => response.json())
    //   .then((data) => {
    //     console.log("RESIDENTI", data);
    //     setResidents(data.content);
    //   })
    //   .catch((error) =>
    //     console.error("Greška pri dohvatanju unesrećenih", error)
    //   );

    setColumns([
      { field: "id", headerName: "ID", width: 50 },
      { field: "firstName", headerName: "Ime", flex: 1 },
      { field: "lastName", headerName: "Prezime", flex: 1 },
      { field: "dateOfBirth", headerName: "Datum rođenja", width: 150 },
      {
        field: "sex",
        headerName: "Pol",
        renderCell: (params) => (params.value === "M" ? "Muški" : "Ženski"),
      },
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
    <div className="flex flex-col md:items-center w-full    p-10">
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
          id={selectedRowRef.current?.id}
          selectedRow={selectedRow}
        ></ResidentInfoModal>
      )}
      <div className=" md:min-w-[60rem] md:max-w-[60rem]">
        <div className=" max-md:overflow-scroll ">
          <div className="max-md:w-[40rem] ">
            <DataGrid
              columns={columns}
              rows={filteredData}
              onRowSelectionModelChange={handleRowSelection}
              pagination
              paginationMode="server"
              rowCount={rowCount}
              pageSize={pageSize}
              pageSizeOptions={[5, 10, 20, 100]}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              initialState={{
                columns: {
                  columnVisibilityModel: {
                    id: false,
                    jmbg: false,
                    employeeJmbg: false,
                    countryName: false,
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Archive;
