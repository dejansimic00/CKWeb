import DataTable from "../../components/DataTable/DataTable";
import axios from "axios";
import API_URLS from "../../utils/api";
import React, { useEffect, useState } from "react";
import CampDashboard from "../../components/CampDashboard/CampDashboard";

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [isAdmin, setIsAdmin] = useState(!false);

  const [selectedCamp, setSelectedCamp] = useState("");

  useEffect(() => {
    // Fetch data from the API
    fetch(API_URLS.ASSIGMNENTS)
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error("Error fetching data:", error));

    setColumns([
      { field: "id", headerName: "ID", width: 70 },
      { field: "startDate", headerName: "Start Date", width: 130 },
      { field: "endDate", headerName: "End Date", width: 130 },
      { field: "employeeJmbg", headerName: "Employee JMBG", width: 130 },
      { field: "campName", headerName: "Camp Name", width: 250 },
    ]);
  }, []); // Empty dependency array ensures useEffect runs only once

  const handleRowSelection = (selected) => {
    const selectedRow = data.find((row) => row.id === selected[0]); // Assuming row IDs are unique
    const campId = selectedRow.id;

    console.log(selectedRow);
    const res = fetch(API_URLS.CAMPS + "/" + campId)
      .then((response) => response.json())
      .then((data) => {
        console.log("DATA ", data); // Log the response data
      });
    //  .catch((error) => console.error("Error fetching data:"));

    console.log(data);

    setColumns([
      { field: "id", headerName: "ID", width: 70 },
      { field: "name", headerName: "Ime", width: 130 },
      { field: "capacity", headerName: "Kapacitet", width: 70 },
      { field: "campStatusName", headerName: "Status", width: 150 },
      { field: "placeDescription", headerName: "Opis lokacije", width: 250 },
    ]);
  };

  return (
    <>
      {isAdmin && (
        <div className="flex flex-col items-center w-full">
          <h1>Data Table Example</h1>
          <div className="">
            <DataTable
              columns={columns}
              rows={data}
              onSelectionModelChange={handleRowSelection}
            />
          </div>
        </div>
      )}
      {!isAdmin && (
        <div>
          <CampDashboard campName={"Summer Camp 2024"}></CampDashboard>
        </div>
      )}
    </>
  );
};

export default Dashboard;
