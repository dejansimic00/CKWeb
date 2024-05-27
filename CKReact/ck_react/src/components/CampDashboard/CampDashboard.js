import { React, useState, useEffect } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import API_URLS from "../../utils/api";
import dayjs from "dayjs";
import CampLineChart from "../Chart/CampLineChart";

const CampDashboard = ({ campName }) => {
  const [camps, setCamps] = useState([
    "Summer Camp 2024",
    "Winter Retreat",
    "Spring Break Camp",
  ]);

  useEffect(() => {
    console.log(camps);
  }, []);

  return (
    <div className="flex flex-col items-center ">
      <CampLineChart campName={campName} />
    </div>
  );
};

export default CampDashboard;
