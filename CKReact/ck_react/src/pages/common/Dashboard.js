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

  useEffect(() => {
    if (selectedCamp) console.log("selectedCamp", selectedCamp);
  }, [selectedCamp]);

  // Dohvatanje podataka iz 3 razlicite tabele u bazi i skladistenje u stanja
  useEffect(() => {
    fetch(API_URLS.CAMPS, {
      headers: {
        Authorization: `Bearer ${getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((newData) => {
        setCamps(newData);
      })
      .catch((error) =>
        console.error("Greška pri dohvatanju podataka o kampovima:", error)
      );

    fetch(API_URLS.MUNICIPALITIES, {
      headers: {
        Authorization: `Bearer ${getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((newData) => {
        setMunicipalities(newData);
      })
      .catch((error) =>
        console.error("Greška pri dohvatanju podataka o gradovima:", error)
      );

    fetch(API_URLS.PLACES, {
      headers: {
        Authorization: `Bearer ${getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((newData) => {
        setPlaces(newData);
      })
      .catch((error) =>
        console.error("Greška pri dohvatanju podataka o lokacijama:", error)
      );

    fetch(API_URLS.ASSIGNMENTS, {
      headers: {
        Authorization: `Bearer ${getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((newData) => {
        setAssignments(newData);
      })
      .catch((error) =>
        console.error("Greška pri dohvatanju podataka o zaduženjima:", error)
      );
    setColumns([
      { field: "id", headerName: "ID", width: 50 },
      { field: "name", headerName: "Ime" },
      { field: "place", headerName: "Mjesto", flex: 1 },
      { field: "location", headerName: "Lokacija", flex: 1 },
    ]);

    const isAdmin = getItem("isAdmin") === "true";
    setIsAdmin(isAdmin);
  }, []);

  useEffect(() => {
    if (assignments) {
      //console.log("assignments", assignments);
      const _campName = assignments
        .filter((ass) => ass.endDate === null)
        .find(
          (ass) => ass.employeeId === Number.parseInt(getItem("id"))
        )?.campName;

      // console.log("camps", camps);

      const _findCamp = camps.find((c) => c.name === _campName);

      // console.log("_findCamp", _findCamp);
      setSelectedCamp(_findCamp);
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
        <div className="">
          <div className="flex flex-col items-center  min-w-[12rem] ">
            <h1 className="text-3xl py-10">Izvještaj</h1>
            <div className="w-full max-w-[60rem]  overflow-hidden">
              <DataTable
                columns={columns}
                rows={data}
                onRowSelectionModelChange={handleRowSelection}
                initialState={{
                  columns: {
                    columnVisibilityModel: {
                      id: false,
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      )}

      {isAdmin && showCampStatistics && assignments && (
        <CampDashboard
          campId={selectedCamp.id ?? 3}
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
            campId={selectedCamp?.id ?? undefined}
            campName={nonAdminCampName}
            assignments={assignments}
          ></CampDashboard>
        </div>
      )}
    </>
  );
};

export default Dashboard;
