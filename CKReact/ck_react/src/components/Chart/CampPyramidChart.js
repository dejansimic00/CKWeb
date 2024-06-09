import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const CampPyramidChart = ({
  residents,
  gap = 5,
  title = "Populaciona piramida",
}) => {
  const data = {
    labels: [],
    datasets: [
      {
        label: "Muškarci",
        data: [],
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
      {
        label: "Žene",
        data: [],
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  };

  function populateData() {
    const maleAges = {};
    const femaleAges = {};

    // Iterate over residents to calculate age and gender distribution
    residents.forEach((resident) => {
      const age =
        new Date().getFullYear() - new Date(resident.dateOfBirth).getFullYear();
      const gender = resident.sex.toLowerCase() === "m" ? "Male" : "Female";

      if (gender === "Male") {
        if (!maleAges[age]) {
          maleAges[age] = 0;
        }
        maleAges[age]++;
      } else {
        if (!femaleAges[age]) {
          femaleAges[age] = 0;
        }
        femaleAges[age]++;
      }
    });

    // Define the maximum age limit
    const ageLimit = 100; // Set your desired maximum age here

    // Populate age labels
    const minAge = 0;
    //  Math.min(
    //   ...Object.keys(maleAges).map(Number),
    //   ...Object.keys(femaleAges).map(Number)
    // );
    const maxAge = ageLimit;
    //  Math.min(
    //   ageLimit,
    //   Math.max(
    //     ...Object.keys(maleAges).map(Number),
    //     ...Object.keys(femaleAges).map(Number)
    //   )
    // );

    for (let i = minAge; i <= maxAge; i += gap) {
      data.labels.push(`${i}-${i + gap - 1}`);
      let maleCount = 0;
      let femaleCount = 0;

      for (let j = i; j < i + gap; j++) {
        maleCount += maleAges[j] || 0;
        femaleCount += femaleAges[j] || 0;
      }

      data.datasets[0].data.push(-maleCount); // Negative values for left side of the pyramid
      data.datasets[1].data.push(femaleCount);
    }
  }

  populateData();

  const options = {
    indexAxis: "y",
    scales: {
      x: {
        ticks: {
          callback: function (value) {
            return Math.abs(value);
          },
        },
      },
    },
  };

  return (
    <div>
      <h2>{title}</h2>
      <Bar data={data} options={options} />
    </div>
  );
};

export default CampPyramidChart;
