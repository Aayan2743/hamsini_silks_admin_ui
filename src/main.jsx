import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { AuthProvider } from "./auth/AuthContext";
import { AppSettingsProvider } from "./context/AppSettingsContext";
ReactDOM.createRoot(document.getElementById("root")).render(
  <AppSettingsProvider>
    <AuthProvider>
      <App />
    </AuthProvider>
   </AppSettingsProvider>
);
