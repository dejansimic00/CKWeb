import { PieChart } from "@mui/x-charts/PieChart";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { generateColor } from "../../utils/colorGradient";
const CampPieChart = function ({
  data,
  title = "PieChart test",
  startColor = "#ffffff",
  endColor = "#ff0000",
  width = 300,
}) {
  const [chartData, setChartData] = useState([]);

  const cX = width / 2;
  const cY = width / 2;

  useEffect(() => {
    if (data && data.length > 0) {
      // Calculate ages and group by intervals
      const ageGroups = data.reduce((acc, person) => {
        const age = dayjs().diff(dayjs(person.dateOfBirth), "year");
        let groupLabel;
        if (age < 15) groupLabel = "0-14";
        else if (age < 25) groupLabel = "15-24";
        else if (age < 35) groupLabel = "25-34";
        else if (age < 45) groupLabel = "35-44";
        else if (age < 55) groupLabel = "45-54";
        else if (age < 65) groupLabel = "55-64";
        else groupLabel = "65+";

        if (!acc[groupLabel]) {
          acc[groupLabel] = 0;
        }
        acc[groupLabel]++;
        return acc;
      }, {});

      // Convert age groups to chart data format
      const formattedData = Object.keys(ageGroups).map((key, index) => ({
        id: index,
        value: ageGroups[key],
        label: key,
      }));

      // Sort the data to ensure correct order
      const sortedData = formattedData.sort((a, b) => {
        const order = [
          "0-14",
          "15-24",
          "25-34",
          "35-44",
          "45-54",
          "55-64",
          "65+",
        ];
        return order.indexOf(a.label) - order.indexOf(b.label);
      });
      setChartData(sortedData);
    }
  }, [data]);

  return (
    <div
      className={`flex flex-col items-center justify-center h-[${width}px] text-sm`}
    >
      <div>{title}</div>
      <PieChart
        key="x"
        width={width}
        height={width}
        colors={generateColor(startColor, endColor, 7)} //hardcoded 7 -- broj starosnih grupa
        slotProps={{
          legend: {
            direction: "row",
            position: { vertical: "top", horizontal: "middle" },
            padding: 0,

            itemMarkWidth: 15,
            itemGap: 5,
            labelStyle: {
              fontSize: 14,
            },
          },
        }}
        series={[
          {
            data: chartData,

            innerRadius: 10,
            outerRadius: 100,
            paddingAngle: 4,
            cornerRadius: 2,
            startAngle: 0,
            endAngle: 360,
            cx: cX,
            cy: 150,
          },
        ]}
      />
    </div>
  );
};

export default CampPieChart;
