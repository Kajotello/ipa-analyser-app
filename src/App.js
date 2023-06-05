import { ThemeProvider, createTheme } from "@mui/material";
import "./App.css";
import "./LineDateAnalysis";
import LineDateAnalysis from "./LineDateAnalysis";
import LineOverview from "./LineOverviev";

const theme = createTheme({
  palette: {
    type: "light",
    primary: {
      main: "#FFBC42",
    },
    secondary: {
      main: "#ffffff",
    },
  },
  breakpoints: {
    values: {
      xxs: 0,
      xs: 450,
      sm: 600,
      md: 1000,
      lg: 1200,
      xl: 1536,
      xxl: 1900,
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <LineDateAnalysis></LineDateAnalysis>
    </ThemeProvider>
  );
}

export default App;
