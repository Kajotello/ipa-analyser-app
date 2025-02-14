import "./Timeline.css";
import { MyChart } from "./Chart";
import { ToolBar } from "./Toolbar";
import { serverAddress } from "./consts";
import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { BarChart } from "./BarChart";
import classNames from "classnames";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { TimeSelection } from "./TimeSecetion";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import axiosRetry from "axios-retry";

axiosRetry(axios, { retries: 3 });

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
  const [infoPopupOpen, setPopupOpen] = useState(false);
  const [timePerspective, setTimePerspective] = useState("day");
  const [selectedTime, setSeclectedTime] = useState(null);
  const [timetableDataset, setTimetableDataset] = useState(null);
  const [lineData, setLineData] = useState(null);
  const [histogramsData, setHistogramsData] = useState(null);
  const [category, setCategory] = useState(0);
  const [direction, setDirection] = useState(0);
  const [onlyStation, setOnlyStation] = useState(false);
  const [isLoading1, setIsLoading1] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const [isLoading3, setIsLoading3] = useState(false);

  useEffect(() => {
    if (selectedTime !== null) {
      setIsLoading1(true);
      axios
        .post(`${serverAddress}/get-timetable`, {
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
    setIsLoading1(false);
  }, [selectedTime, timePerspective]);

  useEffect(() => {
    if (selectedTime === null) return;
    setIsLoading2(true);
    axios
      .post(`${serverAddress}/line-travel-data`, {
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
    setIsLoading2(false);
  }, [selectedTime, timePerspective, category, direction]);

  useEffect(() => {
    if (selectedStation._id.point_position === -100) return;
    if (selectedTime !== null) {
      setIsLoading3(true);
      axios
        .post(`${serverAddress}/station-data`, {
          day: selectedTime.$d.getDate(),
          month: selectedTime.$d.getMonth() + 1,
          year: selectedTime.$d.getFullYear(),
          direction: direction,
          category: category,
          station_name: selectedStation._id.point_name,
          time_scope: timePerspective,
        })
        .then(function (response) {
          setHistogramsData(response.data);
        })
        .catch(function (error) {
          console.log(error);
        });
      setIsLoading3(false);
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
      {isLoading1 || isLoading2 || isLoading3 ? (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : (
        <>
          <Box
            sx={{
              position: "sticky",
              top: 0,
              zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
          >
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
          </Box>

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
                              (onlyStation &&
                                station._id.point_type !== "PO") ||
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
                                        {station.avg_arrival_delay.toFixed(2)}{" "}
                                        min
                                        <br />
                                      </>
                                    ) : (
                                      ""
                                    )}
                                    {checked.includes(4) ? (
                                      <>
                                        Średnie opóźnienie wyjazdowe:{" "}
                                        {station.avg_departure_delay.toFixed(2)}{" "}
                                        min
                                        <br />
                                      </>
                                    ) : (
                                      ""
                                    )}
                                    {checked.includes(5) ? (
                                      <>
                                        Średnie opóźnienie nabyte:{" "}
                                        {station.avg_delay_gained.toFixed(2)}{" "}
                                        min
                                        <br />
                                      </>
                                    ) : (
                                      ""
                                    )}
                                    {checked.includes(6) ? (
                                      <>
                                        Średni czas postoju (rozkładowy):{" "}
                                        {station.avg_schedule_stop_time.toFixed(
                                          1
                                        )}{" "}
                                        s
                                        <br />
                                      </>
                                    ) : (
                                      ""
                                    )}
                                    {checked.includes(7) && (
                                      <>
                                        Średni czas postoju (rzeczywisty):{" "}
                                        {station.avg_real_stop_time.toFixed(1)}{" "}
                                        s
                                        <br />
                                      </>
                                    )}
                                    {checked.includes(8) && (
                                      <>
                                        % pociągów punktualnych na przyjeździe
                                        (do 5 min):{" "}
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
                                        % pociągów punktualnych na odjeździe (do
                                        5 min):{" "}
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
                  <Grid container>
                    <Grid item xs={12}>
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
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ position: "sticky", top: 0, ml: 2, mr: 2 }}>
                        {selectedStation._id.point_position !== -100 && (
                          <>
                            <Typography sx={{ mt: 4 }}>
                              Dane dla stacji/przystanku{" "}
                              {selectedStation._id.point_name}
                            </Typography>
                            {selectedStation !== 0 ? (
                              <>
                                <FormControl fullWidth sx={{ mt: 3 }}>
                                  <InputLabel id="select-time-scope-label">
                                    Rodzaj statystyki
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
                                  histogramData={histogramsData}
                                ></BarChart>
                              </>
                            ) : (
                              <></>
                            )}
                          </>
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              {/* <Grid container sx={{ mt: 10 }}>
            <Grid item xs={4}>
              <Typography>Średnie opóźnienie</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography>Średnie maksymalne opóźnienie</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography>Liczba pociągów</Typography>
            </Grid>
          </Grid>{" "} */}
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
                Witaj! Wybierz datę żeby rozpocząć. <br/>
                Ze względu na wyłączenie infopasażera dane są dostępne <br/> tylko dla dat przed marcem 2023. <br/>
                Ponadto pobieranie pierwszych danych może potrwać ok. 1-2 minut
              </Typography>
              <img src="edek.jpg" alt="maskotka"></img>
            </Box>
          )}
        </>
      )}
    </>
  );
}
