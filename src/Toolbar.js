import React from "react";
import AppBar from "@mui/material/AppBar";
import { Typography } from "@mui/material";
import { Grid } from "@mui/material";
import TrainIcon from "@mui/icons-material/Train";
import { TimelineConfiguration } from "./Timelineconfiguration";

export class ToolBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openUserMenu: false,
      anchorElNav: null,
      anchorElUser: null,
      logged: false,
    };
    this.handleOpenNavMenu = this.handleOpenNavMenu.bind(this);
    this.handleChangeUserMenu = this.handleChangeUserMenu.bind(this);
    this.handleCloseNavMenu = this.handleCloseNavMenu.bind(this);
    this.handleCloseUserMenu = this.handleCloseUserMenu.bind(this);
  }

  handleOpenNavMenu = (event) => {
    this.setState({
      anchorElNav: event.currentTarget,
    });
  };

  handleChangeUserMenu() {
    this.setState({
      openUserMenu: !this.state.openUserMenu,
    });
  }

  handleCloseNavMenu = () => {
    this.setState({
      anchorElNav: null,
    });
  };

  handleCloseUserMenu = () => {
    this.setState({
      openUserMenu: null,
    });
  };

  render() {
    return (
      <div>
        <AppBar
          position="relative"
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, mb: 4 }}
        >
          <Grid container>
            <Grid item xs={2} display="flex">
              {" "}
              <TrainIcon
                color="white"
                sx={{
                  mt: 3,
                  ml: 5,
                  fontSize: 50,
                }}
              ></TrainIcon>
            </Grid>
            <Grid item xs={8}>
              <div>{this.props.component}</div>
            </Grid>
            <Grid item xs={2} display="flex">
              <TimelineConfiguration
                category={this.props.category}
                handleCategoryChange={this.props.handleCategoryChange}
                direction={this.props.direction}
                handleDirectionChange={this.props.handleDirectionChange}
                handleToggle={this.props.handleToggle}
                checked={this.props.checked}
                onlyStation={this.props.onlyStation}
                setOnlyStation={this.props.setOnlyStation}
              />
              <Typography
                fontSize={16}
                color="white"
                fontWeight="Bold"
                sx={{ ml: 5, mt: 2 }}
              >
                Linia kolejowa nr 354 <br /> Poznań PoD - Piła Główna <br />{" "}
                Długość: 92,538 km
              </Typography>
            </Grid>
          </Grid>
        </AppBar>
      </div>
    );
  }
}
