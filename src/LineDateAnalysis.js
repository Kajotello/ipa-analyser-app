import "./Timeline.css";
import { MyChart } from "./Chart";
import { ToolBar } from "./Toolbar";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
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

const myLine = [
  {
    name: "Poznań Główny",
    position: 0.0,
    type: "station",
  },
  {
    name: "Oborniki Wielkopolskie Miasto",
    position: 25.983,
    type: "stop",
  },
  {
    name: "Chodzież",
    position: 60.784,
    type: "station",
  },
  {
    name: "Dziembówko",
    position: 83.021,
    type: "station",
  },
  {
    name: "Piła Główna",
    position: 90.232,
    type: "station",
  },
];

const options = [
  {
    label: "rozkład opóźnień wyjazdowych",
    value: 0,
  },
  {
    label: "rozkład opóźnień przyjazdowych",
    value: 1,
  },
  {
    label: "rozkład opóźnień nabytych",
    value: 2,
  },
];

const timeInterval = [
  { label: "Dzień", value: "day" },
  { label: "Miesiąc", value: "month" },
  { label: "Rok", value: "year" },
  { label: "Korekta rozkładu", value: 3 },
  { label: "Edycja rozkładu", value: 4 },
];

const statsTypes = [
  { label: "Maksymalne opóźnienie", value: 0 },
  { label: "Maksymalne opóźnienie nabyte", value: 1 },
  { label: "Średnie opóźnienie przyjazdowe", value: 2 },
  { label: "Średnie opóźnienie odjazdowe", value: 3 },
  { label: "Średnie opóźnienie nabyte", value: 4 },
  { label: "Średni planowy czas postoju", value: 5 },
  { label: "% punktualnych odjazdów (do 5 min)", value: 6 },
  { label: "% punktualnych przyjazdów (do 5 min)", value: 7 },
];

