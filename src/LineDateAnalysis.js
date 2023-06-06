import "./Timeline.css";
import { MyChart } from "./Chart";
import { ToolBar } from "./Toolbar";

import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { BarChart } from "./BarChart";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import CommentIcon from "@mui/icons-material/Comment";
import classNames from "classnames";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { TimeSelection } from "./TimeSecetion";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const options = [
  {
    label: "rozkład opóźnień przyjazdowych (min)",
    value: 0,
  },
  {
    label: "rozkład opóźnień wyjazdowych (min)",
    value: 1,
  },
  {
    label: "rozkład czasu postoju (s)",
    value: 2,
  },
];

function ComboBox(props) {
  return (
    <Autocomplete
      disablePortal
      la
      id="combo-box-demo"
      options={props.options}
      onChange={(event, newValue) => {
        console.log(newValue.value);
        props.onChange(newValue.value);
      }}
      sx={{ width: 300 }}
      renderInput={(params) => <TextField {...params} label={props.label} />}
    />
  );
}

function SimpleDialog(props) {
  return (
    <Dialog onClose={props.handleClose} open={props.open}>
      <DialogTitle>Nie można dodać kolejnej informacji!</DialogTitle>
      <Typography>
        Maksymalna liczba wyświetlanych statystyk wynosi 4.
      </Typography>
    </Dialog>
  );
}

