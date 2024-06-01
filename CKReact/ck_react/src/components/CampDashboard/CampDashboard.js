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
  const [residents, setResidents] = useState([]);
  const [residencePeriod, setResidencePeriod] = useState([]);

  const [currentCampResidents, setCurrentCampResidents] = useState([]);
  const [currentCampVolunteers, setCurrentCampVolunteers] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [maleResidents, setMaleResidents] = useState([]);
  const [femaleResidents, setFemaleResidents] = useState([]);
  const { getItem } = useSessionStorage();

  const [averageStay, setAverageStay] = useState(0);
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

      const filteredResidents = residents.filter((res) => {
        return filteredResidentPeriod.some(
          (rp) => rp.residentJmbg === res.jmbg
        );
      });

      // Calculate average stay duration
      const totalDays = filteredResidents.reduce((acc, res) => {
        const periods = filteredResidentPeriod.filter(
          (rp) => rp.residentJmbg === res.jmbg
        );
        const stayDays = periods.reduce((acc, period) => {
          const startDate = dayjs(period.startDate);
          const endDate = period.endDate ? dayjs(period.endDate) : dayjs();
          return acc + endDate.diff(startDate, "day");
        }, 0);
        return acc + stayDays;
      }, 0);

      const averageStayDuration =
        filteredResidents.length > 0 ? totalDays / filteredResidents.length : 0;
      setAverageStay(averageStayDuration);
      setCurrentCampResidents(filteredResidents);

      filteredResidents.forEach((res) => {
        if (res.sex.toLowerCase() === "m")
          setMaleResidents((prevData) => [...prevData, res]);
        else setFemaleResidents((prevData) => [...prevData, res]);
      });
    }
  }, [residencePeriod, residents]);

  useEffect(() => {
    setResNumber(currentCampResidents.length);
  }, [currentCampResidents]);

  return (
    <div className="flex flex-col items-center text-lg font-serif p-6">
      {admin && (
        <button
          onClick={adminBackButton}
          className="mb-6 px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition"
        >
          Nazad
        </button>
      )}
      <div className="text-3xl font-bold mb-4">Statistika</div>
      <div className="flex flex-col w-full max-w-4xl space-y-8">
        <div className="flex flex-col space-y-2">
          <div className="font-semibold">Ime kampa: {campName}</div>
          {/* <div>Datum otvaranja: {"DODATI NA BEKEND"}</div> */}
          <div>Broj volontera : {volNumber}</div>
          <div>Broj unesrećenih : {resNumber}</div>
          <div>Prosječno trajanje boravka: {averageStay.toFixed(2)} dana</div>
        </div>
        <hr className="border-t-2 border-gray-300" />
        <div className="flex justify-around space-x-10">
          <CampPieChart
            title="Muška populacija"
            data={maleResidents}
            endColor="#00c1fc"
            width={350}
          />
          <CampPieChart
            title="Ženska populacija"
            data={femaleResidents}
            width={350}
            endColor="#ed44fc"
          />
        </div>
        <hr className="border-t-2 border-gray-300" />
        <div>
          <div className="font-semibold mb-2">Pristizanja po danima</div>
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
