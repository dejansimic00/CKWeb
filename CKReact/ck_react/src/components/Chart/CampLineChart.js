import { React, useState, useEffect } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import API_URLS from "../../utils/api";
import dayjs from "dayjs";
import { useMediaQuery } from "@mui/material";
import { useSessionStorage } from "../../hooks/useSessionStorage";

const CampLineChart = ({ campName, residencePeriod, isMobile }) => {
  const [data, setData] = useState([]);
  const [keys, setKeys] = useState([]);
  const [values, setValues] = useState([]);
  const { getItem } = useSessionStorage();

  useEffect(() => {
    setData(residencePeriod);
  }, [residencePeriod]);

  useEffect(() => {
    if (data) {
      const groupData = Object.groupBy(
        data.filter((d) => d.campName === campName),
        ({ startDate }) => startDate
      );
      const keys = Object.keys(groupData).sort(
        (a, b) => new Date(a) - new Date(b)
      ); // Sort keys (dates) in ascending order

      setKeys(keys.map((key) => new Date(key).getTime()));
      setValues(Object.values(groupData).map((val) => val.length));
    }
  }, [data]);

  const formatDate = (date) => {
    let x = dayjs(date).format("DD/MM/YYYY");
    return x;
  };

  const formatCount = (count) => {
    return count === parseInt(count, 10) ? count : "";
  };
  return (
    <LineChart
      className={isMobile ? "w-10 h-10" : "w-20 h-20"}
      xAxis={[
        {
          data: keys,
          label: "Srbija",
          tickLabelInterval: (v, i) => i % 4 === 0,
          fill: "#992200",
          valueFormatter: formatDate,
        },
      ]}
      series={[
        {
          data: values,
        },
      ]}
      yAxis={[
        {
          min: 0,
          valueFormatter: formatCount,
        },
      ]}
      width={isMobile ? 400 : 800} // Adjust width based on isMobile prop
      height={isMobile ? 200 : 400} // Adjust height based on isMobile prop
      colors={["#ff0000"]}
    />
  );
};

export default CampLineChart;
