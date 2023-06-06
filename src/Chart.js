import React from "react";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import zoomPlugin from "chartjs-plugin-zoom";
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
} from "chart.js";
import { Line } from "react-chartjs-2";
import "chartjs-adapter-moment";
import { getRelativePosition } from "chart.js/helpers";
import { Button } from "@mui/material";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  TimeScale,
  Title,
  Tooltip,
  Legend,
  zoomPlugin,
  {
    id: "getRelativePosition",
    getRelativePosition,
  },
  {
    id: "annotationLine",
    afterDraw: function (chart, easing, options) {
      if (
        options.position < chart.scales.y.end &&
        options.position > chart.scales.y.start
      ) {
        const ctx = chart.ctx;
        var chartPosition =
          ((chart.scales.y.end - options.position) /
            (chart.scales.y.end - chart.scales.y.start)) *
            chart.chartArea.height +
          10;
        const leftX = chart.scales["x"].left;
        const rightX = chart.scales["x"].right;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(leftX, chartPosition);
        ctx.lineTo(rightX, chartPosition);
        ctx.lineWidth = 3;
        ctx.strokeStyle = "#cf34eb";
        ctx.stroke();
        ctx.restore();
      }
    },
  }
);

export function MyChart(props) {
  const [chartRef] = useState(React.createRef());

  const [options, setOptions] = useState({
    interaction: {
      intersect: false,
      mode: "dataset",
    },
    responsive: true,
    elements: {
      point: {
        radius: 0,
      },
    },
    animation: {
      duration: 0,
    },

    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            return "";
          },
        },
      },
      legend: {
        display: false,
      },
      title: {
        display: false,
        text: "Wykres ruchu",
      },
      annotationLine: {
        position: NaN,
      },
      zoom: {
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: "xy",
        },
      },
    },
    scales: {
      x: {
        type: "time",
        min: "2020-10-11 00:00:00",
        max: "2020-10-11 23:59:59",
        time: {
          parser: "YYYY-MM-DD HH:mm:ss",
          unit: "hour",
          displayFormats: {
            hour: "HH:mm",
          },
          tooltipFormat: "D MMM YYYY - HH:mm:ss",
        },
      },
      y: {
        min: 0.0,
        max: 94.0,
      },
    },
  });

  const [data, setNewData] = useState(null);

  function handleReset() {
    if (chartRef.current) {
      var chart = chartRef.current;
      chart.resetZoom();
    }
  }

  useEffect(() => {
    let newData = { datasets: [] };
    var colors, alpha;
    if (props.dataset === null) return;
    props.dataset.forEach((train) => {
      train.category === 1
        ? (colors = [255.0, 0.0, 0.0])
        : (colors = [0.0, 0.0, 0.0]);
      train.train_name.includes("rozkładowy") ? (alpha = 0.2) : (alpha = 1.0);
      newData.datasets.push({
        label: train.train_name,
        data: train.schedule,
        borderColor: `rgba(${colors[0]},${colors[1]},${colors[2]}, ${alpha})`,
        backgroundColor: "rgb(1,0,0)",
        // borderDash: [10, 5],
      });
    });
    setNewData(newData);
    setOptions((prevOptions) => {
      var newOptions = JSON.parse(JSON.stringify(prevOptions));
      newOptions.plugins.tooltip = prevOptions.plugins.tooltip;
      newOptions.scales.x.min = `${props.date.$d.getFullYear()}-${
        props.date.$d.getMonth() + 1
      }-${props.date.$d.getDate()} 00:00:00`;
      newOptions.scales.x.max = `${props.date.$d.getFullYear()}-${
        props.date.$d.getMonth() + 1
      }-${props.date.$d.getDate()} 23:59:59`;
      return newOptions;
    });
  }, [props.dataset, props.date.$d]);

  useEffect(() => {
    if (data === null) return;
    if (chartRef.current) {
      var chart = chartRef.current;
    } else {
      return;
    }

    setOptions((prevOptions) => {
      var newOptions = JSON.parse(JSON.stringify(prevOptions));
      newOptions.plugins.tooltip = prevOptions.plugins.tooltip;
      newOptions.plugins.annotationLine.position = props.position;
      return newOptions;
    });
    chart.update();
  }, [data, props.position, chartRef]);

  return (
    <Box sx={{ ml: 2 }}>
      {data !== null ? (
        <Line redraw={true} options={options} data={data} ref={chartRef} />
      ) : (
        <></>
      )}
      <Button onClick={handleReset}>Resetuj</Button>
    </Box>
  );
}
