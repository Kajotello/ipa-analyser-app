import {
  Box,
  Button,
  FormControlLabel,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Switch,
  ToggleButton,
  ToggleButtonGroup,
  Checkbox,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import React from "react";
import Popover from "@mui/material/Popover";

const statsTypes = [
  { label: "Maksymalne opóźnienie przyjazdowe", value: 0 },
  { label: "Maksymalne opóźnienie wyjazdowe", value: 1 },
  { label: "Maksymalne opóźnienie nabyte", value: 2 },
  { label: "Średnie opóźnienie przyjazdowe", value: 3 },
  { label: "Średnie opóźnienie wyjazdowe", value: 4 },
  { label: "Średnie opóźnienie nabyte", value: 5 },
  { label: "Średni czas postoju (rozkładowy)", value: 6 },
  { label: "Średni czas postoju (rzeczywisty)", value: 7 },
  { label: "% pociągów punktualnych na przyjeździe (do 5 min)", value: 8 },
  { label: "% pociągów punktualnych na odjeździe (do 5 min)", value: 9 },
  { label: "% pociągów, które nienabyły opóźnienie", value: 10 },
  { label: "Liczba pociągów z postojem", value: 11 },
];

export function TimelineConfiguration(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const id = open ? "simple-popover" : undefined;
  return (
    <Box>
      <div>
        <IconButton
          onClick={handleClick}
          variant="contained"
          sx={{ mt: 4, ml: 2 }}
        >
          <MoreVertIcon />
        </IconButton>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          PaperProps={{
            style: { width: "20%", height: "50%" },
          }}
        >
          <Box>
            <ToggleButtonGroup
              color="primary"
              exclusive
              aria-label="Platform"
              value={props.category}
              onChange={props.handleCategoryChange}
              sx={{ mt: 3, ml: 3 }}
            >
              <ToggleButton value={1}>Pośpieszne</ToggleButton>
              <ToggleButton value={2}>Osobowe</ToggleButton>
              <ToggleButton value={0}>Wszystkie</ToggleButton>
            </ToggleButtonGroup>
            <ToggleButtonGroup
              color="primary"
              exclusive
              aria-label="Platform"
              value={props.direction}
              onChange={props.handleDirectionChange}
              sx={{ ml: 6, mt: 1.5 }}
            >
              <ToggleButton value={2}>➡ Piła</ToggleButton>
              <ToggleButton value={1}>➡ Poznań</ToggleButton>
              <ToggleButton value={0}>Wszystkie</ToggleButton>
            </ToggleButtonGroup>
            <FormControlLabel
              sx={{ ml: 2, mt: 1 }}
              control={
                <Switch
                  value={props.onlyStation}
                  onChange={(e, newValue) => {
                    props.setOnlyStation(newValue === true ? 1 : 0);
                  }}
                />
              }
              label="Wyświetlaj tylko stacje "
            />
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
                      onClick={props.handleToggle(statistic.value)}
                      dense
                    >
                      <ListItemIcon>
                        <Checkbox
                          edge="start"
                          checked={
                            props.checked.indexOf(statistic.value) !== -1
                          }
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
          </Box>
        </Popover>
      </div>
    </Box>
  );
}
