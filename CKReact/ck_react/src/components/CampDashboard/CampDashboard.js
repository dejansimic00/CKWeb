import { React, useState, useEffect } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import API_URLS from "../../utils/api";
import dayjs from "dayjs";
import CampLineChart from "../Chart/CampLineChart";
import CampPieChart from "../Chart/CampPieChart";
import { useSessionStorage } from "../../hooks/useSessionStorage";

const CampDashboard = ({
  campName,
  admin = false,
  adminBackButton,
  openingDate,
  assignments,
}) => {
  const [camp, setCamp] = useState();
  const [residents, setResidents] = useState();
  const [residencePeriod, setResidencePeriod] = useState([]);

  const [currentCampResidents, setCurrentCampResidents] = useState([]);
  const [currentCampVolunteers, setCurrentCampVolunteers] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [maleResidents, setMaleResidents] = useState([]);
  const [femaleResidents, setFemaleResidents] = useState([]);
  const { getItem } = useSessionStorage();

  const [volNumber, setVolNumber] = useState(0);
  const [resNumber, setResNumber] = useState(0);

  useEffect(() => {
    fetch(API_URLS.RESIDENCE_PERIOD, {
      headers: {
        Authorization: `Bearer ${getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((newData) => {
        setResidencePeriod(newData);
      })
      .catch((error) => console.error("Error fetching data:", error));

    fetch(API_URLS.RESIDENTS, {
      headers: {
        Authorization: `Bearer ${getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((newData) => {
        setResidents(newData);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    if (assignments) {
      setCurrentCampVolunteers(
        assignments.filter((vol) => vol.campName === campName)
      );
    }
  }, [assignments]);

  useEffect(() => {
    const x = currentCampVolunteers?.length;
    setVolNumber(x);
  }, [currentCampVolunteers]);

  useEffect(() => {
    if (residents?.length > 0 && residencePeriod?.length > 0) {
      // Clear the arrays before updating
      setMaleResidents([]);
      setFemaleResidents([]);

      const newResidencePeriod = residencePeriod.filter(
        (resP) => resP.campName === campName
      );

      const filteredResidentPeriod = residencePeriod.filter(
        (rp) => rp.campName === campName
      );

      //console.log("RESIDENTS", residents);
      //console.log("residencePeriod", residencePeriod);
      //console.log("filteredResidentPeriod", filteredResidentPeriod);

      const filteredREsidents = residents.filter((res) => {
        return filteredResidentPeriod.some(
          (rp) => rp.residentJmbg === res.jmbg
        );
      });

      //console.log("filteredREsidents", filteredREsidents);

      setCurrentCampResidents(filteredREsidents);

      filteredREsidents.forEach((res) => {
        if (res.sex.toLowerCase() === "m")
          setMaleResidents((prevData) => [...prevData, res]);
        else setFemaleResidents((prevData) => [...prevData, res]);
      });
      // console.log("campName", campName);
      // console.log("residents", residents);
      // console.log("cur", currentCampResidents);
      // console.log("residencePeriod", residencePeriod);
      // console.log("currentCampVolunteers", currentCampVolunteers);
    }
    //console.log(currentCampResidents.length);
  }, [residencePeriod, residencePeriod]);

  useEffect(() => {
    //console.log("Postavljanje broja resi");
    setResNumber(currentCampResidents.length);
  }, [currentCampResidents, residents, currentCampResidents.length]);

  return (
    <div className="flex flex-col items-center text-xl font-serif ">
      {admin && <button onClick={adminBackButton}>Nazad</button>}
      <div className="flex flex-col ">
        <div>
          <div className="text-2xl">Statistika</div>
          <div>Ime kampa: {campName}</div>
          <div> Datum otvaranja: {"DODATI NA BEKEND"}</div>
          <div>Broj volontera: {volNumber}</div>
          <div>Broj unesr: {resNumber}</div>
        </div>
        <hr className="h-px my-8   bg-gray-400 border-2 border-transparent" />
        <div className="flex space-x-10">
          <div>
            <CampPieChart
              title="Muška populacija"
              data={maleResidents}
              endColor="#00c1fc"
              width={350}
            />
          </div>
          <div>
            <CampPieChart
              title="Ženska populacija"
              data={femaleResidents}
              width={350}
              endColor="#ed44fc"
            />
          </div>
        </div>
        <hr className="h-px mb-8   bg-gray-400 border-2 border-transparent" />

        <div>
          <span>Pristizanja po danima</span>
          <CampLineChart
            campName={campName}
            residencePeriod={residencePeriod}
          />
        </div>
      </div>
    </div>
  );
};

export default CampDashboard;