export default function LineDateAnalysis() {
  const [checked, setChecked] = useState([0]);
  const [selectedStation, setStation] = useState({
    _id: { point_position: -100 },
  });
  const [statisticType, setStatisticType] = useState(0);
  const [isWithZero, setIsWithZero] = useState(0);
  const [infoPopupOpen, setPopupOpen] = useState(false);
  const [timePerspective, setTimePerspective] = useState("day");
  const [selectedTime, setSeclectedTime] = useState(null);
  const [timetableDataset, setTimetableDataset] = useState(null);
  const [lineData, setLineData] = useState(null);
  const [histogramsData, setHistogramsData] = useState(null);
  const [category, setCategory] = useState(0);
  const [direction, setDirection] = useState(0);
  const [onlyStation, setOnlyStation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selectedTime !== null) {
      setIsLoading(true);
      axios
        .post("http://localhost:8000/get-timetable", {
          day: selectedTime.$d.getDate(),
          month: selectedTime.$d.getMonth() + 1,
          year: selectedTime.$d.getFullYear(),
        })
        .then(function (response) {
          setTimetableDataset(response.data);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
    setIsLoading(false);
  }, [selectedTime, timePerspective]);

  useEffect(() => {
    if (selectedTime === null) return;
    setIsLoading(true);
    axios
      .post("http://localhost:8000/line-travel-data", {
        day: selectedTime.$d.getDate(),
        month: selectedTime.$d.getMonth() + 1,
        year: selectedTime.$d.getFullYear(),
        direction: direction,
        category: category,
        time_scope: timePerspective,
      })
      .then(function (response) {
        console.log(response.data);
        setLineData(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
    setIsLoading(false);
  }, [selectedTime, timePerspective, category, direction]);

  useEffect(() => {
    if (selectedTime !== null) {
      setIsLoading(true);
      axios
        .post("http://localhost:8000/station-data", {
          day: selectedTime.$d.getDate(),
          month: selectedTime.$d.getMonth() + 1,
          year: selectedTime.$d.getFullYear(),
          direction: direction,
          category: category,
          station_name: selectedStation._id.point_name,
        })
        .then(function (response) {
          setHistogramsData(response.data);
        })
        .catch(function (error) {
          console.log(error);
        });
      setIsLoading(false);
    }
  }, [selectedTime, timePerspective, selectedStation, direction, category]);

  const handleTimePerpectiveChange = (event, newValue) => {
    setTimePerspective(newValue.props.value);
  };

  function handleNextDateClick() {
    setSeclectedTime((prevSelectedTime) => {
      if (timePerspective === "day") return prevSelectedTime.add(1, "day");
      else if (timePerspective === "month")
        return prevSelectedTime.add(1, "month");
      else if (timePerspective === "year")
        return prevSelectedTime.add(1, "year");
    });
  }

  const handleDirectionChange = (event, newValue) => {
    setDirection(newValue);
  };

  const handleCategoryChange = (event, newValue) => {
    setCategory(newValue);
  };

  function handlePrevDateClick() {
    setSeclectedTime((prevSelectedTime) => {
      if (timePerspective === "day") return prevSelectedTime.subtract(1, "day");
      else if (timePerspective === "month")
        return prevSelectedTime.subtract(1, "month");
      else if (timePerspective === "year")
        return prevSelectedTime.subtract(1, "year");
    });
  }

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      if (checked.length < 4) newChecked.push(value);
      else setPopupOpen(true);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const handleTimeSet = (newValue) => {
    setSeclectedTime(newValue);
  };
  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <ToolBar
        sx={{ position: "sticky", top: 0 }}
        component={
          <TimeSelection
            timePerspective={timePerspective}
            handleTimePerpectiveChange={handleTimePerpectiveChange}
            handlePrevDateClick={handlePrevDateClick}
            selectedTime={selectedTime}
            handleTimeSet={handleTimeSet}
            handleNextDateClick={handleNextDateClick}
          ></TimeSelection>
        }
        category={category}
        handleCategoryChange={handleCategoryChange}
        direction={direction}
        handleDirectionChange={handleDirectionChange}
        handleToggle={handleToggle}
        checked={checked}
        onlyStation={onlyStation}
        setOnlyStation={setOnlyStation}
      ></ToolBar>

      <SimpleDialog
        sx={{ p: 4 }}
        open={infoPopupOpen}
        handleClose={() => setPopupOpen(false)}
      ></SimpleDialog>

      {selectedTime ? (
        <>
          <Grid container>
            <Grid item xs={5}>
              {lineData !== null ? (
                <div class="container">
                  <div class="rightbox">
                    <div class="rb-container">
                      <ul class="rb">
                        {lineData.map((station) =>
                          (onlyStation && station._id.point_type !== "PO") ||
                          !onlyStation ? (
                            <li
                              className={classNames(
                                {
                                  station:
                                    station._id.point_type === "ST" ||
                                    station._id.point_type === "PODG",
                                },
                                { stop: station._id.point_type === "PO" },
                                {
                                  active:
                                    station._id.point_name ===
                                    selectedStation._id.point_name,
                                }
                              )}
                              onClick={() => setStation(station)}
                            >
                              <div class="name">
                                {station._id.point_name} (
                                {station._id.point_position.toFixed(3)})
                              </div>
                              <div class="item-title">
                                {checked.includes(0) ? (
                                  <>
                                    Maksymalne opóźnienie przyjazdowe:{" "}
                                    {station.max_arrival_delay} min <br />
                                  </>
                                ) : (
                                  ""
                                )}
                                {checked.includes(1) ? (
                                  <>
                                    Maksymalne opóźnienie wyjazdowe:{" "}
                                    {station.max_departure_delay} min
                                    <br />
                                  </>
                                ) : (
                                  ""
                                )}
                                {checked.includes(2) ? (
                                  <>
                                    Maksymalne opóźnienie nabyte:{" "}
                                    {station.max_delay_gained} min
                                    <br />
                                  </>
                                ) : (
                                  ""
                                )}
                                {checked.includes(3) ? (
                                  <>
                                    Średnie opóźnienie przyjazdowe:{" "}
                                    {station.avg_arrival_delay.toFixed(2)} min
                                    <br />
                                  </>
                                ) : (
                                  ""
                                )}
                                {checked.includes(4) ? (
                                  <>
                                    Średnie opóźnienie wyjazdowe:{" "}
                                    {station.avg_departure_delay.toFixed(2)} min
                                    <br />
                                  </>
                                ) : (
                                  ""
                                )}
                                {checked.includes(5) ? (
                                  <>
                                    Średnie opóźnienie nabyte:{" "}
                                    {station.avg_delay_gained.toFixed(2)} min
                                    <br />
                                  </>
                                ) : (
                                  ""
                                )}
                                {checked.includes(6) ? (
                                  <>
                                    Średni czas postoju (rozkładowy):{" "}
                                    {station.avg_schedule_stop_time.toFixed(1)}{" "}
                                    s
                                    <br />
                                  </>
                                ) : (
                                  ""
                                )}
                                {checked.includes(7) && (
                                  <>
                                    Średni czas postoju (rzeczywisty):{" "}
                                    {station.avg_real_stop_time.toFixed(1)} s
                                    <br />
                                  </>
                                )}
                                {checked.includes(8) && (
                                  <>
                                    % pociągów punktualnych na przyjeździe (do 5
                                    min):{" "}
                                    {(
                                      station.percentage_of_punctual_on_arrival *
                                      100
                                    ).toFixed(2)}{" "}
                                    %
                                    <br />
                                  </>
                                )}
                                {checked.includes(9) && (
                                  <>
                                    % pociągów punktualnych na odjeździe (do 5
                                    min):{" "}
                                    {(
                                      station.percentage_of_punctual_on_departure *
                                      100
                                    ).toFixed(2)}{" "}
                                    %
                                    <br />
                                  </>
                                )}
                                {checked.includes(10) && (
                                  <>
                                    % pociągów, które nie nabyły opóźnienie:{" "}
                                    {(
                                      station.percentage_of_train_without_gained_delay *
                                      100
                                    ).toFixed(2)}{" "}
                                    %
                                    <br />
                                  </>
                                )}
                                {checked.includes(11) && (
                                  <>
                                    Liczba pociągów z postojem:{" "}
                                    {station.train_count}
                                    <br />
                                  </>
                                )}
                              </div>
                            </li>
                          ) : (
                            <></>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                <></>
              )}
            </Grid>
            <Grid item xs={7}>
              <Box>
                {timePerspective === "day" && selectedTime !== null ? (
                  <>
                    <Typography variant="h5" sx={{ textAlign: "center" }}>
                      {" "}
                      Wykres ruchu w dniu {selectedTime.$d.getDate()}
                      {"."}
                      {selectedTime.$d.getMonth() + 1}
                      {"."}
                      {selectedTime.$d.getFullYear()} r.
                    </Typography>
                    <Box
                      sx={{
                        ml: 2,
                        mr: 2,
                      }}
                    >
                      <MyChart
                        position={selectedStation._id.point_position}
                        dataset={timetableDataset}
                        date={selectedTime}
                      ></MyChart>
                    </Box>
                  </>
                ) : (
                  <></>
                )}
                {selectedStation._id.point_position !== -100 && (
                  <Box sx={{ position: "sticky", top: 0, ml: 2, mr: 2 }}>
                    <Typography sx={{ mt: 4 }}>
                      Dane dla stacji/przystanku{" "}
                      {selectedStation._id.point_name}
                    </Typography>
                    {selectedStation !== 0 ? (
                      <>
                        <FormControl fullWidth sx={{ mt: 3 }}>
                          <InputLabel id="select-time-scope-label">
                            Horyzont czasowy
                          </InputLabel>
                          <Select
                            labelId="select-time-scope-label"
                            options={options}
                            value={statisticType}
                            onChange={(event, newValue) =>
                              setStatisticType(newValue.props.value)
                            }
                            label="Rodzaj statystyki"
                          >
                            {options.map((option) => (
                              <MenuItem value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        <BarChart
                          statisticType={statisticType}
                          isWithZero={isWithZero}
                          histogramData={histogramsData}
                        ></BarChart>
                      </>
                    ) : (
                      <></>
                    )}
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
          <Grid container sx={{ mt: 10 }}>
            <Grid item xs={4}>
              <Typography>Średnie opóźnienie</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography>Średnie maksymalne opóźnienie</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography>Liczba pociągów</Typography>
            </Grid>
          </Grid>{" "}
        </>
      ) : (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          marginTop={10}
        >
          <Typography variant="h3">
            Witaj! Wybierz datę żeby rozpocząć.
          </Typography>
          <img src="edek.jpg" alt="maskotka"></img>
        </Box>
      )}
    </>
  );
}
