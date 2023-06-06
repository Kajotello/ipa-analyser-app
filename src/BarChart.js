import React from "react";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  BarElement,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import "chartjs-adapter-moment";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  TimeScale,
  Title,
  Tooltip,
  Legend
);

export function BarChart(props) {
  const [chartRef] = useState(React.createRef());
  const [options] = useState({
    scales: {
      xAxes: [
        {
          display: false,
          barPercentage: 1.3,
          ticks: {
            max: 3,
          },
        },
        {
          display: true,
          ticks: {
            autoSkip: false,
            max: 4,
          },
        },
      ],
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  });
  const [data, setDate] = useState(null);

  useEffect(() => {
    console.log(props.histogramData);
    if (props.histogramData === null) return;
    var datasets = [];
    for (let key in props.histogramData) {
      var convertedDataset = Object();
      convertedDataset.labels = props.histogramData[key].bins;
      convertedDataset.datasets = [];
      convertedDataset.datasets.push({
        label: key,
        data: props.histogramData[key].data,
        backgroundColor: "#FFBC42",
      });
      datasets.push(convertedDataset);
    }
    setDate(datasets);
  }, [props.histogramData]);

  return (
    <Box sx={{ ml: 2 }}>
      {data !== null && (
        <Bar
          redraw={true}
          options={options}
          data={data[props.statisticType]}
          ref={chartRef}
        />
      )}
    </Box>
  );
}
