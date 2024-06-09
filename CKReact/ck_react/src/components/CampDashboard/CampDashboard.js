import React, { useState, useEffect } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import API_URLS from "../../utils/api";
import dayjs from "dayjs";
import CampLineChart from "../Chart/CampLineChart";
import CampPieChart from "../Chart/CampPieChart";
import { useSessionStorage } from "../../hooks/useSessionStorage";
import { Typography, useMediaQuery } from "@mui/material"; // Step 1
import CampPyramidChart from "../Chart/CampPyramidChart";

const CampDashboard = ({
  campName,
  admin = false,
  adminBackButton,
  openingDate,
  assignments,
  campId,
}) => {
  const [camp, setCamp] = useState();
  const [residents, setResidents] = useState([]);
  const [residencePeriod, setResidencePeriod] = useState([]);

  const [allCampResidents, setAllCampResidents] = useState([]);
  const [currentCampVolunteers, setCurrentCampVolunteers] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const { getItem } = useSessionStorage();

  const [averageStay, setAverageStay] = useState(0);
  const [volNumber, setVolNumber] = useState(0);
  const [resNumber, setResNumber] = useState(0);

  // Step 2: Determine screen size using useMediaQuery
  const isMobile = useMediaQuery("(max-width:600px)");

  useEffect(() => {
    if (campId) {
      const URL = API_URLS.CAMPS + "/" + campId + "/residence-periods";
      // console.log("URL", URL);
      fetch(URL, {
        headers: {
          Authorization: `Bearer ${getItem("token")}`,
        },
      })
        .then((response) => response.json())
        .then((newData) => {
          setResidencePeriod(newData);
        })
        .catch((error) =>
          console.error("Greška pri dohvatanju podataka o kampovima:", error)
        );

      const URL2 = API_URLS.CAMPS + "/" + campId + "/residents";

      fetch(URL2, {
        headers: {
          Authorization: `Bearer ${getItem("token")}`,
        },
      })
        .then((response) => response.json())
        .then((newData) => {
          setResidents(newData);
        })
        .catch((error) =>
          console.error("Greška pri dohvatanju podataka o unesrećenima:", error)
        );

      const URL3 = API_URLS.CAMPS + "/" + campId + "/all-residents";

      fetch(URL3, {
        headers: {
          Authorization: `Bearer ${getItem("token")}`,
        },
      })
        .then((response) => response.json())
        .then((newData) => {
          setAllCampResidents(newData);
        })
        .catch((error) =>
          console.error("Greška pri dohvatanju podataka o unesrećenima:", error)
        );
    }
  }, [campId]);

  useEffect(() => {
    if (assignments) {
      setCurrentCampVolunteers(
        assignments.filter(
          (vol) => vol.campName === campName && vol.endDate === null
        )
      );
    }
  }, [assignments]);

  useEffect(() => {
    const x = currentCampVolunteers?.length;
    setVolNumber(x);
  }, [currentCampVolunteers]);

  useEffect(() => {
    if (allCampResidents?.length > 0 && residencePeriod?.length > 0) {
      // Clear the arrays before updating

      const newResidencePeriod = residencePeriod.filter(
        (resP) => resP.campName === campName
      );

      // const filteredResidents = residents;
      // // .filter((res) => {
      // //   return filteredResidentPeriod.some(
      // //     (rp) => rp.residentJmbg === res.jmbg
      // //   );
      // // });

      // Calculate average stay duration
      const totalDays = allCampResidents.reduce((acc, res) => {
        const periods = residencePeriod.filter(
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
        allCampResidents.length > 0 ? totalDays / allCampResidents.length : 0;
      setAverageStay(averageStayDuration);

      console.log("totalDays", totalDays);
      console.log("allCampResidents", allCampResidents);

      // console.log("filteredResidents", filteredResidents);
      // setCurrentCampResidents(filteredResidents);
    }
  }, [residencePeriod, residents]);

  useEffect(() => {
    setResNumber(residents.length);
  }, [residents]);

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
      <Typography variant="h4" component="h4">
        Statistika
      </Typography>
      <div className="flex flex-col w-full max-w-4xl space-y-8">
        <div className="flex flex-col space-y-2">
          <div className="font-semibold">Ime kampa: {campName}</div>
          <div>Broj volontera : {volNumber}</div>
          <div>Broj unesrećenih : {resNumber}</div>
          <div>Prosječno trajanje boravka: {averageStay.toFixed(2)} dana</div>
        </div>
        {/*<hr className="border-t-2 border-gray-300" />
        <div className="flex  flex-col sm:flex-row justify-around space-x-10">
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
            className="w-20"
            endColor="#ed44fc"
          />
        </div> */}
        <hr className="border-t-2 border-gray-300" />
        <div>
          <CampPyramidChart
            residents={residents}
            title="Populaciona piramida za trenuto stanje kampa"
          />
        </div>
        <hr className="border-t-2 border-gray-300" />
        <div>
          <CampPyramidChart
            residents={allCampResidents}
            title="Populaciona piramida kroz istoriju kampa"
          />
        </div>
        <hr className="border-t-2 border-gray-300" />
        <div>
          <div className="font-semibold mb-2">Pristizanja po danima</div>
          {/* Step 3: Pass isMobile to CampLineChart */}
          <CampLineChart
            campName={campName}
            residencePeriod={residencePeriod}
            isMobile={isMobile}
          />
        </div>
      </div>
    </div>
  );
};

export default CampDashboard;
