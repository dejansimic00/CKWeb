import DataTable from "../../components/DataTable/DataTable";
import API_URLS from "../../utils/api";
import React, { useEffect, useState } from "react";
import search from "../../assets/images/search.png";
import Logo from "../../components/Logo/Logo";
import Button from "../../components/Button/Button";
import VolunteerModal from "../../components/Modal/VolunteerModal";

const Volunteer = () => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [filterModel, setFilterModel] = useState({});
  const [newVolunteerModal, setNewVolunteerModal] = useState(false);

  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    // Fetch data from the API
    fetch(API_URLS.EMPLOYEES)
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error("Error fetching data:", error));

    setColumns([
      { field: "id", headerName: "ID", width: 70 },
      { field: "firstName", headerName: "Ime", width: 150 },
      { field: "lastName", headerName: "Prezime", width: 150 },
      { field: "dateOfBirth", headerName: "Datum rođenja", width: 130 },
      { field: "sex", headerName: "Pol", width: 90 },
      { field: "jmbg", headerName: "JMBG", width: 150 },
      { field: "countryName", headerName: "Država", width: 150 },
      //{ field: "password", headerName: "Lozinka", width: 150 },
      { field: "username", headerName: "Korisničko ime", width: 150 },
      { field: "isAdmin", headerName: "Admin", width: 100 },
    ]);
  }, []); // Empty dependency array ensures useEffect runs only once

  const handleRowSelection = (selected) => {
    const selectedRow = data.find((row) => row.id === selected[0]); // Assuming row IDs are unique
    const campId = selectedRow.id;

    /*console.log(campId);
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
    ]);*/
  };

  const handleSearchTextChange = (event) => {
    setSearchText(event.target.value);
  };

  const filteredData = data.filter(
    (row) =>
      //row.firstName.toLowerCase().includes(searchText.toLowerCase())
      row
  );

  const newVolonterOnClick = () => {
    console.log("Srbija");
    setNewVolunteerModal(true);
  };

  return (
    <div className="flex flex-col items-center w-full pt-10">
      {newVolunteerModal && (
        <VolunteerModal
          open={newVolunteerModal}
          setOpen={setNewVolunteerModal}
        ></VolunteerModal>
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
          columns={columns}
          rows={filteredData}
          onRowSelectionModelChange={handleRowSelection}
        />
      </div>
    </div>
  );
};

export default Volunteer;
