import DataTable from "../../components/DataTable/DataTable";
import API_URLS from "../../utils/api";
import React, { useEffect, useState } from "react";
import CampDashboard from "../../components/CampDashboard/CampDashboard";
import detailsImg from "../../assets/images/details.png";
import { useUser } from "../../hooks/useUser";
import { useSessionStorage } from "../../hooks/useSessionStorage";

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showCampStatistics, setShowCampStatistics] = useState(false);

  const [camps, setCamps] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);
  const [places, setPlaces] = useState([]);
  const [assignments, setAssignments] = useState();
  const [selectedCamp, setSelectedCamp] = useState("");
  const [token, setToken] = useState();
  const [tokenReady, setTokenReady] = useState(false);
  const [nonAdminCampName, setNonAdminCampName] = useState("Summer Camp 2024");
  const { user } = useUser();
  const { getItem } = useSessionStorage();

  // useEffect(() => {
  //   const checkToken = () => {
  //     const tokenFromStorage = getItem("token");
  //     if (tokenFromStorage) {
  //       setTokenReady(true);
  //       setToken(tokenFromStorage);
  //     } else {
  //       setTimeout(checkToken, 1000); // Check again after 1 second
  //     }
  //   };

  //   checkToken();
  // }, []);

  // Dohvatanje podataka iz 3 razlicite tabele u bazi i skladistenje u stanja
  useEffect(() => {
    console.log("getItem", getItem("token"));

    fetch(API_URLS.CAMPS, {
      headers: {
        Authorization: `Bearer ${getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((newData) => {
        setCamps(newData);
      })
      .catch((error) => console.error("Error fetching data:", error));

    fetch(API_URLS.MUNICIPALITIES, {
      headers: {
        Authorization: `Bearer ${getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((newData) => {
        setMunicipalities(newData);
      })
      .catch((error) => console.error("Error fetching data:", error));

    fetch(API_URLS.PLACES, {
      headers: {
        Authorization: `Bearer ${getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((newData) => {
        setPlaces(newData);
      })
      .catch((error) => console.error("Error fetching data:", error));

    fetch(API_URLS.ASSIGNMENTS, {
      headers: {
        Authorization: `Bearer ${getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((newData) => {
        setAssignments(newData);
      })
      .catch((error) => console.error("Error fetching data:", error));
    setColumns([
      { field: "id", headerName: "ID", width: 50 },
      { field: "name", headerName: "Ime", width: 250 },
      { field: "place", headerName: "Mjesto", width: 200 },
      { field: "location", headerName: "Lokacija", width: 150 },
      {
        field: "actions",
        headerName: "Akcije",
        width: 150,
        renderCell: (params) => (
          <div>
            <button
              className="w-6"
              onClick={() => {
                handleDetailsClick(params.row);
              }}
            >
              <img
                src={detailsImg}
                alt="Detalji o kampu"
                about="Detalji o kampu"
              ></img>
            </button>
          </div>
        ),
      },
    ]);

    const isAdmin = getItem("isAdmin") === "true";
    setIsAdmin(isAdmin);
  }, []);

  useEffect(() => {
    if (assignments) {
      console.log("ASS", assignments);
      setNonAdminCampName(
        assignments
          .filter((ass) => ass.endDate === null)
          .find((ass) => ass.employeeId === Number.parseInt(getItem("id")))
          ?.campName
      );
    }
  }, [assignments]);

  const handleDetailsClick = (camp) => {
    setSelectedCamp(camp);
  };

  // kombinovanje stanja iz 3 tabele, ne moze na pocetku jer neki od te 3 su prazni,
  //moze vjv sa Promise (nije mi se dalo tako === ne znam tako)
  useEffect(() => {
    if (camps && places) {
      let x = camps.map((camp) => {
        let placeX = places.find(
          (p) => p.description === camp.placeDescription
        );
        return {
          id: camp.id,
          name: camp.name,
          location: camp.placeDescription,
          place: placeX?.municipalityName,
        };
      });
      setData(x);
    }
  }, [camps, places]);

  const handleRowSelection = (selected) => {
    const selectedRow = data.find((row) => row.id === selected[0]); // Assuming row IDs are unique
    setSelectedCamp(selectedRow);
    setShowCampStatistics(true);
  };

  return (
    <>
      {isAdmin && !showCampStatistics && (
        <div className="flex flex-col items-center w-full">
          <h1 className="text-3xl py-10">Izvještaj</h1>
          <div className="">
            <DataTable
              columns={columns}
              rows={data}
              onRowSelectionModelChange={handleRowSelection}
            />
          </div>
        </div>
      )}

      {isAdmin && showCampStatistics && assignments && (
        <CampDashboard
          campName={selectedCamp.name}
          admin={true}
          adminBackButton={() => setShowCampStatistics(false)}
          assignments={assignments}
        ></CampDashboard>
      )}
      {!isAdmin && assignments && (
        <div>
          {/* Ovje dodati ime kampa na kojem je volonter zaduzen */}
          <CampDashboard
            campName={nonAdminCampName}
            assignments={assignments}
          ></CampDashboard>
        </div>
      )}
    </>
  );
};

export default Dashboard;
