import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import App from "./App";
import { store } from "./app/store";
import "./utils/chartSetup";
import "./index.css";

const theme = createTheme({
  typography: {
    fontFamily: "Manrope, Segoe UI, sans-serif",
    button: {
      textTransform: "none"
    }
  },
  components: {
    MuiDataGrid: {
      styleOverrides: {
        root: {
          borderRadius: 14
        }
      }
    }
  }
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  </StrictMode>
);
