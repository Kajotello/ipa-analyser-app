import React from "react";
import {
  Grid,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

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
      <Grid item xs={1}>
        <Button onClick={props.handlePrevDateClick} sx={{ mt: 2 }}>
          Poprzedni
        </Button>
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
        <Button onClick={props.handleNextDateClick} sx={{ mt: 2 }}>
          Następny
        </Button>
      </Grid>
    </Grid>
  );
}
