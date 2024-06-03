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

const CampPyramidChart = ({ residents }) => {
  const data = {
    labels: [],
    datasets: [],
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

    // Populate labels and data for male dataset
    data.datasets.push({
      label: "Muškarci",
      data: Object.values(maleAges).map((count) => -count), // Negative values for left side of the pyramid
      backgroundColor: "rgba(54, 162, 235, 0.6)",
    });

    // Populate labels and data for female dataset
    data.datasets.push({
      label: "Žene",
      data: Object.values(femaleAges),
      backgroundColor: "rgba(255, 99, 132, 0.6)",
    });

    // Populate age labels
    const minAge = Math.min(
      ...Object.keys(maleAges),
      ...Object.keys(femaleAges)
    );
    const maxAge = Math.max(
      ...Object.keys(maleAges),
      ...Object.keys(femaleAges)
    );

    for (let i = minAge; i <= maxAge; i++) {
      data.labels.push(`${i}-${i + 1}`);
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
      <h2>Populaciona piramida</h2>
      <Bar data={data} options={options} />
    </div>
  );
};

export default CampPyramidChart;
