import { React, useState, useEffect } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import API_URLS from "../../utils/api";
import dayjs from "dayjs";
import CampLineChart from "../Chart/CampLineChart";
import CampPieChart from "../Chart/CampPieChart";

const CampDashboard = ({ campName, admin, adminBackButton, openingDate }) => {
  const [camp, setCamp] = useState();
  const [residents, setResidents] = useState([]);
  const [residencePeriod, setResidencePeriod] = useState([]);

  const [volunteers, setVolunteers] = useState([]);
  const [maleResidents, setMaleResidents] = useState([]);
  const [femaleResidents, setFemaleResidents] = useState([]);

  useEffect(() => {
    fetch(API_URLS.RESIDENCE_PERIOD)
      .then((response) => response.json())
      .then((newData) => {
        setResidencePeriod(newData);
      })
      .catch((error) => console.error("Error fetching data:", error));

    fetch(API_URLS.RESIDETNS)
      .then((response) => response.json())
      .then((newData) => {
        setResidents(newData);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    if (residents.length > 0 && residencePeriod.length > 0) {
      residencePeriod
        .filter((resP) => resP.campName === campName)
        .forEach((resP) => {
          if (resP.campName === campName) {
            let x = residents.find((res) => res.jmbg === resP.residentJmbg);

            if (x.sex.toLowerCase() === "m")
              setMaleResidents((prevData) => [...prevData, x]);
            else setFemaleResidents((prevData) => [...prevData, x]);
          }
        });
    }
  }, [residents, residencePeriod]);

  return (
    <div className="flex flex-col items-center text-xl font-serif ">
      {admin && <button onClick={adminBackButton}>Nazad</button>}
      <div className="flex flex-col ">
        <div>
          <div className="text-2xl">Statistika</div>
          <div>Ime kampa: {campName}</div>
          <div> Datum otvaranja: {"DODATI NA BEKEND"}</div>
          <div>Broj volontera: {2}</div>
          <div>Broj unesr: {residents.length}</div>
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
        <hr class="h-px mb-8   bg-gray-400 border-2 border-transparent" />

        <div>
          <span>Pristizanja po danima</span>
          <CampLineChart campName={campName} />
        </div>
      </div>
    </div>
  );
};

export default CampDashboard;