const statsAllLine = [];

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
  const [currentStation, setStation] = useState({
    _id: { point_position: 0 },
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

  useEffect(() => {
    if (selectedTime !== null) {
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
  }, [selectedTime, timePerspective]);

  useEffect(() => {
    if (selectedTime === null) return;
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
  }, [selectedTime, timePerspective, category, direction]);

  useEffect(() => {
    if (selectedTime !== null) {
      axios
        .post("http://localhost:8000/station-data", {
          day: selectedTime.$d.getDate(),
          month: selectedTime.$d.getMonth() + 1,
          year: selectedTime.$d.getFullYear(),
          direction: direction,
          category: category,
          station_name: currentStation._id.point_name,
        })
        .then(function (response) {
          setHistogramsData(response.data);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }, [selectedTime, timePerspective, currentStation, direction, category]);

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

  const handleToggle = (value: number) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      if (checked.length < 4) newChecked.push(value);
      else setPopupOpen(true);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    console.log(newChecked);
    setChecked(newChecked);
  };
  return (
    <>
      <ToolBar></ToolBar>
      <Grid container sx={{ mb: 5 }}>
        <Grid item xs={4} sx={{ ml: 5 }}>
          <InputLabel>Horyzont czasowy</InputLabel>
          <FormControl>
            <Select
              options={timeInterval}
              value={timePerspective}
              onChange={handleTimePerpectiveChange}
            >
              {timeInterval.map((interval) => (
                <MenuItem value={interval.value}>{interval.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={1}>
          <Button onClick={handlePrevDateClick} sx={{ mt: 2 }}>
            Poprzedni
          </Button>
        </Grid>
        <Grid item xs={2} sx={{ justifyContent: "center" }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DatePicker"]}>
              <DatePicker
                label="Basic date picker"
                value={selectedTime}
                onChange={(newValue) => {
                  setSeclectedTime(newValue);
                  console.log(selectedTime);
                }}
              />
            </DemoContainer>
          </LocalizationProvider>
        </Grid>
        <Grid item xs={1}>
          <Button onClick={handleNextDateClick} sx={{ mt: 2 }}>
            Następny
          </Button>
        </Grid>
      </Grid>
      <SimpleDialog
        open={infoPopupOpen}
        handleClose={() => setPopupOpen(false)}
      ></SimpleDialog>

      <Grid container>
        <Grid item xs={3}>
          {lineData !== null ? (
            <div class="container">
              <div class="rightbox">
                <div class="rb-container">
                  <ul class="rb">
                    {lineData.map((station) => (
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
                              station._id.name === currentStation.point_name,
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
                              {station.avg_schedule_stop_time.toFixed(1)} s
                              <br />
                            </>
                          ) : (
                            ""
                          )}
                          {checked.includes(7) ? (
                            <>
                              Średni czas postoju (rzeczywisty):{" "}
                              {station.avg_real_stop_time.toFixed(1)} s
                              <br />
                            </>
                          ) : (
                            ""
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}
        </Grid>
        <Grid item xs={2} sx={{ m: 2 }}>
          <ToggleButtonGroup
            color="primary"
            exclusive
            aria-label="Platform"
            value={category}
            onChange={handleCategoryChange}
            sx={{ ml: 2 }}
          >
            <ToggleButton value={1}>Pośpieszne</ToggleButton>
            <ToggleButton value={2}>Osobowe</ToggleButton>
            <ToggleButton value={0}>Wszystkie</ToggleButton>
          </ToggleButtonGroup>
          <ToggleButtonGroup
            color="primary"
            value={direction}
            exclusive
            aria-label="Platform"
            onChange={handleDirectionChange}
            sx={{ ml: 3, mt: 2 }}
          >
            <ToggleButton value={2}>➡ Piła</ToggleButton>
            <ToggleButton value={1}>➡ Poznań</ToggleButton>
            <ToggleButton value={0}>Wszystkie</ToggleButton>
          </ToggleButtonGroup>
          <List
            sx={{
              width: "100%",
              maxWidth: 360,
              bgcolor: "background.paper",
              ml: 2,
            }}
          >
            {statsTypes.map((statistic) => {
              const labelId = `checkbox-list-label-${statistic.value}`;

              return (
                <ListItem key={statistic.value} disablePadding>
                  <ListItemButton
                    role={undefined}
                    onClick={handleToggle(statistic.value)}
                    dense
                  >
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={checked.indexOf(statistic.value) !== -1}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ "aria-labelledby": labelId }}
                      />
                    </ListItemIcon>
                    <ListItemText id={labelId} primary={statistic.label} />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Grid>
        <Grid item xs={6.5}>
          <Box sx={{ position: "sticky", top: 0 }}>
            {timePerspective === "day" && selectedTime !== null ? (
              <>
                <Typography variant="h5" sx={{ textAlign: "center" }}>
                  {" "}
                  Wykres ruchu w dniu {selectedTime.day}
                </Typography>
                <Box
                  sx={{
                    ml: 2,
                    mr: 2,
                  }}
                >
                  <MyChart
                    position={currentStation._id.point_position}
                    dataset={timetableDataset}
                    date={selectedTime}
                  ></MyChart>
                </Box>
              </>
            ) : (
              <></>
            )}
            <Box sx={{ ml: 2, mr: 2 }}>
              <Typography sx={{ mt: 4 }}>
                Wybrana stacja: {currentStation.name}
              </Typography>
              {currentStation !== 0 ? (
                <>
                  <ComboBox
                    options={options}
                    value={statisticType}
                    onChange={setStatisticType}
                  ></ComboBox>
                  <FormControlLabel
                    control={
                      <Switch
                        value={isWithZero}
                        onChange={(e, newValue) => {
                          setIsWithZero(newValue === true ? 1 : 0);
                        }}
                      />
                    }
                    label="Czy uwzględniać 0? "
                  />
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
      </Grid>
    </>
  );
}