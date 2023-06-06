import React from "react";
import { Grid, InputLabel, FormControl, Select, MenuItem } from "@mui/material";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import Fab from "@mui/material/Fab";

const timeInterval = [
  { label: "Dzień", value: "day" },
  { label: "Miesiąc", value: "month" },
  { label: "Rok", value: "year" },
  { label: "Korekta rozkładu", value: 3 },
  { label: "Edycja rozkładu", value: 4 },
];

export function TimeSelection(props) {
  return (
    <Grid container sx={{ mb: 2, ml: 20 }}>
      <Grid item xs={4}>
        <FormControl fullWidth sx={{ mt: 3 }}>
          <InputLabel id="select-time-scope-label">Horyzont czasowy</InputLabel>
          <Select
            labelId="select-time-scope-label"
            options={timeInterval}
            value={props.timePerspective}
            onChange={props.handleTimePerpectiveChange}
            label="Horyzont czasowy"
            sx={{
              backgroundColor: "white",
              borderColor: "grey",
              borderRadius: 1,
            }}
          >
            {timeInterval.map((interval) => (
              <MenuItem value={interval.value}>{interval.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={1} justifyContent="right" display="flex">
        {props.selectedTime && (
          <Fab
            size="small"
            aria-label="upload picture"
            sx={{
              mt: 3.5,
              mr: 2,
              bgcolor: "#f55702",
              "&:hover": { bgcolor: "#f55702" },
            }}
            component="label"
            onClick={props.handlePrevDateClick}
          >
            <KeyboardArrowLeftIcon sx={{ fontSize: 30 }} />
          </Fab>
        )}
      </Grid>
      <Grid item xs={2} sx={{ justifyContent: "center" }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["DatePicker"]}>
            <DatePicker
              label="Wybierz datę"
              value={props.selectedTime}
              onChange={props.handleTimeSet}
              sx={{
                backgroundColor: "white",
                borderColor: "grey",
                mt: 2,
                borderRadius: 1,
              }}
            />
          </DemoContainer>
        </LocalizationProvider>
      </Grid>
      <Grid item xs={1}>
        {props.selectedTime && (
          <Fab
            size="small"
            aria-label="upload picture"
            sx={{
              mt: 3.5,
              ml: 2,
              bgcolor: "#f55702",
              "&:hover": { bgcolor: "#f55702" },
            }}
            component="label"
            onClick={props.handleNextDateClick}
          >
            <KeyboardArrowRightIcon sx={{ fontSize: 30 }} />
          </Fab>
        )}
      </Grid>
    </Grid>
  );
}
