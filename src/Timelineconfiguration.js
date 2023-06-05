import { CheckBox } from "@mui/icons-material";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import React from "react";

export function TimelineConfiguration(props) {
  return (
    <Box>
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
                  <CheckBox
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
    </Box>
  );
}
