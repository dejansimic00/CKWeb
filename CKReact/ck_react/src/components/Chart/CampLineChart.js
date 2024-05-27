import { React, useState, useEffect } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import API_URLS from "../../utils/api";
import dayjs from "dayjs";

const CampLineChart = ({ campName }) => {
  const [data, setData] = useState([]);
  const [keys, setKeys] = useState([]);
  const [values, setValues] = useState([]);

  useEffect(() => {
    fetch(API_URLS.RESIDENCE_PERIOD)
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) =>
        console.error("Greska pri dohvatanju drzava iz baze:", error)
      );
  }, []);

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
      width={800}
      height={400}
    />
  );
};

export default CampLineChart;
