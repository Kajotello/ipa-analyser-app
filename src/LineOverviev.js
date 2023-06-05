import React from "react";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineOppositeContent, {
  timelineOppositeContentClasses,
} from "@mui/lab/TimelineOppositeContent";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  Autocomplete,
  Box,
  Button,
  Grid,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
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

function ComboBox(props) {
  return (
    <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={props.options}
      onChange={(event, newValue) => {
        console.log(newValue.value);
        props.onChange(newValue.value);
      }}
      sx={{ width: 300 }}
      renderInput={(params) => <TextField {...params} label="" />}
    />
  );
}

const timeInterval = [
  { label: "Dzień", value: 0 },
  { label: "Miesiąc", value: 1 },
  { label: "Rok", value: 2 },
  { label: "Korekta rozkładu", value: 3 },
  { label: "Edycja rozkładu", value: 4 },
];

export default function LineOverview() {
  const [timePerspective, setTimePerspective] = useState(0);
  return (
    <Grid container>
      <Grid item xs={4}>
        <ComboBox
          options={timeInterval}
          value={timePerspective}
          onChange={setTimePerspective}
        ></ComboBox>
      </Grid>
    </Grid>
  );
}
